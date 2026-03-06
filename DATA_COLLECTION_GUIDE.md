# Complete Data Collection Guide for Konfigurator Backend

## Overview

This document provides step-by-step instructions for manually collecting ALL data needed to build a functioning custom backend. Follow each section carefully and document everything in the specified format.

---

## What We Need (Complete List)

### ✅ CATEGORY 1: API Endpoints & Network Traffic
### ✅ CATEGORY 2: Configuration Parameters (All Options)
### ✅ CATEGORY 3: Pricing Data (Base Prices & Surcharges)
### ✅ CATEGORY 4: Business Logic Rules
### ✅ CATEGORY 5: UI-to-Backend Mapping

---

## CATEGORY 1: API Endpoints & Network Traffic

### What to Collect:

#### 1.1 Iframe Source URL
```
When you load the configurator page, find the iframe element and get its src URL.
This is the actual configurator application URL.

Example: The iframe might load from something like:
https://configurator.fenstermaxx24.com/...
or
https://www.fenstermaxx24.com/wp-content/plugins/custom-configurator/...
```

**How to find it:**
1. Open Chrome DevTools (F12)
2. Go to Elements tab
3. Search for `<iframe` 
4. Copy the `src` attribute value

**Record this:**
```
IFRAME_SOURCE_URL: ________________________________
```

#### 1.2 All XHR/Fetch Requests (Inside Iframe)

**CRITICAL: You need to capture requests FROM INSIDE the iframe, not just the parent page.**

**How to do it:**
1. Open the configurator: https://www.fenstermaxx24.com/konfigurator/konfigurator-fenster/
2. Open Chrome DevTools (F12)
3. Go to Network tab
4. Check "Preserve log"
5. Filter by "Fetch/XHR"
6. **IMPORTANT:** Right-click the iframe in Elements tab → "Reload frame" to see iframe's network requests
7. Or: In DevTools, click the dropdown at top that says "top" and select the iframe context

**Change each option and record:**

| Action | Request URL | Method | Payload |
|--------|-------------|--------|---------|
| Page load | | | |
| Change width to 500mm | | | |
| Change height to 800mm | | | |
| Change profile type | | | |
| Change color | | | |
| Change glass type | | | |
| Add handle | | | |
| Change opening direction | | | |
| Add drip bar | | | |
| Change frame depth | | | |

**For each request, copy the FULL payload:**
- Right-click request → Copy → Copy as cURL
- Or click request → Headers tab → Request Payload

---

## CATEGORY 2: Configuration Parameters (All Options)

### 2.1 Window Dimensions

**Record the exact min/max values:**

```
WIDTH:
  - Minimum: ______ mm
  - Maximum: ______ mm
  - Default: ______ mm
  - Step: ______ mm (e.g., can you enter 351 or only 350, 360, etc?)

HEIGHT:
  - Minimum: ______ mm
  - Maximum: ______ mm  
  - Default: ______ mm
  - Step: ______ mm
```

### 2.2 Profile Types (Profiltypen)

**List ALL available profiles with their IDs:**

| Profile Name | Internal ID/Value | Available? |
|--------------|------------------|------------|
| IGLO 5 | | |
| IGLO 5 Classic | | |
| IGLO Energy | | |
| IGLO Energy Classic | | |
| IGLO Light | | |
| (any others) | | |

**How to find internal IDs:**
1. Inspect element on profile selector
2. Look for `value` attributes or `data-*` attributes
3. Check Network tab when selecting each profile

### 2.3 Color Options (Farbauswahl)

**For EACH profile type, record available colors:**

```
PROFILE: IGLO 5
AVAILABLE COLORS:
| Color Name | Internal ID | Color Code/RAL | Surcharge (€) |
|------------|-------------|----------------|---------------|
| Weiß (White) | | | 0.00 |
| Anthrazit | | | |
| Golden Oak | | | |
| Nussbaum | | | |
| ... | | | |
```

**Important:** Some colors are only available for certain profiles! Document which.

### 2.4 Glass Types (Glasauswahl)

```
| Glass Name | Internal ID | U-Value | Surcharge (€/m²) |
|------------|-------------|---------|------------------|
| 2-fach Verglasung Standard | | | |
| 2-fach Verglasung Wärmedämm | | | |
| 3-fach Verglasung Standard | | | |
| 3-fach Verglasung Wärmedämm | | | |
| Ornamentglas | | | |
| Sicherheitsglas | | | |
| Schallschutzglas | | | |
| ... | | | |
```

### 2.5 Handle Types (Griffauswahl)

```
| Handle Name | Internal ID | Color | Surcharge (€) |
|-------------|-------------|-------|---------------|
| Standard weiß | | | 0.00 |
| Standard silber | | | |
| Secustik | | | |
| Abschließbar | | | |
| ... | | | |
```

### 2.6 Hardware/Accessories (Beschläge & Zusätze)

```
| Option Name | Internal ID | Surcharge (€) | Surcharge Type |
|-------------|-------------|---------------|----------------|
| Dünne Schweißnaht V-Perfect | | 0.66 | per piece |
| Pilzkopfverriegelung | | | per piece |
| Flügelheber | | | per piece |
| Tropfleiste (Drip bar) | | | per piece |
| Insektenschutz | | | per m² |
| Rolladen | | | per window |
| ... | | | |
```

### 2.7 Opening Types (Öffnungsart)

```
| Opening Type | Internal ID | Description |
|--------------|-------------|-------------|
| Fest (Fixed) | | |
| Dreh (Turn) | | |
| Kipp (Tilt) | | |
| Dreh-Kipp links | | |
| Dreh-Kipp rechts | | |
| ... | | |
```

### 2.8 Frame Depths (Rahmentiefen)

```
| Frame Depth | Internal ID | Surcharge (€) |
|-------------|-------------|---------------|
| 70mm | | |
| 76mm | | |
| 82mm | | |
| ... | | |
```

---

## CATEGORY 3: Pricing Data

### 3.1 Base Price Matrix

**This is the MOST IMPORTANT data. We need the base price for EACH combination of:**

- Profile type × Width × Height

**MINIMUM: Capture prices at these dimension points:**

```
WIDTH (mm): 350, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500
HEIGHT (mm): 350, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800
```

**For EACH profile type, create a price matrix:**

```
PROFILE: IGLO 5 (or whatever the default is)
SETTINGS: Default color (white), Default glass, No extras

| Width↓ / Height→ | 500mm | 600mm | 700mm | 800mm | 900mm | 1000mm | ... |
|------------------|-------|-------|-------|-------|-------|--------|-----|
| 400mm | €___ | €___ | €___ | €___ | €___ | €___ | |
| 500mm | €___ | €___ | €___ | €___ | €___ | €___ | |
| 600mm | €___ | €___ | €___ | €___ | €___ | €___ | |
| 700mm | €___ | €___ | €___ | €___ | €___ | €___ | |
| 800mm | €___ | €___ | €___ | €___ | €___ | €___ | |
| ... | | | | | | | |
```

**IMPORTANT:** Record the ORIGINAL price (before 40% discount), not the discounted price!
The displayed "old price" with strikethrough is what we need.

### 3.2 Surcharge Prices

**For EACH surcharge option, we need:**

1. **Fixed surcharges** (same price regardless of window size):
```
| Option | Surcharge (€) |
|--------|---------------|
| V-Perfect Schweißnaht | 0.66 |
| Handle upgrade to Secustik | |
| ... | |
```

2. **Size-dependent surcharges** (per m² or percentage):
```
| Option | Calculation Method | Rate |
|--------|-------------------|------|
| Color upgrade | per m² | €___/m² |
| Special glass | per m² | €___/m² |
| ... | | |
```

### 3.3 Discount Rules

```
CURRENT DISCOUNT: 40% (multiply by 0.6)

Are there other discounts?
- Quantity discount: _______________
- Seasonal discount: _______________
- Other: _______________
```

---

## CATEGORY 4: Business Logic Rules

### 4.1 Option Dependencies

**Which options depend on other options?**

```
RULE 1: If profile = "IGLO 5", available colors = [list]
RULE 2: If profile = "IGLO Energy", available colors = [list]
RULE 3: If glass = "3-fach", minimum frame depth = ___mm
RULE 4: If width > ___mm, opening type "Dreh-Kipp" not available
...
```

### 4.2 Dimension Constraints

```
RULE: Maximum window area = _____ m²
RULE: If width > ___mm AND height > ___mm, then _____
RULE: Minimum glass area = _____ m²
...
```

### 4.3 Price Calculation Order

**In what order are prices calculated?**

```
1. Base price (from width × height × profile matrix)
2. + Color surcharge
3. + Glass surcharge
4. + Handle surcharge
5. + Accessories surcharges
6. = Subtotal
7. × Discount (0.6 for 40% off)
8. = Final price
```

**OR is it different?** Document exactly how they calculate.

---

## CATEGORY 5: UI-to-Backend Mapping

### 5.1 Summary Box Content

**The "MEIN DRUTEX KUNSTSTOFF FENSTER" summary box shows:**

```
| Display Label | Internal Parameter Name | Format |
|---------------|------------------------|--------|
| Breite | width | ___mm |
| Höhe | height | ___mm |
| Profil | profile_id | text |
| Farbe | color_id | text |
| Verglasung | glass_id | text |
| Griff | handle_id | text |
| Öffnung | opening_type | text |
| ... | ... | ... |
```

### 5.2 Price Display Format

```
OLD PRICE FORMAT: "1.199,90 €" (strikethrough)
NEW PRICE FORMAT: "719,94 €" (bold)

HTML STRUCTURE:
<span style="text-decoration: line-through;">1.199,90 €</span>
<strong>719,94 €</strong>
```

---

## HOW TO COLLECT THIS DATA

### Step-by-Step Process:

#### Session 1: API Discovery (30 min)
1. Open configurator in Chrome
2. Open DevTools → Network tab
3. Enable "Preserve log"
4. Load page, change ONE setting at a time
5. For each change, record:
   - The request URL
   - The request payload (JSON)
   - The response (JSON)
6. Export as HAR file: Right-click in Network tab → "Save all as HAR with content"

#### Session 2: Option Documentation (45 min)
1. Go through EVERY dropdown/selector in the configurator
2. For each option:
   - Inspect element to get internal IDs
   - Note the display name
   - Note any dependencies (grayed out options)

#### Session 3: Price Matrix (60+ min)
1. Set configurator to DEFAULT settings (white, basic glass, no extras)
2. Systematically change width from min to max
3. For each width, change height from min to max
4. Record the OLD price (strikethrough price) for each combination
5. Repeat for each profile type

#### Session 4: Surcharge Testing (45 min)
1. Set to a known base configuration
2. Record the price
3. Change ONE option
4. Record new price
5. Calculate surcharge = new price - old price
6. Repeat for every option

---

## OUTPUT FORMAT

Please provide data in these formats:

### For API Endpoints (copy-paste the HAR file content or):
```json
{
  "endpoint": "/api/calculate-price",
  "method": "POST",
  "payload": {
    "width": 500,
    "height": 800,
    "profile_id": "iglo5",
    ...
  },
  "response": {
    "base_price": 299.90,
    "surcharges": [...],
    "total": 179.94
  }
}
```

### For Price Matrix:
```csv
width,height,profile,base_price
350,500,iglo5,199.90
350,600,iglo5,219.90
400,500,iglo5,229.90
...
```

### For Options:
```json
{
  "profiles": [
    {"id": "iglo5", "name": "IGLO 5", "frame_depth": 70},
    {"id": "iglo_energy", "name": "IGLO Energy", "frame_depth": 82}
  ],
  "colors": [
    {"id": "white", "name": "Weiß", "surcharge": 0, "available_for": ["iglo5", "iglo_energy"]},
    {"id": "anthracite", "name": "Anthrazit", "surcharge": 25.50, "available_for": ["iglo5"]}
  ]
}
```

---

## PRIORITY ORDER

If time is limited, collect in this order:

1. **HIGHEST PRIORITY:** API endpoints & JSON payloads (this tells us how the system works)
2. **HIGH PRIORITY:** Base price matrix for ONE profile type
3. **MEDIUM PRIORITY:** All option IDs and names
4. **MEDIUM PRIORITY:** Surcharge prices
5. **LOWER PRIORITY:** Price matrices for other profile types
6. **LOWER PRIORITY:** Business logic rules

---

## Questions to Answer While Collecting

1. Does the iframe load from the same domain or a different domain?
2. Is authentication/session required for API calls?
3. Are prices calculated client-side (JavaScript) or server-side (API)?
4. Is there a "product ID" system or is everything calculated dynamically?
5. How is the cart/order system integrated?

---

## File to Create

After collecting, create a file called `COLLECTED_DATA.md` with all the information organized by category.

Or better: Export raw data as:
- `api_requests.har` (HAR export from Chrome)
- `price_matrix.csv` (Excel/CSV of prices)
- `options.json` (All configuration options)
