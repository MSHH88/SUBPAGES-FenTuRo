/**
 * CURIA Backend - Database Connection Module
 * PostgreSQL connection pool and query helpers
 * 
 * Supports all features:
 * - CRM Role System (8 roles)
 * - Lead Generator (CREATOR-only)
 * - Order Workflow (9 states)
 * - Quote System (Private/Business)
 * - Configuration Sharing
 * - Wishlist
 * - Cart with Server Sync
 * - Analytics Tracking
 * - Audit Logging
 */

const { Pool } = require('pg');
const config = require('./index');

// Create connection pool
const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: config.database.poolSize,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: config.isProduction ? { rejectUnauthorized: false } : false
});

// Pool event handlers
pool.on('connect', (client) => {
  console.log('📗 New database connection established');
});

pool.on('error', (err, client) => {
  console.error('❌ Database pool error:', err.message);
});

pool.on('remove', (client) => {
  console.log('📕 Database connection removed from pool');
});

/**
 * Execute a single query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️ Slow query (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Query:', text.substring(0, 200));
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Pool client
 */
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query.bind(client);
  const originalRelease = client.release.bind(client);
  
  // Set a timeout for releasing the client
  const timeout = setTimeout(() => {
    console.error('❌ Client has been checked out for too long!');
  }, 30000);
  
  client.query = (...args) => {
    return originalQuery(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    return originalRelease();
  };
  
  return client;
};

/**
 * Execute a transaction
 * @param {Function} callback - Async function receiving the client
 * @returns {Promise<any>} Transaction result
 */
const transaction = async (callback) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Check database connection
 * @returns {Promise<boolean>} Connection status
 */
const checkConnection = async () => {
  try {
    const result = await query('SELECT NOW() as now, current_database() as database');
    console.log('✅ Database connected:', result.rows[0].database);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

/**
 * Get pool statistics
 * @returns {Object} Pool stats
 */
const getPoolStats = () => ({
  total: pool.totalCount,
  idle: pool.idleCount,
  waiting: pool.waitingCount
});

/**
 * Close all pool connections (for graceful shutdown)
 */
const closePool = async () => {
  console.log('🔌 Closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
};

// ===== CRUD HELPERS =====

/**
 * Find one record by conditions
 * @param {string} table - Table name
 * @param {Object} conditions - WHERE conditions
 * @returns {Promise<Object|null>} Found record or null
 */
const findOne = async (table, conditions) => {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
  
  const result = await query(
    `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`,
    values
  );
  
  return result.rows[0] || null;
};

/**
 * Find multiple records
 * @param {string} table - Table name
 * @param {Object} conditions - WHERE conditions
 * @param {Object} options - Order, limit, offset
 * @returns {Promise<Array>} Found records
 */
const findMany = async (table, conditions = {}, options = {}) => {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  
  let sql = `SELECT * FROM ${table}`;
  
  if (keys.length > 0) {
    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    sql += ` WHERE ${whereClause}`;
  }
  
  if (options.orderBy) {
    sql += ` ORDER BY ${options.orderBy}`;
    if (options.orderDir) sql += ` ${options.orderDir}`;
  }
  
  if (options.limit) sql += ` LIMIT ${parseInt(options.limit)}`;
  if (options.offset) sql += ` OFFSET ${parseInt(options.offset)}`;
  
  const result = await query(sql, values);
  return result.rows;
};

/**
 * Insert a record
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<Object>} Inserted record
 */
const insert = async (table, data) => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  
  const result = await query(
    `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  
  return result.rows[0];
};

/**
 * Update records
 * @param {string} table - Table name
 * @param {Object} data - Data to update
 * @param {Object} conditions - WHERE conditions
 * @returns {Promise<Array>} Updated records
 */
const update = async (table, data, conditions) => {
  const dataKeys = Object.keys(data);
  const dataValues = Object.values(data);
  const condKeys = Object.keys(conditions);
  const condValues = Object.values(conditions);
  
  const setClause = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const whereClause = condKeys.map((key, i) => `${key} = $${dataKeys.length + i + 1}`).join(' AND ');
  
  const result = await query(
    `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE ${whereClause} RETURNING *`,
    [...dataValues, ...condValues]
  );
  
  return result.rows;
};

/**
 * Delete records
 * @param {string} table - Table name
 * @param {Object} conditions - WHERE conditions
 * @returns {Promise<number>} Number of deleted records
 */
const remove = async (table, conditions) => {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
  
  const result = await query(
    `DELETE FROM ${table} WHERE ${whereClause}`,
    values
  );
  
  return result.rowCount;
};

/**
 * Count records
 * @param {string} table - Table name
 * @param {Object} conditions - WHERE conditions
 * @returns {Promise<number>} Count
 */
const count = async (table, conditions = {}) => {
  const keys = Object.keys(conditions);
  const values = Object.values(conditions);
  
  let sql = `SELECT COUNT(*) as count FROM ${table}`;
  
  if (keys.length > 0) {
    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
    sql += ` WHERE ${whereClause}`;
  }
  
  const result = await query(sql, values);
  return parseInt(result.rows[0].count);
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  checkConnection,
  getPoolStats,
  closePool,
  findOne,
  findMany,
  insert,
  update,
  remove,
  count
};
