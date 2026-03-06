# CATALOG MANAGEMENT SYSTEM
## How Your 14,000+ Products Will Be Imported Automatically

---

## ✅ YOUR QUESTIONS ANSWERED

### Q1: Can I upload the catalog and it takes over the data?
**YES!** You will upload an Excel/CSV file and the system will:
- Read all product data automatically
- Import into database
- Calculate selling prices based on your margin rules
- Categorize products automatically
- NO manual entry required

### Q2: Will my frontend pictures be preserved?
**YES!** The system has two separate fields:
- `cost_data` → From catalog (prices, specs, etc.)
- `images` → Your frontend images (NOT touched by catalog import)

When you re-upload a catalog, it updates prices/specs but **NEVER** overwrites your images.

### Q3: Will the system categorize automatically?
**YES!** Based on:
- Product names (contains "Fenster" → Windows category)
- Product codes (prefix-based)
- Manufacturer mapping rules
- You can define custom rules

### Q4: Can I set margins per category, per item, or whole catalog?
**YES!** Three levels of margin control:
1. **Global** → Apply to entire catalog (e.g., all products +45%)
2. **Category** → Apply to category (e.g., Windows +50%, Doors +40%)
3. **Individual** → Override specific products (e.g., Product X +60%)

**Priority:** Individual > Category > Global

### Q5: Discounts and Promotions?
**YES!** You can:
- Create time-limited promotions
- Apply discounts to categories/products
- Set "Sale" prices automatically calculated
- Schedule promotions (start/end dates)

---

## 📋 HOW CATALOG UPLOAD WORKS

### Step 1: Prepare Your Catalog File
You provide an Excel/CSV with columns like:
```
| SKU | Name | Category | Cost_Price | Manufacturer | Specs... |
|-----|------|----------|------------|--------------|----------|
| W001| Fenster Classic | Fenster | 150.00 | Drutex | ... |
| D001| Tür Premium | Türen | 250.00 | Salamander | ... |
```

### Step 2: Upload in CRM
- Go to CRM → Catalog Management → Import
- Select your Excel/CSV file
- Click "Import"

### Step 3: System Processes Automatically
```
┌──────────────────────────────────────────────────────────────┐
│                    CATALOG IMPORT PROCESS                    │
├──────────────────────────────────────────────────────────────┤
│ 1. Parse Excel/CSV file                                      │
│ 2. Validate data (required fields, formats)                  │
│ 3. Match to existing products (by SKU) or create new         │
│ 4. Auto-categorize based on rules                            │
│ 5. Apply margin rules to calculate selling prices            │
│ 6. Generate import report (success/errors)                   │
└──────────────────────────────────────────────────────────────┘
```

### Step 4: Review Import Report
- See how many products imported
- See any errors/warnings
- Fix issues and re-import if needed

### Step 5: Products Ready on Frontend
Prices are calculated, products are live!

---

## 💰 MARGIN CALCULATION SYSTEM

### How It Works

```
SELLING_PRICE = COST_PRICE × (1 + MARGIN_PERCENTAGE/100)
```

### Example:
- Cost Price: €100
- Margin: 50%
- **Selling Price: €100 × 1.5 = €150**

### Margin Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      MARGIN PRIORITY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HIGHEST PRIORITY                                               │
│  ┌───────────────────────┐                                      │
│  │ Product-Level Margin  │  (e.g., Product X = 60%)            │
│  └───────────────────────┘                                      │
│            ↓ (if not set, use...)                               │
│  ┌───────────────────────┐                                      │
│  │ Category-Level Margin │  (e.g., Windows = 50%)              │
│  └───────────────────────┘                                      │
│            ↓ (if not set, use...)                               │
│  ┌───────────────────────┐                                      │
│  │ Global Default Margin │  (e.g., All = 45%)                  │
│  └───────────────────────┘                                      │
│  LOWEST PRIORITY                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Your Margin Settings Table

| Category | Margin % | Example: €100 Cost → Selling Price |
|----------|----------|-----------------------------------|
| **Fenster (Windows)** | 50% | €100 → €150 |
| **Türen (Doors)** | 40% | €100 → €140 |
| **Rollläden** | 45% | €100 → €145 |
| **Zubehör** | 55% | €100 → €155 |
| **Global Default** | 45% | €100 → €145 |

You can change these anytime in CRM!

---

## 🔄 AUTO-CATEGORIZATION RULES

### Rule Types

1. **Name-Based** (Default)
   ```
   Product name contains "Fenster" → Category: Fenster
   Product name contains "Tür" → Category: Türen
   Product name contains "Rollladen" → Category: Rollläden
   ```

2. **SKU Prefix-Based**
   ```
   SKU starts with "W-" → Category: Fenster
   SKU starts with "D-" → Category: Türen
   SKU starts with "R-" → Category: Rollläden
   ```

3. **Manufacturer Mapping**
   ```
   If Manufacturer = "Drutex" AND Type = "Fenster" → Use Drutex pricing rules
   ```

4. **Custom Rules** (You Define)
   - Create any rule based on any column
   - Combine conditions (AND/OR)

---

## 🏷️ DISCOUNTS & PROMOTIONS SYSTEM

### Types of Discounts

| Type | Description | Example |
|------|-------------|---------|
| **Percentage** | X% off | 10% off all Windows |
| **Fixed Amount** | €X off | €50 off orders over €500 |
| **Category** | Apply to category | 15% off all Doors |
| **Product** | Apply to specific product | 20% off Product X |
| **Time-Limited** | Start/end dates | Summer Sale: June 1-30 |
| **Volume** | Quantity-based | Buy 5+, get 10% off |
| **Coupon Code** | Customer enters code | Code "SAVE10" = 10% off |

### Promotion Scheduling

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMOTION CALENDAR                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Promotion: "Spring Sale"                                       │
│  ├── Start Date: 2026-04-01 00:00                              │
│  ├── End Date: 2026-04-30 23:59                                │
│  ├── Discount: 15% off Windows                                  │
│  └── Status: SCHEDULED                                          │
│                                                                 │
│  System automatically:                                          │
│  ✅ Activates on start date                                     │
│  ✅ Deactivates on end date                                     │
│  ✅ Recalculates prices                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 PRICE DISPLAY CALCULATION

### Final Price Formula

```
FINAL_DISPLAY_PRICE = (COST_PRICE × (1 + MARGIN%)) - DISCOUNT

With VAT:
FINAL_WITH_VAT = FINAL_DISPLAY_PRICE × (1 + VAT%)
```

### Example Calculation

```
Product: Premium Fenster
├── Cost Price: €200 (from catalog)
├── Category Margin: 50%
├── Base Selling Price: €200 × 1.5 = €300
├── Active Promotion: 10% off Windows
├── After Discount: €300 × 0.9 = €270
├── VAT (19%): €270 × 1.19 = €321.30
└── DISPLAY PRICE: €321.30
```

---

## 🔧 CRM CATALOG MANAGEMENT INTERFACE

### What You'll See in CRM

```
┌─────────────────────────────────────────────────────────────────┐
│  📦 CATALOG MANAGEMENT                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [📤 Import Catalog]  [📥 Export Catalog]  [📊 Price Manager]   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 MARGIN SETTINGS                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Global Default Margin: [45%____] [Save]                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📁 CATEGORY MARGINS                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Fenster (Windows)     [50%____] [✓]                       │ │
│  │ Türen (Doors)         [40%____] [✓]                       │ │
│  │ Rollläden             [45%____] [✓]                       │ │
│  │ Zubehör               [55%____] [✓]                       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Apply Changes to All Products]                                │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 CATALOG STATISTICS                                          │
│  ├── Total Products: 14,523                                     │
│  ├── Active Products: 14,100                                    │
│  ├── Last Import: 2026-03-04 14:30                             │
│  └── Next Scheduled: N/A                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 CATALOG FILE FORMAT

### Required Columns (Minimum)

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `sku` | Text | ✅ YES | Unique product code |
| `name` | Text | ✅ YES | Product name |
| `cost_price` | Number | ✅ YES | Your cost (purchase price) |
| `manufacturer` | Text | ⚪ Optional | Brand name |
| `category` | Text | ⚪ Optional | Category name (auto-detected if empty) |

### Optional Columns (Auto-detected)

| Column | Type | Description |
|--------|------|-------------|
| `description` | Text | Product description |
| `weight` | Number | Product weight (kg) |
| `dimensions` | Text | Product dimensions |
| `material` | Text | Material type |
| `color` | Text | Available colors |
| `min_quantity` | Number | Minimum order quantity |
| `lead_time` | Number | Days to delivery |
| `is_active` | Boolean | Active/inactive |

### Sample Excel File

```
| sku    | name              | cost_price | manufacturer | category |
|--------|-------------------|------------|--------------|----------|
| W-001  | Fenster Classic   | 150.00     | Drutex       | Fenster  |
| W-002  | Fenster Premium   | 250.00     | Drutex       | Fenster  |
| D-001  | Tür Standard      | 180.00     | Salamander   | Türen    |
| D-002  | Tür Premium       | 320.00     | Salamander   | Türen    |
| R-001  | Rollladen Basic   | 120.00     | Drutex       | Rollläden|
```

---

## 🔄 CATALOG UPDATE BEHAVIOR

### What Happens When You Re-Import

| Data | Behavior |
|------|----------|
| **Cost Prices** | ✅ UPDATED from new catalog |
| **Product Names** | ✅ UPDATED from new catalog |
| **Specifications** | ✅ UPDATED from new catalog |
| **Categories** | ✅ UPDATED from new catalog |
| **Your Images** | ❌ NOT TOUCHED (preserved) |
| **Your Descriptions** | ❌ NOT TOUCHED (preserved) |
| **Your Custom Margins** | ❌ NOT TOUCHED (preserved) |
| **Selling Prices** | ✅ RECALCULATED with new costs |

### Match Products By

Products are matched by `SKU` (unique code):
- If SKU exists → UPDATE existing product
- If SKU doesn't exist → CREATE new product
- If SKU in database but NOT in new catalog → Keep or mark inactive (your choice)

---

## 🚀 PHASES FOR CATALOG SYSTEM

### Phase 2: Pricing Engine (Weeks 5-8)
- ✅ Margin calculation engine
- ✅ Category margin rules
- ✅ Product-level overrides
- ✅ VAT calculation
- ✅ Price display formatting

### Phase 4: CRM Foundation (Weeks 15-18)
- ✅ Catalog import/export
- ✅ Product management interface
- ✅ Margin management UI
- ✅ Auto-categorization rules
- ✅ Import validation & reporting

### Phase 5: Frontend Integration (Weeks 19-22)
- ✅ Price display on frontend
- ✅ Promotion display
- ✅ Category filtering
- ✅ Search with pricing

---

## ✅ CONFIRMATION: ALL FEATURES INCLUDED

| Feature | Status | Phase |
|---------|--------|-------|
| Excel/CSV catalog import | ✅ PLANNED | Phase 4 |
| Auto-categorization | ✅ PLANNED | Phase 4 |
| Global margin settings | ✅ PLANNED | Phase 2 |
| Category margin settings | ✅ PLANNED | Phase 2 |
| Product-level margin override | ✅ PLANNED | Phase 2 |
| Image preservation on import | ✅ PLANNED | Phase 4 |
| Price recalculation | ✅ PLANNED | Phase 2 |
| Discount/promotion system | ✅ PLANNED | Phase 2 |
| Scheduled promotions | ✅ PLANNED | Phase 4 |
| Import validation & reporting | ✅ PLANNED | Phase 4 |
| Bulk price updates | ✅ PLANNED | Phase 4 |
| Export catalog | ✅ PLANNED | Phase 4 |

---

## 💡 OPTIMIZATION SUGGESTIONS

1. **Catalog Versioning** - Keep history of all imports (can rollback if needed)
2. **Price Change Alerts** - Notify when prices change significantly
3. **Scheduled Imports** - Auto-import from URL at specific times
4. **Duplicate Detection** - Warn about potential duplicate products
5. **Category Suggestions** - AI-based category recommendations
6. **Profit Report** - Show expected profit per category/product

---

## 📝 SUMMARY

**YOU WILL NOT:**
- Enter 14,000 products manually ❌
- Calculate prices manually ❌
- Categorize products manually ❌
- Lose your images on re-import ❌

**THE SYSTEM WILL:**
- Import your Excel/CSV automatically ✅
- Calculate all prices from your margins ✅
- Categorize products automatically ✅
- Preserve your frontend images ✅
- Apply discounts/promotions automatically ✅
- Recalculate prices when costs change ✅

---

## Ready to Continue?

This catalog system is built into the foundation we're creating now. The database schema already has:
- `products.cost_price` → Your purchase cost
- `products.selling_price` → Calculated selling price
- `products.margin_override` → Product-specific margin
- `products.images` → Your frontend images (separate!)
- `categories.default_margin` → Category margin settings

Everything is prepared for this functionality!
