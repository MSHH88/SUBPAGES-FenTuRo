# DETAILED SYSTEM DEVELOPMENT PLAN
## FenTuRo Three-Tier Architecture: Backend → Frontend → CRM

---

## TABLE OF CONTENTS
1. [System Overview](#1-system-overview)
2. [Questions I Need Answered](#2-questions-i-need-answered)
3. [Data Inventory - What We Have](#3-data-inventory---what-we-have)
4. [Backend Development Plan](#4-backend-development-plan)
5. [Frontend Development Plan](#5-frontend-development-plan)
6. [CRM Development Plan](#6-crm-development-plan)
7. [Risk Assessment](#7-risk-assessment)

---

## 1. SYSTEM OVERVIEW

### Development Order (Confirmed):
```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: BACKEND (Current Focus)                                   │
│  Build the calculation engine, pricing system, and order API        │
│  Timeline: ~10 weeks                                                │
│  Scope: All products EXCEPT PSK and Rolladen (for now)              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: FRONTEND DESIGN                                           │
│  Connect new backend, apply final design to configurator            │
│  Timeline: ~4 weeks                                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: CRM (The Office)                                          │
│  Admin dashboard, catalog management, orders, analytics             │
│  Timeline: ~6 weeks                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Three-Tier Architecture Vision:
```
┌─────────────────────────────────────────────────────────────────────┐
│                      THE FRONTEND (The UI)                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  • Customer-facing configurator                              │    │
│  │  • Product selection interface                               │    │
│  │  • Real-time price display                                   │    │
│  │  • Cart and checkout                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ REST API
┌─────────────────────────────────────────────────────────────────────┐
│                    THE ENGINE (Custom Backend)                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  • CATALOG SYSTEM: Import and manage product catalog         │    │
│  │  • PRICING ENGINE: Calculate prices with margins             │    │
│  │  • DISCOUNT ENGINE: Apply individual/category/site discounts │    │
│  │  • CONFIGURATOR: Validate options, calculate surcharges      │    │
│  │  • ORDER SYSTEM: Cart, order creation, status tracking       │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓↑ REST API
┌─────────────────────────────────────────────────────────────────────┐
│                      THE OFFICE (Custom CRM)                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  • CATALOG MANAGEMENT: Add/edit/remove products              │    │
│  │  • PRICING CONTROLS: Set margins, create discounts           │    │
│  │  • ORDER MANAGEMENT: View, process, update orders            │    │
│  │  • INVOICE AUTOMATION: Generate and send invoices            │    │
│  │  • ANALYTICS: Traffic, revenue, margins, reports             │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Pricing Formula (NO Hardcoded Discount):
```
Verkaufspreis = (Katalogpreis + Aufschläge) × Margin × (1 - Rabatt)

Where:
├── Katalogpreis: From YOUR catalog (Einkaufspreis/purchase price)
├── Aufschläge: Sum of all surcharges from configuration
├── Margin: Admin-configurable (e.g., 1.70 for 70% markup)
└── Rabatt: Admin-configurable discount (0.00 by default = no discount)
```

---

## 2. QUESTIONS I NEED ANSWERED

Before starting development, I need answers to these questions:

### Technical Decisions:

| # | Question | Options | Impact |
|---|----------|---------|--------|
| 1 | **Catalog Format** | CSV / Excel / JSON | How I design the import system |
| 2 | **Default Margin** | ___% (e.g., 70%) | Initial pricing configuration |
| 3 | **Hosting Platform** | AWS / GCP / VPS / Other | Architecture and deployment |
| 4 | **Tech Stack** | Node.js / Python / Other | Backend language choice |
| 5 | **Database** | PostgreSQL / MySQL / MongoDB | Data structure and queries |

### Business Logic:

| # | Question | Options | Impact |
|---|----------|---------|--------|
| 6 | **Order Flow** | What happens after "Add to Cart"? | Workflow design |
| 7 | **Payment** | Integrate (Stripe/PayPal) / Manual invoicing | Payment processing |
| 8 | **Language** | German only / Multi-language | Text handling and i18n |
| 9 | **Email Notifications** | Automated / Manual | Email integration |
| 10 | **Customer Accounts** | Required / Guest checkout allowed | Authentication scope |
| 11 | **Inventory Tracking** | Yes / No | Stock management feature |

### My Recommendations (If You'd Like Guidance):

| Question | My Recommendation | Reason |
|----------|-------------------|--------|
| Tech Stack | **Node.js (Express)** | Fast, good for real-time price updates, large ecosystem |
| Database | **PostgreSQL** | Reliable, good for complex pricing queries, scales well |
| Catalog Format | **CSV** | Easy for you to edit in Excel, simple to import |
| Hosting | **AWS or VPS** | Professional, scalable, cost-effective |

---

## 3. DATA INVENTORY - WHAT WE HAVE

### ✅ COMPLETE DATA (Ready for Backend):

| File | Content | Status |
|------|---------|--------|
| `drutex_kunststoff_base_prices.csv` | 140+ base price datapoints | ✅ Complete |
| `drutex_kunststoff_surcharges.json` | 200+ surcharge values | ✅ Complete |
| `drutex_kunststoff_options.json` | 85 configuration properties | ✅ Complete |
| `api_endpoints.json` | 6 API endpoints documented | ✅ Complete |
| `postmessage_protocol.json` | Frontend-Backend communication | ✅ Complete |
| `comparison_results.json` | 36 products analyzed | ✅ Complete |
| `Gealan_profil_Multiplikator.json` | Profile pricing multiplier | ✅ Complete |
| `Aluplast_profil_Multiplikator.json` | Profile pricing multiplier | ✅ Complete |
| `Salamander_profil_Multiplikator.json` | Profile pricing multiplier | ✅ Complete |
| `Veka_profil_Multiplikator.json` | Profile pricing multiplier | ✅ Complete |
| `Schüco_profil_Multiplikator.json` | Profile pricing multiplier | ✅ Complete |
| `drutex_kunststoff_farben.csv` | 80+ color options | ✅ Complete |
| `drutex_kunststoff_glas.json` | All glass types with U-values | ✅ Complete |
| `drutex_kunststoff_griffe.json` | 7 handle types | ✅ Complete |
| `Maße_Price_Changes_Drutex.csv` | Dimension-based price changes | ✅ Complete |

### ⚠️ COMING LATER (Acknowledged):

| Data | Status | Impact |
|------|--------|--------|
| PSK Doors base prices | You will provide | Can add later as new module |
| Rolladen full data | Different API pattern | Will need separate module |

### ❓ STILL NEEDED:

| Data | When Needed | From You |
|------|-------------|----------|
| Your KATALOG | Before launch | Product catalog with Einkaufspreise |
| Base prices for other manufacturers | For full support | Or calculate from Drutex + multipliers |
| Balkontüren base prices | For Balkontüren support | Similar to Fenster? |
| Haustüren base prices | For Haustüren support | May need separate collection |

---

## 4. BACKEND DEVELOPMENT PLAN

### Phase 1: Foundation (Week 1-2)

#### Week 1: Database & Project Setup
```
Day 1-2: Project Initialization
├── Set up project structure
├── Configure development environment
├── Set up version control (GitHub)
└── Install dependencies

Day 3-4: Database Design
├── Design schema for:
│   ├── catalog_products (your KATALOG)
│   ├── manufacturers
│   ├── profiles
│   ├── surcharges
│   ├── colors
│   ├── glass_types
│   ├── handles
│   ├── margins (global and per-category)
│   ├── discounts (individual/category/site-wide)
│   ├── orders
│   └── order_items
└── Create database migrations

Day 5: Catalog Import System
├── Build CSV/Excel/JSON importer
├── Catalog validation rules
└── Initial data seeding
```

#### Week 2: Core API Structure
```
Day 1-2: API Framework
├── Set up Express/FastAPI
├── Configure middleware
├── Error handling
└── Logging

Day 3-4: Authentication Foundation
├── Admin authentication for CRM
├── API key system for frontend
└── Session management

Day 5: Basic CRUD Endpoints
├── Products API
├── Manufacturers API
└── Categories API
```

### Phase 2: Pricing Engine (Week 3-4)

#### Week 3: Core Pricing
```
Day 1-2: Base Price Calculator
├── Catalog price lookup
├── Dimension-based pricing (from Maße_Price_Changes)
├── Profile multiplier application
└── Manufacturer-specific pricing

Day 3-4: Margin System
├── Global margin setting
├── Category-specific margins
├── Product-specific margin overrides
└── Margin calculation endpoint

Day 5: Testing
├── Unit tests for calculations
├── Compare results with reference data
└── Edge case handling
```

#### Week 4: Surcharges & Discounts
```
Day 1-2: Surcharge Engine
├── Load surcharges from database
├── Color surcharges (Farbzuschlag)
├── Glass surcharges (Glaszuschlag)
├── Handle surcharges
├── Hardware surcharges
└── Surcharge calculation endpoint

Day 3-4: Discount Engine (Ready but Empty)
├── Discount types:
│   ├── Individual product discount
│   ├── Category discount (all windows, all doors)
│   ├── Site-wide discount
│   └── Time-limited promotions
├── Discount priority rules
└── Discount application endpoint
└── NOTE: All discounts = 0% by default

Day 5: Integration Testing
├── Full price calculation tests
├── Verify: Katalogpreis + Aufschläge × Margin × (1 - Rabatt)
└── Performance testing
```

### Phase 3: Configurator Logic (Week 5-6)

#### Week 5: Configuration API
```
Day 1-2: Window Configuration
├── Dimension validation (min/max/step)
├── Profile selection
├── Opening type selection
└── Configuration state management

Day 3-4: Options API
├── Color options (load from drutex_kunststoff_farben.csv)
├── Glass options (load from drutex_kunststoff_glas.json)
├── Handle options (load from drutex_kunststoff_griffe.json)
└── Hardware/accessories options

Day 5: Option Dependencies
├── Which options work with which profiles
├── Color availability per profile
├── Glass compatibility rules
└── Validation error messages
```

#### Week 6: Real-Time Pricing
```
Day 1-2: Live Price Endpoint
├── POST /api/v1/configure/price
├── Accept configuration object
├── Return detailed price breakdown
└── Support for "draft" configurations

Day 3-4: Summary Generation
├── Generate "Mein Fenster" summary text
├── Format prices in German locale (1.234,56 €)
├── Return all selected options in readable format
└── Image URL generation (if applicable)

Day 5: Frontend Integration Testing
├── Test with sample frontend
├── Verify response format matches frontend needs
└── Performance optimization
```

### Phase 4: Product Modules (Week 7-8)

#### Week 7: All Kunststoff Manufacturers
```
Day 1-2: Drutex Kunststoff
├── Verify all calculations work
├── Load all options from data files
└── End-to-end testing

Day 3: Gealan Kunststoff
├── Apply Gealan multiplier
├── Verify profile-specific options
└── Testing

Day 4: Aluplast & Salamander
├── Apply respective multipliers
├── Profile configurations
└── Testing

Day 5: Veka & Schüco
├── Apply respective multipliers
├── Profile configurations
└── Testing
```

#### Week 8: Balkontüren & Haustüren
```
Day 1-2: Balkontüren
├── Similar structure to Fenster
├── Different dimension constraints
├── Balkontüren-specific options
└── Testing

Day 3-4: Haustüren
├── May need different base prices
├── Haustüren-specific options
├── HAVEN Exclusive integration?
└── Testing

Day 5: Product Router
├── Unified /api/v1/products/{type}/configure endpoint
├── Route to correct product module
└── Integration testing
```

### Phase 5: Order System (Week 9-10)

#### Week 9: Cart & Order Management
```
Day 1-2: Cart System
├── Add to cart endpoint
├── Cart item storage
├── Cart total calculation
├── Cart session management

Day 3-4: Order Creation
├── Checkout endpoint
├── Order validation
├── Order number generation
├── Order storage in database

Day 5: Order Status
├── Order status tracking
├── Status update endpoints
└── Order history
```

#### Week 10: CRM-Ready Features
```
Day 1-2: Admin Order API
├── List all orders
├── Filter/search orders
├── Order detail view
└── Update order status

Day 3-4: Order Data Export
├── Export to CSV/JSON
├── Invoice data preparation
└── Analytics data hooks

Day 5: Final Integration
├── Full end-to-end testing
├── Documentation
└── Deployment preparation
```

---

## 5. FRONTEND DEVELOPMENT PLAN

### Timeline: ~4 Weeks (After Backend Complete)

#### Week 1: API Connection
```
├── Replace iframe with native components
├── Connect to new Backend API
├── Implement real-time price updates
└── Handle API responses
```

#### Week 2: Design Implementation
```
├── Apply final UI design
├── Glassmorphism buttons (from header-nav-preview-v2)
├── Color scheme implementation
├── Responsive design
```

#### Week 3: Configurator UI
```
├── Product selection interface
├── Options selection (colors, glass, handles)
├── Real-time price display
├── Summary panel
```

#### Week 4: Cart & Checkout
```
├── Add to cart functionality
├── Cart page
├── Checkout flow
├── Order confirmation
```

---

## 6. CRM DEVELOPMENT PLAN

### Timeline: ~6 Weeks (After Frontend Complete)

#### Week 1-2: Admin Dashboard
```
├── Admin login system
├── Dashboard overview
├── Navigation structure
└── User management
```

#### Week 3: Catalog Management
```
├── View all products
├── Add new products
├── Edit existing products
├── Remove products
├── Import/export catalog
```

#### Week 4: Pricing Controls
```
├── Set global margins
├── Category-specific margins
├── Create discounts
├── Time-limited promotions
├── Preview price changes
```

#### Week 5: Order Management
```
├── Order list view
├── Order detail view
├── Update order status
├── Customer communication
├── Invoice generation
```

#### Week 6: Analytics & Reports
```
├── Revenue dashboard
├── Margin tracking
├── Traffic analytics
├── Order reports
├── Export functionality
```

---

## 7. RISK ASSESSMENT

### Low Risk:
- ✅ Calculation logic is well-documented
- ✅ API patterns are clear
- ✅ Reference data is complete for Drutex Kunststoff

### Medium Risk:
- ⚠️ Other manufacturers may need base price collection
- ⚠️ Balkontüren/Haustüren may have unique requirements
- ⚠️ Performance with many products

### High Risk (But Manageable):
- 🔴 PSK/Rolladen not included in initial scope (acknowledged)
- 🔴 Your KATALOG format unknown (need answer to Question 1)

---

## NEXT STEPS

**Once you answer the 11 questions, I can:**

1. Create the exact database schema
2. Set up the project structure
3. Begin Phase 1: Foundation development

**Please provide:**
1. Answers to the 11 questions
2. Confirm the development order (Backend → Frontend → CRM)
3. Any additional requirements or concerns

---

*This document will be updated as we progress through each phase.*
