/**
 * CURIA Backend - Database Migrations
 * Complete schema for all features
 * 
 * Tables:
 * - users, roles, permissions, role_permissions
 * - user_sessions, audit_logs
 * - categories, manufacturers, products, product_variants
 * - configurations, config_shares
 * - wishlists, wishlist_items
 * - carts, cart_items
 * - quotes, quote_items
 * - orders, order_items, invoices
 * - lead_tracking, analytics_events
 */

const db = require('./database');

// ===== CREATE TABLES =====

const createTables = async () => {
  console.log('🔧 Creating database tables...');

  // 1. ROLES TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      display_name VARCHAR(100) NOT NULL,
      description TEXT,
      level INTEGER NOT NULL DEFAULT 0,
      is_system_role BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ roles table created');

  // 2. PERMISSIONS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS permissions (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      display_name VARCHAR(200) NOT NULL,
      description TEXT,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ permissions table created');

  // 3. ROLE_PERMISSIONS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS role_permissions (
      id SERIAL PRIMARY KEY,
      role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
      permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(role_id, permission_id)
    )
  `);
  console.log('  ✅ role_permissions table created');

  // 4. USERS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      phone VARCHAR(50),
      
      -- Role System
      role_id INTEGER REFERENCES roles(id),
      is_active BOOLEAN DEFAULT TRUE,
      is_verified BOOLEAN DEFAULT FALSE,
      
      -- B2B Support
      company_name VARCHAR(255),
      vat_number VARCHAR(50),
      is_b2b BOOLEAN DEFAULT FALSE,
      
      -- CRM Fields
      created_by UUID,
      can_be_removed_by_ceo BOOLEAN DEFAULT TRUE,
      
      -- Address
      street VARCHAR(255),
      house_number VARCHAR(20),
      postal_code VARCHAR(20),
      city VARCHAR(100),
      country VARCHAR(100) DEFAULT 'Germany',
      
      -- Metadata
      last_login TIMESTAMP,
      login_count INTEGER DEFAULT 0,
      failed_login_attempts INTEGER DEFAULT 0,
      locked_until TIMESTAMP,
      password_changed_at TIMESTAMP,
      verification_token VARCHAR(255),
      reset_token VARCHAR(255),
      reset_token_expires TIMESTAMP,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ users table created');

  // 5. USER_SESSIONS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      token_hash VARCHAR(255) NOT NULL,
      ip_address VARCHAR(50),
      user_agent TEXT,
      is_valid BOOLEAN DEFAULT TRUE,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ user_sessions table created');

  // 6. AUDIT_LOGS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(100) NOT NULL,
      entity_type VARCHAR(50),
      entity_id VARCHAR(100),
      old_values JSONB,
      new_values JSONB,
      ip_address VARCHAR(50),
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ audit_logs table created');

  // 7. CATEGORIES TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      display_name_de VARCHAR(200) NOT NULL,
      display_name_en VARCHAR(200),
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(100),
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      parent_id INTEGER REFERENCES categories(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ categories table created');

  // 8. MANUFACTURERS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS manufacturers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      display_name VARCHAR(200) NOT NULL,
      slug VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      logo_url VARCHAR(500),
      website VARCHAR(255),
      country VARCHAR(100),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ manufacturers table created');

  // 9. PRODUCTS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sku VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      
      -- Categorization
      category_id INTEGER REFERENCES categories(id),
      manufacturer_id INTEGER REFERENCES manufacturers(id),
      
      -- Pricing
      cost_price DECIMAL(10, 2) NOT NULL,
      base_price DECIMAL(10, 2) NOT NULL,
      margin_percent DECIMAL(5, 2) DEFAULT 50.00,
      
      -- Dimensions (for windows/doors)
      min_width INTEGER,
      max_width INTEGER,
      min_height INTEGER,
      max_height INTEGER,
      
      -- Status
      is_active BOOLEAN DEFAULT TRUE,
      is_configurable BOOLEAN DEFAULT TRUE,
      
      -- SEO
      meta_title VARCHAR(255),
      meta_description TEXT,
      
      -- Media
      image_url VARCHAR(500),
      images JSONB DEFAULT '[]',
      
      -- Configuration options
      available_options JSONB DEFAULT '{}',
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ products table created');

  // 10. PRODUCT_VARIANTS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      sku VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      
      -- Variant specifics
      width INTEGER,
      height INTEGER,
      material VARCHAR(100),
      color VARCHAR(100),
      glass_type VARCHAR(100),
      profile_type VARCHAR(100),
      
      -- Pricing
      price_modifier DECIMAL(10, 2) DEFAULT 0,
      
      -- Stock
      stock_quantity INTEGER DEFAULT 0,
      is_in_stock BOOLEAN DEFAULT TRUE,
      
      -- Options as JSON
      options JSONB DEFAULT '{}',
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ product_variants table created');

  // 11. CONFIGURATIONS TABLE (Saved configurator states)
  await db.query(`
    CREATE TABLE IF NOT EXISTS configurations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_id VARCHAR(255),
      
      -- Product info
      product_id UUID REFERENCES products(id),
      category_id INTEGER REFERENCES categories(id),
      
      -- Configuration data
      name VARCHAR(255),
      configuration_data JSONB NOT NULL,
      
      -- Pricing at save time
      calculated_price DECIMAL(10, 2),
      
      -- Status
      is_complete BOOLEAN DEFAULT FALSE,
      is_saved BOOLEAN DEFAULT FALSE,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ configurations table created');

  // 12. CONFIG_SHARES TABLE (Shareable URLs)
  await db.query(`
    CREATE TABLE IF NOT EXISTS config_shares (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
      share_code VARCHAR(50) UNIQUE NOT NULL,
      
      -- Access control
      password_hash VARCHAR(255),
      expires_at TIMESTAMP,
      max_views INTEGER,
      view_count INTEGER DEFAULT 0,
      
      -- Metadata
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ config_shares table created');

  // 13. WISHLISTS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) DEFAULT 'My Wishlist',
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ wishlists table created');

  // 14. WISHLIST_ITEMS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id SERIAL PRIMARY KEY,
      wishlist_id UUID REFERENCES wishlists(id) ON DELETE CASCADE,
      configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ wishlist_items table created');

  // 15. CARTS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_id VARCHAR(255),
      
      -- Totals
      subtotal DECIMAL(10, 2) DEFAULT 0,
      tax_amount DECIMAL(10, 2) DEFAULT 0,
      total DECIMAL(10, 2) DEFAULT 0,
      
      -- Status
      is_active BOOLEAN DEFAULT TRUE,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      expires_at TIMESTAMP
    )
  `);
  console.log('  ✅ carts table created');

  // 16. CART_ITEMS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id SERIAL PRIMARY KEY,
      cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
      configuration_id UUID REFERENCES configurations(id),
      product_id UUID REFERENCES products(id),
      
      -- Item details
      quantity INTEGER DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      total_price DECIMAL(10, 2) NOT NULL,
      
      -- Configuration snapshot
      configuration_data JSONB,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ cart_items table created');

  // 17. QUOTES TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS quotes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      quote_number VARCHAR(50) UNIQUE NOT NULL,
      
      -- Customer info
      user_id UUID REFERENCES users(id),
      customer_type VARCHAR(20) DEFAULT 'private',
      
      -- Contact
      contact_email VARCHAR(255) NOT NULL,
      contact_phone VARCHAR(50),
      contact_whatsapp VARCHAR(50),
      preferred_contact VARCHAR(20) DEFAULT 'email',
      
      -- Company (for B2B)
      company_name VARCHAR(255),
      vat_number VARCHAR(50),
      
      -- Address
      street VARCHAR(255),
      house_number VARCHAR(20),
      postal_code VARCHAR(20),
      city VARCHAR(100),
      country VARCHAR(100) DEFAULT 'Germany',
      
      -- Quote details
      notes TEXT,
      
      -- Totals
      subtotal DECIMAL(10, 2),
      tax_rate DECIMAL(5, 2) DEFAULT 19.00,
      tax_amount DECIMAL(10, 2),
      total DECIMAL(10, 2),
      
      -- Status
      status VARCHAR(20) DEFAULT 'pending',
      
      -- Assigned to
      assigned_to UUID REFERENCES users(id),
      
      -- Validity
      valid_until TIMESTAMP,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ quotes table created');

  // 18. QUOTE_ITEMS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS quote_items (
      id SERIAL PRIMARY KEY,
      quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
      
      -- Item details
      product_id UUID REFERENCES products(id),
      configuration_id UUID REFERENCES configurations(id),
      
      -- Description
      description TEXT,
      
      -- Size
      width INTEGER,
      height INTEGER,
      
      -- Quantity and pricing
      quantity INTEGER DEFAULT 1,
      unit_price DECIMAL(10, 2),
      total_price DECIMAL(10, 2),
      
      -- Configuration snapshot
      configuration_data JSONB,
      
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ quote_items table created');

  // 19. ORDERS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number VARCHAR(50) UNIQUE NOT NULL,
      
      -- Customer
      user_id UUID REFERENCES users(id),
      quote_id UUID REFERENCES quotes(id),
      
      -- Customer type
      customer_type VARCHAR(20) DEFAULT 'private',
      
      -- Contact info
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      
      -- Billing address
      billing_company VARCHAR(255),
      billing_first_name VARCHAR(100),
      billing_last_name VARCHAR(100),
      billing_street VARCHAR(255),
      billing_house_number VARCHAR(20),
      billing_postal_code VARCHAR(20),
      billing_city VARCHAR(100),
      billing_country VARCHAR(100) DEFAULT 'Germany',
      billing_vat_number VARCHAR(50),
      
      -- Shipping address
      shipping_company VARCHAR(255),
      shipping_first_name VARCHAR(100),
      shipping_last_name VARCHAR(100),
      shipping_street VARCHAR(255),
      shipping_house_number VARCHAR(20),
      shipping_postal_code VARCHAR(20),
      shipping_city VARCHAR(100),
      shipping_country VARCHAR(100) DEFAULT 'Germany',
      
      -- Totals
      subtotal DECIMAL(10, 2) NOT NULL,
      shipping_cost DECIMAL(10, 2) DEFAULT 0,
      discount_amount DECIMAL(10, 2) DEFAULT 0,
      tax_rate DECIMAL(5, 2) DEFAULT 19.00,
      tax_amount DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      
      -- Margin tracking
      total_cost DECIMAL(10, 2),
      total_profit DECIMAL(10, 2),
      profit_margin DECIMAL(5, 2),
      
      -- Payment
      payment_method VARCHAR(50),
      payment_status VARCHAR(20) DEFAULT 'pending',
      paid_at TIMESTAMP,
      
      -- Order status
      status VARCHAR(20) DEFAULT 'pending',
      
      -- Warehouse / Distribution
      distribution_center VARCHAR(100),
      warehouse_status VARCHAR(20),
      packed_at TIMESTAMP,
      shipped_at TIMESTAMP,
      delivered_at TIMESTAMP,
      tracking_number VARCHAR(100),
      
      -- Notes
      customer_notes TEXT,
      internal_notes TEXT,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ orders table created');

  // 20. ORDER_ITEMS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id),
      configuration_id UUID REFERENCES configurations(id),
      
      -- Item details
      sku VARCHAR(100),
      name VARCHAR(255) NOT NULL,
      description TEXT,
      
      -- Quantity and pricing
      quantity INTEGER DEFAULT 1,
      unit_price DECIMAL(10, 2) NOT NULL,
      unit_cost DECIMAL(10, 2),
      total_price DECIMAL(10, 2) NOT NULL,
      total_cost DECIMAL(10, 2),
      
      -- Configuration snapshot
      configuration_data JSONB,
      
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ order_items table created');

  // 21. INVOICES TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number VARCHAR(50) UNIQUE NOT NULL,
      order_id UUID REFERENCES orders(id),
      
      -- Company details (from CRM settings)
      company_name VARCHAR(255),
      company_address TEXT,
      company_vat_number VARCHAR(50),
      
      -- Customer details
      customer_name VARCHAR(255),
      customer_address TEXT,
      customer_vat_number VARCHAR(50),
      
      -- Amounts
      subtotal DECIMAL(10, 2) NOT NULL,
      tax_rate DECIMAL(5, 2) DEFAULT 19.00,
      tax_amount DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      
      -- Payment
      payment_due_date TIMESTAMP,
      payment_terms TEXT,
      is_paid BOOLEAN DEFAULT FALSE,
      paid_at TIMESTAMP,
      
      -- PDF
      pdf_url VARCHAR(500),
      
      -- Status
      status VARCHAR(20) DEFAULT 'draft',
      sent_at TIMESTAMP,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ invoices table created');

  // 22. LEAD_TRACKING TABLE (CREATOR-only)
  await db.query(`
    CREATE TABLE IF NOT EXISTS lead_tracking (
      id SERIAL PRIMARY KEY,
      
      -- Lead info
      email VARCHAR(255),
      user_id UUID REFERENCES users(id),
      session_id VARCHAR(255),
      
      -- Source
      source VARCHAR(100),
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      referrer VARCHAR(500),
      
      -- Behavior
      page_views INTEGER DEFAULT 0,
      configurations_started INTEGER DEFAULT 0,
      configurations_completed INTEGER DEFAULT 0,
      carts_created INTEGER DEFAULT 0,
      quotes_requested INTEGER DEFAULT 0,
      orders_placed INTEGER DEFAULT 0,
      
      -- Value
      total_order_value DECIMAL(10, 2) DEFAULT 0,
      total_profit DECIMAL(10, 2) DEFAULT 0,
      
      -- Status
      lead_status VARCHAR(20) DEFAULT 'cold',
      lead_score INTEGER DEFAULT 0,
      
      -- First and last activity
      first_visit TIMESTAMP DEFAULT NOW(),
      last_activity TIMESTAMP DEFAULT NOW(),
      
      -- Device info
      device_type VARCHAR(20),
      browser VARCHAR(50),
      os VARCHAR(50),
      country VARCHAR(100),
      city VARCHAR(100),
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ lead_tracking table created');

  // 23. ANALYTICS_EVENTS TABLE
  await db.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      
      -- Event info
      event_name VARCHAR(100) NOT NULL,
      event_category VARCHAR(50),
      
      -- User info
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      session_id VARCHAR(255),
      
      -- Event data
      event_data JSONB DEFAULT '{}',
      
      -- Page info
      page_url VARCHAR(500),
      page_title VARCHAR(255),
      
      -- Referrer
      referrer VARCHAR(500),
      
      -- Device info
      device_type VARCHAR(20),
      browser VARCHAR(50),
      os VARCHAR(50),
      screen_size VARCHAR(20),
      
      -- Location
      ip_address VARCHAR(50),
      country VARCHAR(100),
      city VARCHAR(100),
      
      -- Timing
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);
  console.log('  ✅ analytics_events table created');

  // Create indexes for performance
  await createIndexes();

  console.log('✅ All tables created successfully!');
};

// ===== CREATE INDEXES =====

const createIndexes = async () => {
  console.log('🔧 Creating indexes...');

  // Users indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by)');

  // Sessions indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token_hash)');

  // Products indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_products_manufacturer ON products(manufacturer_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)');

  // Orders indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at)');

  // Quotes indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_quotes_user ON quotes(user_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status)');

  // Analytics indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_name)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at)');

  // Lead tracking indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_leads_email ON lead_tracking(email)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_leads_status ON lead_tracking(lead_status)');

  // Audit logs indexes
  await db.query('CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action)');
  await db.query('CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at)');

  console.log('  ✅ All indexes created');
};

// ===== SEED DEFAULT DATA =====

const seedDefaultData = async () => {
  console.log('🌱 Seeding default data...');

  // Insert default roles
  const roles = [
    { name: 'creator', display_name: 'Creator (Master)', description: 'Platform owner with full control', level: 100, is_system_role: true },
    { name: 'creator_staff', display_name: 'Creator Staff', description: 'Platform administrators', level: 90, is_system_role: true },
    { name: 'ceo', display_name: 'CEO', description: 'Business owner', level: 80, is_system_role: true },
    { name: 'admin', display_name: 'Admin', description: 'Business administrator', level: 70, is_system_role: false },
    { name: 'operations_manager', display_name: 'Operations Manager', description: 'Manages catalog, inventory, orders', level: 60, is_system_role: false },
    { name: 'warehouse_staff', display_name: 'Warehouse Staff', description: 'Orders and inventory', level: 40, is_system_role: false },
    { name: 'sales_staff', display_name: 'Sales Staff', description: 'Quotes and customer service', level: 40, is_system_role: false },
    { name: 'customer', display_name: 'Customer', description: 'Regular customer', level: 10, is_system_role: false }
  ];

  for (const role of roles) {
    await db.query(`
      INSERT INTO roles (name, display_name, description, level, is_system_role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO NOTHING
    `, [role.name, role.display_name, role.description, role.level, role.is_system_role]);
  }
  console.log('  ✅ Roles seeded');

  // Insert default categories
  const categories = [
    { name: 'fenster', display_name_de: 'Fenster', display_name_en: 'Windows', slug: 'fenster', sort_order: 1 },
    { name: 'tueren', display_name_de: 'Türen', display_name_en: 'Doors', slug: 'tueren', sort_order: 2 },
    { name: 'rolllaeden', display_name_de: 'Rollläden', display_name_en: 'Roller Shutters', slug: 'rolllaeden', sort_order: 3 },
    { name: 'zubehoer', display_name_de: 'Zubehör', display_name_en: 'Accessories', slug: 'zubehoer', sort_order: 4 }
  ];

  for (const cat of categories) {
    await db.query(`
      INSERT INTO categories (name, display_name_de, display_name_en, slug, sort_order)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO NOTHING
    `, [cat.name, cat.display_name_de, cat.display_name_en, cat.slug, cat.sort_order]);
  }
  console.log('  ✅ Categories seeded');

  // Insert default manufacturers
  const manufacturers = [
    { name: 'drutex', display_name: 'Drutex', slug: 'drutex', country: 'Poland' },
    { name: 'salamander', display_name: 'Salamander', slug: 'salamander', country: 'Germany' },
    { name: 'schuco', display_name: 'Schüco', slug: 'schuco', country: 'Germany' },
    { name: 'rehau', display_name: 'Rehau', slug: 'rehau', country: 'Germany' }
  ];

  for (const mfr of manufacturers) {
    await db.query(`
      INSERT INTO manufacturers (name, display_name, slug, country)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
    `, [mfr.name, mfr.display_name, mfr.slug, mfr.country]);
  }
  console.log('  ✅ Manufacturers seeded');

  console.log('✅ Default data seeded successfully!');
};

// ===== RUN MIGRATIONS =====

const runMigrations = async () => {
  console.log('');
  console.log('==================================================');
  console.log('🚀 CURIA Database Migrations');
  console.log('==================================================');
  console.log('');

  try {
    // Check database connection
    const connected = await db.checkConnection();
    if (!connected) {
      throw new Error('Cannot connect to database');
    }

    // Create tables
    await createTables();

    // Seed default data
    await seedDefaultData();

    console.log('');
    console.log('==================================================');
    console.log('✅ All migrations completed successfully!');
    console.log('==================================================');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('==================================================');
    console.error('❌ Migration failed:', error.message);
    console.error('==================================================');
    console.error('');
    throw error;
  }
};

// Export functions
module.exports = {
  runMigrations,
  createTables,
  createIndexes,
  seedDefaultData
};

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
