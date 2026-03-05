# GEALAN PVC Fenster — Preismatrix Extraktion
## Zusammenfassung der extrahierten Daten

**Quelle:** https://www.fenstermaxx24.com/konfigurator/gealan-fenster/  
**API-Endpunkt:** `https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan/ajax/berechnen/`  
**Extraktionsdatum:** 05.03.2026  
**Rabattfaktor:** 0,60 (= 40% Rabatt)

---

## 1. Profile (3 Stück)

| Profil-ID | Name | Uw-Wert | Basispreis 500×500 (Angebot) |
|-----------|------|---------|-------------------------------|
| p1 | GEALAN S8000 | ≥ 0,82 | 47,48 EUR |
| p4 | GEALAN-LINEAR | ≥ 0,73 | 117,43 EUR |
| p2 | GEALAN S9000 | ≥ 0,71 | 72,34 EUR |

---

## 2. Preismatrix (Breite × Höhe)

Jedes Profil hat **15 Breiten × 15 Höhen = 225 Datenpunkte** (675 gesamt).

**Dimensionsbereiche:** 400 mm – 2000 mm  
**Schritte:** 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000 mm

### Beispielwerte GEALAN S8000 (p1) — Angebotspreis (EUR)

| Breite\Höhe | 400 | 500 | 600 | 800 | 1000 | 1200 | 1500 | 2000 |
|-------------|-----|-----|-----|-----|------|------|------|------|
| 400 | 47,48 | 47,48 | 61,48 | 71,49 | 84,49 | 97,50 | 107,56 | 131,12 |
| 600 | 62,48 | 62,48 | 65,48 | 79,49 | 94,67 | 110,04 | 130,59 | 165,51 |
| 800 | 71,49 | 71,49 | 80,49 | 97,82 | 116,33 | 134,85 | 161,62 | 206,91 |
| 1000 | 84,49 | 84,49 | 95,67 | 116,33 | 137,99 | 158,66 | 190,65 | 244,31 |
| 1200 | 98,50 | 98,63 | 110,04 | 134,85 | 159,66 | 184,47 | 220,69 | 281,71 |
| 1500 | 117,57 | 118,07 | 133,59 | 162,62 | 191,65 | 220,69 | 265,23 | 338,81 |
| 2000 | 152,12 | 152,81 | 171,52 | 207,91 | 245,31 | 282,71 | 337,81 | 430,30 |

---

## 3. Aufpreise (Surcharges)

### Schritt 1: Profil

| Kategorie | Option | Aufpreis (Angebot) |
|-----------|--------|-------------------|
| Blendrahmen | 66 mm (Standard) | +0,00 € |
| Blendrahmen | 74 mm | +17,54 € |
| Blendrahmen | 81 mm | +22,81 € |
| Flügelprofil | 78 mm Standard | +0,00 € |
| Flügelprofil | 78 mm halbflächenversetzt | +14,11 € |
| Fensterart | Einflüglig / Zweiflüglig / Dreiflüglig | +0,00 € |
| Fenstertyp | Alle 7 Typen | +0,00 € |
| Öffnungsrichtung | Fest (ohne Flügel) | +0,00 € |
| Öffnungsrichtung | Fest (mit Flügel) | +35,01 € |
| Öffnungsrichtung | Kipp | +99,04 € |
| Öffnungsrichtung | Dreh Rechts / Links | +95,04 € |
| Öffnungsrichtung | Drehkipp Rechts / Links | +95,04 € |

### Schritt 3: Farbe

| Kategorie | Option | Aufpreis (Angebot) |
|-----------|--------|-------------------|
| Dichtungsfarbe Außen | Lichtgrau / Schwarz | +0,00 € |
| Dichtungsfarbe Innen | Lichtgrau / Schwarz | +0,00 € |
| Kernfarbe | Weiß | +0,00 € |
| Kernfarbe | Grau / Schwarz | +2,30 € |
| Dekorfarbe Außen | Weiß (Standard) | +0,00 € |
| Dekorfarbe Außen | Cremeweiß / Hellgrau / Anthrazit / Schwarzbraun / Dunkelbraun | +6,44 € |
| Dekorfarbe Innen | Weiß (Standard) | +0,00 € |
| Dekorfarbe Innen | Cremeweiß / Hellgrau / Anthrazit / Schwarzbraun / Dunkelbraun | +11,50 € |

### Schritt 4: Glas

| Option | Aufpreis (Angebot) |
|--------|-------------------|
| 2-fach Verglasung | +0,00 € |
| 3-fach Verglasung | +0,00 € |
| 3-fach Verglasung Premium | +15,45 € |
| 3-fach Verglasung Passivhaus | +15,45 € |
| 2-fach Verglasung Solar | +5,09 € |
| 3-fach Verglasung Solar | -1,46 € |
| Schallschutz Ja | +0,00 € |
| Sicherheitsverglasung Ja | +6,54 € |
| Ornament- & Sonnenschutzglas Ja | +25,80 € |
| Druckausgleichsventil Ja | +23,17 € |

### Schritt 5: Sprossen

| Option | Aufpreis (Angebot) |
|--------|-------------------|
| Nein | +0,00 € |
| Sprossen innenliegend | +10,22 € |
| Sprossen aufliegend | +0,00 € |

### Schritt 6: Rollladen

| Option | Aufpreis (Angebot) |
|--------|-------------------|
| Kein Rollladen | +0,00 € |
| Aufsatzrollladen | +81,21 € |
| Vorsatzrollladen | +81,21 € |

### Schritt 7: Sonstiges

| Option | Aufpreis (Angebot) |
|--------|-------------------|
| Dünne Schweißnaht (V-Perfect) Nein | +0,00 € |
| Dünne Schweißnaht (V-Perfect) Ja | +0,62 € |
| Rahmenverbreiterung Nein | +0,00 € |
| Rahmenverbreiterung Ja | +0,00 € |

### Schritt 2: Maße

| Option | Aufpreis (Angebot) |
|--------|-------------------|
| Fensterbankanschluss Nein | +0,00 € |
| Fensterbankanschluss Ja | +6,65 € |

---

## 4. Preisberechnung (Formel)

```
Grundpreis = PRICE_MATRIX[profil][breite][hoehe]
Aufpreise  = Summe aller gewählten Optionsaufpreise
Angebotspreis = Grundpreis + Aufpreise
Preisempfehlung = Angebotspreis / 0.60
Ersparnis = Preisempfehlung - Angebotspreis
```

**Rabattfaktor:** 0,60 (= 40% Rabatt, bestätigt durch API-Antworten)

---

## 5. Dateien

| Datei | Inhalt |
|-------|--------|
| `gealan_pvc_konfigurator.html` | Fertiger Konfigurator mit eingebetteter Preismatrix |
| `csv/gealan_pvc_p1_preismatrix.csv` | Preismatrix GEALAN S8000 (225 Zeilen) |
| `csv/gealan_pvc_p4_preismatrix.csv` | Preismatrix GEALAN-LINEAR (225 Zeilen) |
| `csv/gealan_pvc_p2_preismatrix.csv` | Preismatrix GEALAN S9000 (225 Zeilen) |
| `csv/gealan_pvc_alle_profile_preismatrix.csv` | Alle 3 Profile kombiniert (675 Zeilen) |
| `csv/gealan_pvc_aufpreise.csv` | Alle Aufpreise als CSV |
| `csv/gealan_pvc_profil_basispreise.csv` | Basispreise der 3 Profile |
| `json/gealan_pvc_complete_data.json` | Vollständige Daten (Matrix + Aufpreise) |
| `json/gealan_pvc_aufpreise.json` | Aufpreise als JSON |
| `html/gealan_pvc_1_profil.html` | Gespeicherte HTML-Seite: Profil-Schritt |
| `html/gealan_pvc_2_masse.html` | Gespeicherte HTML-Seite: Maße-Schritt |
| `html/gealan_pvc_3_farbe.html` | Gespeicherte HTML-Seite: Farbe-Schritt |
| `html/gealan_pvc_4_glas.html` | Gespeicherte HTML-Seite: Glas-Schritt |
| `html/gealan_pvc_5_sprossen.html` | Gespeicherte HTML-Seite: Sprossen-Schritt |
| `html/gealan_pvc_6_rollladen.html` | Gespeicherte HTML-Seite: Rollladen-Schritt |
| `html/gealan_pvc_7_sonstiges.html` | Gespeicherte HTML-Seite: Sonstiges-Schritt |
