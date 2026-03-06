# GAP ANALYSIS & MISSING FEATURES REPORT

## FenTuRo Three-Tier System: Backend → Frontend → CRM

**Created:** 2026-03-03  
**Purpose:** Identify any gaps, unclear points, or missing features before starting development

---

## EXECUTIVE SUMMARY

After analyzing all 17 planning documents in the repository, I've identified:
- ✅ **35 items COMPLETE** - Well-documented and ready
- ⚠️ **8 items NEED CLARIFICATION** - Require your input
- 🔴 **12 items MISSING** - Need to be added to the plan
- 💡 **15 MODERN FEATURES** - Industry standards you may want to consider

---

# PART A: WHAT WE HAVE (COMPLETE ✅)

## 1. Data & Technical Documentation

| Item | Status | Location |
|------|--------|----------|
| Base price matrix (Drutex) | ✅ Complete | Backend branch |
| Profile multipliers (6 profiles) | ✅ Complete | Backend branch |
| Surcharges (200+ values) | ✅ Complete | Backend branch |
| Color options (80+) | ✅ Complete | Backend branch |
| Glass options (all types) | ✅ Complete | Backend branch |
| Handle options (7 types) | ✅ Complete | Backend branch |
| API endpoints (6 documented) | ✅ Complete | Backend branch |
| PostMessage protocol | ✅ Complete | Backend branch |
| Comparison results (36 products) | ✅ Complete | Backend branch |

## 2. Architecture & Planning

| Item | Status | Location |
|------|--------|----------|
| Three-tier architecture | ✅ Complete | DETAILED_SYSTEM_PLAN.md |
| Pricing formula | ✅ Complete | BACKEND_DEVELOPMENT_PLAN.md |
| Database schema proposal | ✅ Complete | BACKEND_DEVELOPMENT_PLAN.md |
| Development timeline (20 weeks) | ✅ Complete | DETAILED_SYSTEM_PLAN.md |
| Tech stack decided | ✅ Complete | INDUSTRY_RESEARCH_AND_ANSWERS.md |

## 3. Business Decisions

| Item | Status | Decision |
|------|--------|----------|
| Catalog format | ✅ Confirmed | CSV |
| Default margin | ✅ Confirmed | 50% (adjustable) |
| Hosting | ✅ Confirmed | Render (Frankfurt) |
| Tech stack | ✅ Confirmed | Node.js + PostgreSQL |
| Checkout type | ✅ Confirmed | Guest + Optional Account |
| Payment methods | ✅ Confirmed | PayPal, Invoice, Direct Debit, Card |
| Language | ✅ Confirmed | German primary, English CRM |
| Inventory | ✅ Confirmed | CRM-only (not customer-facing) |

---

# PART B: ITEMS NEEDING CLARIFICATION ⚠️

## 1. Your KATALOG Structure

**Question:** What format will your actual catalog be in?

**What I need to know:**
- Will it be a spreadsheet (Excel/CSV)?
- What columns will it have?
- Will you categorize by: Fenster / Türen / Rollläden / Zubehör?
- Will it include images/URLs?

**Example structure I'd recommend:**
```csv
product_id,category,subcategory,manufacturer,profile,model_name,base_price_eur,currency,unit,active
1,Fenster,Kunststoff,Drutex,Iglo 5 Classic,Standard,120.00,EUR,per_window,true
2,Fenster,Kunststoff,Gealan,S 8000,Premium,135.00,EUR,per_window,true
```

**Your Answer:** ____________

---

## 2. Order Email Recipients

**Question:** Who should receive order notifications?

**What I need:**
- Email address for new order notifications
- Email address for invoice copies
- Should there be multiple recipients?
- Should certain order types go to different people?

**Your Answer:** ____________

---

## 3. Invoice Details

**Question:** What should appear on invoices?

**What I need:**
- Company name for invoices: ____________
- Company address: ____________
- VAT ID (USt-IdNr.): ____________
- Bank details for bank transfers: ____________
- Invoice number format (e.g., INV-2026-0001): ____________
- Payment terms (e.g., "14 Tage netto"): ____________

---

## 4. Distribution Center Workflow

**Question:** How does an order get to the distribution center?

**Options:**
a) [ ] Email notification with order PDF
b) [ ] CRM dashboard they can access
c) [ ] API integration with warehouse system
d) [ ] Manual export and forward

**Your Answer:** ____________

---

## 5. Return/Cancellation Policy

**Question:** What are your policies?

**What I need:**
- Can orders be cancelled? Until when?
- Is return possible for made-to-order items?
- Cancellation fees?
- Who handles cancellation requests?

**Your Answer:** ____________

---

## 6. Shipping Options

**Question:** How is shipping calculated?

**Options:**
a) [ ] Flat rate per order (€ ______)
b) [ ] Based on weight
c) [ ] Based on order value (free above € ______)
d) [ ] Calculated by carrier API
e) [ ] Pickup only (no shipping)

**Your Answer:** ____________

---

## 7. Tax Handling

**Question:** How should VAT be handled?

**What I need:**
- Standard VAT rate: 19% (for most products)
- Reduced VAT rate: 7% (for any products?)
- B2B without VAT? (for EU businesses with valid VAT ID)
- Show prices with or without VAT?

**Your Answer:** ____________

---

## 8. Customer Support Contact

**Question:** Where should customers go for help?

**What I need:**
- Support email: ____________
- Support phone: ____________
- Support hours: ____________
- Live chat? Yes / No

**Your Answer:** ____________

---

# PART C: MISSING FROM CURRENT PLAN 🔴

## Critical Missing Items

### 1. 🔴 CRM ACCESS CONTROL SPECIFICATION
**Currently Missing:** Detailed roles and permissions

**Need to Define:**
```
ROLE: Owner
├── Full access to everything
├── Can create/delete admin accounts
├── Can see all financial data
└── Can configure system settings

ROLE: Manager
├── Can view all orders
├── Can manage catalog
├── Can apply discounts
└── Cannot see full financial reports

ROLE: Sales
├── Can view orders assigned to them
├── Can update order status
├── Cannot change pricing
└── Cannot delete products

ROLE: Warehouse
├── Can view order details
├── Can mark as shipped
├── Cannot see customer payment info
└── Cannot modify orders
```

**ACTION NEEDED:** Confirm roles or adjust

---

### 2. 🔴 DATA BACKUP STRATEGY
**Currently Missing:** No backup plan documented

**Need to Define:**
- Database backup frequency (daily/hourly?)
- Backup retention period
- Backup storage location
- Disaster recovery plan

**RECOMMENDATION:**
- Daily automated backups
- Keep 30 days of backups
- Store in separate cloud location

---

### 3. 🔴 ERROR HANDLING & LOGGING
**Currently Missing:** No error handling strategy

**Need to Define:**
- Error notification email
- Log retention period
- What to log (all API calls? errors only?)
- Monitoring dashboard

**RECOMMENDATION:**
- Log all errors to centralized logging
- Notify on critical errors
- Monitor uptime with alerting

---

### 4. 🔴 API RATE LIMITING
**Currently Missing:** No rate limiting strategy

**Need to Define:**
- How many requests per minute/hour?
- Different limits for frontend vs CRM?
- What happens when limit exceeded?

**RECOMMENDATION:**
- 100 requests/minute for frontend
- 500 requests/minute for CRM
- Return 429 error with retry-after header

---

### 5. 🔴 CUSTOMER DATA RETENTION (GDPR)
**Currently Missing:** No data retention policy

**Need to Define:**
- How long to keep order data?
- How long to keep customer data?
- Right to deletion process
- Data export process

**RECOMMENDATION (GDPR Compliant):**
- Keep order data: 10 years (tax requirement)
- Keep customer data: Until deletion requested
- Anonymize after account deletion
- Provide data export on request

---

### 6. 🔴 TERMS & CONDITIONS / PRIVACY POLICY
**Currently Missing:** Legal documents not mentioned

**Need:**
- [ ] AGB (Allgemeine Geschäftsbedingungen)
- [ ] Datenschutzerklärung (Privacy Policy)
- [ ] Widerrufsbelehrung (Cancellation Policy)
- [ ] Impressum

**ACTION:** Will you provide these or need them created?

---

### 7. 🔴 SEO & METADATA
**Currently Missing:** No SEO strategy for configurator pages

**Need to Define:**
- Page titles for configurator pages
- Meta descriptions
- URL structure for products
- Sitemap generation

---

### 8. 🔴 TESTING STRATEGY
**Currently Missing:** No QA/testing plan

**Need to Define:**
- Who tests before launch?
- Test environment setup
- Test data (fake orders, fake customers)
- Performance testing targets

---

### 9. 🔴 LAUNCH CHECKLIST
**Currently Missing:** No go-live checklist

**Need:**
- [ ] SSL certificate verified
- [ ] Email notifications working
- [ ] Payment processing tested
- [ ] Error monitoring active
- [ ] Backups verified
- [ ] DNS configured
- [ ] Analytics tracking installed

---

### 10. 🔴 MAINTENANCE PLAN
**Currently Missing:** Post-launch maintenance plan

**Need to Define:**
- Security update frequency
- Feature update process
- Bug fix response time
- Scheduled maintenance windows

---

### 11. 🔴 STAGING/TESTING ENVIRONMENT
**Currently Missing:** Environment strategy

**Need:**
- Development environment (local)
- Staging environment (test before live)
- Production environment (live)
- How to promote changes between environments

---

### 12. 🔴 MOBILE APP CONSIDERATION
**Currently Missing:** No mobile app mentioned

**Question:** 
- Is a mobile app needed in the future?
- Should the backend be designed to support it?

**RECOMMENDATION:** Design API to be mobile-ready from start

---

# PART D: MODERN FEATURES TO CONSIDER 💡

## Industry Standard Features You May Want

### 1. 💡 REAL-TIME NOTIFICATIONS (WebSocket)
**What:** Live updates in CRM when new order arrives
**Industry Standard:** Yes (Shopify, WooCommerce use it)
**Effort:** Medium
**Recommendation:** Add to CRM phase

---

### 2. 💡 PROGRESSIVE WEB APP (PWA)
**What:** Configurator works offline, installable
**Industry Standard:** Growing trend
**Effort:** Low (add manifest.json, service worker)
**Recommendation:** Consider for frontend

---

### 3. 💡 SAVED CONFIGURATIONS
**What:** Customers can save and return to their configuration
**Industry Standard:** Common in configurators
**Effort:** Low
**Recommendation:** ADD - Very useful for high-value products

---

### 4. 💡 CONFIGURATION SHARING (URL)
**What:** Customer can share their configuration via link
**Industry Standard:** Common in car/furniture configurators
**Effort:** Low (encode config in URL)
**Recommendation:** ADD - Good for consultations

---

### 5. 💡 QUOTE REQUEST (Instead of Buy)
**What:** Customer requests a quote without purchasing
**Industry Standard:** Common for B2B
**Effort:** Low
**Recommendation:** ADD - Good for large orders

---

### 6. 💡 PDF EXPORT OF CONFIGURATION
**What:** Customer can download PDF of their configuration
**Industry Standard:** Yes for complex products
**Effort:** Medium
**Recommendation:** ADD - Professional touch

---

### 7. 💡 COMPARISON FEATURE
**What:** Compare 2-3 configurations side by side
**Industry Standard:** Growing trend
**Effort:** Medium
**Recommendation:** Nice to have (Phase 2)

---

### 8. 💡 RECENTLY VIEWED
**What:** Show customer their recent configurations
**Industry Standard:** Yes
**Effort:** Low
**Recommendation:** ADD

---

### 9. 💡 WISHLIST
**What:** Save items for later
**Industry Standard:** Yes
**Effort:** Low
**Recommendation:** Consider

---

### 10. 💡 ABANDONED CART RECOVERY
**What:** Email customers who left items in cart
**Industry Standard:** Yes (increases conversion 10-15%)
**Effort:** Medium
**Recommendation:** ADD - High ROI

---

### 11. 💡 PRODUCT REVIEWS
**What:** Customer reviews on products
**Industry Standard:** Yes
**Effort:** Medium
**Recommendation:** Phase 2

---

### 12. 💡 LIVE CHAT INTEGRATION
**What:** Chat widget for customer support
**Industry Standard:** Yes
**Effort:** Low (use Crisp, Intercom, etc.)
**Recommendation:** ADD

---

### 13. 💡 GOOGLE ANALYTICS 4 INTEGRATION
**What:** Track all user behavior
**Industry Standard:** Mandatory
**Effort:** Low
**Recommendation:** ADD - Required

---

### 14. 💡 FACEBOOK PIXEL / CONVERSION TRACKING
**What:** Track conversions for ads
**Industry Standard:** Common for paid ads
**Effort:** Low
**Recommendation:** ADD if running ads

---

### 15. 💡 A/B TESTING CAPABILITY
**What:** Test different prices, layouts, etc.
**Industry Standard:** Growing
**Effort:** Medium
**Recommendation:** Nice to have (Phase 2)

---

# PART E: VERIFICATION SUMMARY

## Checklist Before Starting Development

### MUST HAVE (Before Phase 1):

- [ ] Your KATALOG format confirmed
- [ ] Invoice company details provided
- [ ] Order notification email(s) specified
- [ ] Shipping calculation method decided
- [ ] VAT handling confirmed
- [ ] Legal documents (AGB, Datenschutz) status confirmed

### SHOULD HAVE (Before Launch):

- [ ] Customer support contact details
- [ ] Return/cancellation policy defined
- [ ] Distribution center workflow confirmed
- [ ] Data backup strategy approved
- [ ] Testing strategy confirmed

### NICE TO HAVE (Can Add Later):

- [ ] Saved configurations feature
- [ ] PDF export feature
- [ ] Abandoned cart emails
- [ ] Live chat integration
- [ ] A/B testing

---

# PART F: QUESTIONS FOR YOU

## Backend Questions:
1. ✅ All answered in INDUSTRY_RESEARCH_AND_ANSWERS.md

## CRM Questions:

1. **CRM Roles:** Do the 4 roles I defined (Owner, Manager, Sales, Warehouse) match your needs?
2. **CRM Branding:** Should CRM have your company branding or be generic?
3. **CRM Mobile:** Do admins need mobile access to CRM?

## Frontend Questions:

1. **Saved Configs:** Do you want customers to save configurations?
2. **Quote Request:** Should there be a "Request Quote" option?
3. **PDF Export:** Should customers be able to download their config as PDF?

## Legal Questions:

1. **Legal Docs:** Will you provide AGB/Datenschutz or should we create them?
2. **GDPR Contact:** Who is the data protection officer contact?

---

# SUMMARY

## Status of Plan Completeness:

| Category | Completeness | Notes |
|----------|--------------|-------|
| **Technical Data** | 95% | PSK/Rolladen pending |
| **Backend Architecture** | 90% | Add error handling, rate limiting |
| **Frontend Design** | 80% | Add saved configs, PDF export |
| **CRM Features** | 85% | Add statistics as discussed |
| **Business Logic** | 75% | Need shipping, tax, legal answers |
| **Security** | 70% | Add backup, GDPR, monitoring |
| **Operations** | 60% | Need launch checklist, maintenance plan |

## Recommended Priority:

1. **IMMEDIATE:** Answer the 8 clarification questions
2. **BEFORE DEV:** Confirm CRM roles and features to add
3. **DURING DEV:** Document error handling and logging
4. **BEFORE LAUNCH:** Complete legal docs, launch checklist

---

*This document should be reviewed and updated with your answers before starting development.*
