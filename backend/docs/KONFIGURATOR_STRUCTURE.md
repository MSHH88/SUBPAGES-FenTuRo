# CURIA Konfigurator - Complete Structure Documentation

## Overview

This document captures the complete structure of the Fenster, Türen, and Rollläden Konfigurator system.

---

## 🏠 PRODUCT HIERARCHY

### Level 1: Product Categories (5)
1. **Fensterkonfigurator** (Windows)
2. **Balkontürkonfigurator** (Balcony Doors)
3. **Terrassentürkonfigurator** (Terrace Doors)
4. **Türenkonfigurator** (Entry Doors)
5. **Rolladenkonfigurator** (Shutters)

### Level 2: Products (27 Total)

#### Fensterkonfigurator (7 products):
| # | Product | URL Slug |
|---|---------|----------|
| 1 | Kunststofffenster | `/konfigurator/fenster/kunststoff` |
| 2 | Kunststoff-Alu Fenster | `/konfigurator/fenster/kunststoff-alu` |
| 3 | Alu Fenster | `/konfigurator/fenster/alu` |
| 4 | Holzfenster | `/konfigurator/fenster/holz` |
| 5 | Holz-Alu Fenster | `/konfigurator/fenster/holz-alu` |
| 6 | Schiebefenster | `/konfigurator/fenster/schiebe` |

#### Balkontürkonfigurator (5 products):
| # | Product | URL Slug |
|---|---------|----------|
| 1 | Kunststoff Balkontür | `/konfigurator/balkontuer/kunststoff` |
| 2 | Kunststoff-Alu Balkontür | `/konfigurator/balkontuer/kunststoff-alu` |
| 3 | Alu Balkontür | `/konfigurator/balkontuer/alu` |
| 4 | Holz Balkontür | `/konfigurator/balkontuer/holz` |
| 5 | Holz-Alu Balkontür | `/konfigurator/balkontuer/holz-alu` |

#### Terrassentürkonfigurator (4 products):
| # | Product | URL Slug |
|---|---------|----------|
| 1 | Parallel-Schiebe-Kipptür (PSK) | `/konfigurator/terrassentuer/psk` |
| 2 | Smart-Slide-Schiebetür | `/konfigurator/terrassentuer/smart-slide` |
| 3 | Hebe-Schiebetür (HST) | `/konfigurator/terrassentuer/hst` |
| 4 | Falt-Schiebetür | `/konfigurator/terrassentuer/falt` |

#### Türenkonfigurator (6 products):
| # | Product | URL Slug |
|---|---------|----------|
| 1 | Kunststoff Haustür | `/konfigurator/haustuer/kunststoff` |
| 2 | Alu Haustür | `/konfigurator/haustuer/alu` |
| 3 | Holz Haustür | `/konfigurator/haustuer/holz` |
| 4 | Kunststoff Nebeneingangstür | `/konfigurator/nebeneingangstuer/kunststoff` |
| 5 | Alu Nebeneingangstür | `/konfigurator/nebeneingangstuer/alu` |
| 6 | Holz Nebeneingangstür | `/konfigurator/nebeneingangstuer/holz` |

#### Rolladenkonfigurator (5 products):
| # | Product | URL Slug |
|---|---------|----------|
| 1 | Aufsatzrollladen | `/konfigurator/rollladen/aufsatz` |
| 2 | Styropor Aufsatzrollladen | `/konfigurator/rollladen/styropor-aufsatz` |
| 3 | Vorsatzrollladen | `/konfigurator/rollladen/vorsatz` |
| 4 | Raffstore | `/konfigurator/rollladen/raffstore` |
| 5 | Insektenschutz-Plissee | `/konfigurator/rollladen/insektenschutz` |

**TOTAL PRODUCTS: 27**

---

## 🔧 CONFIGURATION STEPS (7 Steps per Product)

| Step | German | URL Param | Applies To |
|------|--------|-----------|------------|
| 1 | **Profil** | `/profil` | All |
| 2 | **Maße** | `/masse` | All |
| 3 | **Farbe** | `/farbe` | All |
| 4 | **Glas** | `/glas` | Windows, Doors |
| 5 | **Sprossen** | `/sprossen` | Windows, Balcony Doors |
| 6 | **Rollladen** | `/rollladen` | Windows, Balcony Doors |
| 7 | **Sonstiges** | `/sonstiges` | All |

### URL Structure:
```
/konfigurator/{category}/{material}/{step}?manufacturer={id}&profile={id}
```

---

## 📋 STEP 1: PROFIL (Profile Selection)

### For Kunststoff Fenster:

#### 1.1 Hersteller (Manufacturers) - 6 options:
| # | Manufacturer | API ID |
|---|--------------|--------|
| 1 | Salamander | `salamander` |
| 2 | Veka | `veka` |
| 3 | Kömmerling | `koemmerling` |
| 4 | Rehau | `rehau` |
| 5 | Schüco | `schueco` |
| 6 | Aluplast | `aluplast` |

#### 1.2 Profile Systems per Manufacturer (~6 each):
| Manufacturer | Example Profiles |
|--------------|------------------|
| Salamander | bluEvolution 82, bluEvolution 92, Brügmann... |
| Veka | Softline 70, Softline 82, EFFECTLINE... |
| Kömmerling | 76 AD, 88+, 88 MD... |
| Rehau | EURO-Design 70, BRILLANT-Design, GENEO... |
| Schüco | CT 70, CT 82, LivIng... |
| Aluplast | IDEAL 4000, IDEAL 7000, IDEAL 8000... |

#### 1.3 Rahmenart (Frame Type) - 2 options:
| # | Option | API Value |
|---|--------|-----------|
| 1 | Standard | `standard` |
| 2 | Renovierung | `renovation` |

#### 1.4 Fensterarten (Window Types) - 3 options:
| # | Option | API Value |
|---|--------|-----------|
| 1 | Einzelfenster | `single` |
| 2 | Mehrflügelig | `multi` |
| 3 | Festverglasung | `fixed` |

#### 1.5 Fenstertyp (Window Configuration) - 7 options:
| # | Type | API Value |
|---|------|-----------|
| 1 | Festverglasung | `fixed` |
| 2 | Dreh-Links | `turn-left` |
| 3 | Dreh-Rechts | `turn-right` |
| 4 | Kipp | `tilt` |
| 5 | Dreh-Kipp Links | `turn-tilt-left` |
| 6 | Dreh-Kipp Rechts | `turn-tilt-right` |
| 7 | Oberlicht kippbar | `top-tilt` |

#### 1.6 Öffnungsrichtung - 7 options:
| # | Direction | API Value |
|---|-----------|-----------|
| 1 | Keine | `none` |
| 2 | Links | `left` |
| 3 | Rechts | `right` |
| 4 | Innen | `inside` |
| 5 | Außen | `outside` |
| 6 | Links-Innen | `left-inside` |
| 7 | Rechts-Innen | `right-inside` |

---

## 📋 STEP 2: MAẞE (Dimensions)

#### 2.1 Fensterbankanschluss:
- Nein (`false`)
- Ja (`true`)

#### 2.2 Dimensions Input:
```json
{
  "width": { "min": 300, "max": 3000, "unit": "mm" },
  "height": { "min": 300, "max": 2800, "unit": "mm" },
  "quantity": { "min": 1, "max": 99 }
}
```

#### 2.3 Sondermaße:
- Standardmaße (`standard`)
- Sondermaße (`custom`)
- Angebot anfordern (`quote_request`)

---

## 📋 STEP 3: FARBE (Color)

#### 3.1 Farbauswahl Typ:
- Weiß (`white`)
- Einfarbig Foliert (`single_foil`)
- Zweifarbig (`dual_foil`)

#### 3.2 Dichtungsfarbe Außen - 2 options:
- Schwarz (`black`)
- Lichtgrau (`light_grey`)

#### 3.3 Dichtungsfarbe Innen - 2 options:
- Schwarz (`black`)
- Lichtgrau (`light_grey`)

#### 3.4 Kernfarbe - 3 options:
- Weiß (`white`)
- Grau (`grey`)
- Schwarz (`black`)

#### 3.5 Dekorfarbe Außen - 6+ options:
- Golden Oak (`golden_oak`)
- Nussbaum (`nussbaum`)
- Anthrazitgrau RAL 7016 (`anthracite_7016`)
- Dunkelbraun RAL 8014 (`dark_brown_8014`)
- Weiß RAL 9016 (`white_9016`)
- Schwarz RAL 9005 (`black_9005`)
- ... (more RAL colors)

#### 3.6 Dekorfarbe Innen - 6+ options:
Same as Außen

---

## 📋 STEP 4: GLAS (Glass)

#### 4.1 Verglasung - 6 options:
| Type | U-Wert | API Value |
|------|--------|-----------|
| 2-fach Standard | 1.1 | `double_standard` |
| 2-fach Wärme | 1.0 | `double_warm` |
| 3-fach Standard | 0.7 | `triple_standard` |
| 3-fach Wärme | 0.5 | `triple_warm` |
| 3-fach Solar | 0.5 | `triple_solar` |
| Sicherheitsglas | varies | `security` |

#### 4.2 Options (Yes/No each):
- Schallschutz
- Sicherheitsverglasung (P4A, P5A, P6B)
- Ornament- & Sonnenschutzglas
- Druckausgleichsventil

---

## 📋 STEP 5: SPROSSEN (Mullions)

- Nein (`none`)
- Innenliegend (`inside`)
- Aufliegend (`applied`)

Patterns: h2, h3, v2, v3, grid_2x2, grid_3x2, custom

---

## 📋 STEP 6: ROLLLADEN (Shutters)

- Kein Rollladen (`none`)
- Aufsatzrollladen (`aufsatz`)
- Vorsatzrollladen (`vorsatz`)

Antrieb: Gurt, Motor, Funk, Smart

---

## 📋 STEP 7: SONSTIGES (Extras)

#### 7.1 Dünne Schweißnaht V-Perfect:
- Nein (`false`)
- Ja (`true`)

#### 7.2 Rahmenverbreiterung:
- Nein (`none`)
- Oben (`top`)
- Unten (`bottom`)
- Links (`left`)
- Rechts (`right`)
- Mehrfach (`multiple`)

#### 7.3 Griffe:
- Standard weiß/silber
- Design-Griff
- Abschließbar
- Smart Lock

#### 7.4 Montageservice:
- Selbstmontage
- Mit Montage
- Angebot anfordern

---

## 💰 PRICE CALCULATION

```
TOTAL_PRICE = 
  BASE_PRICE (per m²)
  × SIZE_FACTOR
  + PROFILE_ADDON
  + MANUFACTURER_FACTOR
  + COLOR_ADDON
  + GLASS_ADDON
  + SPROSSEN_ADDON
  + ROLLLADEN_ADDON
  + EXTRAS_ADDON
  × MARGIN (4-level)
  - DISCOUNT
```

---

## 📊 TOTAL SCOPE

| Category | Products | Steps | ~Combinations |
|----------|----------|-------|---------------|
| Fenster | 6 | 7 | ~7,500+ |
| Balkontür | 5 | 7 | ~5,250+ |
| Terrassentür | 4 | 6 | ~1,920+ |
| Haustür | 6 | 7 | ~6,300+ |
| Rollladen | 5 | 5 | ~1,500+ |
| **TOTAL** | **26** | - | **~22,500+** |

---

*Version: 1.0 - March 2024*
