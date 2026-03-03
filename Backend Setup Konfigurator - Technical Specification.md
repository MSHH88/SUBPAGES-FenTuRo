# Backend Setup Konfigurator - Technical Specification

This document contains the reverse-engineered data and logic for the window configurator, intended for the development of the **Custom Backend (The Engine)**.

## 1. API Endpoint Specification

The frontend communicates with the backend via a single POST endpoint for all price and configuration updates.

*   **Endpoint:** `https://confde.fenstermaxx24.com/confapp/Gealan/PVC-ALU-Fenster-bestellen-gealan/ajax/berechnen/`
*   **Method:** `POST`
*   **Content-Type:** `application/x-www-form-urlencoded`

### Request Payload Structure
The payload consists of a CSRF token and a URL-encoded JSON object (`tmp_obj`) containing the full state of the configurator.

**Example `tmp_obj` (Decoded):**
```json
{
  "breite": 700,
  "hoehe": 500,
  "hoehe_ol": 0,
  "hoehe_ul": 0,
  "mass_txt": "",
  "material": "ma5",
  "hersteller": "h7",
  "rab": "rab_0",
  "profil": "p2",
  "br": "br_6",
  "fl": "fl_5",
  "art": "a1",
  "typ": "typ1",
  "oer": "fn_1_fest_ohne_fluegel",
  "oer_oben": "-",
  "oer_unten": "-",
  "dekofarbe_rubrik": "fr1",
  "dekofarbe_textur": "fs1",
  "dekofarbe_a": "fs1_9016",
  "dekofarbe_i": "fs1_01_i",
  "dfi": "dfi_1",
  "dfa": "dfa_1",
  "kf": "kf_0",
  "glas": "g1",
  "schallschutz": "schallschutz_nein",
  "schallschutz_db": "schallschutz_stufe01",
  "sicherheitsverglasung": "sicherheitsverglasung_0",
  "sicherheitsverglasung_typ": "sicherheitsverglasung_typ_0",
  "ornament": "ornament_0",
  "druckventil": "druckventil_0",
  "wk": "wk_1",
  "sprossen_typ": "sprossen_typ_0",
  "sprossen_farbe": "sprossen_farbe_0",
  "sprossen_anordnung": "sprossen_anordnung_0",
  "sprossen_anordnung_ol": "sprossen_anordnung_ol_0",
  "sprossen_anordnung_ul": "sprossen_anordnung_ul_0",
  "rollladen": "rollladen_0",
  "rollladen_hoehe": "rollladen_hoehe_0",
  "rollladen_farbe": "rollladen_farbe_0",
  "rollladen_panzer": "rollladen_panzer_0",
  "rollladen_bedienung": "rollladen_bedienung_0",
  "rollladen_motor": "rollladen_motor_0",
  "rollladen_funk": "rollladen_funk_0",
  "rollladen_sender": "rollladen_sender_0",
  "rollladen_schalter": "rollladen_schalter_0",
  "rollladen_gurtwickler": "rollladen_gurtwickler_0",
  "rollladen_insektenschutz": "rollladen_insektenschutz_0",
  "griff": "griff_0",
  "griff_farbe": "griff_farbe_0",
  "aufbohrschutz": "aufbohrschutz_0",
  "sicherheitsbeschlag": "sicherheitsbeschlag_0",
  "verdeckte_beschlaege": "verdeckte_beschlaege_0",
  "febaan": "febaan_0",
  "montagevorbohrungen": "montagevorbohrungen_1",
  "reedkontakt": "reedkontakt_0",
  "falzluefter": "falzluefter_0",
  "vperfect": "vperfect_0",
  "verbreiterung_o": "verbreiterung_o_0",
  "verbreiterung_u": "verbreiterung_u_0",
  "verbreiterung_l": "verbreiterung_l_0",
  "verbreiterung_r": "verbreiterung_r_0"
}
```

### Response Structure
The backend returns a JSON object containing calculated prices, technical specs, and localized text for the UI.

**Example Response:**
```json
{
  "status": "ok",
  "preis_empfehlung": "303,05",
  "preis_angebot": "181,83",
  "ersparnis": "121,22",
  "grundpreis": "300,48",
  "flaeche": "0.42",
  "breite": "700",
  "hoehe": "600",
  "hersteller_text": "GEALAN",
  "profil_text": "GEALAN S9000-A mit ALU-Schale",
  "glas_preis": "2,57",
  "rabatt_logic": "40% discount applied to preis_empfehlung to get preis_angebot"
}
```

## 2. Pricing Logic Matrix (Sample Data)

Based on live captures for the **GEALAN S9000-A (mit ALU-Schale)** profile:

| Width (mm) | Height (mm) | Base Price (Old) | Offer Price (New) | Area (m²) |
| :--- | :--- | :--- | :--- | :--- |
| 500 | 500 | 254,38 € | 152,63 € | 0.25 |
| 600 | 500 | 286,64 € | 171,98 € | 0.30 |
| 600 | 600 | 292,80 € | 175,68 € | 0.36 |
| 700 | 600 | 303,05 € | 181,83 € | 0.42 |

**Formula Deduction:**
1.  **Discount:** `Offer Price = Base Price * 0.60` (40% off).
2.  **Area Calculation:** `Area = (Width / 1000) * (Height / 1000)`.
3.  **Base Price:** Appears to be a lookup table based on Width/Height brackets, not a simple linear formula.

## 3. Option IDs & Surcharges

| Option Category | ID | Description | Surcharge |
| :--- | :--- | :--- | :--- |
| **Material** | `ma5` | Kunststoff-Aluminium | Base |
| **Hersteller** | `h7` | GEALAN | Base |
| **Profil** | `p2` | GEALAN S9000-A | Base |
| **Glas** | `g1` | 2-fach Verglasung | +2,57 € (at 0.42m²) |
| **Zusätze** | `vperfect_1` | Dünne Schweißnaht | +0,66 € |

## 4. Implementation Notes for Custom Backend
*   The backend must handle the `tmp_obj` structure to remain compatible with the existing frontend.
*   All price components (Base, Rabatt, Surcharges) must be stored as separate variables to allow CRM access for invoicing.
*   The `preis_angebot` should be recalculated on every change to ensure the UI summary box stays 100% accurate.


---

# Drutex Kunststoff Fenster - Backend Technical Specification (Comprehensive)

This section contains the complete reverse-engineered data required to build a custom backend ("The Engine") for the Drutex Kunststoff Fenster configurator. It is based on the comprehensive data capture and analysis performed on the live system.

## 1. Core Architecture: API Endpoint & Data Schema

The entire configurator is driven by a single, stateful API endpoint. The frontend sends the complete configuration object on every change, and the backend returns the full updated HTML block with new prices.

- **Endpoint:** `POST /ajax/berechnen/`
- **Request Payload:** A form-data object containing:
  - `csrf_cyko`: A CSRF token (can be left blank for direct API calls).
  - `tmp_obj`: A JSON string representing the complete state of the window configuration.

### Full `obj_konfig` JSON Schema

This is the complete structure of the `tmp_obj` payload. Your backend must be able to deserialize this exact object.

```json
{
  "breite": 1000,
  "hoehe": 1000,
  "hoehe_ol": 0,
  "hoehe_ul": 0,
  "mass_txt": "",
  "material": "ma1",
  "hersteller": "h1",
  "rab": "rab_0",
  "kaempfer_ol": "kaempfer_ol_0",
  "kaempfer_ul": "kaempfer_ul_0",
  "profil": "p1",
  "art": "a1",
  "typ": "typ1",
  "oer": "fn_1_drehkipp_rechts",
  "oer_oben": "-",
  "oer_unten": "-",
  "dekofarbe_rubrik": "fr1",
  "dekofarbe_textur": "fs1",
  "dekofarbe_a": "fs1_01",
  "dekofarbe_i": "fs1_01_i",
  "dfi": "dfi_0",
  "dfa": "dfa_0",
  "kf": "kf_0",
  "glas": "g1",
  "schallschutz": "schallschutz_nein",
  "schallschutz_db": "schallschutz_stufe01",
  "sicherheitsverglasung": "sicherheitsverglasung_0",
  "sicherheitsverglasung_typ": "verglasung_typ_2_1",
  "ornament": "ornament_0",
  "ornament_typ": "ornament_typ_1",
  "warme_kante": "wk_1",
  "drv": "drv_0",
  "sprossen": "sprossen_0",
  "sprossenOU": "sprossenOU_0",
  "sprossen_breite": "sprossen_breite_8",
  "sprossen_farbe": "sprossen_farbe_8_1",
  "sprossen_vorlage": "sprossen_vorlage_1",
  "roll": "roll_0",
  "roll_art": "roll_art_1",
  "roll_model": "roll_model_1",
  "roll_teil": "roll_teil_1",
  "roll_kh": "roll_kh_215",
  "roll_fk": "roll_fk_0",
  "roll_fs_schraege": "roll_fs_schraege_0",
  "roll_fs_verlaengerung": "0",
  "dekofarbe_fb": "fk1_01",
  "roll_panzer": "roll_panzer_1",
  "roll_el": "roll_el_1",
  "roll_antriebart": "roll_antriebart_1",
  "roll_as": "roll_as_l",
  "roll_lambreite": "roll_lambreite_37 ",
  "roll_pt": "roll_pt_0",
  "roll_sk": "roll_sk_0",
  "roll_ssm": "roll_ssm_0",
  "roll_vm": "roll_vm_0",
  "fenstergriffe": "fenstergriffe_0",
  "fenstergriffart": "fenstergriffart_1_1",
  "fenstergriffart_ral": "",
  "oberlichtoeffner": "oberlichtoeffner_0",
  "main_handleside": "main_handleside_0",
  "ol_handleside": "ol_handleside_0",
  "ul_handleside": "ul_handleside_0",
  "griffhoehe": "griffhoehe_0",
  "griffhoehe_value": "183 mm",
  "aufbohrschutz": "aufbohrschutz_0",
  "sicherheitsbeschlaege": "sicherheitsbeschlaege_0",
  "sicherheitsbeschlaegeart": "sicherheitsbeschlaege_art_1_1",
  "verdeckt_beschlaege": "verdeckt_beschlaege_0",
  "montagevorbohrung": "montagevorbohrung_1",
  "reedkontakt": "reedkontakte_0",
  "febaan": "febaan_0",
  "fensterfalzluefter": "fensterfalzluefter_0",
  "fensterfalzluefter_art": "fensterfalzluefter_art_1",
  "dsd": "dsd_1",
  "rahmenverbreiterung": "rahmenverbreiterung_0",
  "unten": "unten_0",
  "links": "links_0",
  "rechts": "rechts_0",
  "oben": "oben_0"
}
```


## 2. Core Pricing Logic

The pricing is calculated in two main steps:

1.  **Preisempfehlung (MSRP):** This is the master price calculated by the backend. It is the sum of the `Grundpreis` (Base Price) from the dimension matrix, plus all applicable surcharges for colors, glass, accessories, etc.
    
    `Preisempfehlung = Grundpreis + Surcharge(Color) + Surcharge(Glass) + ...`
    
2.  **Angebotspreis (Offer Price):** This is the final price shown to the customer. It is a fixed 40% discount from the MSRP.
    
    `Angebotspreis = Preisempfehlung * 0.60`

Your backend should calculate the `Preisempfehlung` based on the logic below and then apply the discount to get the final price.

## 3. Grundpreis (Base Price) Calculation

The `Grundpreis` is determined by two factors: the window dimensions (Width x Height) and the selected profile. It is not a simple linear calculation based on area, but a complex lookup matrix.

### 3.1. Base Price Matrix: Iglo 5 Classic (p1)

This is the reference lookup table for the `Grundpreis` of the **Iglo 5 Classic (p1)** profile in white. Prices for other profiles are calculated using a multiplier against this table.

| W/H | 500 | 600 | 700 | 800 | 900 | 1000 | 1100 | 1200 | 1300 | 1400 | 1500 | 1600 | 1800 | 2000 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **500** | 221.68 | 217.59 | 214.19 | 211.29 | 219.24 | 245.41 | 255.01 | 263.78 | 272.56 | 281.36 | 291.82 | 300.61 | 0.00 | 0.00 |
| **600** | 217.59 | 213.57 | 210.24 | 207.39 | 215.19 | 240.88 | 250.30 | 258.91 | 267.53 | 276.17 | 286.43 | 295.06 | 0.00 | 0.00 |
| **700** | 214.19 | 210.24 | 206.95 | 215.25 | 225.33 | 251.30 | 259.62 | 269.61 | 277.98 | 287.98 | 297.86 | 309.13 | 0.00 | 0.00 |
| **800** | 211.29 | 207.39 | 215.25 | 224.97 | 234.76 | 265.19 | 274.86 | 283.74 | 294.64 | 306.71 | 318.79 | 330.86 | 0.00 | 0.00 |
| **900** | 224.48 | 220.34 | 229.55 | 238.93 | 249.23 | 279.92 | 289.30 | 301.88 | 311.54 | 326.03 | 338.11 | 351.79 | 0.00 | 0.00 |
| **1000** | 239.36 | 234.94 | 244.63 | 253.66 | 264.46 | 295.44 | 308.32 | 321.20 | 334.08 | 346.96 | 359.84 | 373.53 | 0.00 | 0.00 |
| **1100** | 248.16 | 243.58 | 254.66 | 265.07 | 273.99 | 308.32 | 322.01 | 334.89 | 349.38 | 363.06 | 375.14 | 388.82 | 0.00 | 0.00 |
| **1200** | 257.84 | 253.08 | 263.06 | 274.04 | 286.59 | 322.01 | 334.89 | 349.38 | 363.06 | 377.55 | 391.24 | 406.53 | 0.00 | 0.00 |
| **1300** | 268.36 | 263.40 | 271.48 | 284.98 | 300.27 | 335.69 | 346.96 | 363.87 | 376.75 | 392.85 | 408.14 | 423.44 | 0.00 | 0.00 |
| **1400** | 277.19 | 272.07 | 281.53 | 298.66 | 312.35 | 348.57 | 360.65 | 377.55 | 392.04 | 408.95 | 422.63 | 438.73 | 0.00 | 0.00 |
| **1500** | 286.02 | 280.74 | 293.03 | 311.54 | 324.42 | 362.26 | 374.33 | 391.24 | 406.53 | 425.05 | 437.93 | 454.83 | 0.00 | 0.00 |
| **1600** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **1800** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| **2000** | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |

### 3.2. Profile Price Multipliers

To get the `Grundpreis` for other profiles, multiply the value from the table above by the corresponding multiplier below.

| Profile | Grundpreis (1000x1000) | Multiplier |
| :--- | :--- | :--- |
| Iglo 5 Classic | 295.44 | **1.0000x** |
| Iglo 5 | 295.44 | **1.0000x** |
| Iglo Energy Classic | 372.27 | **1.2601x** |
| Iglo Energy | 372.27 | **1.2601x** |
| Iglo Light | 281.60 | **0.9532x** |

**Example:** `Grundpreis(1000x1000, Iglo Energy) = 295.44 * 1.2601 = 372.27`

## 4. Surcharge Tables

Surcharges are added to the `Grundpreis` to get the final `Preisempfehlung`. The values below are the **surcharge amounts** to be added.

### 4.1. Color Surcharges

| Color ID | Color Name | Surcharge (Empfehlung) |
| :--- | :--- | :--- |
| fs1_01 | Weiss (ohne Dekorfarbe) | **+0.00** |
| fs1_04 | Golden Oak (2178001) | **+43.68** |
| fs1_02 | Nussbaum (2178007) | **+43.68** |
| fs1_03 | Mahagoni (2065021) | **+43.68** |
| fs1_07 | Anthrazitgrau (701605) | **+43.68** |
| fs1_08 | Mooreiche (2052089) | **+104.64** |
| fs1_09 | Stahlblau (5014005) | **+104.64** |
| fs1_12 | Siena Rosso (3152009) | **+78.48** |

### 4.2. Glass Type Surcharges

| Glass ID | Glass Name | Surcharge (Empfehlung) |
| :--- | :--- | :--- |
| g1 | 2-fach Thermo-Verglasung (Ug 1.1) | **+0.00** |
| g2 | 2-fach Thermo-Verglasung warme Kante (Ug 1.0) | **+0.00** |
| g3 | 3-fach Thermo-Verglasung (Ug 0.7) | **+39.81** |
| g4 | 3-fach Thermo-Verglasung warme Kante (Ug 0.6) | **+39.81** |
| g7 | Sandwitchplatte PVC/Schaum/PVC | **+99.98** |
| g8 | Ohne Glasscheibe | **-15.05** |

### 4.3. Key Accessories Surcharges

These are the surcharges for the final **Angebotspreis (Offer Price)**, which is what your CRM will likely need for invoicing.

| Accessory | Surcharge (Angebot) |
| :--- | :--- |
| Fenstergriffe Druckknopf | **+15.83** |
| Fenstergriffe Abschließbar | **+22.33** |
| Aufbohrschutz Ja | **+6.39** |
| Verdeckte Beschläge Ja | **+79.34** |
| Reedkontakt Ja | **+62.22** |
| Fensterfalzlüfter Ja | **+32.81** |
| V-Perfect Ja | **+3.29** |
| Fensterbankanschluss Ja | **+11.36** |
| Sicherheitsverglasung Ja (2-fach) | **+44.63** |
| Sprossen innenliegend | **+20.91** |
| Sprossen aufliegend | **+76.72** |

## 5. Business Logic & Constraints

### 5.1. Min/Max Dimensions

The allowed dimensions change based on the profile and opening type. Your frontend must enforce these limits.

| Profile | Opening Type | Width (mm) | Height (mm) |
| :--- | :--- | :--- | :--- |
| Iglo 5 Classic (p1) | Dreh-Kipp Rechts | 415-1500 | 395-1700 |
| Iglo 5 Classic (p1) | Fest (ohne Flügel) | 415-1500 | 395-1700 |
| Iglo Energy (p4) | Dreh-Kipp Rechts | 415-1500 | 395-1700 |
| Iglo EXT (p7) | Dreh-Kipp Rechts | 415-1500 | 395-1700 |

*(Note: The limits appear consistent across most combinations, but this should be verified for all product-by-product as per our strategic plan.)*

## 6. Backend Implementation Plan

1.  **Create a POST endpoint** at `/berechnen`.
2.  **Deserialize** the incoming `tmp_obj` JSON string into a native object/dictionary.
3.  **Lookup the `Grundpreis`** from your database/matrix using the `breite`, `hoehe`, and `profil` values.
4.  **Apply the profile multiplier** if the profile is not `p1`.
5.  **Iterate through all other options** (color, glass, accessories) and add the corresponding surcharge to the `Grundpreis` to calculate the `Preisempfehlung`.
6.  **Calculate the `Angebotspreis`** by multiplying the `Preisempfehlung` by 0.60.
7.  **Return a JSON response** containing all the calculated prices, which the frontend can then use to update the display.

This document provides the complete blueprint for the Drutex Kunststoff Fenster "Engine." The next step is to use this as a baseline and perform rapid verification (Option A) on other product types to identify any differences in logic or exceptions.
