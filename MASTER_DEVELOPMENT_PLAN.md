# MASTER DEVELOPMENT PLAN
## FenTuRo Complete System - Step-by-Step Chronological Guide

**Created:** 2026-03-03
**Status:** FINAL - Ready for Development

---

## TABLE OF CONTENTS
1. [Your Questions Answered](#1-your-questions-answered)
2. [What We Have - Complete Inventory](#2-what-we-have---complete-inventory)
3. [What We Still Need](#3-what-we-still-need)
4. [Phase Plan - Detailed Chronological](#4-phase-plan---detailed-chronological)
5. [Backend Access - Login System](#5-backend-access---login-system)
6. [Gap Check - Final Review](#6-gap-check---final-review)

---

## 1. YOUR QUESTIONS ANSWERED

### Q1: When do I need the Google Account for GA4?

**Answer:** You need the CURIA Google Account in **Phase 5 (Integration)**, approximately Week 14-16.

**Timeline:**
- **Now - Week 13:** No Google account needed. We build everything without it.
- **Week 14-16:** Before CRM launch, you create the CURIA Google account
- **Setup takes:** ~30 minutes

**What you'll need:**
1. Create Google Account: `curia@gmail.com` (or similar)
2. Go to analytics.google.com
3. Create property for the website
4. Get tracking ID (format: G-XXXXXXXXXX)
5. Provide tracking ID to us

**We will:**
- Add tracking code to website
- Configure events (page views, purchases, etc.)
- Integrate dashboard into CRM

### Q2: Email Tool for Lead Generator

**Answer:** Noted. You'll recommend email tools but not handle messaging. We will only collect leads.

**What we'll implement:**
- Collect: Email, name, phone, company
- Store: In database
- Export: CSV, Excel, or direct email list
- You or CEO decide which email marketing tool to use

**Popular options you can recommend:**
- Mailchimp (free up to 500 contacts)
- SendGrid
- Brevo (formerly Sendinblue)
- CleverReach (German company, GDPR native)

---

## 2. WHAT WE HAVE - COMPLETE INVENTORY

### ✅ DOCUMENTS READY (12 Planning Documents)

| Document | Purpose | Status |
|----------|---------|--------|
| `BACKEND_DEVELOPMENT_PLAN.md` | Technical backend specs | ✅ Complete |
| `DETAILED_SYSTEM_PLAN.md` | Full system architecture | ✅ Complete |
| `FINAL_FEATURE_DECISIONS.md` | All feature decisions | ✅ Complete |
| `CRM_AND_BACKEND_REQUIREMENTS.md` | CRM specs & role system | ✅ Complete |
| `CLARIFICATIONS_AND_UPDATED_PLAN.md` | Updated after Q&A | ✅ Complete |
| `COMPLETE_ANSWERS_AND_EXPLANATIONS.md` | All questions answered | ✅ Complete |
| `GAP_ANALYSIS_AND_MISSING_FEATURES.md` | Gap review | ✅ Complete |
| `INDUSTRY_RESEARCH_AND_ANSWERS.md` | Industry research | ✅ Complete |
| `DESIGN_SYSTEM_COLOR_SCHEME.md` | Visual design specs | ✅ Complete |
| `DATA_COLLECTION_GUIDE.md` | How to collect data | ✅ Complete |
| `MASTER_DATA_COLLECTION_CHECKLIST.md` | Data checklist | ✅ Complete |
| `Backend_Setup_Konfigurator.md` | Konfigurator setup | ✅ Complete |

### ✅ DATA FILES READY (Backend Branch - 17 Files)

| File | Content | Status |
|------|---------|--------|
| `drutex_kunststoff_base_prices.csv` | 140+ base price datapoints | ✅ Ready |
| `drutex_kunststoff_surcharges.json` | 200+ surcharge values | ✅ Ready |
| `drutex_kunststoff_options.json` | 85 configuration properties | ✅ Ready |
| `drutex_kunststoff_rules.js` | Business logic rules | ✅ Ready |
| `api_endpoints.json` | 6 API endpoints documented | ✅ Ready |
| `postmessage_protocol.json` | Frontend-Backend communication | ✅ Ready |
| `comparison_results.json` | 36 products analyzed | ✅ Ready |
| `Gealan_profil_Multiplikator.json` | Profile multipliers | ✅ Ready |
| `Aluplast_profil_Multiplikator.json` | Profile multipliers | ✅ Ready |
| `Salamander_profil_Multiplikator.json` | Profile multipliers | ✅ Ready |
| `Veka_profil_Multiplikator.json` | Profile multipliers | ✅ Ready |
| `Schüco_profil_Multiplikator.json` | Profile multipliers | ✅ Ready |
| `drutex_kunststoff_farben.csv` | 80+ color options | ✅ Ready |
| `drutex_kunststoff_glas.json` | All glass types | ✅ Ready |
| `drutex_kunststoff_griffe.json` | 7 handle types | ✅ Ready |
| `haustuer_calculations.json` | Haustür pricing | ✅ Ready |
| `rollladen_calculations.json` | Rollladen pricing | ✅ Ready |

### ✅ FRONTEND FILES READY (4 Files)

| File | Content | Status |
|------|---------|--------|
| `header-nav-preview-v2.html` | Header with glassmorphism | ✅ Ready |
| `homepage-v1.html` | Homepage design | ✅ Ready |
| `Fenster.Konfigurator.Kunstoff.Drutex.html` | Configurator template | ✅ Ready |
| `Kunststofffenster.Konfigurator.Drutex.html` | Configurator variant | ✅ Ready |

---

## 3. WHAT WE STILL NEED

### From You (CREATOR) - Not Needed Now

| Item | When Needed | Priority |
|------|-------------|----------|
| YOUR KATALOG (CSV with Einkaufspreise) | Before launch (Week 16) | HIGH - but later |
| CURIA Google Account | Week 14-16 | MEDIUM - can wait |
| CEO Company Details (Invoice) | Before launch (Week 16) | MEDIUM - can wait |
| CEO Support Contact Info | Before launch (Week 16) | LOW - can wait |
| Shipping Rate Info | Before launch (Week 16) | MEDIUM - can wait |
| Quote Response SLA | Before launch (Week 16) | LOW - can wait |

### From CEO - Not Needed Now

| Item | When Needed | Priority |
|------|-------------|----------|
| Legal Entity (Company name, VAT) | Before launch | MEDIUM |
| Shipping Partner Info | Before launch | MEDIUM |
| Distribution Center Workflow | Before launch | LOW |

### ⚠️ IMPORTANT: WE CAN START NOW

**All missing data is for LATER PHASES.** We have everything needed to:
1. Build the pricing engine
2. Build the configurator backend
3. Build the order system
4. Build the CRM structure

**The KATALOG with your Einkaufspreise is only needed when:**
- You want to set YOUR margins (not the 40% from Drutex)
- You want to launch to real customers

**Until then, we use Drutex prices as reference for testing.**

---

## 4. PHASE PLAN - DETAILED CHRONOLOGICAL

### Overview: 24 Weeks Total

```
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 1: BACKEND FOUNDATION                    Weeks 1-4          │
│  ─────────────────────────────────────────────────────────────────  │
│  Project setup, database, core pricing engine                       │
│  NO EXTERNAL DATA NEEDED                                            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 2: PRICING & CONFIGURATOR                Weeks 5-8          │
│  ─────────────────────────────────────────────────────────────────  │
│  Full pricing engine, all manufacturers, configurator logic         │
│  NO EXTERNAL DATA NEEDED                                            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3: ORDER SYSTEM                          Weeks 9-10         │
│  ─────────────────────────────────────────────────────────────────  │
│  Cart, checkout, order management                                   │
│  NO EXTERNAL DATA NEEDED                                            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 3.5: FRONTEND DESIGN (NEW)               Weeks 11-14        │
│  ─────────────────────────────────────────────────────────────────  │
│  Component-by-component design (Step indicator, options panel,      │
│  summary, cart, quote form, checkout) - See LAYOUT_REFERENCE.md     │
│  NO EXTERNAL DATA NEEDED                                            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 4: CRM FOUNDATION                        Weeks 15-18        │
│  ─────────────────────────────────────────────────────────────────  │
│  Admin dashboard, role system, catalog management                   │
│  NEED: GA4 Account (Week 18)                                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 5: FRONTEND & INTEGRATION                Weeks 19-22        │
│  ─────────────────────────────────────────────────────────────────  │
│  Connect frontend to backend, apply design, test                    │
│  NEED: KATALOG, CEO Details (Week 20)                               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  PHASE 6: TESTING & LAUNCH                      Weeks 23-24        │
│  ─────────────────────────────────────────────────────────────────  │
│  Full testing, documentation, go-live                               │
│  ALL DATA NEEDED                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

### PHASE 1: BACKEND FOUNDATION (Weeks 1-4)

#### Week 1: Project Setup
| Day | Task | Details |
|-----|------|---------|
| 1 | Create project | Node.js + Express |
| 2 | Database setup | PostgreSQL |
| 3 | Import data files | All JSON/CSV from Backend branch |
| 4 | Basic API structure | Routes, middleware, error handling |
| 5 | Authentication foundation | JWT setup, session management |

**Deliverable:** Running server with database connected

#### Week 2: Database Schema
| Day | Task | Details |
|-----|------|---------|
| 1 | Products table | manufacturers, profiles |
| 2 | Pricing tables | base_prices, surcharges |
| 3 | Configuration tables | options, colors, glass, handles |
| 4 | User tables | users, roles, permissions |
| 5 | Order tables | orders, order_items, cart |

**Deliverable:** Complete database schema with migrations

#### Week 3: Import System
| Day | Task | Details |
|-----|------|---------|
| 1 | CSV importer | For base prices, colors |
| 2 | JSON importer | For options, surcharges |
| 3 | Catalog importer | For YOUR KATALOG (when ready) |
| 4 | Data validation | Ensure data integrity |
| 5 | Seed database | Import all Drutex data |

**Deliverable:** All data imported and verified

#### Week 4: Core API
| Day | Task | Details |
|-----|------|---------|
| 1 | Products API | GET /products, GET /products/:id |
| 2 | Manufacturers API | GET /manufacturers |
| 3 | Options API | GET /options (colors, glass, etc.) |
| 4 | Authentication API | POST /login, POST /register |
| 5 | Testing | Unit tests for all endpoints |

**Deliverable:** Working REST API

---

### PHASE 2: PRICING & CONFIGURATOR (Weeks 5-8)

#### Week 5: Base Pricing Engine
| Day | Task | Details |
|-----|------|---------|
| 1 | Base price lookup | From matrix (width × height) |
| 2 | Profile multipliers | Apply 1.0x, 1.26x, etc. |
| 3 | Margin system | Global margin setting |
| 4 | Category margins | Per-product-type margins |
| 5 | Testing | Verify calculations |

**Deliverable:** Base price calculation working

#### Week 6: Surcharge Engine
| Day | Task | Details |
|-----|------|---------|
| 1 | Color surcharges | Exterior + Interior |
| 2 | Glass surcharges | 2-fach, 3-fach, etc. |
| 3 | Handle surcharges | All handle types |
| 4 | Hardware surcharges | Security, V-Perfect, etc. |
| 5 | Combined calculation | All surcharges together |

**Deliverable:** Full surcharge calculation working

#### Week 7: Discount Engine (Empty but Ready)
| Day | Task | Details |
|-----|------|---------|
| 1 | Discount types | Individual, category, site-wide |
| 2 | Discount application | Apply to prices |
| 3 | Time-limited discounts | Start/end dates |
| 4 | Admin discount API | Create, update, delete |
| 5 | Testing | Verify 0% default |

**Deliverable:** Discount system ready (all set to 0%)

#### Week 8: All Manufacturers
| Day | Task | Details |
|-----|------|---------|
| 1 | Gealan support | Apply multipliers |
| 2 | Aluplast support | Apply multipliers |
| 3 | Salamander support | Apply multipliers |
| 4 | Veka support | Apply multipliers |
| 5 | Schüco support | Apply multipliers |

**Deliverable:** All manufacturers working

---

### PHASE 3: ORDER SYSTEM (Weeks 9-10)

#### Week 9: Cart & Checkout
| Day | Task | Details |
|-----|------|---------|
| 1 | Add to cart | POST /cart/add |
| 2 | Cart management | GET /cart, DELETE /cart/item |
| 3 | Cart storage | localStorage + server |
| 4 | Guest checkout | No account required |
| 5 | Account checkout | For logged-in users |

**Deliverable:** Working cart system

#### Week 10: Order Management
| Day | Task | Details |
|-----|------|---------|
| 1 | Order creation | POST /orders |
| 2 | Order status | Pending → Confirmed → Processing → Shipped → Delivered |
| 3 | Order history | GET /orders (user's orders) |
| 4 | Admin order view | GET /admin/orders (all orders) |
| 5 | Email notifications | Order confirmation (basic) |

**Deliverable:** Complete order flow

---

### PHASE 3.5: FRONTEND DESIGN (Weeks 11-14) - NEW

**Reference:** See `LAYOUT_REFERENCE.md` for complete layout specs
**Base Template:** `Backend/Kunststofffenster.Konfigurator.Drutex.html`

#### Week 11: Core Layout Components
| Day | Task | Details |
|-----|------|---------|
| 1 | Step indicator | Progress bar with numbered steps |
| 2 | Step indicator | Active/completed/upcoming states |
| 3 | Basic page structure | Header + body + footer integration |
| 4 | Responsive framework | Mobile-first grid |
| 5 | Testing | All screen sizes |

**Deliverable:** Step indicator component complete

#### Week 12: Configurator Components
| Day | Task | Details |
|-----|------|---------|
| 1 | Options panel | Left side selection area |
| 2 | Option cards | Selection buttons with images |
| 3 | Summary panel | Right side configuration display |
| 4 | Product image | Image display area |
| 5 | Selected options | Live updating choices list |

**Deliverable:** Options panel + Summary panel complete

#### Week 13: Cart & Price Components
| Day | Task | Details |
|-----|------|---------|
| 1 | Price display | Live price calculation display |
| 2 | Cart sidebar | Items in cart |
| 3 | Line item component | Product, options, price |
| 4 | Quantity selector | Add/remove items |
| 5 | Cart totals | Subtotal, VAT, total |

**Deliverable:** Cart and price components complete

#### Week 14: Forms & Checkout
| Day | Task | Details |
|-----|------|---------|
| 1 | Quote request form | Private/Business toggle |
| 2 | Quote form fields | Size, quantity, material, contact |
| 3 | Checkout address | Shipping/billing forms |
| 4 | Navigation buttons | Back/Next step buttons |
| 5 | Integration testing | All components together |

**Deliverable:** All frontend components ready for backend integration

**COMPONENT-BY-COMPONENT APPROACH:**
- MAX 3 tasks per day
- Each task = ONE component only
- Build separately, test separately
- Then combine in Phase 5

---

### PHASE 4: CRM FOUNDATION (Weeks 15-18)

#### Week 15: Admin Authentication
| Day | Task | Details |
|-----|------|---------|
| 1 | Role system | CREATOR, CREATOR_STAFF, CEO, etc. |
| 2 | Permission system | Per-section access |
| 3 | Admin login | Separate from customer login |
| 4 | Session timeout | 30 min idle |
| 5 | Audit logging | Track all admin actions |

**Deliverable:** Role-based access control

#### Week 16: CRM Dashboard
| Day | Task | Details |
|-----|------|---------|
| 1 | Dashboard UI | Overview cards |
| 2 | Revenue stats | Today, week, month, all-time |
| 3 | Order stats | Recent orders, pending, completed |
| 4 | Navigation | Sidebar menu |
| 5 | Responsive design | Works on tablet |

**Deliverable:** Working CRM dashboard

#### Week 17: Catalog & Pricing Management
| Day | Task | Details |
|-----|------|---------|
| 1 | Product list | View all products |
| 2 | Product edit | Add/edit/remove |
| 3 | Margin settings | Set global/category margins |
| 4 | Discount management | Create/edit discounts |
| 5 | Import/export | CSV import for catalog |

**Deliverable:** Full catalog management

#### Week 18: Analytics & Lead Generator
| Day | Task | Details |
|-----|------|---------|
| 1 | Lead collection | Capture emails, visits |
| 2 | Lead dashboard | CREATOR-only view |
| 3 | GA4 integration | Connect to your account |
| 4 | Monthly reports | Auto-generate |
| 5 | Export options | CSV, Excel |

**🚨 ACTION NEEDED:** Create CURIA Google account this week

**Deliverable:** Lead generator + GA4 connected

---

### PHASE 5: FRONTEND & INTEGRATION (Weeks 19-22)

#### Week 19: Connect Backend
| Day | Task | Details |
|-----|------|---------|
| 1 | API connection | Frontend calls backend |
| 2 | Price display | Live price updates |
| 3 | Options loading | Colors, glass, etc. |
| 4 | Configuration state | Track selections |
| 5 | Testing | All connections working |

**Deliverable:** Frontend connected to backend

#### Week 20: Final Design
| Day | Task | Details |
|-----|------|---------|
| 1 | Apply design system | Colors, typography |
| 2 | Configurator UI | Steps, selections |
| 3 | Cart & checkout | Design implementation |
| 4 | Responsive testing | Mobile, tablet, desktop |
| 5 | Performance | Optimize loading |

**🚨 ACTION NEEDED:** Provide KATALOG with Einkaufspreise this week

**Deliverable:** Final frontend design

#### Week 21: Features Integration
| Day | Task | Details |
|-----|------|---------|
| 1 | Configuration sharing | URL generation |
| 2 | Wishlist | Save configurations |
| 3 | Quote request | Private & Business forms |
| 4 | VAT validation | VIES API integration |
| 5 | Testing | All features working |

**Deliverable:** All features integrated

#### Week 22: CRM Polish
| Day | Task | Details |
|-----|------|---------|
| 1 | Invoice details | Add CEO company info |
| 2 | Email templates | Order confirmation, etc. |
| 3 | Distribution center | Email/API setup |
| 4 | Order workflow | Full flow testing |
| 5 | User testing | With CEO staff |

**🚨 ACTION NEEDED:** Provide CEO company details, support contact

**Deliverable:** CRM ready for use

---

### PHASE 6: TESTING & LAUNCH (Weeks 23-24)

#### Week 23: Full Testing
| Day | Task | Details |
|-----|------|---------|
| 1 | Unit tests | All components |
| 2 | Integration tests | Full flows |
| 3 | Performance tests | Load testing |
| 4 | Security audit | Check vulnerabilities |
| 5 | Bug fixes | Address issues |

**Deliverable:** All tests passing

#### Week 24: Launch
| Day | Task | Details |
|-----|------|---------|
| 1 | Staging deployment | Final review |
| 2 | Production setup | Server, domain, SSL |
| 3 | Data migration | If needed |
| 4 | GO LIVE | Launch website |
| 5 | Monitoring | Watch for issues |

**Deliverable:** 🎉 LIVE WEBSITE

---

## 5. BACKEND ACCESS - LOGIN SYSTEM

### How You Will Access

#### Initial CREATOR Account

When backend is deployed, I will create:

```
┌─────────────────────────────────────────────────────────────────────┐
│  YOUR INITIAL CREATOR ACCOUNT                                        │
│  ─────────────────────────────────────────────────────────────────  │
│  Role: CREATOR (Master access)                                       │
│                                                                      │
│  Login URL: https://curia.yourdomain.com/admin                       │
│                                                                      │
│  Initial Credentials (will be provided securely):                    │
│  Username: creator@curia.com                                         │
│  Password: [Secure password - provided via secure channel]           │
│                                                                      │
│  FIRST LOGIN:                                                        │
│  - You will be required to change password                           │
│  - Set up 2FA (recommended)                                          │
│  - Configure your email                                              │
└─────────────────────────────────────────────────────────────────────┘
```

#### What You Can Do

As CREATOR, you have access to:

| Section | Access |
|---------|--------|
| Dashboard | Full |
| Catalog Management | Full |
| Pricing & Margins | Full |
| Discounts | Full |
| Orders | Full |
| Invoices | Full |
| Customers | Full |
| Lead Generator | EXCLUSIVE |
| Analytics | Full |
| User Management | Full (can create/remove all users) |
| Settings | Full |
| System Controls | EXCLUSIVE (take site offline, block access) |

#### Password Delivery

For security, I will:
1. **NOT** put password in any document
2. Provide initial password via:
   - Secure encrypted message (Signal, Telegram Secret Chat)
   - OR: One-time password link via email
   - OR: Set it together in a call

#### Password Requirements

- Minimum 12 characters
- Must include: uppercase, lowercase, number, symbol
- Cannot be common password
- Changed every 90 days (optional - you can disable)

---

## 6. GAP CHECK - FINAL REVIEW

### ✅ VERIFIED COMPLETE

| Category | Status | Notes |
|----------|--------|-------|
| Backend pricing logic | ✅ 100% | All formulas documented |
| Frontend design | ✅ 100% | Design files ready |
| CRM role system | ✅ 100% | 6 roles defined |
| Lead generator | ✅ 100% | Spec complete |
| Order workflow | ✅ 100% | Flow defined |
| Invoice system | ✅ 100% | Fields defined |
| Quote system | ✅ 100% | Private + Business |
| Configuration sharing | ✅ 100% | URL method defined |
| Wishlist | ✅ 100% | For projects |
| VAT validation | ✅ 100% | VIES API |
| GA4 integration | ✅ 100% | Plan ready |

### ⏳ TO BE PROVIDED LATER

| Item | When | From |
|------|------|------|
| KATALOG (Einkaufspreise) | Week 16 | You |
| CURIA Google Account | Week 14 | You |
| CEO Company Details | Week 16 | CEO |
| Shipping Rates | Week 16 | CEO |
| Support Contact | Week 16 | CEO |
| Legal Docs (T&C, Privacy) | Week 16 | Legal team |

### ✅ CAN WE START WITHOUT MISSING DATA?

**YES, ABSOLUTELY.**

**Weeks 1-13:** No external data needed. We use Drutex reference data.

**Weeks 14-20:** Need your KATALOG and CEO details.

---

## SUMMARY

### What We Have ✅
- 12 planning documents
- 17 data files
- 4 frontend templates
- Complete system architecture
- Detailed phase plan

### What We Need (Later) ⏳
- Your KATALOG (Week 16)
- CURIA Google Account (Week 14)
- CEO details (Week 16)

### Can We Start Now? ✅
**YES** - Everything needed for Phases 1-3 is ready.

### How Will You Access?
- Secure login at `https://curia.yourdomain.com/admin`
- CREATOR role with full access
- Password provided securely (not in documents)

---

**Document Status:** FINAL ✅
**Ready for Development:** YES ✅
**Last Updated:** 2026-03-03
