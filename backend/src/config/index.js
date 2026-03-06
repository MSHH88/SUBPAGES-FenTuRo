/**
 * CURIA Backend - Configuration Module
 * 
 * This file centralizes all configuration from environment variables.
 * It validates required settings and provides defaults for optional ones.
 * 
 * Step 1.4: Environment Configuration
 */

require('dotenv').config();

// ============================================
// CONFIGURATION OBJECT
// ============================================

const config = {
  // -----------------------------------------
  // Server Configuration
  // -----------------------------------------
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV !== 'production',
  },

  // -----------------------------------------
  // Database Configuration (PostgreSQL)
  // -----------------------------------------
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'curia',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    
    // Connection pool settings
    pool: {
      min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
    
    // SSL for production
    ssl: process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
  },

  // -----------------------------------------
  // JWT Authentication
  // -----------------------------------------
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production-minimum-32-chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // -----------------------------------------
  // Security Settings
  // -----------------------------------------
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT_MS, 10) || 30 * 60 * 1000, // 30 minutes
  },

  // -----------------------------------------
  // CORS (Cross-Origin Resource Sharing)
  // -----------------------------------------
  cors: {
    allowedOrigins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },

  // -----------------------------------------
  // Email Configuration (for later)
  // -----------------------------------------
  email: {
    provider: process.env.EMAIL_PROVIDER || 'console', // 'sendgrid', 'ses', 'console'
    from: process.env.EMAIL_FROM || 'noreply@curia.app',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  },

  // -----------------------------------------
  // Logging
  // -----------------------------------------
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  // -----------------------------------------
  // API Settings
  // -----------------------------------------
  api: {
    version: 'v1',
    prefix: '/api/v1',
    pagination: {
      defaultLimit: 20,
      maxLimit: 100,
    },
  },

  // -----------------------------------------
  // Business Logic
  // -----------------------------------------
  business: {
    defaultMargin: parseFloat(process.env.DEFAULT_MARGIN) || 0.50, // 50%
    defaultVatRate: parseFloat(process.env.DEFAULT_VAT_RATE) || 0.19, // 19% German VAT
    currency: process.env.DEFAULT_CURRENCY || 'EUR',
    locale: process.env.DEFAULT_LOCALE || 'de-DE',
  },

  // -----------------------------------------
  // CRM Role System (6 Tiers as specified)
  // -----------------------------------------
  roles: {
    CREATOR: 'creator',           // Tier 1: Platform owner (YOU) - full control
    CREATOR_STAFF: 'creator_staff', // Tier 2: Your team - cannot be removed by CEO
    CEO: 'ceo',                   // Tier 3: Business owner - sees all their CRM data
    OPERATIONS_MANAGER: 'operations_manager', // Tier 4: Catalog, inventory, orders
    WAREHOUSE_STAFF: 'warehouse_staff', // Tier 5: Orders, inventory only
    SALES_STAFF: 'sales_staff',   // Tier 6: Quotes, discounts, customers
    MARKETING: 'marketing',       // Advertisement people - discounts, campaigns
    CUSTOMER: 'customer',         // Regular customer (website user)
  },

  // -----------------------------------------
  // Lead Generator (CREATOR-ONLY Feature)
  // -----------------------------------------
  leadGenerator: {
    enabled: process.env.LEAD_GENERATOR_ENABLED === 'true' || true,
    trackEmails: true,
    trackVisits: true,
    trackPurchases: true,
    // This section only visible to CREATOR role
  },

  // -----------------------------------------
  // Order Workflow States
  // -----------------------------------------
  orderStatuses: {
    PENDING: 'pending',           // Just created
    CONFIRMED: 'confirmed',       // Admin confirmed
    PROCESSING: 'processing',     // Being prepared
    SENT_TO_WAREHOUSE: 'sent_to_warehouse', // Sent to distribution
    PACKED: 'packed',             // Packed at warehouse
    SHIPPED: 'shipped',           // On the way
    DELIVERED: 'delivered',       // Received by customer
    CANCELLED: 'cancelled',       // Cancelled
    REFUNDED: 'refunded',         // Refunded
  },

  // -----------------------------------------
  // Quote System
  // -----------------------------------------
  quotes: {
    types: ['private', 'business'], // B2C and B2B
    contactMethods: ['email', 'whatsapp', 'phone'],
    defaultExpirationDays: 30,
  },

  // -----------------------------------------
  // Configuration Sharing
  // -----------------------------------------
  configSharing: {
    enabled: true,
    urlPrefix: process.env.CONFIG_SHARE_URL_PREFIX || '/configure?config=',
  },

  // -----------------------------------------
  // VAT Validation (VIES API for B2B)
  // -----------------------------------------
  vatValidation: {
    enabled: process.env.VIES_VALIDATION_ENABLED === 'true' || true,
    apiUrl: 'https://ec.europa.eu/taxation_customs/vies/rest-api/ms/DE/vat/',
    cacheValidationHours: 24,
  },

  // -----------------------------------------
  // Analytics (Google Analytics 4)
  // -----------------------------------------
  analytics: {
    ga4Enabled: process.env.GA4_ENABLED === 'true' || false,
    ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || '',
    ga4ApiSecret: process.env.GA4_API_SECRET || '',
    // Internal analytics always on
    internalEnabled: true,
  },

  // -----------------------------------------
  // Product Categories (Configurators)
  // -----------------------------------------
  categories: {
    WINDOWS: 'fenster',
    DOORS: 'tueren',
    ROLLER_SHUTTERS: 'rolladen',
    GARAGE_DOORS: 'garagentore',
    ENTRANCE_DOORS: 'haustuer',
  },

  // -----------------------------------------
  // Wishlist & Cart
  // -----------------------------------------
  wishlist: {
    enabled: true,
    maxItems: 50,
    saveForDays: 90, // How long to keep saved configs
  },
  cart: {
    maxItems: 20,
    sessionStorageKey: 'curia_cart',
    serverSyncForLoggedIn: true,
  },
};

// ============================================
// VALIDATION
// ============================================

/**
 * Validates required configuration for production
 */
function validateConfig() {
  const errors = [];

  // In production, these MUST be set
  if (config.server.isProduction) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production');
    }
    
    if (!process.env.DB_PASSWORD) {
      errors.push('DB_PASSWORD is required in production');
    }

    if (process.env.JWT_SECRET === 'dev-secret-change-in-production-minimum-32-chars') {
      errors.push('JWT_SECRET must be changed from default in production');
    }
  }

  if (errors.length > 0) {
    console.error('❌ Configuration Errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }
}

// Validate on startup
validateConfig();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get database connection string
 */
config.getDatabaseUrl = function() {
  const { user, password, host, port, name } = this.database;
  return `postgresql://${user}:${password}@${host}:${port}/${name}`;
};

/**
 * Print configuration summary (hides sensitive data)
 */
config.printSummary = function() {
  console.log('\n📋 Configuration Summary:');
  console.log('==================================================');
  console.log(`   Environment: ${this.server.nodeEnv}`);
  console.log(`   Port: ${this.server.port}`);
  console.log(`   Database: ${this.database.host}:${this.database.port}/${this.database.name}`);
  console.log(`   JWT Expiry: ${this.jwt.expiresIn}`);
  console.log(`   Rate Limit: ${this.security.rateLimitMaxRequests} requests / ${this.security.rateLimitWindowMs / 1000 / 60} min`);
  console.log(`   Default Margin: ${(this.business.defaultMargin * 100).toFixed(0)}%`);
  console.log(`   VAT Rate: ${(this.business.defaultVatRate * 100).toFixed(0)}%`);
  console.log('==================================================\n');
};

// ============================================
// EXPORT
// ============================================

module.exports = config;
