# MASTER DATA COLLECTION CHECKLIST
## Drutex Kunststoff Fenster - Complete Groundwork

**Target URL:** https://www.fenstermaxx24.com/konfigurator/konfigurator-fenster/
**Purpose:** Collect 100% of data needed to build a functioning custom backend

---

# PART A: DETAILED BASELINE COLLECTION (Drutex Kunststoff)
## Estimated Time: 2-4 hours for complete collection

---

## 1. NETWORK & API INFRASTRUCTURE

### 1.1 Iframe Analysis
- [ ] **Iframe Source URL** - Full URL of the iframe `src` attribute
- [ ] **Iframe Domain** - Which domain hosts the configurator? (e.g., fensterblick.de)
- [ ] **Iframe Load Parameters** - Any query params in iframe URL?
- [ ] **Iframe ID/Class** - HTML element identifier

### 1.2 API Endpoints (Inside Iframe)
Open DevTools → Network Tab → Filter by XHR/Fetch

For EACH API call, record:
- [ ] **Endpoint 1:** _______________
  - Method: GET / POST
  - Full URL: 
  - Purpose: (what triggers this call?)
  
- [ ] **Endpoint 2:** _______________
  - Method: GET / POST
  - Full URL:
  - Purpose:
  
- [ ] **Endpoint 3:** _______________
  - Method: GET / POST
  - Full URL:
  - Purpose:

(Continue for all endpoints discovered)

### 1.3 Initial Load Requests
- [ ] What API calls happen on page load? (list all)
- [ ] What data is fetched initially? (config options, prices, etc.)
- [ ] Any authentication/session tokens required?

---

## 2. CONFIGURATION PARAMETERS (Complete List)

### 2.1 Window Dimensions
- [ ] **Width (Breite)**
  - Minimum value: ___ mm
  - Maximum value: ___ mm
  - Step increment: ___ mm
  - Default value: ___ mm
  - Input type: slider / number field / dropdown

- [ ] **Height (Höhe)**
  - Minimum value: ___ mm
  - Maximum value: ___ mm
  - Step increment: ___ mm
  - Default value: ___ mm
  - Input type: slider / number field / dropdown

### 2.2 Profile Selection (Profil)
For EACH profile option:

- [ ] **Profile 1:** _______________
  - Internal ID: ___
  - Display Name: ___
  - Is Default: Yes / No
  
- [ ] **Profile 2:** _______________
  - Internal ID: ___
  - Display Name: ___
  
- [ ] **Profile 3:** _______________
  - Internal ID: ___
  - Display Name: ___

(List ALL profiles)

### 2.3 Opening Type (Öffnungsart)
- [ ] **Option 1:** _______________
  - Internal ID: ___
  - Icon/Image URL: ___
  
- [ ] **Option 2:** _______________
  - Internal ID: ___
  - Icon/Image URL: ___

(List ALL opening types: Dreh-Kipp, Festverglast, etc.)

### 2.4 Color Selection (Farbauswahl)

#### 2.4.1 Frame Colors (Rahmenfarbe)
For EACH color:
- [ ] **Color 1:** _______________
  - Internal ID: ___
  - RAL Code: ___
  - Hex Code: ___
  - Surcharge: ___ EUR
  - Available for profiles: ___

(List ALL frame colors - likely 20-50+ options)

#### 2.4.2 Interior/Exterior Colors
- [ ] Same color both sides? Yes / No
- [ ] Different interior/exterior available? Yes / No
- [ ] Color matching rules: _______________

### 2.5 Glass Selection (Glasauswahl)

For EACH glass type:
- [ ] **Glass 1:** _______________
  - Internal ID: ___
  - U-Value (Ug): ___
  - Description: ___
  - Surcharge: ___ EUR or ___ EUR/m²
  
- [ ] **Glass 2:** _______________
  - Internal ID: ___
  - U-Value (Ug): ___
  - Description: ___
  - Surcharge: ___

(List ALL glass options)

### 2.6 Handle Selection (Griff)

For EACH handle:
- [ ] **Handle 1:** _______________
  - Internal ID: ___
  - Image URL: ___
  - Surcharge: ___ EUR
  
(List ALL handle options)

### 2.7 Hardware/Accessories (Zubehör)

For EACH accessory:
- [ ] **Accessory 1:** _______________
  - Internal ID: ___
  - Type: (lock, hinge, ventilation, etc.)
  - Surcharge: ___ EUR
  - Compatible with: ___

(List ALL accessories)

### 2.8 Additional Options (Zusätze)

- [ ] **V-Perfect (Dünne Schweißnaht)**
  - Price: ___ EUR
  - Available for: ___

- [ ] **Insect Screen (Insektenschutz)**
  - Price: ___ EUR
  - Types available: ___

- [ ] **Blind Integration (Rollladen)**
  - Types: ___
  - Pricing: ___

(List ALL additional options)

---

## 3. PRICE CALCULATION DATA

### 3.1 Base Price Matrix
**CRITICAL:** This is the foundation of all pricing

Create a matrix for dimensions:
```
Width (mm) →   500    600    700    800    900   1000   1100   1200   ...
Height (mm) ↓
400           ___    ___    ___    ___    ___    ___    ___    ___
500           ___    ___    ___    ___    ___    ___    ___    ___
600           ___    ___    ___    ___    ___    ___    ___    ___
700           ___    ___    ___    ___    ___    ___    ___    ___
800           ___    ___    ___    ___    ___    ___    ___    ___
900           ___    ___    ___    ___    ___    ___    ___    ___
1000          ___    ___    ___    ___    ___    ___    ___    ___
...
```

- [ ] Collect prices for at least 10x10 dimension combinations
- [ ] Note: Is pricing linear or stepped?
- [ ] Note: Any dimension ranges with special pricing?

### 3.2 Surcharge List (Complete)

| Component | Option | Surcharge Type | Amount |
|-----------|--------|---------------|--------|
| Profile X | (name) | Fixed/Per m² | ___ EUR |
| Color X | (name) | Fixed/Per m² | ___ EUR |
| Glass X | (name) | Fixed/Per m² | ___ EUR |
| Handle X | (name) | Fixed | ___ EUR |
| Accessory X | (name) | Fixed | ___ EUR |

- [ ] All profile surcharges documented
- [ ] All color surcharges documented
- [ ] All glass surcharges documented
- [ ] All handle surcharges documented
- [ ] All accessory surcharges documented

### 3.3 Discount Rules

- [ ] **Standard Discount:** ___% (appears to be 40%)
- [ ] **Display Format:** Original price struck through, new price bold
- [ ] **Calculation:** New = Original × ___
- [ ] **Any volume discounts?** Yes / No
- [ ] **Any promo codes?** Yes / No

### 3.4 Price Calculation Formula

Document the EXACT formula:
```
Final Price = (
    Base_Price[width][height]
    + Profile_Surcharge
    + Color_Surcharge
    + Glass_Surcharge
    + Handle_Surcharge
    + Sum(Accessory_Surcharges)
    + Sum(Additional_Options)
) × Discount_Factor
```

- [ ] Formula verified with manual calculation
- [ ] Edge cases documented

---

## 4. API PAYLOADS (JSON Structures)

### 4.1 Configuration Request Payload

When user changes ANY option, what JSON is sent?

```json
{
  "example": "fill in actual structure"
}
```

- [ ] Payload for dimension change captured
- [ ] Payload for profile change captured
- [ ] Payload for color change captured
- [ ] Payload for glass change captured
- [ ] Payload for handle change captured
- [ ] Payload for accessory toggle captured

### 4.2 Price Response Payload

What JSON comes back from the server?

```json
{
  "example": "fill in actual structure"
}
```

- [ ] Response structure documented
- [ ] All fields identified
- [ ] Price field location confirmed

### 4.3 Add to Cart Payload

What data is sent when adding to cart?

```json
{
  "example": "fill in actual structure"
}
```

- [ ] Cart payload structure documented
- [ ] Product ID format documented
- [ ] Configuration summary format documented

---

## 5. UI ↔ BACKEND MAPPING

### 5.1 Summary Box ("MEIN DRUTEX KUNSTSTOFF FENSTER")

For EACH line in the summary:
- [ ] **Line 1:** _______________ 
  - Data source: ___
  - Format: ___
  
- [ ] **Line 2:** _______________ 
  - Data source: ___
  - Format: ___

(Map ALL summary box content)

### 5.2 Price Display Elements

- [ ] **Original Price Element:** ID/Class = ___
- [ ] **Discounted Price Element:** ID/Class = ___
- [ ] **Price Format:** (e.g., "1.199,90 €")
- [ ] **PostMessage event name:** ___

### 5.3 Configuration Preview Image

- [ ] How is the window preview generated?
- [ ] Image URL pattern: ___
- [ ] Parameters that affect image: ___

---

## 6. BUSINESS LOGIC RULES

### 6.1 Option Dependencies

Which options affect which?

- [ ] Profile → affects available colors? Yes / No
- [ ] Profile → affects available glass? Yes / No
- [ ] Opening type → affects available handles? Yes / No
- [ ] Color → affects available accessories? Yes / No
- [ ] Document ALL dependency rules

### 6.2 Validation Rules

- [ ] Minimum window area: ___ m²
- [ ] Maximum window area: ___ m²
- [ ] Dimension ratio limits: ___
- [ ] Weight limits: ___
- [ ] Any forbidden combinations: ___

### 6.3 Error Messages

- [ ] List all possible validation errors
- [ ] Error message formats
- [ ] Error trigger conditions

---

## 7. POSTMESSAGE COMMUNICATION

### 7.1 Messages FROM Iframe TO Parent

- [ ] **Event 1:** `setFixedInfo`
  - Payload structure: ___
  - When triggered: ___
  
- [ ] **Event 2:** _______________
  - Payload structure: ___
  - When triggered: ___

### 7.2 Messages FROM Parent TO Iframe

- [ ] **Event 1:** _______________
  - Payload structure: ___
  - Purpose: ___

---

## 8. TECHNICAL SPECIFICATIONS

### 8.1 Data Formats

- [ ] **Price format:** German (1.234,56 €) / Other
- [ ] **Date format:** ___
- [ ] **Dimension unit:** mm / cm
- [ ] **Area calculation:** width × height / 1000000 = m²

### 8.2 Session/State Management

- [ ] How is configuration state stored?
- [ ] LocalStorage keys: ___
- [ ] SessionStorage keys: ___
- [ ] Cookies used: ___

### 8.3 External Dependencies

- [ ] jQuery version: ___
- [ ] Other libraries: ___
- [ ] CDN resources: ___

---

# PART B: QUICK STRUCTURE VERIFICATION (Other Products)
## Estimated Time: 15-30 minutes per product

---

## Purpose
Quickly determine if other configurators use the SAME structure, allowing us to reuse the backend with different price tables.

---

## Quick Check Checklist (Per Product)

**Product:** _______________
**URL:** _______________

### Step 1: Iframe Check (2 minutes)
- [ ] Open DevTools → Elements
- [ ] Find iframe element
- [ ] **Iframe source domain:** _______________
- [ ] **SAME as Drutex Kunststoff?** ✅ Yes / ❌ No

**If NO → STOP. This product needs separate analysis.**

### Step 2: API Endpoint Check (5 minutes)
- [ ] Open DevTools → Network → Filter XHR
- [ ] Change window width
- [ ] **API endpoint called:** _______________
- [ ] **SAME endpoint pattern as Drutex?** ✅ Yes / ❌ No

**If NO → Note the difference, continue checks.**

### Step 3: Response Structure Check (5 minutes)
- [ ] Look at API response JSON
- [ ] **Same JSON structure?** ✅ Yes / ❌ No
- [ ] **Same field names?** ✅ Yes / ❌ No
- [ ] **Price in same location?** ✅ Yes / ❌ No

### Step 4: Parameter Check (5 minutes)
- [ ] List visible configuration options
- [ ] **Same option categories?** ✅ Yes / ❌ No
- [ ] **Any EXTRA options?** _______________
- [ ] **Any MISSING options?** _______________

### Step 5: Price Calculation Spot Check (5 minutes)
- [ ] Set same dimensions as tested in Drutex
- [ ] Note the price: _______________
- [ ] **Different base price but same discount %?** ✅ Yes / ❌ No

### Step 6: PostMessage Check (3 minutes)
- [ ] Open Console
- [ ] Look for PostMessage events
- [ ] **Same event names?** ✅ Yes / ❌ No
- [ ] **Same payload structure?** ✅ Yes / ❌ No

---

## Quick Verdict Template

| Product | Same Iframe? | Same API? | Same Structure? | Action Needed |
|---------|--------------|-----------|-----------------|---------------|
| Drutex Kunststoff | BASELINE | BASELINE | BASELINE | Full analysis done |
| Gealan Kunststoff | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Aluplast Kunststoff | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Salamander Kunststoff | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Veka Kunststoff | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Holz Fenster | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Aluminium Fenster | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Holz-Alu Fenster | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Balkontüren | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| PSK-Türen | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| HST-Türen | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Haustüren | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |
| Rollläden | ✅/❌ | ✅/❌ | ✅/❌ | Reuse / Separate |

---

## Decision Matrix

### If ALL checks pass (✅ Yes):
→ **REUSE BACKEND** - Only need to collect:
1. Base price matrix for this product
2. Product-specific surcharges
3. Product-specific options list

### If API structure same but options differ:
→ **EXTEND BACKEND** - Need to:
1. Add new option types to backend
2. Collect new option data
3. Update validation rules

### If API structure different:
→ **SEPARATE MODULE** - Need to:
1. Full analysis like Part A
2. Separate backend module
3. Different integration approach

---

## Files to Create After Collection

1. `drutex_kunststoff_base_prices.csv` - Full price matrix
2. `drutex_kunststoff_surcharges.json` - All surcharges
3. `drutex_kunststoff_options.json` - All configuration options
4. `api_endpoints.json` - All discovered endpoints
5. `postmessage_protocol.json` - Communication format
6. `comparison_results.json` - Quick check results for all products

---

*Document Version: 1.0*
*Created: 2026-03-02*
*Purpose: Complete data collection for custom backend development*
