# CRM & BACKEND REQUIREMENTS SPECIFICATION

## FenTuRo System: Comprehensive Requirements

**Created:** 2026-03-03  
**Status:** Requirements Gathering Complete  
**Purpose:** Ensure Backend is CRM-Ready from Day One

---

## 1. BACKEND → CRM INTEGRATION STRATEGY

### Philosophy:
```
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND (For Developers)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • Price calculation engine                                  │   │
│  │  • Product configuration validation                          │   │
│  │  • Order processing logic                                    │   │
│  │  • Data storage & retrieval                                  │   │
│  │  • API endpoints for all operations                          │   │
│  │  • Statistics data collection                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  DIRECT ACCESS: Only developers/technical staff                     │
│  INTERFACE: API only (no admin UI)                                  │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ REST API
┌─────────────────────────────────────────────────────────────────────┐
│                    CRM (For Business Users)                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  • Catalog management UI                                     │   │
│  │  • Pricing & margin controls                                 │   │
│  │  • Order management dashboard                                │   │
│  │  • Invoice generation                                        │   │
│  │  • Analytics & statistics                                    │   │
│  │  • User access management                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ACCESS: Owner, managers, sales, warehouse staff                    │
│  INTERFACE: Full admin dashboard UI                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. STATISTICS & DATA COLLECTION (CRITICAL)

### 2.1 Events to Track

Every user action that generates data for statistics:

```javascript
// FRONTEND EVENTS (Track in Backend)
const TRACKABLE_EVENTS = {
  // Configuration Events
  'config.page_view': 'User opened configurator page',
  'config.option_change': 'User changed any option',
  'config.price_calculation': 'Price was calculated',
  'config.saved': 'Configuration was saved',
  
  // Cart Events
  'cart.add': 'Item added to cart',
  'cart.remove': 'Item removed from cart',
  'cart.update': 'Cart item quantity changed',
  'cart.view': 'Cart page viewed',
  
  // Checkout Events
  'checkout.start': 'Checkout process started',
  'checkout.shipping_entered': 'Shipping info entered',
  'checkout.payment_selected': 'Payment method selected',
  'checkout.payment_completed': 'Payment successful',
  'checkout.abandoned': 'Checkout abandoned (no completion)',
  
  // Order Events
  'order.created': 'Order successfully created',
  'order.confirmed': 'Order confirmed by admin',
  'order.shipped': 'Order shipped',
  'order.delivered': 'Order delivered',
  'order.cancelled': 'Order cancelled'
};
```

### 2.2 Statistics Required in CRM

#### A. Sales Statistics
| Statistic | Description | Update Frequency |
|-----------|-------------|------------------|
| **Best Sellers (Overall)** | Top 10 products by quantity sold | Real-time |
| **Best Sellers (Category)** | Top products per category | Real-time |
| **Revenue (Daily)** | Total revenue per day | Real-time |
| **Revenue (Weekly)** | Total revenue per week | Real-time |
| **Revenue (Monthly)** | Total revenue per month | Real-time |
| **Revenue (Category)** | Revenue per Fenster/Türen/Rollläden | Real-time |
| **Average Order Value** | Total revenue / number of orders | Real-time |
| **Orders Count** | Number of orders | Real-time |

#### B. Margin Statistics
| Statistic | Description | Formula |
|-----------|-------------|---------|
| **Margin per Product** | Profit margin for specific product | (Verkaufspreis - Katalogpreis) / Verkaufspreis × 100 |
| **Margin per Category** | Average margin for category | Sum(Product Margins) / Count(Products) |
| **Margin (Site-wide)** | Overall average margin | Sum(All Margins) / Count(All Products) |
| **Profit (Daily)** | Total profit per day | Sum(Verkaufspreise) - Sum(Katalogpreise) |
| **Discount Impact** | Profit lost to discounts | Original Margin - Actual Margin |

#### C. Conversion Statistics
| Statistic | Description | Formula |
|-----------|-------------|---------|
| **Configurator Views** | Number of times configurator opened | Count(config.page_view) |
| **Add to Cart Rate** | % of viewers who add to cart | cart.add / config.page_view × 100 |
| **Checkout Start Rate** | % of carts that start checkout | checkout.start / cart.add × 100 |
| **Completion Rate** | % of checkouts that complete | order.created / checkout.start × 100 |
| **Overall Conversion** | % of viewers who buy | order.created / config.page_view × 100 |

#### D. Click Statistics
| Statistic | Description |
|-----------|-------------|
| **Most Clicked Products** | Which products get most views |
| **Most Clicked Categories** | Which categories get most views |
| **Popular Options** | Which colors/glass/handles are most selected |
| **Drop-off Points** | Where users abandon configuration |

### 2.3 Database Schema for Statistics

```sql
-- Event tracking table
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,      -- 'config.page_view', 'cart.add', etc.
  user_session VARCHAR(100),             -- Anonymous session ID
  user_id INTEGER REFERENCES users(id),  -- If logged in
  event_data JSONB,                       -- Additional data
  product_id INTEGER,                     -- If product-related
  category VARCHAR(50),                   -- Fenster, Türen, Rollläden
  manufacturer VARCHAR(50),               -- Drutex, Gealan, etc.
  value_eur DECIMAL(10,2),               -- Monetary value if applicable
  created_at TIMESTAMP DEFAULT NOW()
);

-- Aggregated statistics (for fast dashboard loading)
CREATE TABLE statistics_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(50),
  manufacturer VARCHAR(50),
  product_id INTEGER,
  views INTEGER DEFAULT 0,
  add_to_cart INTEGER DEFAULT 0,
  checkouts INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  profit DECIMAL(12,2) DEFAULT 0,
  margin_percentage DECIMAL(5,2) DEFAULT 0,
  UNIQUE(date, category, manufacturer, product_id)
);

-- Index for fast queries
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
CREATE INDEX idx_statistics_date ON statistics_daily(date);
```

---

## 3. CRM ACCESS CONTROL

### 3.1 Role Definitions

```javascript
const CRM_ROLES = {
  OWNER: {
    name: 'Owner',
    description: 'Full access to everything',
    permissions: ['*'],  // All permissions
    sections: ['dashboard', 'catalog', 'pricing', 'orders', 'invoices', 
               'customers', 'distribution', 'analytics', 'users', 'settings']
  },
  
  MANAGER: {
    name: 'Manager',
    description: 'Can manage most aspects, limited settings',
    permissions: [
      'catalog.view', 'catalog.edit',
      'pricing.view', 'pricing.edit',
      'orders.view', 'orders.edit',
      'invoices.view', 'invoices.create',
      'customers.view',
      'analytics.view',
      'distribution.view'
    ],
    sections: ['dashboard', 'catalog', 'pricing', 'orders', 'invoices', 
               'customers', 'distribution', 'analytics']
  },
  
  SALES: {
    name: 'Sales',
    description: 'Order and customer focused',
    permissions: [
      'orders.view', 'orders.edit_status',
      'customers.view', 'customers.create',
      'analytics.view_own'
    ],
    sections: ['dashboard', 'orders', 'customers']
  },
  
  WAREHOUSE: {
    name: 'Warehouse',
    description: 'Distribution center access',
    permissions: [
      'orders.view_shipping',
      'distribution.view', 'distribution.update'
    ],
    sections: ['distribution']
  }
};
```

### 3.2 Section Access Matrix

| Section | Owner | Manager | Sales | Warehouse |
|---------|-------|---------|-------|-----------|
| Dashboard | ✅ Full | ✅ Full | ✅ Limited | ❌ No |
| Catalog | ✅ Full | ✅ Full | ❌ No | ❌ No |
| Pricing & Margins | ✅ Full | ✅ Full | ❌ No | ❌ No |
| Discounts | ✅ Full | ✅ Full | ❌ No | ❌ No |
| Orders | ✅ Full | ✅ Full | ✅ View/Edit Status | ✅ View Shipping |
| Invoices | ✅ Full | ✅ Full | ❌ No | ❌ No |
| Customers | ✅ Full | ✅ View | ✅ View/Create | ❌ No |
| Distribution | ✅ Full | ✅ View | ❌ No | ✅ Full |
| Analytics | ✅ Full | ✅ Full | ✅ Own Stats | ❌ No |
| User Management | ✅ Full | ❌ No | ❌ No | ❌ No |
| Settings | ✅ Full | ❌ No | ❌ No | ❌ No |

### 3.3 Configurable Settings (Owner Only)

- Email addresses for order notifications
- Email addresses for invoice copies
- Default margin percentages
- Site-wide discount (if any)
- Company details for invoices
- Payment method availability
- Shipping options
- VAT settings

---

## 4. ORDER & INVOICE MANAGEMENT

### 4.1 Order Fields

```javascript
const ORDER_SCHEMA = {
  // Basic Info
  order_id: 'ORD-2026-0001',
  created_at: '2026-03-03T14:30:00Z',
  status: 'pending',  // pending, confirmed, processing, shipped, delivered, cancelled
  
  // Customer Info
  customer: {
    id: 123,
    email: 'customer@example.com',
    name: 'Max Mustermann',
    phone: '+49 123 456 789',
    is_guest: false
  },
  
  // Shipping
  shipping: {
    address: {
      street: 'Musterstraße 123',
      city: 'Berlin',
      postal_code: '10115',
      country: 'DE'
    },
    method: 'standard',
    tracking_number: null,
    shipped_at: null,
    delivered_at: null
  },
  
  // Billing
  billing: {
    address: { /* same structure */ },
    vat_id: null,
    is_business: false
  },
  
  // Items
  items: [
    {
      product_type: 'Fenster',
      manufacturer: 'Drutex',
      profile: 'Iglo 5 Classic',
      configuration: { /* full config object */ },
      quantity: 2,
      unit_price: 180.55,
      subtotal: 361.10,
      // For statistics
      catalog_price: 120.00,
      margin_percentage: 50,
      profit: 60.55
    }
  ],
  
  // Totals
  subtotal: 361.10,
  shipping_cost: 29.00,
  vat_amount: 74.12,
  total: 464.22,
  
  // Internal
  notes_internal: 'Customer requested delivery before Easter',
  notes_customer: '',
  assigned_to: null,  // Sales rep if assigned
  
  // Distribution Center
  distribution: {
    assigned_at: null,
    confirmed_at: null,
    packed_at: null,
    ready_for_shipping: false
  },
  
  // Invoice
  invoice: {
    number: 'INV-2026-0001',
    created_at: null,
    sent_at: null,
    paid_at: null,
    payment_method: 'invoice',
    payment_status: 'pending'
  }
};
```

### 4.2 Order Workflow

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. ORDER CREATED                                                     │
│  └─► Customer completes checkout                                      │
│  └─► Order saved to database                                          │
│  └─► Email sent to customer (confirmation)                            │
│  └─► Email sent to owner (new order notification)                     │
│  └─► Statistics: order.created event logged                           │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  2. ORDER REVIEWED (CRM)                                              │
│  └─► Admin reviews order in CRM                                       │
│  └─► Verifies payment (if not prepaid)                                │
│  └─► Can edit order if needed                                         │
│  └─► Status: pending → confirmed                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  3. SENT TO DISTRIBUTION CENTER                                       │
│  └─► Order appears in distribution section                            │
│  └─► Warehouse staff sees order details                               │
│  └─► Status: confirmed → processing                                   │
│  └─► Email to customer: "Being prepared"                              │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  4. PREPARED & PACKED                                                 │
│  └─► Warehouse marks items as packed                                  │
│  └─► Status: processing → ready_to_ship                               │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  5. SHIPPED                                                           │
│  └─► Tracking number added                                            │
│  └─► Status: ready_to_ship → shipped                                  │
│  └─► Email to customer with tracking                                  │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  6. DELIVERED                                                         │
│  └─► Carrier confirms delivery                                        │
│  └─► Status: shipped → delivered                                      │
│  └─► Statistics: order completed                                      │
└──────────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│  7. INVOICE & PAYMENT                                                 │
│  └─► Invoice generated (manual or automatic)                         │
│  └─► Invoice sent to customer                                         │
│  └─► Payment tracked                                                  │
│  └─► Statistics: revenue recorded                                     │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.3 Invoice Requirements

```javascript
const INVOICE_FIELDS = {
  // Header
  invoice_number: 'INV-2026-0001',
  invoice_date: '2026-03-03',
  due_date: '2026-03-17',  // 14 days
  
  // Seller (Your Company)
  seller: {
    company_name: '_______________',  // NEED FROM YOU
    address: '_______________',        // NEED FROM YOU
    city_postal: '_______________',    // NEED FROM YOU
    country: 'Deutschland',
    vat_id: 'DE___________',          // NEED FROM YOU
    tax_number: '_______________',     // NEED FROM YOU
    email: '_______________',          // NEED FROM YOU
    phone: '_______________',          // NEED FROM YOU
    bank_name: '_______________',      // NEED FROM YOU
    iban: '_______________',           // NEED FROM YOU
    bic: '_______________'             // NEED FROM YOU
  },
  
  // Buyer
  buyer: {
    name: 'Customer Name',
    company: null,  // If B2B
    address: '...',
    vat_id: null    // If B2B
  },
  
  // Line Items
  items: [
    {
      position: 1,
      description: 'Drutex Iglo 5 Classic Fenster 1000x1000mm',
      quantity: 2,
      unit: 'Stück',
      unit_price_net: 151.72,
      vat_rate: 19,
      vat_amount: 28.83,
      total_gross: 361.10
    }
  ],
  
  // Totals
  subtotal_net: 303.44,
  vat_19: 57.66,
  shipping_net: 24.37,
  shipping_vat: 4.63,
  total_gross: 390.10,
  
  // Footer
  payment_terms: 'Zahlbar innerhalb von 14 Tagen ohne Abzug.',
  notes: 'Vielen Dank für Ihren Auftrag!'
};
```

---

## 5. MARGIN & PROFIT CALCULATIONS (CRITICAL)

### 5.1 Core Formula

```javascript
// The COMPLETE pricing formula with margin tracking

function calculatePrice(config) {
  // 1. Get catalog price (what you pay)
  const katalogpreis = getCatalogPrice(config);
  
  // 2. Add surcharges
  const surcharges = calculateSurcharges(config);
  const basispreis = katalogpreis + surcharges;
  
  // 3. Apply margin (what you want to earn)
  const margin = getMargin(config);  // e.g., 1.50 for 50%
  const verkaufspreisBrutto = basispreis * margin;
  
  // 4. Apply discount (if any)
  const discount = getDiscount(config);  // e.g., 0.10 for 10%
  const endpreis = verkaufspreisBrutto * (1 - discount);
  
  // 5. Calculate profit and statistics
  const profit = endpreis - katalogpreis;
  const effectiveMargin = profit / endpreis * 100;
  
  return {
    katalogpreis,
    surcharges,
    basispreis,
    margin_multiplier: margin,
    margin_percentage: (margin - 1) * 100,
    verkaufspreis_vor_rabatt: verkaufspreisBrutto,
    discount_percentage: discount * 100,
    discount_amount: verkaufspreisBrutto * discount,
    endpreis,
    profit,
    effective_margin_percentage: effectiveMargin
  };
}
```

### 5.2 Example Calculation

```
PRODUCT: Drutex Fenster 1000x1000mm

Step 1 - Katalogpreis (Your Cost):       100.00 EUR
Step 2 - Surcharges (Color, Glass, etc.): 20.00 EUR
Step 3 - Basispreis:                     120.00 EUR
Step 4 - Margin (50%):                   × 1.50
Step 5 - Verkaufspreis vor Rabatt:       180.00 EUR
Step 6 - Discount (10%):                 - 18.00 EUR
Step 7 - Endpreis:                       162.00 EUR

PROFIT ANALYSIS:
├── Cost (Katalogpreis):      100.00 EUR
├── Selling Price:            162.00 EUR
├── Profit:                    62.00 EUR
├── Effective Margin:          38.27%
└── Lost to Discount:          18.00 EUR (10% of 180)

COMPARISON:
├── Without Discount: 80.00 EUR profit (44.44% margin)
├── With 10% Discount: 62.00 EUR profit (38.27% margin)
└── Margin Lost: 6.17 percentage points
```

### 5.3 CRM Dashboard: Margin Visibility

For each product/order, show:
- **Original Margin %** - What was set in pricing
- **Effective Margin %** - After discounts applied
- **Profit Amount (EUR)** - Actual money earned
- **Discount Impact** - How much margin was lost to discount
- **"Can I Lower?"** - Indicator showing room to lower price

---

## 6. CRM SECTIONS SPECIFICATION

### Section 1: Dashboard
- Overview statistics (today/week/month)
- Recent orders
- Quick actions
- Alerts (low inventory, pending orders)

### Section 2: Catalog Management
- View all products
- Add/edit/remove products
- Import/export catalog (CSV)
- Product categories

### Section 3: Pricing & Margins
- Global margin setting
- Category margins (Fenster, Türen, etc.)
- Individual product margins
- Margin calculator tool

### Section 4: Discounts
- Create discounts (individual/category/site-wide)
- Time-limited promotions
- Discount codes
- Discount analytics

### Section 5: Orders
- Order list with filters
- Order detail view
- Status updates
- Bulk actions

### Section 6: Invoices
- Invoice list
- Generate invoice
- Send invoice
- Payment tracking

### Section 7: Distribution Center
- Orders ready to process
- Packing status
- Shipping updates
- Inventory (if tracked)

### Section 8: Customers
- Customer list
- Customer details
- Order history per customer
- Customer communication

### Section 9: Analytics & Reports
- Sales reports
- Margin reports
- Product performance
- Traffic analytics
- Export to Excel/PDF

### Section 10: User Management
- Create/edit users
- Assign roles
- Permission management
- Activity logs

### Section 11: Settings
- Company details
- Email templates
- Notification preferences
- System configuration

---

## 7. VERIFICATION CHECKLIST

### Backend Must Support:
- [ ] Event tracking for all user actions
- [ ] Statistics aggregation
- [ ] Margin calculation in every price response
- [ ] Role-based API access
- [ ] Order workflow state machine
- [ ] Invoice data generation

### CRM Must Display:
- [ ] All statistics mentioned above
- [ ] Real-time order updates
- [ ] Margin analysis for every product
- [ ] User permission management
- [ ] Configurable email settings

### Data Must Flow:
- [ ] Frontend → Backend: All events
- [ ] Backend → CRM: All statistics
- [ ] CRM → Backend: All admin actions
- [ ] Backend → Email: All notifications

---

## SUMMARY

This document defines:
1. **How Backend prepares for CRM integration**
2. **What statistics to collect**
3. **Access control structure**
4. **Order workflow**
5. **Invoice requirements**
6. **Margin calculation precision**
7. **CRM sections needed**

All requirements are designed to ensure the backend is **CRM-ready from day one** with no retrofitting needed.

---

*This document should be referenced during all phases of development.*
