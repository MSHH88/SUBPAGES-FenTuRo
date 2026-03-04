/**
 * CURIA Backend - Main Server Entry Point
 * 
 * This is the main file that starts the Express server.
 * It configures middleware, routes, and error handling.
 * 
 * Features included:
 * - Security (Helmet, CORS, Rate Limiting)
 * - Body parsing (JSON, URL-encoded)
 * - Request logging
 * - Compression
 * - Health monitoring
 * - Error handling
 * - Graceful shutdown
 */

// Load environment variables FIRST (before anything else)
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

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
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    const allowedOrigins = [
      'http://localhost:3000',  // Frontend dev server
      'http://localhost:3001',  // Same server
      process.env.FRONTEND_URL,  // Production frontend
      process.env.CORS_ORIGIN    // Custom origin
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression: Reduce response size (faster loading)
app.use(compression());

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
// REQUEST LOGGING (Simple logging until we add Winston in Step 1.7)
// =============================================================================

// Log all requests in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// =============================================================================
// TRUST PROXY (Required when behind a reverse proxy like Render/Railway)
// =============================================================================
app.set('trust proxy', 1);

// =============================================================================
// API ROUTES
// =============================================================================

// Health check endpoint (to verify server is running)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CURIA Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
    }
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
let server;
if (require.main === module) {
  server = app.listen(PORT, () => {
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

// =============================================================================
// GRACEFUL SHUTDOWN (Clean exit when server stops)
// =============================================================================

// Handle shutdown signals (Ctrl+C, server restart, etc.)
const gracefulShutdown = (signal) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      // Close database connections here (added in Step 1.5)
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Export app for testing
module.exports = app;
