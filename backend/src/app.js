/**
 * CURIA Backend - Main Server Entry Point
 * 
 * This is the main file that starts the Express server.
 * It configures middleware, routes, and error handling.
 */

// Load environment variables FIRST (before anything else)
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import custom middleware (will create later)
// const errorHandler = require('./middleware/errorHandler');
// const logger = require('./utils/logger');

// Create Express application
const app = express();

// =============================================================================
// SECURITY MIDDLEWARE
// =============================================================================

// Helmet: Adds security headers (XSS protection, etc.)
app.use(helmet());

// CORS: Allow cross-origin requests (frontend can talk to backend)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting: Prevent abuse (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// =============================================================================
// BODY PARSING MIDDLEWARE
// =============================================================================

// Parse JSON bodies (for API requests)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================================================
// API ROUTES
// =============================================================================

// Health check endpoint (to verify server is running)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CURIA Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API version endpoint
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    name: 'CURIA API',
    version: '1.0.0',
    description: 'Backend API for CURIA CRM and E-Commerce Platform',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      // Future endpoints will be listed here:
      // auth: '/api/v1/auth',
      // users: '/api/v1/users',
      // products: '/api/v1/products',
      // orders: '/api/v1/orders',
    }
  });
});

// =============================================================================
// PLACEHOLDER ROUTES (Will be implemented in later steps)
// =============================================================================

// Auth routes (Step 3.5)
// app.use('/api/v1/auth', require('./routes/auth'));

// User routes (Step 4.1)
// app.use('/api/v1/users', require('./routes/users'));

// Product routes (Step 4.2)
// app.use('/api/v1/products', require('./routes/products'));

// Order routes (Phase 2)
// app.use('/api/v1/orders', require('./routes/orders'));

// =============================================================================
// ERROR HANDLING
// =============================================================================

// 404 Handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    statusCode: 404
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Send error response
  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    statusCode: err.statusCode || 500
  });
});

// =============================================================================
// START SERVER
// =============================================================================

const PORT = process.env.PORT || 3001;

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 CURIA Backend Server Started');
    console.log('='.repeat(50));
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Server URL: http://localhost:${PORT}`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api/v1`);
    console.log('='.repeat(50));
  });
}

// Export app for testing
module.exports = app;
