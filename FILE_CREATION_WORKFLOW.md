# File Creation Workflow - Step by Step

## Overview: WHEN to Create Each File

The files are created in a **specific order** during the data collection process. Here's the exact sequence:

---

## PHASE 1: Initial Baseline Collection (Drutex Kunststoff Only)
**Do this FIRST, before any comparison**

### Files to Create DURING Initial Data Collection:

```
📁 konfigurator-data/
├── 📄 api_endpoints.json              ← CREATE DURING STEP 1
├── 📄 postmessage_protocol.json       ← CREATE DURING STEP 1
├── 📄 drutex_kunststoff_options.json  ← CREATE DURING STEP 2
├── 📄 drutex_kunststoff_surcharges.json ← CREATE DURING STEP 3
└── 📄 drutex_kunststoff_base_prices.csv ← CREATE DURING STEP 3
```

### When to Create Each:

| Step | What You're Doing | File to Create | When |
|------|-------------------|----------------|------|
| 1 | Network analysis (DevTools) | `api_endpoints.json` | As you discover each endpoint |
| 1 | PostMessage analysis | `postmessage_protocol.json` | As you capture messages |
| 2 | Document all options | `drutex_kunststoff_options.json` | After clicking through all dropdowns |
| 3 | Collect prices | `drutex_kunststoff_surcharges.json` | After documenting all surcharges |
| 3 | Build price matrix | `drutex_kunststoff_base_prices.csv` | After testing dimension combinations |

---

## PHASE 2: Quick Comparison (Other Products)
**Do this AFTER Phase 1 is complete**

### File to Create DURING Comparison:

```
📁 konfigurator-data/
└── 📄 comparison_results.json         ← CREATE DURING PHASE 2
```

### When:
- Create this file as you check each other product
- Fill in results for each product as you test them

---

## PHASE 3: After Comparison (Conditional)
**What to do depends on comparison results**

### IF All Products Use Same Structure:
```
📁 konfigurator-data/
├── 📄 gealan_kunststoff_base_prices.csv    ← Just add price files
├── 📄 aluplast_kunststoff_base_prices.csv
├── 📄 holz_fenster_base_prices.csv
├── 📄 ... (one per product)
└── 📄 unified_options.json                  ← Merge all options into one
```

### IF Some Products Differ:
```
📁 konfigurator-data/
├── 📁 fenster/                              ← Separate folders
│   ├── api_endpoints.json
│   └── ...
├── 📁 haustueren/                           ← Different structure
│   ├── api_endpoints.json                   ← NEW file needed
│   └── ...
```

---

## Summary: Exact Order

### YOU DO THIS:

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Open Drutex Kunststoff konfigurator in Chrome           │
│         Open DevTools → Network tab                             │
│         ↓                                                       │
│         CREATE: api_endpoints.json (as you find endpoints)      │
│         CREATE: postmessage_protocol.json (as you see messages) │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Click through ALL configuration options                 │
│         Document every dropdown, every choice                   │
│         ↓                                                       │
│         CREATE: drutex_kunststoff_options.json                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Test price changes                                      │
│         Change dimensions, note prices                          │
│         Change options, note surcharges                         │
│         ↓                                                       │
│         CREATE: drutex_kunststoff_surcharges.json               │
│         CREATE: drutex_kunststoff_base_prices.csv               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
           ═══════════════════════════════════════
              PHASE 1 COMPLETE - BASELINE DONE
           ═══════════════════════════════════════
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Quick check other products (15-30 min each)             │
│         Just verify: Same iframe? Same API? Same structure?     │
│         ↓                                                       │
│         CREATE: comparison_results.json (fill in as you go)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Based on comparison results:                            │
│         • If SAME → Just collect base prices for other products │
│         • If DIFFERENT → Create separate files for that product │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Templates (Empty Starting Point)

### 1. api_endpoints.json (create first)
```json
{
  "product": "drutex_kunststoff",
  "collected_date": "2026-03-02",
  "endpoints": []
}
```

### 2. postmessage_protocol.json
```json
{
  "product": "drutex_kunststoff",
  "collected_date": "2026-03-02",
  "iframe_to_parent": [],
  "parent_to_iframe": []
}
```

### 3. drutex_kunststoff_options.json
```json
{
  "product": "drutex_kunststoff",
  "collected_date": "2026-03-02",
  "dimensions": {},
  "profiles": [],
  "opening_types": [],
  "colors": [],
  "glass": [],
  "handles": [],
  "hardware": [],
  "extras": []
}
```

### 4. drutex_kunststoff_surcharges.json
```json
{
  "product": "drutex_kunststoff",
  "collected_date": "2026-03-02",
  "fixed_surcharges": [],
  "per_sqm_surcharges": [],
  "percentage_surcharges": []
}
```

### 5. drutex_kunststoff_base_prices.csv
```csv
width_mm,height_mm,profile_id,base_price_eur
350,350,iglo5,XXX.XX
400,350,iglo5,XXX.XX
...
```

### 6. comparison_results.json (create during Phase 2)
```json
{
  "baseline": "drutex_kunststoff",
  "comparison_date": "2026-03-02",
  "products": [
    {
      "name": "gealan_kunststoff",
      "url": "...",
      "same_iframe_domain": null,
      "same_api_structure": null,
      "same_options": null,
      "same_calculation": null,
      "verdict": null,
      "notes": ""
    }
  ]
}
```

---

## Quick Answer to Your Question:

**YES, create the files DURING the initial search:**

1. ✅ `api_endpoints.json` - Create as you discover endpoints
2. ✅ `postmessage_protocol.json` - Create as you capture messages
3. ✅ `drutex_kunststoff_options.json` - Create after documenting options
4. ✅ `drutex_kunststoff_surcharges.json` - Create after documenting prices
5. ✅ `drutex_kunststoff_base_prices.csv` - Create after testing dimensions

**THEN after comparing:**

6. ✅ `comparison_results.json` - Create during comparison phase

**The files are PROGRESSIVE** - you build them as you collect data, not after everything is done.
