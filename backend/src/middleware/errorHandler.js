/**
 * CURIA Backend - Comprehensive Error Handling Middleware
 * 
 * This middleware handles ALL types of errors in the application:
 * - HTTP errors (400, 401, 403, 404, 409, 429, 500)
 * - Database errors (connection, query, constraint violations)
 * - Validation errors (input validation failures)
 * - Authentication errors (invalid credentials, expired tokens)
 * - Authorization errors (insufficient permissions, role-based access)
 * - Business logic errors (invalid operations, workflow violations)
 * - CRM-specific errors (role access, lead generator, order workflow)
 * 
 * @module middleware/errorHandler
 */

// ============================================================================
// ERROR CLASS DEFINITIONS
// ============================================================================

/**
 * Base error class for all custom errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // Distinguishes operational vs programming errors
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================================================
// HTTP ERRORS
// ============================================================================

/**
 * 400 Bad Request - Invalid input/request format
 */
class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details; // Array of validation errors
  }
}

/**
 * 401 Unauthorized - Authentication required/failed
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * 403 Forbidden - Authenticated but not authorized
 */
class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

/**
 * 404 Not Found - Resource doesn't exist
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource', identifier = null) {
    const message = identifier 
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    this.resource = resource;
    this.identifier = identifier;
  }
}

/**
 * 409 Conflict - Resource already exists or state conflict
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists', conflictType = 'duplicate') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
    this.conflictType = conflictType;
  }
}

/**
 * 429 Too Many Requests - Rate limit exceeded
 */
class RateLimitError extends AppError {
  constructor(retryAfter = 60) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds.`, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
class InternalError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super(message, 500, 'INTERNAL_ERROR');
    this.name = 'InternalError';
  }
}

// ============================================================================
// DATABASE ERRORS
// ============================================================================

/**
 * Database connection or query errors
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

/**
 * Database constraint violation (unique, foreign key, etc.)
 */
class ConstraintViolationError extends AppError {
  constructor(constraint, message = 'Database constraint violation') {
    super(message, 409, 'CONSTRAINT_VIOLATION');
    this.name = 'ConstraintViolationError';
    this.constraint = constraint;
  }
}

// ============================================================================
// BUSINESS LOGIC ERRORS
// ============================================================================

/**
 * Generic business logic error
 */
class BusinessLogicError extends AppError {
  constructor(message, details = null) {
    super(message, 422, 'BUSINESS_LOGIC_ERROR');
    this.name = 'BusinessLogicError';
    this.details = details;
  }
}

/**
 * Payment processing error
 */
class PaymentError extends AppError {
  constructor(message = 'Payment processing failed', paymentCode = null) {
    super(message, 422, 'PAYMENT_ERROR');
    this.name = 'PaymentError';
    this.paymentCode = paymentCode;
  }
}

/**
 * Shipping/delivery error
 */
class ShippingError extends AppError {
  constructor(message = 'Shipping operation failed') {
    super(message, 422, 'SHIPPING_ERROR');
    this.name = 'ShippingError';
  }
}

/**
 * Inventory/stock error
 */
class InventoryError extends AppError {
  constructor(message = 'Insufficient inventory', productId = null) {
    super(message, 422, 'INVENTORY_ERROR');
    this.name = 'InventoryError';
    this.productId = productId;
  }
}

// ============================================================================
// CRM-SPECIFIC ERRORS
// ============================================================================

/**
 * Role-based access error (CRM roles: CREATOR, CEO, ADMIN, etc.)
 */
class RoleAccessError extends AppError {
  constructor(requiredRole, userRole) {
    const message = `Access denied. Required role: ${requiredRole}, your role: ${userRole}`;
    super(message, 403, 'ROLE_ACCESS_DENIED');
    this.name = 'RoleAccessError';
    this.requiredRole = requiredRole;
    this.userRole = userRole;
  }
}

/**
 * Lead Generator access error (CREATOR-only feature)
 */
class LeadGeneratorAccessError extends AppError {
  constructor() {
    super('Lead Generator access is restricted to CREATOR role only', 403, 'LEAD_GENERATOR_ACCESS_DENIED');
    this.name = 'LeadGeneratorAccessError';
  }
}

/**
 * Order workflow state error (invalid state transition)
 */
class OrderWorkflowError extends AppError {
  constructor(currentState, attemptedState) {
    const message = `Invalid order state transition from '${currentState}' to '${attemptedState}'`;
    super(message, 422, 'ORDER_WORKFLOW_ERROR');
    this.name = 'OrderWorkflowError';
    this.currentState = currentState;
    this.attemptedState = attemptedState;
  }
}

/**
 * Quote expiration error
 */
class QuoteExpiredError extends AppError {
  constructor(quoteId, expirationDate) {
    super(`Quote ${quoteId} expired on ${expirationDate}`, 410, 'QUOTE_EXPIRED');
    this.name = 'QuoteExpiredError';
    this.quoteId = quoteId;
    this.expirationDate = expirationDate;
  }
}

/**
 * Configuration error (invalid product configuration)
 */
class ConfigurationError extends AppError {
  constructor(message = 'Invalid product configuration', invalidOptions = null) {
    super(message, 422, 'CONFIGURATION_ERROR');
    this.name = 'ConfigurationError';
    this.invalidOptions = invalidOptions;
  }
}

/**
 * VAT validation error (invalid VAT number for B2B)
 */
class VatValidationError extends AppError {
  constructor(vatNumber, country) {
    super(`Invalid VAT number ${vatNumber} for country ${country}`, 422, 'VAT_VALIDATION_ERROR');
    this.name = 'VatValidationError';
    this.vatNumber = vatNumber;
    this.country = country;
  }
}

// ============================================================================
// ERROR STATISTICS TRACKING
// ============================================================================

const errorStats = {
  counts: {},
  lastErrors: [],
  maxLastErrors: 100,
  
  track(error) {
    const errorType = error.name || error.constructor.name || 'UnknownError';
    this.counts[errorType] = (this.counts[errorType] || 0) + 1;
    
    // Keep last N errors for debugging
    this.lastErrors.unshift({
      type: errorType,
      message: error.message,
      timestamp: new Date().toISOString(),
      statusCode: error.statusCode || 500
    });
    
    if (this.lastErrors.length > this.maxLastErrors) {
      this.lastErrors.pop();
    }
  },
  
  getStats() {
    return {
      counts: { ...this.counts },
      totalErrors: Object.values(this.counts).reduce((a, b) => a + b, 0),
      lastErrors: this.lastErrors.slice(0, 10)
    };
  },
  
  reset() {
    this.counts = {};
    this.lastErrors = [];
  }
};

// ============================================================================
// ERROR CLASSIFICATION
// ============================================================================

/**
 * Classify error type for appropriate handling
 */
function classifyError(error) {
  if (error instanceof AppError) {
    return error.name;
  }
  
  // PostgreSQL error codes
  if (error.code) {
    switch (error.code) {
      case '23505': return 'UniqueViolation';      // Duplicate key
      case '23503': return 'ForeignKeyViolation';  // FK constraint
      case '23502': return 'NotNullViolation';     // NOT NULL constraint
      case '22P02': return 'InvalidTextRepresentation'; // Invalid UUID, etc.
      case '42P01': return 'UndefinedTable';       // Table doesn't exist
      case '42703': return 'UndefinedColumn';      // Column doesn't exist
      case '28P01': return 'InvalidPassword';      // Auth failure
      case 'ECONNREFUSED': return 'DatabaseConnection';
      case 'ENOTFOUND': return 'DatabaseConnection';
      default: return 'DatabaseError';
    }
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') return 'JWTError';
  if (error.name === 'TokenExpiredError') return 'JWTExpired';
  
  // Validation errors (express-validator)
  if (error.array && typeof error.array === 'function') return 'ValidationError';
  
  return 'UnknownError';
}

/**
 * Convert database errors to user-friendly errors
 */
function handleDatabaseError(error) {
  const errorType = classifyError(error);
  
  switch (errorType) {
    case 'UniqueViolation':
      return new ConflictError('This record already exists', 'duplicate');
    case 'ForeignKeyViolation':
      return new ValidationError('Invalid reference: related record not found');
    case 'NotNullViolation':
      return new ValidationError('Required field is missing');
    case 'InvalidTextRepresentation':
      return new ValidationError('Invalid data format');
    case 'UndefinedTable':
    case 'UndefinedColumn':
      return new DatabaseError('Database schema error');
    case 'DatabaseConnection':
      return new DatabaseError('Unable to connect to database');
    case 'InvalidPassword':
      return new AuthenticationError('Invalid credentials');
    default:
      return new DatabaseError('Database operation failed', error);
  }
}

/**
 * Convert JWT errors to authentication errors
 */
function handleJWTError(error) {
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Your session has expired. Please login again.');
  }
  return new AuthenticationError('Invalid authentication token');
}

// ============================================================================
// SANITIZE ERROR FOR RESPONSE
// ============================================================================

/**
 * Sanitize error for client response (hide sensitive info in production)
 */
function sanitizeError(error, isDevelopment) {
  const response = {
    success: false,
    error: {
      code: error.errorCode || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500
    }
  };
  
  // Add validation details if present
  if (error.details) {
    response.error.details = error.details;
  }
  
  // Add additional context for specific errors
  if (error instanceof RoleAccessError) {
    response.error.requiredRole = error.requiredRole;
  }
  
  if (error instanceof OrderWorkflowError) {
    response.error.currentState = error.currentState;
    response.error.allowedTransitions = getValidOrderTransitions(error.currentState);
  }
  
  if (error instanceof RateLimitError) {
    response.error.retryAfter = error.retryAfter;
  }
  
  // Include stack trace only in development
  if (isDevelopment) {
    response.error.stack = error.stack;
    response.error.originalError = error.originalError?.message;
  }
  
  return response;
}

/**
 * Get valid order state transitions (for OrderWorkflowError)
 */
function getValidOrderTransitions(currentState) {
  const transitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'on_hold'],
    'on_hold': ['processing', 'cancelled'],
    'shipped': ['delivered'],
    'delivered': ['completed', 'refund_requested'],
    'refund_requested': ['refunded', 'completed'],
    'cancelled': [],
    'refunded': [],
    'completed': []
  };
  return transitions[currentState] || [];
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log error with context
 */
function logError(error, req) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      code: error.errorCode || error.code,
      statusCode: error.statusCode || 500,
      stack: error.stack
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'none'
    }
  };
  
  // Log based on severity
  if (error.statusCode >= 500) {
    console.error('[CRITICAL ERROR]', JSON.stringify(logEntry, null, 2));
  } else if (error.statusCode >= 400) {
    console.warn('[CLIENT ERROR]', JSON.stringify(logEntry, null, 2));
  } else {
    console.log('[INFO]', JSON.stringify(logEntry, null, 2));
  }
  
  return logEntry;
}

// ============================================================================
// MAIN ERROR HANDLER MIDDLEWARE
// ============================================================================

/**
 * Main error handling middleware
 * This should be the LAST middleware in the Express app
 */
function errorHandler(error, req, res, next) {
  // If headers already sent, delegate to Express default
  if (res.headersSent) {
    return next(error);
  }
  
  // Track error statistics
  errorStats.track(error);
  
  // Classify and convert error if needed
  let processedError = error;
  
  // Handle specific error types
  if (!(error instanceof AppError)) {
    const errorType = classifyError(error);
    
    switch (errorType) {
      case 'UniqueViolation':
      case 'ForeignKeyViolation':
      case 'NotNullViolation':
      case 'InvalidTextRepresentation':
      case 'UndefinedTable':
      case 'UndefinedColumn':
      case 'DatabaseConnection':
        processedError = handleDatabaseError(error);
        break;
      case 'JWTError':
      case 'JWTExpired':
        processedError = handleJWTError(error);
        break;
      default:
        // Wrap unknown errors as InternalError in production
        processedError = new InternalError(
          process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
        );
        processedError.originalError = error;
    }
  }
  
  // Log the error
  const logEntry = logError(processedError, req);
  
  // Determine environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Sanitize and send response
  const response = sanitizeError(processedError, isDevelopment);
  
  // Set appropriate headers
  if (processedError instanceof RateLimitError) {
    res.set('Retry-After', processedError.retryAfter);
  }
  
  // Send error response
  res.status(processedError.statusCode || 500).json(response);
}

// ============================================================================
// 404 HANDLER
// ============================================================================

/**
 * Handle 404 Not Found for unknown routes
 */
function notFoundHandler(req, res, next) {
  const error = new NotFoundError('Route', `${req.method} ${req.originalUrl}`);
  next(error);
}

// ============================================================================
// ASYNC ERROR WRAPPER
// ============================================================================

/**
 * Wrap async route handlers to catch errors
 * Usage: app.get('/route', asyncHandler(async (req, res) => { ... }))
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main middleware
  errorHandler,
  notFoundHandler,
  asyncHandler,
  
  // Error classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalError,
  DatabaseError,
  ConstraintViolationError,
  BusinessLogicError,
  PaymentError,
  ShippingError,
  InventoryError,
  
  // CRM-specific errors
  RoleAccessError,
  LeadGeneratorAccessError,
  OrderWorkflowError,
  QuoteExpiredError,
  ConfigurationError,
  VatValidationError,
  
  // Utilities
  errorStats,
  classifyError,
  sanitizeError
};
