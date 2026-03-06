# Konfigurator Comparison Checklist

## Purpose
This checklist is used to verify if other materials/manufacturers use the **same calculation structure** as Drutex Kunststoff (our baseline), or if they have completely different calculations.

---

## Strategy Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Detailed Drutex Kunststoff Analysis (Current)         │
│  ✓ Full API mapping                                             │
│  ✓ Complete price calculation logic                             │
│  ✓ All parameters documented                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Comparison Testing (Next)                             │
│  → Check if other materials use SAME iframe/API structure       │
│  → Verify calculation pattern (same formula, different prices?) │
│  → Identify any material-specific differences                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Knowledge Base Creation                               │
│  IF similar structure:                                          │
│    → Collect base prices for each material/manufacturer         │
│    → Create unified KB with all price tables                    │
│    → Build ONE backend that handles all variants                │
│  IF different structure:                                        │
│    → Document differences per product type                      │
│    → Create separate calculation modules as needed              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Baseline: Drutex Kunststoff

**URL:** `https://www.fenstermaxx24.com/konfigurator/konfigurator-fenster/`

### Known Structure:
| Component | Details |
|-----------|---------|
| Iframe Source | `https://drutex.fensterblick.de/...` |
| Communication | PostMessage with `setFixedInfo` event |
| Price Format | German locale (1.234,56 €) |
| Discount | 40% (multiply by 0.6) |
| API Type | Likely server-rendered or internal API |

---

## Comparison Checklist Template

Use this checklist for EACH product type to compare against Drutex Kunststoff:

### Product Being Compared: ____________________

#### 1. URL & Iframe Structure
| Check | Drutex Kunststoff | This Product | Same? |
|-------|-------------------|--------------|-------|
| Parent Page URL | `/konfigurator/konfigurator-fenster/` | | ☐ |
| Iframe Source Domain | `drutex.fensterblick.de` | | ☐ |
| Iframe ID | `#configurator-iframe` | | ☐ |

**Conclusion:** ☐ Same ☐ Different

---

#### 2. API Endpoints & Response Format
| Check | Drutex Kunststoff | This Product | Same? |
|-------|-------------------|--------------|-------|
| Uses iframe internal API | Yes | | ☐ |
| API endpoint pattern | Unknown (to capture) | | ☐ |
| Response format | JSON | | ☐ |

**Conclusion:** ☐ Same ☐ Different

---

#### 3. Configuration Parameters
| Parameter | Drutex Kunststoff | This Product | Same? |
|-----------|-------------------|--------------|-------|
| Width (Breite) | 350-2500mm | | ☐ |
| Height (Höhe) | 350-2500mm | | ☐ |
| Profile Types | Multiple | | ☐ |
| Colors | Multiple per profile | | ☐ |
| Glass Types | Multiple | | ☐ |
| Handle Types | Multiple | | ☐ |
| Opening Types | Dreh, Kipp, Dreh-Kipp, etc. | | ☐ |

**Conclusion:** ☐ Same ☐ Different

---

#### 4. Price Calculation Pattern
| Check | Drutex Kunststoff | This Product | Same? |
|-------|-------------------|--------------|-------|
| Base price lookup | Size × Profile matrix | | ☐ |
| Color surcharge | Fixed or per m² | | ☐ |
| Glass surcharge | Fixed or per m² | | ☐ |
| 40% discount formula | `price × 0.6` | | ☐ |
| Price includes VAT | Yes (19%) | | ☐ |

**Formula Test:**
```
Change ONLY width from 500mm to 600mm
Expected: Price increases proportionally
Actual: ____________
Same pattern? ☐ Yes ☐ No
```

**Conclusion:** ☐ Same Formula (Different Prices) ☐ Different Formula

---

#### 5. PostMessage Communication
| Check | Drutex Kunststoff | This Product | Same? |
|-------|-------------------|--------------|-------|
| Event type | `setFixedInfo` | | ☐ |
| Contains price data | Yes | | ☐ |
| Contains product name | Yes | | ☐ |
| Format matches | HTML with spans | | ☐ |

**Conclusion:** ☐ Same ☐ Different

---

#### 6. Discount Logic
| Check | Drutex Kunststoff | This Product | Same? |
|-------|-------------------|--------------|-------|
| Shows original price | Yes (strikethrough) | | ☐ |
| Shows discounted price | Yes (bold) | | ☐ |
| Discount percentage | 40% | | ☐ |
| Discount in iframe or parent | Calculated in parent | | ☐ |

**Conclusion:** ☐ Same ☐ Different

---

## Products to Compare

### Kunststoff (Plastic/PVC) Windows
| Manufacturer | Compared? | Same Structure? | Notes |
|--------------|-----------|-----------------|-------|
| Drutex | ✅ BASELINE | N/A | Reference product |
| Gealan | ☐ | ☐ Same ☐ Different | |
| Aluplast | ☐ | ☐ Same ☐ Different | |
| Salamander | ☐ | ☐ Same ☐ Different | |
| Veka | ☐ | ☐ Same ☐ Different | |

### Other Materials
| Material | Compared? | Same Structure? | Notes |
|----------|-----------|-----------------|-------|
| Holz (Wood) | ☐ | ☐ Same ☐ Different | |
| Aluminium | ☐ | ☐ Same ☐ Different | |
| Holz-Alu | ☐ | ☐ Same ☐ Different | |
| Kunststoff-Alu | ☐ | ☐ Same ☐ Different | |

### Other Product Types
| Product | Compared? | Same Structure? | Notes |
|---------|-----------|-----------------|-------|
| Balkontüren | ☐ | ☐ Same ☐ Different | |
| Terrassentüren (PSK) | ☐ | ☐ Same ☐ Different | |
| Terrassentüren (HST) | ☐ | ☐ Same ☐ Different | |
| Haustüren | ☐ | ☐ Same ☐ Different | |
| Rollläden | ☐ | ☐ Same ☐ Different | |

---

## Quick Comparison Test

**Fastest way to check if structure is the same:**

1. Open DevTools Network tab
2. Load the new configurator
3. Check if iframe comes from same domain (`*.fensterblick.de`)
4. If YES → Likely same structure, just different prices
5. If NO → Likely different structure, needs separate analysis

---

## Final Determination

After completing comparisons:

### IF Most Products = SAME STRUCTURE:
→ **Build Unified Backend with Price Tables**

```
Backend Structure:
├── /api/calculate-price
│   ├── Uses: manufacturer_id, material_id
│   ├── Loads: price_table_{manufacturer}_{material}.json
│   └── Applies: Same formula for all
├── /price-tables/
│   ├── drutex_kunststoff.json
│   ├── gealan_kunststoff.json
│   ├── aluplast_kunststoff.json
│   └── ... (one per product)
```

### IF Products = DIFFERENT STRUCTURE:
→ **Build Modular Backend**

```
Backend Structure:
├── /api/calculate-price
│   └── Routes to appropriate module
├── /modules/
│   ├── kunststoff-calculator.js (for all plastic)
│   ├── holz-calculator.js (different formula)
│   ├── alu-calculator.js (different formula)
│   └── ...
```

---

## Notes

_Space for recording observations during comparison:_

```
[Date] [Product] [Observation]
────────────────────────────────────────────────
                                                
                                                
                                                
```
