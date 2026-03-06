# CLARIFICATIONS & UPDATED PLAN

## Document Purpose
This document consolidates all clarifications from user feedback and provides an updated development plan.

---

## CRM ROLE SYSTEM (Final Version)

### Multi-Tenant SaaS Model

You're building a **white-label SaaS platform** where:
- YOU (CREATOR) manage the platform
- CLIENTS (CEOs) use the platform for their business
- Each client pays you monthly fees

### 6-Tier Role Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│  TIER 1: CREATOR (Platform Master)                              │
│  - YOU - Full platform control                                   │
│  - Can shutdown any site                                         │
│  - Can block all access                                          │
│  - Invisible to lower tiers                                      │
│  - Cannot be removed by anyone                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TIER 2: CREATOR'S STAFF (Platform Administrators)             │
│  - Your team members                                             │
│  - Can manage client websites                                    │
│  - Cannot be removed by CEO                                      │
│  - Can modify catalog, settings, etc.                            │
│  - Report only to CREATOR                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TIER 3: CEO (Business Owner/Client)                            │
│  - Pays monthly fee to CREATOR                                   │
│  - Full access to THEIR CRM                                      │
│  - Can manage their staff                                        │
│  - Cannot access platform controls                               │
│  - Cannot see/remove CREATOR or CREATOR'S STAFF                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TIER 4: OPERATIONS MANAGER (CEO's Manager)                     │
│  - Senior staff of CEO                                           │
│  - Access: Catalog, Inventory, Orders, Reports                   │
│  - Can supervise Tier 5 & 6                                      │
│  - Created by CEO                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TIER 5: WAREHOUSE STAFF                                         │
│  - Access: Orders (view), Inventory                              │
│  - Can mark orders as packed/shipped                             │
│  - Cannot modify catalog or prices                               │
│  - Created by CEO or Operations Manager                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  TIER 6: SALES STAFF                                             │
│  - Access: Quotes, Customers, Discounts (limited)               │
│  - Can create quotes and respond to inquiries                    │
│  - Cannot modify catalog or prices                               │
│  - Created by CEO or Operations Manager                          │
└─────────────────────────────────────────────────────────────────┘
```

### Additional Roles (Optional)

| Role | Access | Created By |
|------|--------|------------|
| MARKETING STAFF | Discounts, Promotions, Analytics | CEO |
| ACCOUNTANT | Invoices, Financial Reports | CEO |
| CUSTOMER SERVICE | Orders (view), Customer Communication | CEO |

### Permission Matrix

| Permission | CREATOR | CREATOR STAFF | CEO | OPS MGR | WAREHOUSE | SALES |
|------------|---------|---------------|-----|---------|-----------|-------|
| Shutdown Site | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Block All Access | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Manage Platform | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Data | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage CEO Staff | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Edit Catalog | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Prices | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Inventory | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Quotes | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Apply Discounts | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️* |

*Sales can apply discounts up to a limit set by CEO

---

## BRANDING

### Platform Name: **CURIA**

**Logo Concept:** Pantheon/Roman columns (Palatine Hill inspiration)

**Style:** Neutral - no creator branding visible to clients

**Implementation:**
- CRM header shows "CURIA" logo
- Each client can add their own logo for their frontend
- CREATOR branding hidden from all users

---

## DASHBOARDS

### Phase 1 Dashboards (To Build):

**CREATOR Dashboard:**
- All clients overview
- Total revenue across platform
- System health & uptime
- Payment status per client

**CEO Dashboard:**
- Sales overview (today, week, month, year)
- Profit margins
- Best-selling products
- Order status summary
- Revenue charts

### Phase 2 Dashboards (Later):
- Operations Manager dashboard
- Warehouse dashboard
- Sales performance dashboard

---

## FRONTEND: CONFIGURATION SAVING

### Industry Standard Approach (Nike, BMW, etc.)

**During Configuration:**
1. Each step saved to browser localStorage
2. User can navigate back/forward freely
3. Progress bar shows completed steps

**Back Button Behavior:**
- Goes to previous step
- Current step choices are preserved
- User can modify and continue

**Leave Page Behavior:**
```
┌─────────────────────────────────────────┐
│  You have unsaved configuration!        │
│                                         │
│  Would you like to save it?             │
│                                         │
│  [Save to Account] [Don't Save] [Cancel]│
└─────────────────────────────────────────┘
```
- Only shows ONCE per session (not annoying)
- If no account: data cleared on browser close
- If logged in: data saved to server

**Save Button Location:**
- In the configurator summary panel (right side)
- Icon: 💾 or "Save Configuration"
- Saved configs appear in "My Configurations" (account required)

---

## REQUEST QUOTE FEATURE

### Two Types of Quote Requests

**Type 1: Private Customer**
- Building/renovating their home
- Needs 1-20 windows typically
- Wants simple form

**Type 2: Business Customer**
- Construction company, developer
- Needs 50-500+ windows
- Wants to negotiate bulk pricing
- May need VAT exemption

### Quote Form Design

```
┌─────────────────────────────────────────────────────────────────┐
│  REQUEST A QUOTE                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Customer Type:  ○ Private  ○ Business                          │
├─────────────────────────────────────────────────────────────────┤
│  Your Items:                                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Size (WxH)  │ Quantity │ Material    │ Profile   │ [+][-]│   │
│  │ 120x140 cm  │    10    │ Kunststoff  │ Any       │       │   │
│  │ 80x100 cm   │     5    │ Kunststoff  │ Any       │       │   │
│  │ 200x220 cm  │     2    │ Holz-Alu    │ Any       │       │   │
│  └──────────────────────────────────────────────────────────┘   │
│  [+ Add Another Size]                                            │
├─────────────────────────────────────────────────────────────────┤
│  Additional Details (Optional):                                  │
│  Color: [___________]                                            │
│  Glass: [___________]                                            │
│  Notes: [___________________________________________]            │
├─────────────────────────────────────────────────────────────────┤
│  Contact Information:                                            │
│  Name: [___________]                                             │
│  Email: [___________]                                            │
│  Phone: [___________] (optional)                                 │
│                                                                  │
│  Preferred Contact Method:                                       │
│  ☐ Email  ☐ WhatsApp  ☐ Phone Call                              │
├─────────────────────────────────────────────────────────────────┤
│  [FOR BUSINESS ONLY]                                             │
│  Company Name: [___________]                                     │
│  VAT Number: [___________]  [Validate]                          │
├─────────────────────────────────────────────────────────────────┤
│                          [SEND QUOTE REQUEST]                    │
└─────────────────────────────────────────────────────────────────┘
```

### Quote Workflow

1. Customer submits form
2. Quote request saved to CRM
3. Notification sent to configured emails
4. Sales staff reviews in CRM
5. Quote created and sent via preferred channel
6. Customer can convert quote to order

---

## PDF EXPORT

### Decision: LIMITED IMPLEMENTATION

**What you said:** Only text document with logo and configuration details (like an invoice).

**Implementation:**
- Simple PDF with:
  - Company logo
  - Configuration summary (text only)
  - All selected options
  - Price breakdown
- NO product images or renderings
- Format similar to invoice

**Used for:**
- Quote documentation
- Order confirmation
- Customer records

---

## UPDATED DEVELOPMENT PHASES

### Phase 1: Backend Foundation (Weeks 1-4)

**Week 1-2: Core Infrastructure**
- [ ] Database schema (PostgreSQL)
- [ ] User/Role system (6 tiers)
- [ ] Authentication (JWT)
- [ ] Basic API structure

**Week 3-4: Pricing Engine**
- [ ] Catalog import (CSV)
- [ ] Price calculation
- [ ] Margin system
- [ ] Surcharge engine

### Phase 2: Backend Features (Weeks 5-8)

**Week 5-6: Configurator Logic**
- [ ] Configuration API
- [ ] Option validation
- [ ] Save/load configurations
- [ ] Sharing URL generation

**Week 7-8: Orders & Quotes**
- [ ] Cart system
- [ ] Quote request handling
- [ ] Order creation
- [ ] Invoice generation

### Phase 3: CRM (Weeks 9-12)

**Week 9-10: Core CRM**
- [ ] Dashboard (CREATOR & CEO)
- [ ] Catalog management UI
- [ ] Pricing management UI
- [ ] Order management UI

**Week 11-12: Advanced CRM**
- [ ] User/Role management
- [ ] Statistics & analytics
- [ ] Settings & configuration
- [ ] Email notifications

### Phase 4: Frontend (Weeks 13-16)

**Week 13-14: Configurator**
- [ ] Step-by-step UI
- [ ] Real-time pricing
- [ ] Save functionality
- [ ] Quote request form

**Week 15-16: Checkout & Account**
- [ ] Cart page
- [ ] Checkout flow
- [ ] Account management
- [ ] Order history

### Phase 5: Launch Prep (Weeks 17-18)

- [ ] Testing
- [ ] Legal documents (from CEO)
- [ ] Shipping setup
- [ ] Go live

---

## REMAINING QUESTIONS

### 1. Google Analytics 4
**Question:** Do you want GA4 tracking? (FREE, industry standard)
**Recommendation:** YES - essential for professional e-commerce

### 2. Priority Features for Phase 2
Which of these should come first?
- A/B Testing
- Facebook Pixel
- Advanced Analytics

### 3. Email Service Provider
Which email service for notifications?
- SendGrid (popular, reliable)
- Amazon SES (cheap, technical)
- Mailgun (developer-friendly)

---

## SUMMARY

All critical questions are now answered. Development can proceed with:

**✅ Ready:**
- Role system defined
- Configuration saving approach
- Quote feature designed
- PDF format decided
- VAT handling clear
- Session timeout set

**⏳ To Be Provided Later:**
- Company details (from CEO)
- Shipping rates (from CEO)
- Legal documents (from legal team)
- Support contact (from CEO)

**❓ Need Confirmation:**
- Google Analytics 4 (YES/NO?)
- Email service provider preference
