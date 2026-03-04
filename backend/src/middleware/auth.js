/**
 * CURIA Backend - Authentication Middleware
 * 
 * FEATURES:
 * =========
 * 1. JWT Token Management (Access + Refresh tokens)
 * 2. Role-Based Access Control (RBAC)
 * 3. Permission-Based Access Control
 * 4. Password Hashing & Verification
 * 5. Session Management
 * 6. Account Verification (Email)
 * 7. Password Reset Flow
 * 8. Multi-Factor Authentication Ready
 * 9. API Key Authentication
 * 10. OAuth2 Ready (Google, etc.)
 * 
 * SECURITY:
 * =========
 * - Bcrypt password hashing (12 rounds)
 * - JWT with RS256 or HS256
 * - Refresh token rotation
 * - Token blacklisting
 * - Secure token storage guidelines
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ============================================
// CONFIGURATION
// ============================================

const config = {
  // JWT Settings
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',      // 15 minutes
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',     // 7 days
    issuer: process.env.JWT_ISSUER || 'curia-backend',
    audience: process.env.JWT_AUDIENCE || 'curia-app'
  },
  
  // Password Settings
  password: {
    saltRounds: 12,
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Session Settings
  session: {
    maxConcurrentSessions: 5,
    sessionTimeout: 30 * 60 * 1000  // 30 minutes inactivity
  },
  
  // Verification Settings
  verification: {
    tokenExpiry: 24 * 60 * 60 * 1000,  // 24 hours
    resetTokenExpiry: 1 * 60 * 60 * 1000  // 1 hour
  }
};

// ============================================
// USER ROLES & PERMISSIONS
// ============================================

/**
 * User Roles Hierarchy
 * Higher number = more permissions
 */
const ROLES = {
  GUEST: 0,
  CUSTOMER: 1,
  CREATOR: 2,        // Lead Generator / Affiliate
  SALES_REP: 3,      // Sales Representative
  SUPPORT: 4,        // Customer Support
  MANAGER: 5,        // Store Manager
  ADMIN: 6,          // Administrator
  SUPER_ADMIN: 7     // Super Administrator
};

/**
 * Role Names (for display)
 */
const ROLE_NAMES = {
  0: 'Guest',
  1: 'Customer',
  2: 'Creator',
  3: 'Sales Representative',
  4: 'Support',
  5: 'Manager',
  6: 'Administrator',
  7: 'Super Administrator'
};

/**
 * Permissions by Role
 */
const PERMISSIONS = {
  // Guest permissions
  [ROLES.GUEST]: [
    'products:view',
    'categories:view',
    'configurator:use'
  ],
  
  // Customer permissions
  [ROLES.CUSTOMER]: [
    'products:view',
    'categories:view',
    'configurator:use',
    'orders:create',
    'orders:view:own',
    'profile:view:own',
    'profile:edit:own',
    'wishlist:manage'
  ],
  
  // Creator (Lead Generator) permissions
  [ROLES.CREATOR]: [
    'products:view',
    'categories:view',
    'configurator:use',
    'orders:create',
    'orders:view:own',
    'profile:view:own',
    'profile:edit:own',
    'leads:view:own',
    'leads:create',
    'commissions:view:own',
    'referral:manage'
  ],
  
  // Sales Rep permissions
  // NOTE: NO leads access - only SUPER_ADMIN can see leads
  [ROLES.SALES_REP]: [
    'products:view',
    'categories:view',
    'configurator:use',
    'orders:view:all',
    'orders:edit',
    'customers:view',
    'customers:edit',
    'quotes:create',
    'quotes:edit'
    // leads:view:all - REMOVED (Only SUPER_ADMIN can see all leads)
    // leads:assign - REMOVED (Only SUPER_ADMIN can assign leads)
  ],
  
  // Support permissions
  [ROLES.SUPPORT]: [
    'products:view',
    'categories:view',
    'orders:view:all',
    'orders:edit:status',
    'customers:view',
    'tickets:manage',
    'refunds:request'
  ],
  
  // Manager permissions
  [ROLES.MANAGER]: [
    'products:view',
    'products:create',
    'products:edit',
    'categories:manage',
    'orders:view:all',
    'orders:edit',
    'orders:cancel',
    'customers:view',
    'customers:edit',
    'reports:view',
    'analytics:view',
    'inventory:manage',
    'promotions:manage',
    'staff:view'
  ],
  
  // Admin permissions
  // NOTE: NO leads access - only SUPER_ADMIN can see/manage all leads
  [ROLES.ADMIN]: [
    'products:manage',
    'categories:manage',
    'orders:manage',
    'customers:manage',
    'reports:manage',
    'analytics:manage',
    'inventory:manage',
    'promotions:manage',
    'staff:manage',
    'settings:view',
    'settings:edit',
    'catalog:import',
    'commissions:manage'
    // leads:manage - REMOVED (Only SUPER_ADMIN)
    // leads:view:all - REMOVED (Only SUPER_ADMIN)
  ],
  
  // Super Admin permissions (everything)
  // ONLY SUPER_ADMIN CAN:
  // - View ALL leads from ALL creators
  // - Assign leads to staff
  // - Manage lead permissions
  // - Export lead data
  [ROLES.SUPER_ADMIN]: [
    '*'  // All permissions including: leads:view:all, leads:manage, leads:assign, leads:export
  ]
};

// ============================================
// TOKEN BLACKLIST (In-Memory - Use Redis in production)
// ============================================

const tokenBlacklist = new Set();
const refreshTokens = new Map();  // userId -> Set of refresh tokens

/**
 * Add token to blacklist
 */
const blacklistToken = (token) => {
  tokenBlacklist.add(token);
  
  // Auto-cleanup after token would expire anyway
  setTimeout(() => {
    tokenBlacklist.delete(token);
  }, 24 * 60 * 60 * 1000);  // 24 hours
};

/**
 * Check if token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token);
};

// ============================================
// PASSWORD UTILITIES
// ============================================

/**
 * Hash password using bcrypt
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(config.password.saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Validate password strength
 */
const validatePasswordStrength = (password) => {
  const errors = [];
  
  if (password.length < config.password.minLength) {
    errors.push(`Password must be at least ${config.password.minLength} characters`);
  }
  
  if (config.password.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (config.password.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (config.password.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (config.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate random password
 */
const generateRandomPassword = (length = 16) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// ============================================
// JWT TOKEN UTILITIES
// ============================================

/**
 * Generate Access Token
 */
const generateAccessToken = (user) => {
  const payload = {
    userId: user._id || user.id,
    email: user.email,
    role: user.role || ROLES.CUSTOMER,
    permissions: getPermissionsForRole(user.role || ROLES.CUSTOMER),
    type: 'access'
  };
  
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience
  });
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (user) => {
  const tokenId = crypto.randomBytes(16).toString('hex');
  
  const payload = {
    userId: user._id || user.id,
    tokenId,
    type: 'refresh'
  };
  
  const token = jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience
  });
  
  // Store refresh token for user
  const userId = user._id || user.id;
  if (!refreshTokens.has(userId)) {
    refreshTokens.set(userId, new Set());
  }
  refreshTokens.get(userId).add(tokenId);
  
  // Limit concurrent sessions
  const userTokens = refreshTokens.get(userId);
  if (userTokens.size > config.session.maxConcurrentSessions) {
    const tokensArray = Array.from(userTokens);
    tokensArray.slice(0, userTokens.size - config.session.maxConcurrentSessions)
      .forEach(t => userTokens.delete(t));
  }
  
  return token;
};

/**
 * Generate Token Pair (Access + Refresh)
 */
const generateTokenPair = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    expiresIn: config.jwt.accessExpiresIn,
    tokenType: 'Bearer'
  };
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  try {
    if (isTokenBlacklisted(token)) {
      return { valid: false, error: 'Token has been revoked' };
    }
    
    const decoded = jwt.verify(token, config.jwt.accessSecret, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience
    });
    
    if (decoded.type !== 'access') {
      return { valid: false, error: 'Invalid token type' };
    }
    
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  try {
    if (isTokenBlacklisted(token)) {
      return { valid: false, error: 'Token has been revoked' };
    }
    
    const decoded = jwt.verify(token, config.jwt.refreshSecret, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience
    });
    
    if (decoded.type !== 'refresh') {
      return { valid: false, error: 'Invalid token type' };
    }
    
    // Check if token is still valid for user
    const userTokens = refreshTokens.get(decoded.userId);
    if (!userTokens || !userTokens.has(decoded.tokenId)) {
      return { valid: false, error: 'Token has been invalidated' };
    }
    
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * Refresh Token Pair (rotate refresh token)
 */
const refreshTokenPair = async (refreshToken, getUserById) => {
  const verification = verifyRefreshToken(refreshToken);
  
  if (!verification.valid) {
    throw new Error(verification.error);
  }
  
  const { decoded } = verification;
  
  // Invalidate old refresh token
  const userTokens = refreshTokens.get(decoded.userId);
  if (userTokens) {
    userTokens.delete(decoded.tokenId);
  }
  
  // Get fresh user data
  const user = await getUserById(decoded.userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!user.isActive) {
    throw new Error('Account is disabled');
  }
  
  // Generate new token pair
  return generateTokenPair(user);
};

/**
 * Revoke all tokens for user
 */
const revokeAllUserTokens = (userId) => {
  refreshTokens.delete(userId);
};

/**
 * Revoke specific token
 */
const revokeToken = (token) => {
  blacklistToken(token);
};

// ============================================
// PERMISSION UTILITIES
// ============================================

/**
 * Get permissions for role
 */
const getPermissionsForRole = (role) => {
  const permissions = new Set();
  
  // Add permissions for this role and all lower roles
  for (let r = 0; r <= role; r++) {
    if (PERMISSIONS[r]) {
      PERMISSIONS[r].forEach(p => permissions.add(p));
    }
  }
  
  return Array.from(permissions);
};

/**
 * Check if user has permission
 */
const hasPermission = (user, permission) => {
  if (!user) return false;
  
  const userRole = user.role || ROLES.CUSTOMER;
  const permissions = getPermissionsForRole(userRole);
  
  // Super admin has all permissions
  if (permissions.includes('*')) return true;
  
  // Check exact permission
  if (permissions.includes(permission)) return true;
  
  // Check wildcard (e.g., 'products:manage' includes 'products:view')
  const [resource, action] = permission.split(':');
  if (permissions.includes(`${resource}:manage`)) return true;
  
  return false;
};

/**
 * Check if user has any of the permissions
 */
const hasAnyPermission = (user, permissions) => {
  return permissions.some(p => hasPermission(user, p));
};

/**
 * Check if user has all permissions
 */
const hasAllPermissions = (user, permissions) => {
  return permissions.every(p => hasPermission(user, p));
};

/**
 * Check if user has role or higher
 */
const hasRole = (user, requiredRole) => {
  if (!user) return false;
  const userRole = user.role || ROLES.CUSTOMER;
  return userRole >= requiredRole;
};

// ============================================
// VERIFICATION TOKENS
// ============================================

/**
 * Generate email verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate password reset token
 */
const generatePasswordResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
};

/**
 * Hash reset token for comparison
 */
const hashResetToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

/**
 * Authenticate request (required)
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }
    
    // Check Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format. Use Bearer token.',
        code: 'INVALID_FORMAT'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const verification = verifyAccessToken(token);
    
    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        error: verification.error,
        code: 'INVALID_TOKEN'
      });
    }
    
    // Attach user to request
    req.user = verification.decoded;
    req.token = token;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

/**
 * Authenticate request (optional - allows guests)
 */
const authenticateOptional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Continue as guest
      req.user = { role: ROLES.GUEST, permissions: getPermissionsForRole(ROLES.GUEST) };
      return next();
    }
    
    const token = authHeader.substring(7);
    const verification = verifyAccessToken(token);
    
    if (verification.valid) {
      req.user = verification.decoded;
      req.token = token;
    } else {
      req.user = { role: ROLES.GUEST, permissions: getPermissionsForRole(ROLES.GUEST) };
    }
    
    next();
  } catch (error) {
    req.user = { role: ROLES.GUEST, permissions: getPermissionsForRole(ROLES.GUEST) };
    next();
  }
};

/**
 * Require specific role
 */
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!hasRole(req.user, requiredRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${ROLE_NAMES[requiredRole]}`,
        code: 'INSUFFICIENT_ROLE'
      });
    }
    
    next();
  };
};

/**
 * Require specific permission
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!hasPermission(req.user, permission)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required permission: ${permission}`,
        code: 'INSUFFICIENT_PERMISSION'
      });
    }
    
    next();
  };
};

/**
 * Require any of the permissions
 */
const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!hasAnyPermission(req.user, permissions)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required one of: ${permissions.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSION'
      });
    }
    
    next();
  };
};

/**
 * Require all permissions
 */
const requireAllPermissions = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    if (!hasAllPermissions(req.user, permissions)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required all of: ${permissions.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSION'
      });
    }
    
    next();
  };
};

/**
 * Require ownership or role
 * Checks if user owns the resource OR has admin role
 */
const requireOwnershipOrRole = (getOwnerId, requiredRole = ROLES.ADMIN) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }
    
    // Admins always pass
    if (hasRole(req.user, requiredRole)) {
      return next();
    }
    
    try {
      const ownerId = await getOwnerId(req);
      const userId = req.user.userId;
      
      if (ownerId && ownerId.toString() === userId.toString()) {
        return next();
      }
      
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not own this resource.',
        code: 'NOT_OWNER'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Error checking ownership',
        code: 'OWNERSHIP_CHECK_FAILED'
      });
    }
  };
};

// ============================================
// API KEY AUTHENTICATION
// ============================================

const apiKeys = new Map();  // Store API keys (use database in production)

/**
 * Generate API Key
 */
const generateApiKey = (userId, name, permissions = []) => {
  const key = `curia_${crypto.randomBytes(32).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  
  apiKeys.set(keyHash, {
    userId,
    name,
    permissions,
    createdAt: new Date(),
    lastUsed: null
  });
  
  return key;  // Return unhashed key (only shown once)
};

/**
 * Validate API Key
 */
const validateApiKey = (key) => {
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  const keyData = apiKeys.get(keyHash);
  
  if (!keyData) {
    return { valid: false, error: 'Invalid API key' };
  }
  
  keyData.lastUsed = new Date();
  return { valid: true, data: keyData };
};

/**
 * API Key Authentication Middleware
 */
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      code: 'NO_API_KEY'
    });
  }
  
  const validation = validateApiKey(apiKey);
  
  if (!validation.valid) {
    return res.status(401).json({
      success: false,
      error: validation.error,
      code: 'INVALID_API_KEY'
    });
  }
  
  req.apiKey = validation.data;
  next();
};

/**
 * Revoke API Key
 */
const revokeApiKey = (key) => {
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');
  return apiKeys.delete(keyHash);
};

// ============================================
// MULTI-FACTOR AUTHENTICATION (MFA) READY
// ============================================

/**
 * Generate MFA Secret (TOTP)
 */
const generateMFASecret = () => {
  return crypto.randomBytes(20).toString('hex');
};

/**
 * Verify MFA Token
 * (Placeholder - implement with speakeasy or otplib)
 */
const verifyMFAToken = (secret, token) => {
  // TODO: Implement TOTP verification
  // Use library like 'speakeasy' or 'otplib'
  return false;
};

/**
 * Generate backup codes
 */
const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
};

// ============================================
// LEADS ACCESS CONTROL (SUPER_ADMIN ONLY)
// ============================================

/**
 * LEAD PERMISSIONS:
 * -----------------
 * leads:view:own    → Creator can see their OWN leads only
 * leads:view:all    → SUPER_ADMIN ONLY - see ALL leads
 * leads:create      → Creator can create leads (referrals)
 * leads:assign      → SUPER_ADMIN ONLY - assign leads to staff
 * leads:manage      → SUPER_ADMIN ONLY - full lead management
 * leads:export      → SUPER_ADMIN ONLY - export lead data
 */

/**
 * Check if user can view leads
 * - SUPER_ADMIN: Can view ALL leads
 * - CREATOR: Can view ONLY their own leads
 * - Others: NO access
 */
const canViewAllLeads = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // Only SUPER_ADMIN can view ALL leads
  if (req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Only Super Administrator can view all leads.',
      yourRole: ROLE_NAMES[req.user.role]
    });
  }
  
  next();
};

/**
 * Check if user can view a specific lead
 * - SUPER_ADMIN: Can view any lead
 * - CREATOR: Can view only leads they created
 * - Others: NO access
 */
const canViewLead = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // SUPER_ADMIN can view any lead
  if (req.user.role === ROLES.SUPER_ADMIN) {
    return next();
  }
  
  // CREATOR can view only their own leads
  if (req.user.role === ROLES.CREATOR) {
    // The route handler must verify lead.creatorId === req.user.id
    req.mustVerifyLeadOwnership = true;
    return next();
  }
  
  // All others: NO access
  return res.status(403).json({
    success: false,
    error: 'Access denied. You do not have permission to view leads.',
    yourRole: ROLE_NAMES[req.user.role]
  });
};

/**
 * Check if user can manage leads (assign, edit, delete, export)
 * ONLY SUPER_ADMIN
 */
const canManageLeads = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  
  // Only SUPER_ADMIN can manage leads
  if (req.user.role !== ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Only Super Administrator can manage leads.',
      yourRole: ROLE_NAMES[req.user.role]
    });
  }
  
  next();
};

/**
 * Grant temporary lead access to a user
 * Only SUPER_ADMIN can grant this
 * @param {string} userId - User to grant access
 * @param {string} leadId - Specific lead or 'all'
 * @param {number} durationHours - How long access lasts
 */
const temporaryLeadAccess = new Map(); // userId -> { leadIds: Set, expiresAt: Date }

const grantTemporaryLeadAccess = (userId, leadId, durationHours = 24) => {
  const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);
  
  if (!temporaryLeadAccess.has(userId)) {
    temporaryLeadAccess.set(userId, { leadIds: new Set(), expiresAt });
  }
  
  const access = temporaryLeadAccess.get(userId);
  access.leadIds.add(leadId);
  access.expiresAt = expiresAt;
  
  return { userId, leadId, expiresAt };
};

const revokeTemporaryLeadAccess = (userId, leadId = null) => {
  if (!temporaryLeadAccess.has(userId)) return false;
  
  if (leadId) {
    temporaryLeadAccess.get(userId).leadIds.delete(leadId);
  } else {
    temporaryLeadAccess.delete(userId);
  }
  
  return true;
};

const hasTemporaryLeadAccess = (userId, leadId) => {
  if (!temporaryLeadAccess.has(userId)) return false;
  
  const access = temporaryLeadAccess.get(userId);
  
  // Check if expired
  if (new Date() > access.expiresAt) {
    temporaryLeadAccess.delete(userId);
    return false;
  }
  
  return access.leadIds.has(leadId) || access.leadIds.has('all');
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Configuration
  config,
  
  // Roles & Permissions
  ROLES,
  ROLE_NAMES,
  PERMISSIONS,
  getPermissionsForRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  
  // Password utilities
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  generateRandomPassword,
  
  // JWT Token utilities
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  refreshTokenPair,
  revokeAllUserTokens,
  revokeToken,
  blacklistToken,
  isTokenBlacklisted,
  
  // Verification tokens
  generateVerificationToken,
  generatePasswordResetToken,
  hashResetToken,
  
  // Authentication middleware
  authenticate,
  authenticateOptional,
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireOwnershipOrRole,
  
  // API Key authentication
  generateApiKey,
  validateApiKey,
  authenticateApiKey,
  revokeApiKey,
  
  // MFA utilities
  generateMFASecret,
  verifyMFAToken,
  generateBackupCodes,
  
  // LEADS ACCESS CONTROL (SUPER_ADMIN ONLY)
  canViewAllLeads,
  canViewLead,
  canManageLeads,
  grantTemporaryLeadAccess,
  revokeTemporaryLeadAccess,
  hasTemporaryLeadAccess,
  temporaryLeadAccess,
  
  // Token storage (for external access)
  tokenBlacklist,
  refreshTokens
};
