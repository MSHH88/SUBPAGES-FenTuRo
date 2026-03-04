/**
 * CURIA Backend - API Routes Index
 * 
 * ROUTE STRUCTURE:
 * ================
 * 
 * /api/v1/
 * ├── auth/           → Authentication (login, register, password reset)
 * ├── users/          → User management
 * ├── customers/      → Customer management (CRM)
 * ├── products/       → Product catalog
 * ├── catalog/        → Catalog import/export
 * ├── orders/         → Order management
 * ├── quotes/         → Quote requests
 * ├── configurator/   → Product configurator
 * ├── payments/       → Payment processing
 * ├── leads/          → Lead generator (SUPER_ADMIN only for all)
 * ├── commissions/    → Commission tracking
 * ├── analytics/      → Analytics & reporting
 * ├── inventory/      → Inventory management
 * ├── promotions/     → Promotions & discounts
 * ├── notifications/  → Notifications
 * ├── settings/       → System settings
 * ├── uploads/        → File uploads
 * └── health/         → Health check
 * 
 * @module routes
 */

const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate, authenticateOptional } = require('../middleware/auth');
const { generalLimiter, apiLimiter, authLimiter } = require('../middleware/security');
const { requestLogger } = require('../utils/logger');

// ============================================
// ROUTE IMPORTS (will be created in Phase 2)
// ============================================

// For now, create placeholder route handlers
// These will be replaced with actual route files

// ============================================
// API VERSION PREFIX
// ============================================
const API_VERSION = '/api/v1';

// ============================================
// HEALTH CHECK (No auth required)
// ============================================
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

router.get('/health/detailed', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected', // Will be dynamic
    services: {
      auth: 'operational',
      payments: 'operational',
      notifications: 'operational'
    }
  });
});

// ============================================
// AUTH ROUTES (/api/v1/auth)
// ============================================
const authRoutes = express.Router();

// Public routes (no authentication required)
authRoutes.post('/register', authLimiter, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Registration endpoint - Coming in Phase 2' });
});

authRoutes.post('/login', authLimiter, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Login endpoint - Coming in Phase 2' });
});

authRoutes.post('/logout', authenticate, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Logout endpoint - Coming in Phase 2' });
});

authRoutes.post('/refresh-token', (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Refresh token endpoint - Coming in Phase 2' });
});

authRoutes.post('/forgot-password', authLimiter, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Forgot password endpoint - Coming in Phase 2' });
});

authRoutes.post('/reset-password', authLimiter, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Reset password endpoint - Coming in Phase 2' });
});

authRoutes.post('/verify-email', (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Verify email endpoint - Coming in Phase 2' });
});

authRoutes.get('/me', authenticate, (req, res) => {
  // TODO: Implement in Phase 2
  res.status(501).json({ message: 'Get current user endpoint - Coming in Phase 2' });
});

// ============================================
// USER ROUTES (/api/v1/users)
// ============================================
const userRoutes = express.Router();

userRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all users - Coming in Phase 2' });
});

userRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get user by ID - Coming in Phase 2' });
});

userRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update user - Coming in Phase 2' });
});

userRoutes.delete('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete user - Coming in Phase 2' });
});

// ============================================
// CUSTOMER ROUTES (/api/v1/customers) - CRM
// ============================================
const customerRoutes = express.Router();

customerRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all customers - Coming in Phase 2' });
});

customerRoutes.post('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Create customer - Coming in Phase 2' });
});

customerRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get customer by ID - Coming in Phase 2' });
});

customerRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update customer - Coming in Phase 2' });
});

customerRoutes.delete('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete customer - Coming in Phase 2' });
});

customerRoutes.get('/:id/orders', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get customer orders - Coming in Phase 2' });
});

customerRoutes.get('/:id/quotes', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get customer quotes - Coming in Phase 2' });
});

// ============================================
// PRODUCT ROUTES (/api/v1/products)
// ============================================
const productRoutes = express.Router();

productRoutes.get('/', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Get all products - Coming in Phase 2' });
});

productRoutes.get('/categories', (req, res) => {
  res.status(501).json({ message: 'Get product categories - Coming in Phase 2' });
});

productRoutes.get('/search', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Search products - Coming in Phase 2' });
});

productRoutes.get('/:id', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Get product by ID - Coming in Phase 2' });
});

productRoutes.post('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Create product - Coming in Phase 2' });
});

productRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update product - Coming in Phase 2' });
});

productRoutes.delete('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete product - Coming in Phase 2' });
});

// ============================================
// CATALOG ROUTES (/api/v1/catalog)
// ============================================
const catalogRoutes = express.Router();

catalogRoutes.post('/import', authenticate, (req, res) => {
  res.status(501).json({ message: 'Import catalog - Coming in Phase 2' });
});

catalogRoutes.get('/export', authenticate, (req, res) => {
  res.status(501).json({ message: 'Export catalog - Coming in Phase 2' });
});

catalogRoutes.get('/versions', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get catalog versions - Coming in Phase 2' });
});

catalogRoutes.post('/auto-import/configure', authenticate, (req, res) => {
  res.status(501).json({ message: 'Configure auto-import - Coming in Phase 2' });
});

// ============================================
// ORDER ROUTES (/api/v1/orders)
// ============================================
const orderRoutes = express.Router();

orderRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all orders - Coming in Phase 2' });
});

orderRoutes.post('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Create order - Coming in Phase 2' });
});

orderRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get order by ID - Coming in Phase 2' });
});

orderRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update order - Coming in Phase 2' });
});

orderRoutes.put('/:id/status', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update order status - Coming in Phase 2' });
});

orderRoutes.post('/:id/cancel', authenticate, (req, res) => {
  res.status(501).json({ message: 'Cancel order - Coming in Phase 2' });
});

// ============================================
// QUOTE ROUTES (/api/v1/quotes)
// ============================================
const quoteRoutes = express.Router();

quoteRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all quotes - Coming in Phase 2' });
});

quoteRoutes.post('/', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Request quote - Coming in Phase 2' });
});

quoteRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get quote by ID - Coming in Phase 2' });
});

quoteRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update quote - Coming in Phase 2' });
});

quoteRoutes.post('/:id/convert', authenticate, (req, res) => {
  res.status(501).json({ message: 'Convert quote to order - Coming in Phase 2' });
});

// ============================================
// CONFIGURATOR ROUTES (/api/v1/configurator)
// ============================================
// EXTENSIVE KONFIGURATOR for Fenster, Türen, Rollläden
// Supports complex configurations with real-time pricing
// ============================================
const configuratorRoutes = express.Router();

// ----- PRODUCT TYPE CONFIGURATION -----
// Get available product types (Fenster, Türen, Rollläden)
configuratorRoutes.get('/types', (req, res) => {
  res.status(501).json({ message: 'Get product types - Coming in Phase 2' });
});

// Get all options for a specific product type
configuratorRoutes.get('/types/:type/options', (req, res) => {
  // :type = fenster | tueren | rolllaeden
  res.status(501).json({ message: 'Get options for product type - Coming in Phase 2' });
});

// ----- FENSTER (WINDOWS) CONFIGURATOR -----
configuratorRoutes.get('/fenster/options', (req, res) => {
  res.status(501).json({ message: 'Get window configuration options - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/profiles', (req, res) => {
  res.status(501).json({ message: 'Get window profile systems (Kunststoff, Holz, Alu) - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/glass-types', (req, res) => {
  res.status(501).json({ message: 'Get glass types (2-fach, 3-fach, solar, etc.) - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/opening-types', (req, res) => {
  res.status(501).json({ message: 'Get opening types (Dreh-Kipp, Festverglast, etc.) - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/colors', (req, res) => {
  res.status(501).json({ message: 'Get window colors/finishes (RAL, foils) - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/handles', (req, res) => {
  res.status(501).json({ message: 'Get handle options - Coming in Phase 2' });
});

configuratorRoutes.get('/fenster/extras', (req, res) => {
  res.status(501).json({ message: 'Get window extras (Sprossen, Rollladen, etc.) - Coming in Phase 2' });
});

// ----- TÜREN (DOORS) CONFIGURATOR -----
configuratorRoutes.get('/tueren/options', (req, res) => {
  res.status(501).json({ message: 'Get door configuration options - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/types', (req, res) => {
  res.status(501).json({ message: 'Get door types (Haustür, Balkontür, Innentür) - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/materials', (req, res) => {
  res.status(501).json({ message: 'Get door materials (Kunststoff, Holz, Alu, Holz-Alu) - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/glass-options', (req, res) => {
  res.status(501).json({ message: 'Get door glass options (panels, sidelights) - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/security', (req, res) => {
  res.status(501).json({ message: 'Get security options (locks, hinges, RC classes) - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/colors', (req, res) => {
  res.status(501).json({ message: 'Get door colors/finishes - Coming in Phase 2' });
});

configuratorRoutes.get('/tueren/handles', (req, res) => {
  res.status(501).json({ message: 'Get door handle options - Coming in Phase 2' });
});

// ----- ROLLLÄDEN (SHUTTERS) CONFIGURATOR -----
configuratorRoutes.get('/rolllaeden/options', (req, res) => {
  res.status(501).json({ message: 'Get roller shutter options - Coming in Phase 2' });
});

configuratorRoutes.get('/rolllaeden/types', (req, res) => {
  res.status(501).json({ message: 'Get shutter types (Vorbau, Aufsatz, Mini) - Coming in Phase 2' });
});

configuratorRoutes.get('/rolllaeden/materials', (req, res) => {
  res.status(501).json({ message: 'Get shutter materials (Kunststoff, Alu) - Coming in Phase 2' });
});

configuratorRoutes.get('/rolllaeden/motors', (req, res) => {
  res.status(501).json({ message: 'Get motor options (Gurt, Motor, Smart) - Coming in Phase 2' });
});

configuratorRoutes.get('/rolllaeden/colors', (req, res) => {
  res.status(501).json({ message: 'Get shutter colors - Coming in Phase 2' });
});

// ----- SIZE & DIMENSIONS -----
configuratorRoutes.post('/dimensions/validate', (req, res) => {
  // Validate width/height are within manufacturer limits
  res.status(501).json({ message: 'Validate dimensions - Coming in Phase 2' });
});

configuratorRoutes.get('/dimensions/limits/:productType', (req, res) => {
  // Get min/max dimensions for product type
  res.status(501).json({ message: 'Get dimension limits - Coming in Phase 2' });
});

// ----- PRICE CALCULATION -----
configuratorRoutes.post('/calculate', (req, res) => {
  // Calculate price based on ALL selected options
  // Uses base price from catalog + margin + option adjustments
  res.status(501).json({ message: 'Calculate configured price - Coming in Phase 2' });
});

configuratorRoutes.post('/calculate/breakdown', (req, res) => {
  // Get detailed price breakdown (base + each option's cost)
  res.status(501).json({ message: 'Get price breakdown - Coming in Phase 2' });
});

configuratorRoutes.post('/calculate/live', (req, res) => {
  // Real-time price update (WebSocket-ready endpoint)
  res.status(501).json({ message: 'Live price calculation - Coming in Phase 2' });
});

// ----- CONFIGURATION RULES -----
configuratorRoutes.get('/rules/:productType', (req, res) => {
  // Get configuration rules (what options are compatible)
  res.status(501).json({ message: 'Get configuration rules - Coming in Phase 2' });
});

configuratorRoutes.post('/validate', (req, res) => {
  // Validate entire configuration is valid
  res.status(501).json({ message: 'Validate configuration - Coming in Phase 2' });
});

configuratorRoutes.post('/conflicts/check', (req, res) => {
  // Check for option conflicts
  res.status(501).json({ message: 'Check option conflicts - Coming in Phase 2' });
});

// ----- SAVE & LOAD CONFIGURATIONS -----
configuratorRoutes.post('/save', authenticate, (req, res) => {
  res.status(501).json({ message: 'Save configuration - Coming in Phase 2' });
});

configuratorRoutes.get('/saved', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all saved configurations - Coming in Phase 2' });
});

configuratorRoutes.get('/saved/:configId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get specific saved configuration - Coming in Phase 2' });
});

configuratorRoutes.put('/saved/:configId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update saved configuration - Coming in Phase 2' });
});

configuratorRoutes.delete('/saved/:configId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete saved configuration - Coming in Phase 2' });
});

configuratorRoutes.post('/saved/:configId/duplicate', authenticate, (req, res) => {
  res.status(501).json({ message: 'Duplicate configuration - Coming in Phase 2' });
});

// ----- CONFIGURATION SHARING -----
configuratorRoutes.post('/share', authenticate, (req, res) => {
  // Generate shareable link for configuration
  res.status(501).json({ message: 'Generate share link - Coming in Phase 2' });
});

configuratorRoutes.get('/shared/:shareCode', (req, res) => {
  // Load configuration from share link
  res.status(501).json({ message: 'Load shared configuration - Coming in Phase 2' });
});

// ----- QUOTE FROM CONFIGURATION -----
configuratorRoutes.post('/request-quote', authenticate, (req, res) => {
  // Create quote request from configuration
  res.status(501).json({ message: 'Request quote for configuration - Coming in Phase 2' });
});

configuratorRoutes.post('/add-to-cart', authenticate, (req, res) => {
  // Add configured product to cart
  res.status(501).json({ message: 'Add configuration to cart - Coming in Phase 2' });
});

// ----- CONFIGURATION IMAGES -----
configuratorRoutes.post('/preview/generate', (req, res) => {
  // Generate preview image of configured product
  res.status(501).json({ message: 'Generate configuration preview - Coming in Phase 2' });
});

configuratorRoutes.get('/preview/:configId', (req, res) => {
  // Get preview image
  res.status(501).json({ message: 'Get configuration preview image - Coming in Phase 2' });
});

// ----- TEMPLATES -----
configuratorRoutes.get('/templates', (req, res) => {
  // Get pre-configured templates (popular configurations)
  res.status(501).json({ message: 'Get configuration templates - Coming in Phase 2' });
});

configuratorRoutes.get('/templates/:templateId', (req, res) => {
  // Load specific template
  res.status(501).json({ message: 'Load configuration template - Coming in Phase 2' });
});

// ----- COMPARISON -----
configuratorRoutes.post('/compare', (req, res) => {
  // Compare multiple configurations side by side
  res.status(501).json({ message: 'Compare configurations - Coming in Phase 2' });
});

// ============================================
// PAYMENT ROUTES (/api/v1/payments)
// ============================================
const paymentRoutes = express.Router();

paymentRoutes.post('/initialize', authenticate, (req, res) => {
  res.status(501).json({ message: 'Initialize payment - Coming in Phase 2' });
});

paymentRoutes.post('/confirm', authenticate, (req, res) => {
  res.status(501).json({ message: 'Confirm payment - Coming in Phase 2' });
});

paymentRoutes.post('/webhook', (req, res) => {
  res.status(501).json({ message: 'Payment webhook - Coming in Phase 2' });
});

paymentRoutes.get('/methods', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get payment methods - Coming in Phase 2' });
});

paymentRoutes.get('/history', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get payment history - Coming in Phase 2' });
});

// ============================================
// LEAD ROUTES (/api/v1/leads) - SUPER_ADMIN ONLY FOR ALL
// ============================================
const leadRoutes = express.Router();

// NOTE: All lead routes require SUPER_ADMIN for viewing all leads
// Creators can only see their own leads

leadRoutes.get('/', authenticate, (req, res) => {
  // Will check: SUPER_ADMIN sees all, Creator sees own
  res.status(501).json({ message: 'Get leads - Coming in Phase 2' });
});

leadRoutes.get('/:id', authenticate, (req, res) => {
  // Will check: SUPER_ADMIN sees all, Creator sees own
  res.status(501).json({ message: 'Get lead by ID - Coming in Phase 2' });
});

leadRoutes.put('/:id/assign', authenticate, (req, res) => {
  // SUPER_ADMIN only
  res.status(501).json({ message: 'Assign lead - Coming in Phase 2' });
});

leadRoutes.get('/export', authenticate, (req, res) => {
  // SUPER_ADMIN only
  res.status(501).json({ message: 'Export leads - Coming in Phase 2' });
});

// ============================================
// COMMISSION ROUTES (/api/v1/commissions)
// ============================================
const commissionRoutes = express.Router();

commissionRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get commissions - Coming in Phase 2' });
});

commissionRoutes.get('/summary', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get commission summary - Coming in Phase 2' });
});

commissionRoutes.post('/payout', authenticate, (req, res) => {
  res.status(501).json({ message: 'Process payout - Coming in Phase 2' });
});

// ============================================
// ANALYTICS ROUTES (/api/v1/analytics)
// ============================================
const analyticsRoutes = express.Router();

analyticsRoutes.get('/dashboard', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get dashboard stats - Coming in Phase 2' });
});

analyticsRoutes.get('/sales', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get sales analytics - Coming in Phase 2' });
});

analyticsRoutes.get('/products', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get product analytics - Coming in Phase 2' });
});

analyticsRoutes.get('/customers', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get customer analytics - Coming in Phase 2' });
});

analyticsRoutes.get('/profit', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get profit analytics - Coming in Phase 2' });
});

analyticsRoutes.get('/profit/daily', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get daily profit - Coming in Phase 2' });
});

analyticsRoutes.get('/profit/monthly', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get monthly profit - Coming in Phase 2' });
});

analyticsRoutes.get('/profit/yearly', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get yearly profit - Coming in Phase 2' });
});

analyticsRoutes.get('/bestsellers', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get bestsellers - Coming in Phase 2' });
});

analyticsRoutes.get('/trending', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get trending products - Coming in Phase 2' });
});

// ============================================
// INVENTORY ROUTES (/api/v1/inventory)
// ============================================
const inventoryRoutes = express.Router();

inventoryRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get inventory - Coming in Phase 2' });
});

inventoryRoutes.put('/:productId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update inventory - Coming in Phase 2' });
});

inventoryRoutes.get('/low-stock', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get low stock alerts - Coming in Phase 2' });
});

// ============================================
// PROMOTION ROUTES (/api/v1/promotions)
// ============================================
const promotionRoutes = express.Router();

promotionRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get promotions - Coming in Phase 2' });
});

promotionRoutes.post('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Create promotion - Coming in Phase 2' });
});

promotionRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get promotion by ID - Coming in Phase 2' });
});

promotionRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update promotion - Coming in Phase 2' });
});

promotionRoutes.delete('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete promotion - Coming in Phase 2' });
});

promotionRoutes.post('/validate', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Validate promo code - Coming in Phase 2' });
});

// ============================================
// NOTIFICATION ROUTES (/api/v1/notifications)
// ============================================
const notificationRoutes = express.Router();

notificationRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get notifications - Coming in Phase 2' });
});

notificationRoutes.put('/:id/read', authenticate, (req, res) => {
  res.status(501).json({ message: 'Mark notification read - Coming in Phase 2' });
});

notificationRoutes.put('/read-all', authenticate, (req, res) => {
  res.status(501).json({ message: 'Mark all read - Coming in Phase 2' });
});

// ============================================
// SETTINGS ROUTES (/api/v1/settings)
// ============================================
const settingsRoutes = express.Router();

settingsRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get settings - Coming in Phase 2' });
});

settingsRoutes.put('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update settings - Coming in Phase 2' });
});

settingsRoutes.get('/margins', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get margin settings - Coming in Phase 2' });
});

settingsRoutes.put('/margins', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update margin settings - Coming in Phase 2' });
});

// ============================================
// UPLOAD ROUTES (/api/v1/uploads)
// ============================================
const uploadRoutes = express.Router();

uploadRoutes.post('/image', authenticate, (req, res) => {
  res.status(501).json({ message: 'Upload image - Coming in Phase 2' });
});

uploadRoutes.post('/document', authenticate, (req, res) => {
  res.status(501).json({ message: 'Upload document - Coming in Phase 2' });
});

uploadRoutes.post('/catalog', authenticate, (req, res) => {
  res.status(501).json({ message: 'Upload catalog file - Coming in Phase 2' });
});

// ============================================
// CART ROUTES (/api/v1/cart)
// ============================================
const cartRoutes = express.Router();

cartRoutes.get('/', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Get cart - Coming in Phase 3' });
});

cartRoutes.post('/items', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Add item to cart - Coming in Phase 3' });
});

cartRoutes.put('/items/:itemId', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Update cart item quantity - Coming in Phase 3' });
});

cartRoutes.delete('/items/:itemId', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Remove item from cart - Coming in Phase 3' });
});

cartRoutes.delete('/clear', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Clear entire cart - Coming in Phase 3' });
});

cartRoutes.post('/merge', authenticate, (req, res) => {
  res.status(501).json({ message: 'Merge guest cart with user cart - Coming in Phase 3' });
});

cartRoutes.get('/count', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Get cart item count - Coming in Phase 3' });
});

// ============================================
// WISHLIST ROUTES (/api/v1/wishlist)
// ============================================
const wishlistRoutes = express.Router();

wishlistRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get wishlist/saved configurations - Coming in Phase 3' });
});

wishlistRoutes.post('/items', authenticate, (req, res) => {
  res.status(501).json({ message: 'Add to wishlist - Coming in Phase 3' });
});

wishlistRoutes.delete('/items/:itemId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Remove from wishlist - Coming in Phase 3' });
});

wishlistRoutes.post('/items/:itemId/move-to-cart', authenticate, (req, res) => {
  res.status(501).json({ message: 'Move wishlist item to cart - Coming in Phase 3' });
});

// ============================================
// COUPON ROUTES (/api/v1/coupons)
// ============================================
const couponRoutes = express.Router();

couponRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all coupons (admin) - Coming in Phase 4' });
});

couponRoutes.post('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Create coupon - Coming in Phase 4' });
});

couponRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get coupon details - Coming in Phase 4' });
});

couponRoutes.put('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update coupon - Coming in Phase 4' });
});

couponRoutes.delete('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Delete coupon - Coming in Phase 4' });
});

couponRoutes.post('/validate', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Validate coupon code at checkout - Coming in Phase 3' });
});

couponRoutes.post('/apply', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Apply coupon to cart - Coming in Phase 3' });
});

// ============================================
// INVOICE ROUTES (/api/v1/invoices)
// ============================================
const invoiceRoutes = express.Router();

invoiceRoutes.get('/', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get all invoices - Coming in Phase 3' });
});

invoiceRoutes.get('/:id', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get invoice by ID - Coming in Phase 3' });
});

invoiceRoutes.get('/:id/pdf', authenticate, (req, res) => {
  res.status(501).json({ message: 'Download invoice PDF - Coming in Phase 3' });
});

invoiceRoutes.post('/generate', authenticate, (req, res) => {
  res.status(501).json({ message: 'Generate invoice for order - Coming in Phase 3' });
});

invoiceRoutes.post('/:id/send', authenticate, (req, res) => {
  res.status(501).json({ message: 'Email invoice to customer - Coming in Phase 3' });
});

// ============================================
// SHIPPING ROUTES (/api/v1/shipping)
// ============================================
const shippingRoutes = express.Router();

shippingRoutes.get('/rates', (req, res) => {
  res.status(501).json({ message: 'Get shipping rates - Coming in Phase 3' });
});

shippingRoutes.post('/calculate', (req, res) => {
  res.status(501).json({ message: 'Calculate shipping cost for cart - Coming in Phase 3' });
});

shippingRoutes.get('/zones', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get shipping zones - Coming in Phase 4' });
});

shippingRoutes.put('/zones', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update shipping zones - Coming in Phase 4' });
});

shippingRoutes.get('/tracking/:orderId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get shipping tracking info - Coming in Phase 3' });
});

// ============================================
// VAT/TAX ROUTES (/api/v1/tax)
// ============================================
const taxRoutes = express.Router();

taxRoutes.get('/rates', (req, res) => {
  res.status(501).json({ message: 'Get VAT rates (19% standard, 7% reduced) - Coming in Phase 2' });
});

taxRoutes.post('/calculate', (req, res) => {
  res.status(501).json({ message: 'Calculate tax for cart - Coming in Phase 2' });
});

taxRoutes.post('/vies/validate', (req, res) => {
  res.status(501).json({ message: 'Validate EU VAT ID via VIES API - Coming in Phase 2' });
});

taxRoutes.get('/vies/status/:vatId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Check VAT ID validation status - Coming in Phase 2' });
});

taxRoutes.put('/b2b/exempt', authenticate, (req, res) => {
  res.status(501).json({ message: 'Mark customer as VAT exempt (B2B) - Coming in Phase 2' });
});

// ============================================
// PDF ROUTES (/api/v1/pdf)
// ============================================
const pdfRoutes = express.Router();

pdfRoutes.post('/quote', authenticate, (req, res) => {
  res.status(501).json({ message: 'Generate quote PDF - Coming in Phase 3' });
});

pdfRoutes.post('/order', authenticate, (req, res) => {
  res.status(501).json({ message: 'Generate order summary PDF - Coming in Phase 3' });
});

pdfRoutes.post('/configuration', authenticateOptional, (req, res) => {
  res.status(501).json({ message: 'Generate configuration PDF - Coming in Phase 2' });
});

pdfRoutes.post('/invoice', authenticate, (req, res) => {
  res.status(501).json({ message: 'Generate invoice PDF - Coming in Phase 3' });
});

pdfRoutes.post('/delivery-note', authenticate, (req, res) => {
  res.status(501).json({ message: 'Generate delivery note PDF - Coming in Phase 3' });
});

// ============================================
// LANGUAGE/i18n ROUTES (/api/v1/i18n)
// ============================================
const i18nRoutes = express.Router();

i18nRoutes.get('/languages', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      available: ['de', 'en'],
      default: 'de',
      names: {
        de: 'Deutsch',
        en: 'English'
      }
    }
  });
});

i18nRoutes.get('/translations/:lang', (req, res) => {
  res.status(501).json({ message: 'Get translations for language - Coming in Phase 5' });
});

i18nRoutes.get('/translations/:lang/:namespace', (req, res) => {
  res.status(501).json({ message: 'Get translations by namespace - Coming in Phase 5' });
});

// ============================================
// SEARCH ROUTES (/api/v1/search)
// ============================================
const searchRoutes = express.Router();

searchRoutes.get('/products', (req, res) => {
  res.status(501).json({ message: 'Search products - Coming in Phase 2' });
});

searchRoutes.get('/customers', authenticate, (req, res) => {
  res.status(501).json({ message: 'Search customers - Coming in Phase 4' });
});

searchRoutes.get('/orders', authenticate, (req, res) => {
  res.status(501).json({ message: 'Search orders - Coming in Phase 4' });
});

searchRoutes.get('/global', authenticate, (req, res) => {
  res.status(501).json({ message: 'Global search across all entities - Coming in Phase 5' });
});

searchRoutes.get('/suggestions', (req, res) => {
  res.status(501).json({ message: 'Search suggestions/autocomplete - Coming in Phase 5' });
});

// ============================================
// MARGIN ROUTES (/api/v1/margins)
// ============================================
const marginRoutes = express.Router();

marginRoutes.get('/global', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get global default margin - Coming in Phase 2' });
});

marginRoutes.put('/global', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update global default margin - Coming in Phase 2' });
});

marginRoutes.get('/categories', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get category-level margins - Coming in Phase 2' });
});

marginRoutes.put('/categories/:categoryId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update category margin - Coming in Phase 2' });
});

marginRoutes.get('/manufacturers', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get manufacturer-level margins - Coming in Phase 2' });
});

marginRoutes.put('/manufacturers/:manufacturerId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update manufacturer margin - Coming in Phase 2' });
});

marginRoutes.get('/products/:productId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Get product-specific margin - Coming in Phase 2' });
});

marginRoutes.put('/products/:productId', authenticate, (req, res) => {
  res.status(501).json({ message: 'Update product-specific margin (highest priority) - Coming in Phase 2' });
});

marginRoutes.get('/calculate', authenticate, (req, res) => {
  res.status(501).json({ message: 'Calculate effective margin for product - Coming in Phase 2' });
});

// ============================================
// RECENT/HISTORY ROUTES (/api/v1/history)
// ============================================
// Track user browsing history and recently viewed items
// ============================================
const historyRoutes = express.Router();

// ----- RECENTLY VIEWED PRODUCTS -----
historyRoutes.get('/viewed', authenticateOptional, (req, res) => {
  // Get recently viewed products (uses session for guests, user account for authenticated)
  res.status(501).json({ message: 'Get recently viewed products - Coming in Phase 3' });
});

historyRoutes.post('/viewed', authenticateOptional, (req, res) => {
  // Add product to recently viewed
  res.status(501).json({ message: 'Add to recently viewed - Coming in Phase 3' });
});

historyRoutes.delete('/viewed', authenticate, (req, res) => {
  // Clear recently viewed history
  res.status(501).json({ message: 'Clear recently viewed - Coming in Phase 3' });
});

historyRoutes.delete('/viewed/:productId', authenticate, (req, res) => {
  // Remove specific product from recently viewed
  res.status(501).json({ message: 'Remove product from recently viewed - Coming in Phase 3' });
});

// ----- RECENTLY VIEWED CONFIGURATIONS -----
historyRoutes.get('/viewed/configurations', authenticateOptional, (req, res) => {
  // Get recently viewed configurations (from configurator)
  res.status(501).json({ message: 'Get recently viewed configurations - Coming in Phase 3' });
});

historyRoutes.post('/viewed/configurations', authenticateOptional, (req, res) => {
  // Add configuration to recently viewed
  res.status(501).json({ message: 'Add configuration to recently viewed - Coming in Phase 3' });
});

// ----- CONFIGURATION HISTORY -----
historyRoutes.get('/configurations', authenticate, (req, res) => {
  // Get all configuration history (with full details)
  res.status(501).json({ message: 'Get configuration history - Coming in Phase 3' });
});

historyRoutes.get('/configurations/:configId', authenticate, (req, res) => {
  // Get specific configuration from history
  res.status(501).json({ message: 'Get configuration from history - Coming in Phase 3' });
});

historyRoutes.post('/configurations/:configId/restore', authenticate, (req, res) => {
  // Restore old configuration to configurator
  res.status(501).json({ message: 'Restore configuration - Coming in Phase 3' });
});

// ----- SEARCH HISTORY -----
historyRoutes.get('/searches', authenticate, (req, res) => {
  // Get recent searches
  res.status(501).json({ message: 'Get recent searches - Coming in Phase 5' });
});

historyRoutes.delete('/searches', authenticate, (req, res) => {
  // Clear search history
  res.status(501).json({ message: 'Clear search history - Coming in Phase 5' });
});

// ----- ORDER HISTORY -----
historyRoutes.get('/orders', authenticate, (req, res) => {
  // Get order history (summary)
  res.status(501).json({ message: 'Get order history - Coming in Phase 3' });
});

// ----- QUOTE REQUEST HISTORY -----
historyRoutes.get('/quotes', authenticate, (req, res) => {
  // Get quote request history
  res.status(501).json({ message: 'Get quote history - Coming in Phase 3' });
});

// ----- BROWSE ACTIVITY -----
historyRoutes.get('/activity', authenticate, (req, res) => {
  // Get all browsing activity (products, configs, searches)
  res.status(501).json({ message: 'Get all browsing activity - Coming in Phase 3' });
});

historyRoutes.get('/activity/timeline', authenticate, (req, res) => {
  // Get activity timeline
  res.status(501).json({ message: 'Get activity timeline - Coming in Phase 3' });
});

// ----- RECOMMENDATIONS BASED ON HISTORY -----
historyRoutes.get('/recommendations', authenticateOptional, (req, res) => {
  // Get product recommendations based on history
  res.status(501).json({ message: 'Get recommendations based on history - Coming in Phase 5' });
});

// ============================================
// REGISTER ALL ROUTES
// ============================================
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/catalog', catalogRoutes);
router.use('/orders', orderRoutes);
router.use('/quotes', quoteRoutes);
router.use('/configurator', configuratorRoutes);
router.use('/payments', paymentRoutes);
router.use('/leads', leadRoutes);
router.use('/commissions', commissionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/promotions', promotionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);
// NEW ROUTES ADDED
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/coupons', couponRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/shipping', shippingRoutes);
router.use('/tax', taxRoutes);
router.use('/pdf', pdfRoutes);
router.use('/i18n', i18nRoutes);
router.use('/search', searchRoutes);
router.use('/margins', marginRoutes);
router.use('/history', historyRoutes);

// ============================================
// 404 HANDLER FOR API
// ============================================
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      '/api/v1/health',
      '/api/v1/auth',
      '/api/v1/users',
      '/api/v1/customers',
      '/api/v1/products',
      '/api/v1/catalog',
      '/api/v1/orders',
      '/api/v1/quotes',
      '/api/v1/configurator',
      '/api/v1/payments',
      '/api/v1/leads',
      '/api/v1/commissions',
      '/api/v1/analytics',
      '/api/v1/inventory',
      '/api/v1/promotions',
      '/api/v1/notifications',
      '/api/v1/settings',
      '/api/v1/uploads',
      '/api/v1/cart',
      '/api/v1/wishlist',
      '/api/v1/coupons',
      '/api/v1/invoices',
      '/api/v1/shipping',
      '/api/v1/tax',
      '/api/v1/pdf',
      '/api/v1/i18n',
      '/api/v1/search',
      '/api/v1/margins',
      '/api/v1/history'
    ]
  });
});

// ============================================
// ROUTE INFO HELPER
// ============================================
const getRouteInfo = () => {
  return {
    version: 'v1',
    baseUrl: '/api/v1',
    routes: {
      health: {
        'GET /health': 'Basic health check',
        'GET /health/detailed': 'Detailed health check (auth required)'
      },
      auth: {
        'POST /auth/register': 'Register new user',
        'POST /auth/login': 'User login',
        'POST /auth/logout': 'User logout',
        'POST /auth/refresh-token': 'Refresh access token',
        'POST /auth/forgot-password': 'Request password reset',
        'POST /auth/reset-password': 'Reset password',
        'POST /auth/verify-email': 'Verify email address',
        'GET /auth/me': 'Get current user'
      },
      users: {
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get user by ID',
        'PUT /users/:id': 'Update user',
        'DELETE /users/:id': 'Delete user'
      },
      customers: {
        'GET /customers': 'Get all customers',
        'POST /customers': 'Create customer',
        'GET /customers/:id': 'Get customer by ID',
        'PUT /customers/:id': 'Update customer',
        'DELETE /customers/:id': 'Delete customer',
        'GET /customers/:id/orders': 'Get customer orders',
        'GET /customers/:id/quotes': 'Get customer quotes'
      },
      products: {
        'GET /products': 'Get all products',
        'GET /products/categories': 'Get categories',
        'GET /products/search': 'Search products',
        'GET /products/:id': 'Get product by ID',
        'POST /products': 'Create product',
        'PUT /products/:id': 'Update product',
        'DELETE /products/:id': 'Delete product'
      },
      catalog: {
        'POST /catalog/import': 'Import catalog',
        'GET /catalog/export': 'Export catalog',
        'GET /catalog/versions': 'Get catalog versions',
        'POST /catalog/auto-import/configure': 'Configure auto-import'
      },
      orders: {
        'GET /orders': 'Get all orders',
        'POST /orders': 'Create order',
        'GET /orders/:id': 'Get order by ID',
        'PUT /orders/:id': 'Update order',
        'PUT /orders/:id/status': 'Update order status',
        'POST /orders/:id/cancel': 'Cancel order'
      },
      quotes: {
        'GET /quotes': 'Get all quotes',
        'POST /quotes': 'Request quote',
        'GET /quotes/:id': 'Get quote by ID',
        'PUT /quotes/:id': 'Update quote',
        'POST /quotes/:id/convert': 'Convert to order'
      },
      configurator: {
        'GET /configurator/options/:productId': 'Get config options',
        'POST /configurator/calculate': 'Calculate price',
        'POST /configurator/save': 'Save configuration',
        'GET /configurator/saved': 'Get saved configs'
      },
      payments: {
        'POST /payments/initialize': 'Initialize payment',
        'POST /payments/confirm': 'Confirm payment',
        'POST /payments/webhook': 'Payment webhook',
        'GET /payments/methods': 'Get payment methods',
        'GET /payments/history': 'Get payment history'
      },
      leads: {
        'GET /leads': 'Get leads (SUPER_ADMIN: all, Creator: own)',
        'GET /leads/:id': 'Get lead by ID',
        'PUT /leads/:id/assign': 'Assign lead (SUPER_ADMIN only)',
        'GET /leads/export': 'Export leads (SUPER_ADMIN only)'
      },
      commissions: {
        'GET /commissions': 'Get commissions',
        'GET /commissions/summary': 'Get summary',
        'POST /commissions/payout': 'Process payout'
      },
      analytics: {
        'GET /analytics/dashboard': 'Dashboard stats',
        'GET /analytics/sales': 'Sales analytics',
        'GET /analytics/products': 'Product analytics',
        'GET /analytics/customers': 'Customer analytics',
        'GET /analytics/profit': 'Profit analytics',
        'GET /analytics/profit/daily': 'Daily profit',
        'GET /analytics/profit/monthly': 'Monthly profit',
        'GET /analytics/profit/yearly': 'Yearly profit',
        'GET /analytics/bestsellers': 'Bestselling products',
        'GET /analytics/trending': 'Trending products'
      },
      inventory: {
        'GET /inventory': 'Get inventory',
        'PUT /inventory/:productId': 'Update inventory',
        'GET /inventory/low-stock': 'Low stock alerts'
      },
      promotions: {
        'GET /promotions': 'Get promotions',
        'POST /promotions': 'Create promotion',
        'GET /promotions/:id': 'Get promotion',
        'PUT /promotions/:id': 'Update promotion',
        'DELETE /promotions/:id': 'Delete promotion',
        'POST /promotions/validate': 'Validate promo code'
      },
      notifications: {
        'GET /notifications': 'Get notifications',
        'PUT /notifications/:id/read': 'Mark as read',
        'PUT /notifications/read-all': 'Mark all read'
      },
      settings: {
        'GET /settings': 'Get settings',
        'PUT /settings': 'Update settings',
        'GET /settings/margins': 'Get margins',
        'PUT /settings/margins': 'Update margins'
      },
      uploads: {
        'POST /uploads/image': 'Upload image',
        'POST /uploads/document': 'Upload document',
        'POST /uploads/catalog': 'Upload catalog'
      },
      cart: {
        'GET /cart': 'Get cart',
        'POST /cart/items': 'Add item to cart',
        'PUT /cart/items/:itemId': 'Update cart item',
        'DELETE /cart/items/:itemId': 'Remove item from cart',
        'DELETE /cart/clear': 'Clear cart',
        'POST /cart/merge': 'Merge guest cart with user cart',
        'GET /cart/count': 'Get cart item count'
      },
      wishlist: {
        'GET /wishlist': 'Get wishlist',
        'POST /wishlist/items': 'Add to wishlist',
        'DELETE /wishlist/items/:itemId': 'Remove from wishlist',
        'POST /wishlist/items/:itemId/move-to-cart': 'Move to cart'
      },
      coupons: {
        'GET /coupons': 'Get all coupons (admin)',
        'POST /coupons': 'Create coupon',
        'GET /coupons/:id': 'Get coupon details',
        'PUT /coupons/:id': 'Update coupon',
        'DELETE /coupons/:id': 'Delete coupon',
        'POST /coupons/validate': 'Validate coupon code',
        'POST /coupons/apply': 'Apply coupon to cart'
      },
      invoices: {
        'GET /invoices': 'Get all invoices',
        'GET /invoices/:id': 'Get invoice by ID',
        'GET /invoices/:id/pdf': 'Download invoice PDF',
        'POST /invoices/generate': 'Generate invoice for order',
        'POST /invoices/:id/send': 'Email invoice to customer'
      },
      shipping: {
        'GET /shipping/rates': 'Get shipping rates',
        'POST /shipping/calculate': 'Calculate shipping cost',
        'GET /shipping/zones': 'Get shipping zones',
        'PUT /shipping/zones': 'Update shipping zones',
        'GET /shipping/tracking/:orderId': 'Get tracking info'
      },
      tax: {
        'GET /tax/rates': 'Get VAT rates (19%/7%)',
        'POST /tax/calculate': 'Calculate tax for cart',
        'POST /tax/vies/validate': 'Validate EU VAT ID (VIES)',
        'GET /tax/vies/status/:vatId': 'Check VAT ID status',
        'PUT /tax/b2b/exempt': 'Mark customer VAT exempt'
      },
      pdf: {
        'POST /pdf/quote': 'Generate quote PDF',
        'POST /pdf/order': 'Generate order PDF',
        'POST /pdf/configuration': 'Generate configuration PDF',
        'POST /pdf/invoice': 'Generate invoice PDF',
        'POST /pdf/delivery-note': 'Generate delivery note PDF'
      },
      i18n: {
        'GET /i18n/languages': 'Get available languages (de, en)',
        'GET /i18n/translations/:lang': 'Get translations for language',
        'GET /i18n/translations/:lang/:namespace': 'Get translations by namespace'
      },
      search: {
        'GET /search/products': 'Search products',
        'GET /search/customers': 'Search customers',
        'GET /search/orders': 'Search orders',
        'GET /search/global': 'Global search',
        'GET /search/suggestions': 'Search suggestions'
      },
      margins: {
        'GET /margins/global': 'Get global default margin',
        'PUT /margins/global': 'Update global margin',
        'GET /margins/categories': 'Get category margins',
        'PUT /margins/categories/:categoryId': 'Update category margin',
        'GET /margins/manufacturers': 'Get manufacturer margins',
        'PUT /margins/manufacturers/:manufacturerId': 'Update manufacturer margin',
        'GET /margins/products/:productId': 'Get product margin',
        'PUT /margins/products/:productId': 'Update product margin (highest priority)',
        'GET /margins/calculate': 'Calculate effective margin'
      },
      history: {
        'GET /history/viewed': 'Recently viewed products',
        'POST /history/viewed': 'Add to recently viewed',
        'GET /history/searches': 'Recent searches',
        'GET /history/configurations': 'Configuration history'
      }
    },
    totalEndpoints: 138
  };
};

// Export router and helpers
module.exports = router;
module.exports.getRouteInfo = getRouteInfo;
module.exports.API_VERSION = API_VERSION;
