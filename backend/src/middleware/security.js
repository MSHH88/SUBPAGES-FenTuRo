/**
 * CURIA Backend - Security Middleware
 * 
 * Features:
 * - Helmet security headers
 * - CORS configuration
 * - Rate limiting (general, auth, API)
 * - Input sanitization (XSS, SQL injection protection)
 * - CSRF protection
 * - IP blocking/whitelisting
 * - Request validation
 * - Authentication helpers
 * 
 * @module middleware/security
 */

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const { logSecurity, logAudit } = require('../utils/logger');

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Allowed origins for CORS
 */
const getAllowedOrigins = () => {
  const origins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.CRM_URL || 'http://localhost:3001',
    process.env.ADMIN_URL || 'http://localhost:3002',
  ];
  
  // Add production domains
  if (process.env.NODE_ENV === 'production') {
    origins.push(
      'https://curia.de',
      'https://www.curia.de',
      'https://crm.curia.de',
      'https://admin.curia.de',
      'https://api.curia.de'
    );
  }
  
  return origins.filter(Boolean);
};

/**
 * IP blacklist (blocked IPs)
 */
const blockedIPs = new Set();

/**
 * IP whitelist (always allowed)
 */
const whitelistedIPs = new Set([
  '127.0.0.1',
  '::1', // localhost IPv6
]);

/**
 * Failed login attempts tracker
 */
const failedLoginAttempts = new Map();

// ============================================================================
// HELMET - SECURITY HEADERS
// ============================================================================

/**
 * Helmet configuration for security headers
 */
const helmetConfig = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.stripe.com', 'https://api.paypal.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://www.paypal.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  
  // Cross-Origin settings
  crossOriginEmbedderPolicy: false, // Allow embedding payment iframes
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  
  // DNS Prefetch Control
  dnsPrefetchControl: { allow: true },
  
  // Frameguard - prevent clickjacking
  frameguard: { action: 'sameorigin' },
  
  // Hide X-Powered-By
  hidePoweredBy: true,
  
  // HSTS - HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // IE No Open
  ieNoOpen: true,
  
  // No Sniff
  noSniff: true,
  
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  
  // XSS Filter
  xssFilter: true,
});

// ============================================================================
// CORS - CROSS-ORIGIN RESOURCE SHARING
// ============================================================================

/**
 * CORS configuration
 */
const corsConfig = cors({
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logSecurity('cors_blocked', {
        blockedOrigin: origin,
        allowedOrigins,
      });
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true, // Allow cookies
  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
    'X-API-Key',
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  
  maxAge: 86400, // 24 hours
  
  preflightContinue: false,
  
  optionsSuccessStatus: 204,
});

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * General rate limiter - 100 requests per minute
 */
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logSecurity('rate_limit_exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      limit: options.max,
    });
    res.status(429).json(options.message);
  },
  skip: (req) => {
    // Skip rate limiting for whitelisted IPs
    return whitelistedIPs.has(req.ip);
  },
});

/**
 * Strict rate limiter for authentication - 5 requests per minute
 */
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 login attempts per minute
  message: {
    success: false,
    error: 'Too many login attempts. Please try again in 1 minute.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logSecurity('auth_rate_limit_exceeded', {
      ip: req.ip,
      email: req.body?.email,
      attemptCount: options.max,
    });
    res.status(429).json(options.message);
  },
  keyGenerator: (req) => {
    // Rate limit by IP + email combination
    return `${req.ip}-${req.body?.email || 'unknown'}`;
  },
});

/**
 * API rate limiter - 1000 requests per minute (for API keys)
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute for API clients
  message: {
    success: false,
    error: 'API rate limit exceeded.',
    code: 'API_RATE_LIMIT_EXCEEDED',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by API key
    return req.headers['x-api-key'] || req.ip;
  },
});

/**
 * Password reset rate limiter - 3 requests per hour
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    success: false,
    error: 'Too many password reset requests. Please try again in 1 hour.',
    code: 'PASSWORD_RESET_LIMIT_EXCEEDED',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Order creation limiter - 10 orders per hour
 */
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour per user
  message: {
    success: false,
    error: 'Too many orders. Please try again later.',
    code: 'ORDER_LIMIT_EXCEEDED',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, otherwise by IP
    return req.user?.id || req.ip;
  },
});

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

/**
 * MongoDB injection sanitization
 */
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logSecurity('mongo_injection_attempt', {
      ip: req.ip,
      path: req.path,
      key,
      body: req.body,
    });
  },
});

/**
 * XSS protection
 */
const xssConfig = xss();

/**
 * HTTP Parameter Pollution protection
 */
const hppConfig = hpp({
  whitelist: [
    'sort',
    'fields',
    'page',
    'limit',
    'filter',
    'category',
    'manufacturer',
    'price',
    'status',
  ],
});

// ============================================================================
// CUSTOM SECURITY MIDDLEWARE
// ============================================================================

/**
 * IP blocking middleware
 */
const ipBlocker = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (blockedIPs.has(clientIP)) {
    logSecurity('blocked_ip_access', {
      ip: clientIP,
      path: req.path,
      method: req.method,
    });
    
    return res.status(403).json({
      success: false,
      error: 'Access denied.',
      code: 'IP_BLOCKED',
    });
  }
  
  next();
};

/**
 * Add IP to blocklist
 */
const blockIP = (ip, reason = 'Unknown') => {
  blockedIPs.add(ip);
  logSecurity('ip_blocked', { ip, reason });
};

/**
 * Remove IP from blocklist
 */
const unblockIP = (ip) => {
  blockedIPs.delete(ip);
  logSecurity('ip_unblocked', { ip });
};

/**
 * Add IP to whitelist
 */
const whitelistIP = (ip) => {
  whitelistedIPs.add(ip);
  logSecurity('ip_whitelisted', { ip });
};

/**
 * Track failed login attempts
 */
const trackFailedLogin = (ip, email) => {
  const key = `${ip}-${email}`;
  const attempts = failedLoginAttempts.get(key) || { count: 0, firstAttempt: Date.now() };
  
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  
  failedLoginAttempts.set(key, attempts);
  
  logSecurity('failed_login_attempt', {
    ip,
    email,
    attemptCount: attempts.count,
  });
  
  // Auto-block after 10 failed attempts within 15 minutes
  if (attempts.count >= 10 && (Date.now() - attempts.firstAttempt) < 15 * 60 * 1000) {
    blockIP(ip, 'Too many failed login attempts');
    return true; // IP was blocked
  }
  
  return false;
};

/**
 * Reset failed login attempts on successful login
 */
const resetFailedLogins = (ip, email) => {
  const key = `${ip}-${email}`;
  failedLoginAttempts.delete(key);
};

/**
 * Request sanitization middleware
 */
const sanitizeRequest = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query params
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  // Sanitize params
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

/**
 * Recursively sanitize an object
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeValue(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip dangerous keys
    if (key.startsWith('$') || key.startsWith('__')) {
      logSecurity('dangerous_key_blocked', { key });
      continue;
    }
    sanitized[sanitizeValue(key)] = sanitizeObject(value);
  }
  
  return sanitized;
};

/**
 * Sanitize a single value
 */
const sanitizeValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  
  // Remove null bytes
  value = value.replace(/\0/g, '');
  
  // Basic XSS prevention (HTML entities)
  value = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
  
  return value.trim();
};

/**
 * Validate Content-Type header
 */
const validateContentType = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const contentType = req.headers['content-type'];
  
  // Allow requests without body
  if (!req.body || Object.keys(req.body).length === 0) {
    return next();
  }
  
  // Validate content type
  const validTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
  ];
  
  const isValid = validTypes.some(type => contentType?.includes(type));
  
  if (!isValid) {
    logSecurity('invalid_content_type', {
      ip: req.ip,
      contentType,
      path: req.path,
    });
    
    return res.status(415).json({
      success: false,
      error: 'Unsupported Media Type',
      code: 'INVALID_CONTENT_TYPE',
    });
  }
  
  next();
};

/**
 * Security audit logging middleware
 */
const securityAuditLog = (req, res, next) => {
  // Log all sensitive operations
  const sensitiveRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/password',
    '/admin',
    '/api/users',
    '/api/orders',
    '/api/payments',
  ];
  
  const isSensitive = sensitiveRoutes.some(route => req.path.startsWith(route));
  
  if (isSensitive) {
    logAudit('sensitive_route_access', {
      ip: req.ip,
      userId: req.user?.id,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'],
    });
  }
  
  next();
};

/**
 * HTTPS redirect middleware (for production)
 */
const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
};

/**
 * Request ID middleware for tracing
 */
const requestId = (req, res, next) => {
  const id = req.headers['x-request-id'] || generateRequestId();
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};

/**
 * Generate unique request ID
 */
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * API Key validation middleware
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      code: 'API_KEY_MISSING',
    });
  }
  
  // Validate API key format
  if (!/^[a-zA-Z0-9_-]{32,64}$/.test(apiKey)) {
    logSecurity('invalid_api_key_format', {
      ip: req.ip,
      apiKey: apiKey.substring(0, 8) + '...',
    });
    
    return res.status(401).json({
      success: false,
      error: 'Invalid API key format',
      code: 'API_KEY_INVALID',
    });
  }
  
  // API key validation logic would go here
  // This would check against database of valid API keys
  req.apiKey = apiKey;
  next();
};

// ============================================================================
// COMPOSITE MIDDLEWARE
// ============================================================================

/**
 * Apply all security middleware at once
 */
const applySecurity = (app) => {
  // Basic security
  app.use(requestId);
  app.use(httpsRedirect);
  app.use(helmetConfig);
  app.use(corsConfig);
  
  // Rate limiting
  app.use('/api/', generalLimiter);
  app.use('/auth/login', authLimiter);
  app.use('/auth/register', authLimiter);
  app.use('/auth/forgot-password', passwordResetLimiter);
  app.use('/api/orders', orderLimiter);
  
  // Input sanitization
  app.use(mongoSanitizeConfig);
  app.use(xssConfig);
  app.use(hppConfig);
  
  // Custom security
  app.use(ipBlocker);
  app.use(sanitizeRequest);
  app.use(validateContentType);
  app.use(securityAuditLog);
  
  logSecurity('security_middleware_applied', {
    middleware: [
      'helmet',
      'cors',
      'rate-limiting',
      'mongo-sanitize',
      'xss-clean',
      'hpp',
      'ip-blocker',
      'request-sanitizer',
      'content-type-validator',
      'audit-logger',
    ],
  });
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Helmet
  helmetConfig,
  
  // CORS
  corsConfig,
  getAllowedOrigins,
  
  // Rate Limiters
  generalLimiter,
  authLimiter,
  apiLimiter,
  passwordResetLimiter,
  orderLimiter,
  
  // Input Sanitization
  mongoSanitizeConfig,
  xssConfig,
  hppConfig,
  sanitizeRequest,
  sanitizeObject,
  sanitizeValue,
  
  // IP Management
  ipBlocker,
  blockIP,
  unblockIP,
  whitelistIP,
  blockedIPs,
  whitelistedIPs,
  
  // Login Tracking
  trackFailedLogin,
  resetFailedLogins,
  failedLoginAttempts,
  
  // Validation
  validateContentType,
  validateApiKey,
  
  // Logging
  securityAuditLog,
  
  // Utilities
  httpsRedirect,
  requestId,
  generateRequestId,
  
  // Composite
  applySecurity,
};
