# FINAL FEATURE DECISIONS
## All Decisions Confirmed - Ready for Development

---

## 1. CONFIGURATION SHARING URL ✅ CONFIRMED

**Decision:** YES - Add this feature

**Why it's easy and bug-free:**
- Each configuration gets a unique hash/ID
- URL format: `https://site.com/configure?config=abc123`
- Hash contains all selected options (encoded)
- When user opens link, options are pre-selected
- No database required (options encoded in URL)
- Very common pattern, well-tested

**Implementation:**
```
// Generate shareable link
const configHash = btoa(JSON.stringify({
  manufacturer: "Drutex",
  profile: "Iglo5",
  width: 1200,
  height: 1000,
  color: "Anthrazit",
  glass: "3-fach",
  // ... all options
}));

const shareableURL = `${baseURL}/configure?config=${configHash}`;
```

---

## 2. VAT VALIDATION (VIES API) ✅ CONFIRMED

**Decision:** YES - Must implement for B2B

**I will code this in:**
- Integration with EU VIES API
- Real-time validation when customer enters VAT number
- Auto-exempt valid B2B customers from VAT
- Store validation result in database for audit

**Implementation Plan:**
```javascript
// Backend API call to VIES
async function validateVATNumber(vatNumber, countryCode) {
  const response = await fetch(
    `https://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl`,
    {
      // SOAP request with VAT number
    }
  );
  
  return {
    valid: response.valid,
    companyName: response.name,
    companyAddress: response.address
  };
}
```

**Security:**
- Rate limit to prevent abuse
- Log all validation attempts
- Store validated numbers for quick re-check

---

## 3. GOOGLE ANALYTICS 4 ✅ CONFIRMED

**Decision:** YES - Integrate with CRM

**Your Questions Answered:**

### Will we integrate into CRM?
**YES** - Two ways:
1. **GA4 Dashboard Embed** - Show GA4 reports directly in CRM
2. **Custom Calculations** - Pull data via GA4 API, calculate our own metrics

### Is it secure? Does it steal leads?
**SECURE & NO LEAD STEALING:**
- Data stays in YOUR Google account
- You own all the data
- Google doesn't have access to personal details
- We collect emails separately in our database

### What if there's a new version?
**EASY TO UPDATE:**
- GA4 is the latest version (replaces Universal Analytics)
- Google handles updates automatically
- Our integration uses GA4 API which is stable

### Monthly Overview?
**YES - Built-in:**
- GA4 has pre-built monthly reports
- We can also generate custom monthly reports in CRM
- Export to PDF/CSV available

**What We'll Track:**
- Page views
- Configurator starts
- Add to cart events
- Checkout starts
- Purchases
- Revenue
- User demographics
- Traffic sources

---

## 4. A/B TESTING ❌ NOT NEEDED

**Decision:** NO - Skip this feature

**Reason:** You'll make informed choices based on existing data.

**Note:** Can be added later if needed, but not priority.

---

## 5. FACEBOOK PIXEL ⏳ LATER

**Decision:** Can be added later

**CEO currently doesn't use it.**

**Can it be added later?**
**YES - Very easy:**
- Just add a script tag to the website
- Configure events (page view, add to cart, purchase)
- Takes about 30 minutes to implement

**When to add:**
- When CEO starts Facebook advertising
- Just let me know and I'll add it

---

## 6. WISHLIST ✅ CONFIRMED

**Decision:** YES - For konfigurator choices/projects

**Design:**
- User can save multiple configurations
- Each saved config = a "project"
- Can name projects (e.g., "Kitchen Windows", "Living Room")
- Can compare saved projects
- Available for logged-in users only

**Wishlist vs Cart:**
| Feature | Wishlist | Cart |
|---------|----------|------|
| Purpose | Save for later | Buy now |
| Multiple items | Yes, unlimited | Yes, unlimited |
| Persistence | Forever (until deleted) | Session or until checkout |
| Share | Can share via URL | No |
| Compare | Yes | No |

---

## 7. CART STORAGE ✅ CONFIRMED

**Decision:** 
- Device (localStorage) for guests
- Server (database) for logged-in users

**Implementation:**
```javascript
// For guests
localStorage.setItem('cart', JSON.stringify(cartItems));

// For logged-in users
await saveCartToServer(userId, cartItems);
```

**Benefits:**
- Guests don't lose cart on page refresh
- Logged-in users can access cart from any device
- Cart syncs when guest logs in

---

# NEW REQUIREMENT: LEAD GENERATOR

## CREATOR-ONLY CRM Section

### Overview
A hidden section in the CRM that only YOU (the CREATOR) can see. This collects and analyzes all user/lead data.

### Access Control
- **Default:** Only CREATOR can see
- **Can grant access:** CREATOR can add specific people
- **Hidden from:** CEO, all other roles (unless granted)

### Data Collected

#### 1. User Information
| Data Point | Source |
|------------|--------|
| Email address | Account registration, quote requests, checkout |
| Name | Account registration, checkout |
| Phone | Quote requests, checkout |
| Company (if B2B) | Quote requests, checkout |
| Account created date | Registration |
| Last login | Session tracking |

#### 2. Traffic Data
| Data Point | Source |
|------------|--------|
| Visit count | Session tracking |
| Pages viewed | Analytics |
| Time on site | Analytics |
| Referral source | UTM parameters |
| Device type | User agent |
| Location (country/city) | IP geolocation |

#### 3. Purchase Data
| Data Point | Source |
|------------|--------|
| Total purchases | Order history |
| Total spent | Order history |
| Average order value | Calculated |
| First purchase date | Order history |
| Last purchase date | Order history |
| Products purchased | Order history |
| Quotes requested | Quote system |

### Lead Generator Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                     LEAD GENERATOR (CREATOR ONLY)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  OVERVIEW                                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ Total Leads │ │ New Today   │ │ Converted   │ │ Total Rev.  │    │
│  │   1,234     │ │     23      │ │    156      │ │  €45,678    │    │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘    │
│                                                                      │
│  LEAD LIST                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Email          │ Visits │ Last Visit │ Purchases │ Total Spent │ │
│  ├─────────────────────────────────────────────────────────────────┤ │
│  │ john@email.com │   12   │ Today      │     2     │   €1,234    │ │
│  │ anna@firm.de   │    5   │ Yesterday  │     0     │   €0        │ │
│  │ max@company.de │    8   │ 3 days ago │     1     │   €567      │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  FILTERS: [All] [Purchased] [Not Purchased] [High Value] [Recent]   │
│                                                                      │
│  EXPORT: [CSV] [Excel] [Email List]                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Lead Scoring
Automatic lead scoring based on behavior:

| Action | Points |
|--------|--------|
| Visit website | +1 |
| View product | +2 |
| Start configurator | +5 |
| Complete configuration | +10 |
| Add to cart | +15 |
| Request quote | +20 |
| Create account | +25 |
| Purchase | +50 |

**Lead Categories:**
- **Cold** (0-20 points): Just browsing
- **Warm** (21-50 points): Interested
- **Hot** (51-100 points): Ready to buy
- **Customer** (100+): Has purchased

### Export Options
- **CSV:** For importing to other systems
- **Excel:** For analysis
- **Email List:** For marketing campaigns (GDPR compliant - only opted-in)

### GDPR Compliance
- Only collect data with consent
- Allow data deletion requests
- Privacy policy must mention data collection
- Export user data on request

---

## FINAL CONFIRMED FEATURE LIST

### MUST HAVE (Phase 1):
- [x] Configuration Sharing URL
- [x] VAT Validation (VIES API)
- [x] Google Analytics 4 (integrated into CRM)
- [x] Wishlist (for konfigurator projects)
- [x] Cart Storage (device + server)
- [x] Lead Generator (CREATOR only)

### LATER (Phase 2+):
- [ ] Facebook Pixel (when CEO needs it)

### NOT IMPLEMENTING:
- [x] A/B Testing (not needed)

---

## NEXT STEPS

1. ✅ All feature decisions confirmed
2. ⏳ Create FINAL_REQUIREMENTS_SPECIFICATION.md
3. ⏳ Begin backend development

---

**Document Status:** FINAL ✅
**Last Updated:** 2026-03-03
