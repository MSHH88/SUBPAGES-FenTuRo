/**
 * CURIA Backend - Comprehensive Logging Utility
 * 
 * Features:
 * - Multi-transport system (console + files)
 * - Daily rotation with 30-day retention
 * - CRM-specific loggers (audit, orders, payments, catalog, security)
 * - Request logging middleware
 * - Color-coded console output (development)
 * - JSON format for production
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// =============================================================================
// LOG LEVELS
// =============================================================================
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(colors);

// =============================================================================
// LOG FORMATS
// =============================================================================

// Console format (colorized for development)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// File format (JSON for production parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// =============================================================================
// TRANSPORTS
// =============================================================================
const transports = [];

// Console transport (always enabled in development)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug'
    })
  );
} else {
  // Production: minimal console output
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      ),
      level: 'info'
    })
  );
}

// File transports (always enabled)
// Combined log (all levels)
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: fileFormat,
    level: 'debug',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 30
  })
);

// Error log (errors only)
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    format: fileFormat,
    level: 'error',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 30
  })
);

// HTTP log (requests)
transports.push(
  new winston.transports.File({
    filename: path.join(logsDir, 'http.log'),
    format: fileFormat,
    level: 'http',
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 14
  })
);

// =============================================================================
// MAIN LOGGER
// =============================================================================
const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'debug',
  transports,
  exitOnError: false
});

// =============================================================================
// CRM-SPECIFIC LOGGERS
// =============================================================================

/**
 * Create a specialized logger for a specific domain
 */
function createDomainLogger(domain, filename) {
  return winston.createLogger({
    levels,
    level: 'debug',
    format: fileFormat,
    defaultMeta: { domain },
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, filename),
        maxsize: 10 * 1024 * 1024,
        maxFiles: 30
      }),
      // Also log to combined
      new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 10 * 1024 * 1024,
        maxFiles: 30
      })
    ]
  });
}

// Audit logger - User actions
const auditLogger = createDomainLogger('audit', 'audit.log');

// Order logger - Order lifecycle
const orderLogger = createDomainLogger('orders', 'orders.log');

// Payment logger - Payment transactions
const paymentLogger = createDomainLogger('payments', 'payments.log');

// Catalog logger - Catalog imports/changes
const catalogLogger = createDomainLogger('catalog', 'catalog.log');

// Security logger - Security events
const securityLogger = createDomainLogger('security', 'security.log');

// Analytics logger - Analytics events
const analyticsLogger = createDomainLogger('analytics', 'analytics.log');

// Inventory logger - Stock changes
const inventoryLogger = createDomainLogger('inventory', 'inventory.log');

// Promotion logger - Promotion events
const promotionLogger = createDomainLogger('promotions', 'promotions.log');

// =============================================================================
// LOGGING FUNCTIONS
// =============================================================================

/**
 * Log an audit event (user action)
 * @param {string} action - The action performed
 * @param {Object} data - Additional data
 */
function logAudit(action, data = {}) {
  auditLogger.info(action, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log an order event
 * @param {string} event - The order event
 * @param {Object} data - Order data
 */
function logOrder(event, data = {}) {
  orderLogger.info(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log a payment event
 * @param {string} event - The payment event
 * @param {Object} data - Payment data (sanitized - no card numbers)
 */
function logPayment(event, data = {}) {
  // Sanitize sensitive data
  const sanitized = { ...data };
  if (sanitized.cardNumber) {
    sanitized.cardNumber = `****${sanitized.cardNumber.slice(-4)}`;
  }
  if (sanitized.cvv) {
    sanitized.cvv = '***';
  }
  
  paymentLogger.info(event, {
    ...sanitized,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log a catalog event
 * @param {string} event - The catalog event
 * @param {Object} data - Catalog data
 */
function logCatalog(event, data = {}) {
  catalogLogger.info(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log a security event
 * @param {string} event - The security event
 * @param {Object} data - Security data
 */
function logSecurity(event, data = {}) {
  securityLogger.warn(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log an analytics event
 * @param {string} event - The analytics event (page_view, add_to_cart, purchase, etc.)
 * @param {Object} data - Analytics data
 */
function logAnalytics(event, data = {}) {
  analyticsLogger.info(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log an inventory event
 * @param {string} event - The inventory event (stock_update, low_stock, restock)
 * @param {Object} data - Inventory data
 */
function logInventory(event, data = {}) {
  inventoryLogger.info(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log a promotion event
 * @param {string} event - The promotion event (promotion_created, promotion_applied, promotion_expired)
 * @param {Object} data - Promotion data
 */
function logPromotion(event, data = {}) {
  promotionLogger.info(event, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// REQUEST LOGGING MIDDLEWARE
// =============================================================================

/**
 * Express middleware for logging HTTP requests
 */
function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log after response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || null
    };
    
    // Determine log level based on status code
    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request warning', logData);
    } else {
      logger.http('Request completed', logData);
    }
  });
  
  next();
}

/**
 * Simple request logging (without middleware)
 */
function logRequest(method, url, status, duration) {
  const logLine = `[${new Date().toISOString()}] ${method} ${url} - ${status} (${duration}ms)`;
  console.log(logLine);
  logger.http(logLine);
}

// =============================================================================
// ERROR LOGGING
// =============================================================================

/**
 * Log an error with full stack trace
 * @param {Error} error - The error object
 * @param {Object} context - Additional context
 */
function logError(error, context = {}) {
  logger.error(error.message, {
    stack: error.stack,
    code: error.code,
    ...context
  });
}

// =============================================================================
// LOG STATISTICS
// =============================================================================

// Track error counts for monitoring
const errorStats = {
  counts: {},
  lastReset: Date.now()
};

/**
 * Track error statistics
 * @param {string} errorType - Type of error
 */
function trackError(errorType) {
  errorStats.counts[errorType] = (errorStats.counts[errorType] || 0) + 1;
}

/**
 * Get error statistics
 * @returns {Object} Error counts
 */
function getErrorStats() {
  return {
    ...errorStats,
    uptime: Date.now() - errorStats.lastReset
  };
}

/**
 * Reset error statistics
 */
function resetErrorStats() {
  errorStats.counts = {};
  errorStats.lastReset = Date.now();
}

// =============================================================================
// PERFORMANCE LOGGING
// =============================================================================

/**
 * Create a performance timer
 * @param {string} operation - Name of the operation being timed
 * @returns {Function} Function to call when operation completes
 */
function startTimer(operation) {
  const startTime = Date.now();
  return () => {
    const duration = Date.now() - startTime;
    logger.debug(`Performance: ${operation}`, { 
      operation, 
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    return duration;
  };
}

/**
 * Log a performance metric
 * @param {string} operation - Name of the operation
 * @param {number} duration - Duration in milliseconds
 * @param {Object} meta - Additional metadata
 */
function logPerformance(operation, duration, meta = {}) {
  logger.debug(`Performance: ${operation}`, {
    operation,
    duration: `${duration}ms`,
    ...meta,
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// BUSINESS INTELLIGENCE LOGGING
// =============================================================================

/**
 * Log a sales event for analytics
 * @param {string} event - The sales event (sale_completed, quote_created, cart_abandoned)
 * @param {Object} data - Sales data
 */
function logSale(event, data = {}) {
  const saleData = {
    ...data,
    timestamp: new Date().toISOString()
  };
  
  // Log to analytics for BI reports
  analyticsLogger.info(`SALE: ${event}`, saleData);
  
  // Also log to orders if it's a completed sale
  if (event === 'sale_completed') {
    orderLogger.info('ORDER_COMPLETED', saleData);
  }
}

/**
 * Log a margin/profit event
 * @param {string} event - The margin event
 * @param {Object} data - Margin data (category, margin %, amount)
 */
function logMargin(event, data = {}) {
  analyticsLogger.info(`MARGIN: ${event}`, {
    ...data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log profit analytics with period support (overall, monthly, yearly)
 * Yearly data is NOT too much - database handles it efficiently with proper indexing
 * 
 * @param {string} event - Profit event type
 * @param {Object} data - Profit data
 */
function logProfit(event, data = {}) {
  const now = new Date();
  
  const profitData = {
    event,
    
    // Period identification (for aggregation)
    period: data.period || 'transaction', // 'transaction', 'daily', 'monthly', 'yearly', 'overall'
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    year: data.year || now.getFullYear(),
    month: data.month || now.getMonth() + 1,
    day: data.day || now.getDate(),
    
    // Revenue metrics
    revenue: data.revenue,
    revenueGross: data.revenueGross,
    revenueNet: data.revenueNet, // After returns/refunds
    
    // Cost metrics  
    costOfGoods: data.costOfGoods, // Total cost from catalog
    operationalCosts: data.operationalCosts,
    shippingCosts: data.shippingCosts,
    paymentProcessingFees: data.paymentProcessingFees,
    
    // Profit metrics
    grossProfit: data.grossProfit, // Revenue - Cost of Goods
    netProfit: data.netProfit, // After all costs
    profitMarginPercent: data.profitMarginPercent,
    
    // Breakdown by category (optional)
    category: data.category,
    categoryProfit: data.categoryProfit,
    
    // Breakdown by product (optional)
    productId: data.productId,
    productProfit: data.productProfit,
    
    // Breakdown by region (optional)
    region: data.region,
    regionProfit: data.regionProfit,
    
    // Comparison metrics (for trends)
    previousPeriodProfit: data.previousPeriodProfit,
    profitChange: data.profitChange, // Percent change
    profitTrend: data.profitTrend, // 'up', 'down', 'stable'
    
    // Transaction count (for averages)
    transactionCount: data.transactionCount,
    averageOrderValue: data.averageOrderValue,
    averageProfitPerOrder: data.averageProfitPerOrder,
    
    timestamp: new Date().toISOString()
  };
  
  analyticsLogger.info(`PROFIT: ${event}`, profitData);
}

/**
 * Log overall profit summary (all-time)
 * @param {Object} data - Overall profit data
 */
function logProfitOverall(data = {}) {
  logProfit('overall_summary', {
    ...data,
    period: 'overall'
  });
}

/**
 * Log monthly profit summary
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {Object} data - Monthly profit data
 */
function logProfitMonthly(year, month, data = {}) {
  logProfit('monthly_summary', {
    ...data,
    period: 'monthly',
    year,
    month,
    periodStart: new Date(year, month - 1, 1).toISOString(),
    periodEnd: new Date(year, month, 0).toISOString()
  });
}

/**
 * Log yearly profit summary
 * Database handles yearly data efficiently - proper indexing makes queries fast
 * @param {number} year - Year
 * @param {Object} data - Yearly profit data
 */
function logProfitYearly(year, data = {}) {
  logProfit('yearly_summary', {
    ...data,
    period: 'yearly',
    year,
    periodStart: new Date(year, 0, 1).toISOString(),
    periodEnd: new Date(year, 11, 31).toISOString()
  });
}

/**
 * Log daily profit summary
 * @param {Date|string} date - The date
 * @param {Object} data - Daily profit data
 */
function logProfitDaily(date, data = {}) {
  const d = new Date(date);
  logProfit('daily_summary', {
    ...data,
    period: 'daily',
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    periodStart: new Date(d.setHours(0, 0, 0, 0)).toISOString(),
    periodEnd: new Date(d.setHours(23, 59, 59, 999)).toISOString()
  });
}

/**
 * Log weekly profit summary
 * @param {number} year - Year
 * @param {number} week - Week number (1-52)
 * @param {Object} data - Weekly profit data
 */
function logProfitWeekly(year, week, data = {}) {
  // Calculate week start/end dates
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dayOfWeek = simple.getDay();
  const weekStart = new Date(simple);
  weekStart.setDate(simple.getDate() - dayOfWeek + 1); // Monday
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6); // Sunday
  
  logProfit('weekly_summary', {
    ...data,
    period: 'weekly',
    year,
    week,
    periodStart: weekStart.toISOString(),
    periodEnd: weekEnd.toISOString()
  });
}

/**
 * Log quarterly profit summary
 * @param {number} year - Year
 * @param {number} quarter - Quarter (1-4)
 * @param {Object} data - Quarterly profit data
 */
function logProfitQuarterly(year, quarter, data = {}) {
  const startMonth = (quarter - 1) * 3;
  const endMonth = startMonth + 2;
  
  logProfit('quarterly_summary', {
    ...data,
    period: 'quarterly',
    year,
    quarter,
    periodStart: new Date(year, startMonth, 1).toISOString(),
    periodEnd: new Date(year, endMonth + 1, 0).toISOString()
  });
}

/**
 * Log profit by category
 * @param {string} category - Product category
 * @param {Object} data - Category profit data
 */
function logProfitByCategory(category, data = {}) {
  logProfit('category_profit', {
    ...data,
    category,
    period: data.period || 'monthly'
  });
}

/**
 * Log profit comparison between two periods
 * @param {string} comparisonType - Type of comparison (month_over_month, year_over_year, etc.)
 * @param {Object} data - Comparison data
 */
function logProfitComparison(comparisonType, data = {}) {
  const change = data.currentProfit && data.previousProfit 
    ? ((data.currentProfit - data.previousProfit) / data.previousProfit * 100).toFixed(2)
    : null;
    
  logProfit('comparison', {
    comparisonType,
    currentPeriod: data.currentPeriod,
    previousPeriod: data.previousPeriod,
    currentProfit: data.currentProfit,
    previousProfit: data.previousProfit,
    profitChange: change ? parseFloat(change) : null,
    profitTrend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    currentRevenue: data.currentRevenue,
    previousRevenue: data.previousRevenue,
    ...data
  });
}

/**
 * Log a single transaction profit
 * @param {Object} data - Transaction profit data
 */
function logProfitTransaction(data = {}) {
  logProfit('transaction', {
    ...data,
    period: 'transaction',
    orderId: data.orderId,
    productId: data.productId,
    costPrice: data.costPrice,
    sellingPrice: data.sellingPrice,
    profit: data.sellingPrice && data.costPrice ? data.sellingPrice - data.costPrice : data.profit,
    marginPercent: data.marginPercent,
    category: data.category
  });
}

// =============================================================================
// LEAD GENERATOR LOGGING (INTERNAL - NOT GOOGLE ANALYTICS)
// =============================================================================

/**
 * Log lead generator events (for CREATOR role commission tracking)
 * This tracks which sales agent brought which customer
 * @param {string} event - The lead event type
 * @param {Object} data - Lead data
 */
function logLead(event, data = {}) {
  const leadData = {
    event,
    // Lead Generator (CREATOR) Info
    creatorId: data.creatorId,
    creatorName: data.creatorName,
    
    // Visitor/Customer Info - WHO VISITED
    customerId: data.customerId,
    customerEmail: data.customerEmail ? '***' + data.customerEmail.slice(-10) : null,
    customerName: data.customerName,
    isNewVisitor: data.isNewVisitor,
    isReturningCustomer: data.isReturningCustomer,
    visitCount: data.visitCount, // How many times they've visited
    
    // Traffic Source - WHERE THEY CAME FROM
    source: data.source, // website, referral, direct, google, social, etc.
    referrer: data.referrer, // The referring URL
    campaign: data.campaign, // Marketing campaign
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    utmContent: data.utmContent,
    
    // Session Info - WHAT THEY DID
    sessionId: data.sessionId,
    landingPage: data.landingPage,
    pagesVisited: data.pagesVisited, // Array of pages
    pageCount: data.pageCount, // How many pages visited
    sessionDuration: data.sessionDuration, // How long on site (seconds)
    configuratorInteraction: data.configuratorInteraction, // Did they use configurator?
    productsViewed: data.productsViewed, // Which products they looked at
    
    // Conversion Info - WHAT THEY BOUGHT/SPENT
    converted: data.converted, // Did they make a purchase?
    orderId: data.orderId,
    orderValue: data.orderValue,
    totalSpent: data.totalSpent, // Lifetime total
    products: data.products, // What they bought
    configuratorOptions: data.configuratorOptions, // What config they selected
    
    // Contact Info (if they submitted inquiry)
    contactRequested: data.contactRequested,
    quoteRequested: data.quoteRequested,
    
    // Device/Location
    device: data.device, // mobile, desktop, tablet
    browser: data.browser,
    ipAddress: data.ipAddress ? data.ipAddress.slice(0, 7) + '***' : null, // Partial for privacy
    country: data.country,
    region: data.region,
    
    timestamp: new Date().toISOString(),
    ...data
  };
  
  auditLogger.info(`LEAD: ${event}`, leadData);
  analyticsLogger.info(`LEAD: ${event}`, leadData);
}

/**
 * Log visitor tracking for lead insights (who visited, what they did)
 * @param {string} event - Visitor event type
 * @param {Object} data - Visitor data
 */
function logVisitor(event, data = {}) {
  analyticsLogger.info(`VISITOR: ${event}`, {
    event,
    visitorId: data.visitorId,
    sessionId: data.sessionId,
    isNewVisitor: data.isNewVisitor,
    isReturningCustomer: data.isReturningCustomer,
    
    // What they viewed
    currentPage: data.currentPage,
    previousPage: data.previousPage,
    pagesVisited: data.pagesVisited,
    pageCount: data.pageCount,
    
    // Time spent
    timeOnPage: data.timeOnPage, // seconds
    totalSessionTime: data.totalSessionTime, // seconds
    
    // Interactions
    configuratorUsed: data.configuratorUsed,
    productsViewed: data.productsViewed,
    cartAdded: data.cartAdded,
    inquirySent: data.inquirySent,
    
    // Source
    referrer: data.referrer,
    source: data.source,
    
    // Device
    device: data.device,
    browser: data.browser,
    screenResolution: data.screenResolution,
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log commission events for lead generators
 * @param {string} event - Commission event type
 * @param {Object} data - Commission data
 */
function logCommission(event, data = {}) {
  auditLogger.info(`COMMISSION: ${event}`, {
    event,
    creatorId: data.creatorId,
    creatorName: data.creatorName,
    orderId: data.orderId,
    orderAmount: data.orderAmount,
    commissionRate: data.commissionRate,
    commissionAmount: data.commissionAmount,
    status: data.status, // pending, approved, paid
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// CUSTOMER BEHAVIOR ANALYTICS
// =============================================================================

/**
 * Log customer behavior events (professional analytics)
 * @param {string} event - Behavior event type
 * @param {Object} data - Behavior data
 */
function logCustomerBehavior(event, data = {}) {
  analyticsLogger.info(`BEHAVIOR: ${event}`, {
    event,
    customerId: data.customerId,
    sessionId: data.sessionId,
    productId: data.productId,
    productName: data.productName,
    category: data.category,
    action: data.action, // view, add_to_cart, remove_from_cart, wishlist, compare
    value: data.value,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log conversion funnel events
 * @param {string} stage - Funnel stage
 * @param {Object} data - Funnel data
 */
function logConversion(stage, data = {}) {
  analyticsLogger.info(`FUNNEL: ${stage}`, {
    stage,
    stages: {
      1: 'page_view',
      2: 'product_view',
      3: 'add_to_cart',
      4: 'begin_checkout',
      5: 'payment_info',
      6: 'purchase_complete'
    },
    customerId: data.customerId,
    sessionId: data.sessionId,
    orderId: data.orderId,
    cartValue: data.cartValue,
    itemCount: data.itemCount,
    timestamp: new Date().toISOString()
  });
}

/**
 * Log cart abandonment events
 * @param {Object} data - Abandonment data
 */
function logCartAbandonment(data = {}) {
  analyticsLogger.info('CART_ABANDONED', {
    customerId: data.customerId,
    sessionId: data.sessionId,
    cartId: data.cartId,
    cartValue: data.cartValue,
    itemCount: data.itemCount,
    items: data.items, // Array of product IDs
    lastActiveAt: data.lastActiveAt,
    abandonedAt: new Date().toISOString(),
    recoveryEmailSent: false
  });
}

// =============================================================================
// SEARCH & DISCOVERY ANALYTICS
// =============================================================================

/**
 * Log search events (what customers search for)
 * @param {Object} data - Search data
 */
function logSearch(data = {}) {
  analyticsLogger.info('SEARCH', {
    query: data.query,
    resultsCount: data.resultsCount,
    category: data.category,
    filters: data.filters,
    sortBy: data.sortBy,
    page: data.page,
    customerId: data.customerId,
    sessionId: data.sessionId,
    clickedResults: data.clickedResults, // Which results were clicked
    timestamp: new Date().toISOString()
  });
}

// NOTE: logZeroResults removed - not needed for configurator-based pricing model
// Catalog provides base prices, configurator calculates custom pricing

// =============================================================================
// GEOGRAPHIC & REGIONAL ANALYTICS
// =============================================================================

/**
 * Log geographic data for regional analytics
 * @param {string} event - Geographic event
 * @param {Object} data - Geographic data
 */
function logGeographic(event, data = {}) {
  analyticsLogger.info(`GEO: ${event}`, {
    event,
    country: data.country,
    region: data.region,
    city: data.city,
    postalCode: data.postalCode,
    orderId: data.orderId,
    customerId: data.customerId,
    orderValue: data.orderValue,
    shippingZone: data.shippingZone,
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// TIME-BASED ANALYTICS
// =============================================================================

/**
 * Log time-based analytics (seasonality, peak hours)
 * @param {string} event - Time event
 * @param {Object} data - Time data
 */
function logTimeAnalytics(event, data = {}) {
  const now = new Date();
  analyticsLogger.info(`TIME: ${event}`, {
    event,
    hour: now.getHours(),
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
    month: now.toLocaleDateString('en-US', { month: 'long' }),
    quarter: Math.ceil((now.getMonth() + 1) / 3),
    year: now.getFullYear(),
    isWeekend: [0, 6].includes(now.getDay()),
    ...data,
    timestamp: now.toISOString()
  });
}

// =============================================================================
// EMPLOYEE PERFORMANCE ANALYTICS
// =============================================================================

/**
 * Log employee/team performance metrics
 * @param {string} event - Performance event
 * @param {Object} data - Performance data
 */
function logEmployeePerformance(event, data = {}) {
  auditLogger.info(`EMPLOYEE: ${event}`, {
    event,
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    role: data.role,
    metric: data.metric, // orders_processed, quotes_created, leads_converted
    value: data.value,
    period: data.period, // daily, weekly, monthly
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// CUSTOMER LIFETIME VALUE (CLV) ANALYTICS
// =============================================================================

/**
 * Log customer lifetime value events
 * @param {string} event - CLV event
 * @param {Object} data - CLV data
 */
function logCLV(event, data = {}) {
  analyticsLogger.info(`CLV: ${event}`, {
    event,
    customerId: data.customerId,
    totalOrders: data.totalOrders,
    totalRevenue: data.totalRevenue,
    totalProfit: data.totalProfit,
    averageOrderValue: data.averageOrderValue,
    firstPurchaseDate: data.firstPurchaseDate,
    lastPurchaseDate: data.lastPurchaseDate,
    daysSinceLastPurchase: data.daysSinceLastPurchase,
    predictedCLV: data.predictedCLV,
    customerSegment: data.customerSegment, // high_value, medium, low, at_risk
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// ROI & MARKETING ANALYTICS
// =============================================================================

/**
 * Log ROI and marketing campaign analytics
 * @param {string} event - Marketing event
 * @param {Object} data - Marketing data
 */
function logMarketing(event, data = {}) {
  analyticsLogger.info(`MARKETING: ${event}`, {
    event,
    campaignId: data.campaignId,
    campaignName: data.campaignName,
    channel: data.channel, // email, social, ppc, organic
    spend: data.spend,
    impressions: data.impressions,
    clicks: data.clicks,
    conversions: data.conversions,
    revenue: data.revenue,
    roi: data.roi, // (revenue - spend) / spend * 100
    cpc: data.cpc, // cost per click
    cpa: data.cpa, // cost per acquisition
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// SUPPLIER ANALYTICS
// =============================================================================

/**
 * Log supplier performance analytics
 * @param {string} event - Supplier event
 * @param {Object} data - Supplier data
 */
function logSupplier(event, data = {}) {
  analyticsLogger.info(`SUPPLIER: ${event}`, {
    event,
    supplierId: data.supplierId,
    supplierName: data.supplierName,
    metric: data.metric, // delivery_time, quality_score, price_changes
    value: data.value,
    ordersCount: data.ordersCount,
    onTimeDeliveryRate: data.onTimeDeliveryRate,
    defectRate: data.defectRate,
    avgLeadTime: data.avgLeadTime,
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// PRODUCT PERFORMANCE ANALYTICS (BESTSELLERS, HOT ITEMS, TRENDING)
// =============================================================================

/**
 * Log product sale event - tracks which products sell the most
 * Call this EVERY time a product is sold
 * @param {Object} data - Product sale data
 */
function logProductSale(data = {}) {
  analyticsLogger.info('PRODUCT_SALE', {
    productId: data.productId,
    productSku: data.productSku,
    productName: data.productName,
    category: data.category,
    subcategory: data.subcategory,
    manufacturer: data.manufacturer,
    
    // Sale details
    quantity: data.quantity || 1,
    unitPrice: data.unitPrice,
    totalPrice: data.totalPrice,
    margin: data.margin,
    marginPercent: data.marginPercent,
    
    // Order context
    orderId: data.orderId,
    customerId: data.customerId,
    isConfiguratorProduct: data.isConfiguratorProduct,
    
    // Configuration details (if from configurator)
    configuration: data.configuration ? {
      baseProduct: data.configuration.baseProduct,
      customizations: data.configuration.customizations,
      calculatedUpcharge: data.configuration.calculatedUpcharge
    } : null,
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log product as bestseller/top performer
 * Call periodically (daily/weekly) with aggregated data
 * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly', 'alltime'
 * @param {Object} data - Bestseller data
 */
function logBestseller(period, data = {}) {
  analyticsLogger.info(`BESTSELLER_${period.toUpperCase()}`, {
    period,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    
    // Product info
    rank: data.rank, // 1 = top seller
    productId: data.productId,
    productSku: data.productSku,
    productName: data.productName,
    category: data.category,
    
    // Performance metrics
    unitsSold: data.unitsSold,
    totalRevenue: data.totalRevenue,
    totalProfit: data.totalProfit,
    avgMargin: data.avgMargin,
    
    // Comparison
    previousPeriodUnits: data.previousPeriodUnits,
    unitChangePercent: data.unitChangePercent,
    previousPeriodRevenue: data.previousPeriodRevenue,
    revenueChangePercent: data.revenueChangePercent,
    
    // Ranking change
    previousRank: data.previousRank,
    rankChange: data.rankChange, // positive = moved up, negative = moved down
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log trending/hot products - products gaining popularity quickly
 * @param {Object} data - Trending product data
 */
function logTrendingProduct(data = {}) {
  analyticsLogger.info('TRENDING_PRODUCT', {
    productId: data.productId,
    productSku: data.productSku,
    productName: data.productName,
    category: data.category,
    
    // Trending metrics
    trendScore: data.trendScore, // calculated score
    currentPeriodSales: data.currentPeriodSales,
    previousPeriodSales: data.previousPeriodSales,
    salesGrowthPercent: data.salesGrowthPercent,
    
    // Views to sales
    currentViews: data.currentViews,
    previousViews: data.previousViews,
    viewGrowthPercent: data.viewGrowthPercent,
    
    // Conversion
    conversionRate: data.conversionRate,
    
    // When did it start trending
    trendStartDate: data.trendStartDate,
    daysTrending: data.daysTrending,
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log low performing products - products that need attention
 * @param {Object} data - Low performer data
 */
function logLowPerformer(data = {}) {
  analyticsLogger.warn('LOW_PERFORMER', {
    productId: data.productId,
    productSku: data.productSku,
    productName: data.productName,
    category: data.category,
    
    // Performance issues
    reason: data.reason, // 'no_sales', 'declining', 'low_margin', 'high_returns', 'low_views'
    unitsSold: data.unitsSold,
    totalRevenue: data.totalRevenue,
    margin: data.margin,
    
    // Context
    daysSinceLastSale: data.daysSinceLastSale,
    lastSaleDate: data.lastSaleDate,
    views: data.views,
    addToCartCount: data.addToCartCount,
    abandonmentRate: data.abandonmentRate,
    
    // Recommendation
    recommendation: data.recommendation, // 'price_review', 'discontinue', 'promote', 'restock'
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log product ranking summary - full ranking list
 * Call periodically to log entire rankings
 * @param {string} period - 'daily', 'weekly', 'monthly'
 * @param {string} category - Category name or 'all' for overall
 * @param {Array} rankings - Array of product rankings
 */
function logProductRankings(period, category, rankings = []) {
  analyticsLogger.info(`PRODUCT_RANKINGS_${period.toUpperCase()}`, {
    period,
    category,
    rankingDate: new Date().toISOString(),
    totalProducts: rankings.length,
    
    // Top 10 summary
    top10: rankings.slice(0, 10).map((item, index) => ({
      rank: index + 1,
      productId: item.productId,
      productSku: item.productSku,
      productName: item.productName,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
      profit: item.profit
    })),
    
    // Bottom 5 (low performers)
    bottom5: rankings.slice(-5).map((item, index) => ({
      rank: rankings.length - 4 + index,
      productId: item.productId,
      productSku: item.productSku,
      productName: item.productName,
      unitsSold: item.unitsSold,
      revenue: item.revenue
    })),
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log product view - track what products customers are looking at
 * @param {Object} data - View data
 */
function logProductView(data = {}) {
  analyticsLogger.info('PRODUCT_VIEW', {
    productId: data.productId,
    productSku: data.productSku,
    productName: data.productName,
    category: data.category,
    
    // Viewer info
    customerId: data.customerId, // null if not logged in
    visitorId: data.visitorId,
    sessionId: data.sessionId,
    
    // Context
    source: data.source, // 'search', 'category', 'recommendation', 'direct', 'ad'
    referrer: data.referrer,
    viewDuration: data.viewDuration, // seconds
    
    // Configurator engagement
    openedConfigurator: data.openedConfigurator,
    configuratorTimeSpent: data.configuratorTimeSpent,
    
    // Actions taken
    addedToCart: data.addedToCart,
    addedToWishlist: data.addedToWishlist,
    requestedQuote: data.requestedQuote,
    
    timestamp: new Date().toISOString()
  });
}

/**
 * Log category performance - which categories sell best
 * @param {string} period - 'daily', 'weekly', 'monthly', 'yearly'
 * @param {Object} data - Category performance data
 */
function logCategoryPerformance(period, data = {}) {
  analyticsLogger.info(`CATEGORY_PERFORMANCE_${period.toUpperCase()}`, {
    period,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    
    category: data.category,
    subcategories: data.subcategories,
    
    // Metrics
    productCount: data.productCount,
    unitsSold: data.unitsSold,
    totalRevenue: data.totalRevenue,
    totalProfit: data.totalProfit,
    avgMargin: data.avgMargin,
    
    // Top products in category
    topProduct: data.topProduct,
    topProductUnits: data.topProductUnits,
    
    // Comparison
    previousPeriodRevenue: data.previousPeriodRevenue,
    revenueGrowthPercent: data.revenueGrowthPercent,
    
    // Category rank
    overallRank: data.overallRank,
    previousRank: data.previousRank,
    
    timestamp: new Date().toISOString()
  });
}

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Main logger
  logger,
  
  // Convenience methods
  error: (msg, meta) => logger.error(msg, meta),
  warn: (msg, meta) => logger.warn(msg, meta),
  info: (msg, meta) => logger.info(msg, meta),
  http: (msg, meta) => logger.http(msg, meta),
  debug: (msg, meta) => logger.debug(msg, meta),
  
  // CRM-specific loggers
  logAudit,
  logOrder,
  logPayment,
  logCatalog,
  logSecurity,
  logAnalytics,
  logInventory,
  logPromotion,
  
  // Business Intelligence & Profit Analytics
  logSale,
  logMargin,
  logProfit,
  logProfitOverall,
  logProfitMonthly,
  logProfitYearly,
  logProfitDaily,
  logProfitWeekly,
  logProfitQuarterly,
  logProfitByCategory,
  logProfitComparison,
  logProfitTransaction,
  
  // Lead Generator & Commission Tracking (INTERNAL - NOT GOOGLE ANALYTICS)
  // Tracks: WHO visited, WHERE they came from, WHAT they viewed, WHAT they bought/spent
  logLead,
  logVisitor,
  logCommission,
  
  // Customer Behavior Analytics
  logCustomerBehavior,
  logConversion,
  logCartAbandonment,
  
  // Search Analytics (logZeroResults removed - not needed for configurator model)
  logSearch,
  
  // Geographic & Regional Analytics
  logGeographic,
  
  // Time-based Analytics
  logTimeAnalytics,
  
  // Employee Performance Analytics
  logEmployeePerformance,
  
  // Customer Lifetime Value (CLV)
  logCLV,
  
  // Marketing & ROI Analytics
  logMarketing,
  
  // Supplier Analytics
  logSupplier,
  
  // Product Performance Analytics (BESTSELLERS, HOT ITEMS, TRENDING)
  // Tracks: What sells most, trending products, low performers, rankings
  logProductSale,
  logBestseller,
  logTrendingProduct,
  logLowPerformer,
  logProductRankings,
  logProductView,
  logCategoryPerformance,
  
  // Request logging
  requestLogger,
  logRequest,
  
  // Error logging
  logError,
  trackError,
  getErrorStats,
  resetErrorStats,
  
  // Performance logging
  startTimer,
  logPerformance,
  
  // Domain loggers (for direct access)
  auditLogger,
  orderLogger,
  paymentLogger,
  catalogLogger,
  securityLogger,
  analyticsLogger,
  inventoryLogger,
  promotionLogger
};
