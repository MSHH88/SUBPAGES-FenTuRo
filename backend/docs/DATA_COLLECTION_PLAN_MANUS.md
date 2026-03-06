# DATA COLLECTION PLAN FOR PRIORITY VERIFICATION

## Prepared for: Manus
## Date: 2026-03-05
## Purpose: Collect calculation data to verify ONE pricing engine works for all products

---

## OVERVIEW

We need data from 3 different products to confirm all use the same calculation pattern:

| Product | Material | Manufacturer | Why |
|---------|----------|--------------|-----|
| Fenster Kunststoff | Kunststoff | Gealan | Different manufacturer, same material |
| Balkonturen Kunststoff | Kunststoff | Any | Different product type, same material |
| Fenster Holz | Holz | Any | Same product, different material |

---

## TOOLS NEEDED

1. Chrome/Firefox with DevTools (F12)
2. Text editor for saving data
3. Access to fensterblick.de or similar configurator site
4. Python (optional, for running extraction scripts)

---

## DATA COLLECTION TASK 1: Fenster Kunststoff - Gealan

### Goal: Get base prices and surcharges for Gealan (NOT Drutex)

### Step 1.1: Navigate to Configurator

1. Go to fensterblick.de Fensterkonfigurator
2. Select Material: Kunststoff
3. Select Manufacturer: Gealan (NOT Drutex)
4. Select any Profile (e.g., Gealan S8000)

### Step 1.2: Open DevTools Network Tab

1. Press F12 to open DevTools
2. Go to "Network" tab
3. Filter by "XHR" or "Fetch"
4. Refresh the page

### Step 1.3: Capture Base Price API Call

1. Look for API calls containing: "price", "calc", "config", "obj_konfig"
2. Click on each call
3. Check "Response" tab for JSON data
4. Look for patterns like:
   - "grundpreis" or "base_price"
   - "preise" or "prices"
   - Arrays with width/height/price combinations

### Step 1.4: Extract Base Price Matrix

Record all width/height combinations and prices in this format:

```csv
width,height,base_price
500,500,XXX.XX
500,600,XXX.XX
600,600,XXX.XX
...continue for all sizes
```

### Step 1.5: Capture Surcharges

1. In DevTools, look for "surcharges", "aufpreise", "zuschlaege"
2. Or manually click through options and record price changes:

#### Profile Surcharges:
| Profile | Price Change | Multiplier (if any) |
|---------|-------------|---------------------|
| Profile 1 | +/- EUR | x.xxxx |
| Profile 2 | +/- EUR | x.xxxx |

#### Color Surcharges:
| Color Name | Exterior Price | Interior Price |
|------------|---------------|----------------|
| Weiss | EUR | EUR |
| Anthrazit | EUR | EUR |
| (each color) | EUR | EUR |

#### Glass Surcharges:
| Glass Type | Price per Unit | Notes |
|------------|---------------|-------|
| 2-fach Standard | EUR | |
| 3-fach Warme | EUR | |
| (each type) | EUR | |

#### Other Surcharges:
| Option | Price |
|--------|-------|
| V-Perfect | EUR |
| Schallschutz | EUR |
| Sicherheitsglas | EUR |
| (each option) | EUR |

### Step 1.6: Verify Discount Formula

1. Configure a complete window
2. Note the "Preisempfehlung" (original price)
3. Note the "Angebotspreis" (discounted price)
4. Calculate: Angebotspreis / Preisempfehlung = ?
   - Should be 0.60 (40% discount) like Drutex

### Step 1.7: Save HTML File

1. Right-click on page
2. Select "Save Page As"
3. Save as: Fenster.Konfigurator.Kunststoff.Gealan.html

---

## DATA COLLECTION TASK 2: Balkonturen Kunststoff

### Goal: Verify same calculation pattern as Fenster

### Step 2.1: Navigate to Balkonturen Configurator

1. Go to Balkonturen Konfigurator (any site)
2. Select Material: Kunststoff
3. Select any Manufacturer

### Step 2.2: Compare Structure to Fenster

Check if these are the SAME or DIFFERENT from Fenster:

| Element | Fenster Has | Balkonturen Has | Same/Different |
|---------|-------------|-----------------|----------------|
| Base price matrix (width x height) | Yes | ? | |
| Profile multipliers | Yes | ? | |
| Color surcharges (exterior) | Yes | ? | |
| Color surcharges (interior) | Yes | ? | |
| Glass surcharges | Yes | ? | |
| Handle options | Yes | ? | |
| V-Perfect option | Yes | ? | |
| Discount formula (x0.60) | Yes | ? | |

### Step 2.3: Check for UNIQUE Options

List any options that Balkonturen has that Fenster does NOT:

| Unique Option | Description | Price Change |
|---------------|-------------|--------------|
| | | |
| | | |

### Step 2.4: Extract Sample Prices

For dimension 1000mm x 2000mm (typical balcony door):

| Option | Price |
|--------|-------|
| Base price | EUR |
| + Color Anthrazit | +EUR |
| + 3-fach Glas | +EUR |
| = Total before discount | EUR |
| x 0.60 discount | EUR |
| = Final price | EUR |

### Step 2.5: Save HTML File

Save as: Balkonturen.Konfigurator.Kunststoff.html

---

## DATA COLLECTION TASK 3: Fenster Holz

### Goal: Verify different material uses same formula

### Step 3.1: Navigate to Holzfenster Configurator

1. Go to Fensterkonfigurator
2. Select Material: Holz
3. Select any Manufacturer (e.g., Internorm, Actual)

### Step 3.2: Check Calculation Structure

Verify these elements exist:

| Element | Exists? | Same Format as Kunststoff? |
|---------|---------|---------------------------|
| Base price matrix | ? | ? |
| Profile options | ? | ? |
| Wood type options (Fichte, Eiche, etc.) | ? | N/A - unique to Holz |
| Color/Lasur options | ? | ? |
| Glass options | ? | ? |

### Step 3.3: Document Unique Options for Holz

| Unique Holz Option | Description | Price Impact |
|--------------------|-------------|--------------|
| Wood type | Fichte, Kiefer, Eiche, etc. | +EUR |
| Lasur type | Various finishes | +EUR |
| (other unique options) | | |

### Step 3.4: Verify Formula

1. Configure a complete Holz window (e.g., 1000 x 1000)
2. Record: Preisempfehlung = EUR ____
3. Record: Angebotspreis = EUR ____
4. Calculate: Angebotspreis / Preisempfehlung = ____ (should be 0.60)

### Step 3.5: Save HTML File

Save as: Fenster.Konfigurator.Holz.html

---

## API ENDPOINT EXTRACTION (ADVANCED)

If Manus has technical skills, also extract:

### DevTools Console Commands

Open DevTools Console (F12 > Console) and run:

```javascript
// Find all API endpoints being called
performance.getEntriesByType("resource")
  .filter(r => r.name.includes("api") || r.name.includes("config"))
  .map(r => r.name);
```

```javascript
// Find price calculation functions in page code
Array.from(document.scripts)
  .filter(s => s.innerHTML.includes("preis") || s.innerHTML.includes("price"))
  .map(s => s.src || "inline script");
```

### Look for These API Patterns

| Pattern | Example | What It Contains |
|---------|---------|------------------|
| /api/konfig/* | /api/konfig/preise | Price data |
| /api/v1/products/* | /api/v1/products/123 | Product config |
| postMessage | window.postMessage() | Config communication |

---

## DELIVERABLES CHECKLIST

After completing all tasks, Manus should provide:

### Files to Save:

- [ ] Fenster.Konfigurator.Kunststoff.Gealan.html
- [ ] Balkonturen.Konfigurator.Kunststoff.html
- [ ] Fenster.Konfigurator.Holz.html
- [ ] gealan_kunststoff_base_prices.csv (if extracted)
- [ ] gealan_kunststoff_surcharges.json (if extracted)
- [ ] balkonturen_kunststoff_base_prices.csv (if extracted)
- [ ] holz_fenster_base_prices.csv (if extracted)

### Questions to Answer:

1. Does Gealan use same calculation formula as Drutex? YES/NO
2. Does Balkonturen use same calculation formula as Fenster? YES/NO
3. Does Holz use same base calculation formula? YES/NO
4. Is discount always 40% (x0.60) across all products? YES/NO
5. List any UNIQUE surcharges per product type:
   - Balkonturen unique: _______________
   - Holz unique: _______________

---

## EXPECTED OUTCOME

If all 3 products use same formula:
- ONE pricing engine handles ALL products
- Different data tables per product/manufacturer
- Same calculation logic

If formulas differ:
- Note which product has different formula
- Document the difference
- We may need product-specific calculation modules

---

## CONTACT

Questions about this plan: Contact project lead
Technical issues with extraction: Open GitHub issue

---

## REFERENCE: Known Calculation Formula (Drutex Kunststoff)

```
Grundpreis = Base_Matrix[width][height]
Profile_Price = Grundpreis x Profile_Multiplier
Total = Profile_Price + Color_Ext + Color_Int + Glass + V_Perfect + Options
Preisempfehlung = Total
Angebotspreis = Preisempfehlung x 0.60
```

This is what we are verifying matches across all products.
