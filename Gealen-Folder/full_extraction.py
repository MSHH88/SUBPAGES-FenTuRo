#!/usr/bin/env python3
"""
Comprehensive Price Matrix Extractor for Gealan Window Configurator (fenstermaxx24.com)
Extracts: base price matrix, all surcharges, color options, glass options, etc.
"""

import requests
import json
import csv
import time
import re
import os
from bs4 import BeautifulSoup
from copy import deepcopy

BASE_URL = "https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan"
API_URL = f"{BASE_URL}/ajax/berechnen/"

OUTPUT_DIR = "/home/ubuntu/fenster_konfigurator"
CSV_DIR = f"{OUTPUT_DIR}/csv"
JSON_DIR = f"{OUTPUT_DIR}/json"
HTML_DIR = f"{OUTPUT_DIR}/html"

os.makedirs(CSV_DIR, exist_ok=True)
os.makedirs(JSON_DIR, exist_ok=True)
os.makedirs(HTML_DIR, exist_ok=True)

# Session setup
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': f'{BASE_URL}/',
    'Origin': 'https://confde.fenstermaxx24.com',
    'Content-Type': 'application/x-www-form-urlencoded',
})

# Initialize session
print("Initializing session...")
page_resp = session.get(f"{BASE_URL}/", timeout=20)
print(f"Page loaded: {page_resp.status_code}, {len(page_resp.text)} chars")

# Save full HTML
with open(f"{HTML_DIR}/gealan_pvc_fenster_profil.html", 'w', encoding='utf-8') as f:
    f.write(page_resp.text)
print(f"Saved HTML: {HTML_DIR}/gealan_pvc_fenster_profil.html")

# Base configuration
BASE_CONFIG = {
    "breite": 500, "hoehe": 500, "hoehe_ol": 0, "hoehe_ul": 0,
    "mass_txt": "", "material": "ma1", "hersteller": "h7", "rab": "rab_0",
    "profil": "p1", "br": "br_1", "fl": "fl_1", "art": "a1", "typ": "typ1",
    "oer": "fn_1_fest_ohne_fluegel", "oer_oben": "-", "oer_unten": "-",
    "dekofarbe_rubrik": "fr1", "dekofarbe_textur": "fs1",
    "dekofarbe_a": "fs1_01", "dekofarbe_i": "fs1_01_i",
    "dfi": "dfi_1", "dfa": "dfa_1", "kf": "kf_0",
    "glas": "g1", "schallschutz": "schallschutz_nein",
    "schallschutz_db": "schallschutz_stufe01",
    "sicherheitsverglasung": "sicherheitsverglasung_0",
    "sicherheitsverglasung_typ": "verglasung_typ_2_1",
    "ornament": "ornament_0", "ornament_typ": "ornament_typ_1",
    "warme_kante": "--", "drv": "drv_0",
    "sprossen": "sprossen_0", "sprossenOU": "sprossenOU_0",
    "sprossen_breite": "sprossen_breite_8", "sprossen_farbe": "sprossen_farbe_8_1",
    "sprossen_vorlage": "sprossen_vorlage_1",
    "roll": "roll_0", "roll_art": "roll_art_1", "roll_model": "roll_model_1",
    "roll_teil": "roll_teil_1", "roll_kh": "roll_kh_210", "roll_fk": "roll_fk_0",
    "dekofarbe_fb": "fk1_01", "roll_antriebart": "roll_antriebart_1",
    "roll_as": "roll_as_l", "roll_lambreite": "roll_lambreite_37 ",
    "roll_pt": "roll_pt_0", "roll_schallschutz": "roll_schallschutz_0",
    "roll_stahlverstaerkung": "roll_stahlverstaerkung_0",
    "roll_stahlverstaerkung_art": "roll_stahlverstaerkung_art_1",
    "roll_vormontiert": "roll_vormontiert_0",
    "roll_fs_schraege": "roll_fs_schraege_0", "roll_fs_verlaengerung": "0",
    "fenstergriffe": "fenstergriffe_0", "fenstergriffart": "fenstergriffart_1_1",
    "fenstergriffart_ral": "", "oberlichtoeffner": "oberlichtoeffner_0",
    "main_handleside": "main_handleside_0", "ol_handleside": "ol_handleside_0",
    "ul_handleside": "ul_handleside_0", "griffhoehe": "griffhoehe_0",
    "griffhoehe_value": "183mm", "aufbohrschutz": "aufbohrschutz_0",
    "sicherheitsbeschlaege": "sicherheitsbeschlaege_0",
    "sicherheitsbeschlaegeart": "sicherheitsbeschlaege_art_1_1",
    "verdeckt_beschlaege": "verdeckt_beschlaege_0",
    "montagevorbohrung": "montagevorbohrung_1", "reedkontakt": "reedkontakte_0",
    "febaan": "febaan_0", "fensterfalzluefter": "fensterfalzluefter_0",
    "fensterfalzluefter_art": "fensterfalzluefter_art_1",
    "dsd": "dsd_0", "rahmenverbreiterung": "rahmenverbreiterung_0",
    "unten": "unten_0", "links": "links_0", "rechts": "rechts_0", "oben": "oben_0"
}

def parse_price(price_str):
    """Convert German price string to float"""
    if not price_str:
        return 0.0
    cleaned = price_str.replace('.', '').replace(',', '.').strip()
    try:
        return float(cleaned)
    except:
        return 0.0

def extract_prices_from_html(html_text):
    """Extract all prices from the API response HTML"""
    result = {}
    
    # Preisempfehlung (crossed out price)
    m = re.search(r'id="topStrokePrice"[^>]*>([\d.,]+)\s*EUR', html_text)
    if m:
        result['preisempfehlung'] = parse_price(m.group(1))
    
    # Angebotspreis (offer price in h2)
    m = re.search(r'<h2>([\d.,]+)\s*EUR', html_text)
    if m:
        result['angebotspreis'] = parse_price(m.group(1))
    
    # Grundpreis
    m = re.search(r'Grundpreis[:\s]*</small>\s*</div>\s*<div[^>]*>\s*<small>([\d.,]+)\s*EUR', html_text)
    if m:
        result['grundpreis'] = parse_price(m.group(1))
    
    # Glasauswahl (2-fach Verglasung price)
    m = re.search(r'2-fach Verglasung[:\s]*</small>\s*</div>\s*<div[^>]*>\s*<small>([\d.,]+)', html_text)
    if m:
        result['glas_2fach'] = parse_price(m.group(1))
    
    # Parse all labeled prices using BeautifulSoup
    soup = BeautifulSoup(html_text, 'html.parser')
    
    # Find all price rows
    labeled_prices = {}
    rows = soup.find_all('div', class_='row')
    for row in rows:
        cols = row.find_all('div')
        if len(cols) >= 2:
            label_col = cols[0]
            value_col = cols[-1]
            label = label_col.get_text(strip=True)
            value = value_col.get_text(strip=True)
            # Check if value looks like a price
            if re.search(r'^[\d.,]+$', value) or re.search(r'[\d.,]+\s*EUR', value):
                price_match = re.search(r'([\d.,]+)', value)
                if price_match and label:
                    labeled_prices[label] = parse_price(price_match.group(1))
    
    result['labeled_prices'] = labeled_prices
    
    # Extract savings
    m = re.search(r'Sie sparen ([\d.,]+)\s*EUR', html_text)
    if m:
        result['ersparnis'] = parse_price(m.group(1))
    
    # Calculate discount factor
    if result.get('preisempfehlung') and result.get('angebotspreis'):
        result['rabatt_faktor'] = round(result['angebotspreis'] / result['preisempfehlung'], 4)
    
    return result

def call_api(config):
    """Call the pricing API"""
    try:
        data = {'csrf_cyko': '', 'tmp_obj': json.dumps(config)}
        resp = session.post(API_URL, data=data, timeout=20)
        if resp.status_code == 200:
            return extract_prices_from_html(resp.text), resp.text
        return None, None
    except Exception as e:
        print(f"  API Error: {e}")
        return None, None

# ============================================================
# SECTION 1: PROFIL OPTIONS - Click all 3 profiles
# ============================================================
print("\n" + "="*70)
print("SECTION 1: PROFIL - 3 Profile Options")
print("="*70)

profiles = [
    {"id": "p1", "name": "GEALAN S8000", "uw": "0.82", "br": "br_1"},
    {"id": "p4", "name": "GEALAN-LINEAR", "uw": "0.73", "br": "br_1"},
    {"id": "p2", "name": "GEALAN S9000", "uw": "0.71", "br": "br_1"},
]

# Test each profile at default size to get base prices
profil_base_prices = []
for profile in profiles:
    config = deepcopy(BASE_CONFIG)
    config['profil'] = profile['id']
    result, html = call_api(config)
    if result:
        row = {
            'profil_id': profile['id'],
            'profil_name': profile['name'],
            'uw_wert': profile['uw'],
            'breite_mm': 500,
            'hoehe_mm': 500,
            'grundpreis_eur': result.get('grundpreis', 0),
            'preisempfehlung_eur': result.get('preisempfehlung', 0),
            'angebotspreis_eur': result.get('angebotspreis', 0),
            'rabatt_faktor': result.get('rabatt_faktor', 0.6),
        }
        profil_base_prices.append(row)
        print(f"  {profile['name']}: Grundpreis={result.get('grundpreis')}, Angebot={result.get('angebotspreis')}, Empfehlung={result.get('preisempfehlung')}")
    time.sleep(0.5)

# ============================================================
# SECTION 2: BASE PRICE MATRIX - Width x Height for each Profile
# ============================================================
print("\n" + "="*70)
print("SECTION 2: BASE PRICE MATRIX (Width x Height)")
print("="*70)

# Standard dimension ranges (mm)
widths = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000]
heights = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000]

all_matrix_rows = []

for profile in profiles:
    print(f"\n  Profile: {profile['name']}")
    profile_matrix = []
    
    for width in widths:
        for height in heights:
            config = deepcopy(BASE_CONFIG)
            config['profil'] = profile['id']
            config['breite'] = width
            config['hoehe'] = height
            
            result, html = call_api(config)
            if result:
                row = {
                    'profil': profile['name'],
                    'profil_id': profile['id'],
                    'breite_mm': width,
                    'hoehe_mm': height,
                    'flaeche_m2': round((width/1000) * (height/1000), 4),
                    'grundpreis_eur': result.get('grundpreis', 0),
                    'preisempfehlung_eur': result.get('preisempfehlung', 0),
                    'angebotspreis_eur': result.get('angebotspreis', 0),
                    'rabatt_faktor': result.get('rabatt_faktor', 0.6),
                }
                profile_matrix.append(row)
                all_matrix_rows.append(row)
                if width == 500:  # Only print first column to avoid spam
                    print(f"    {width}x{height}: GP={result.get('grundpreis')}, AP={result.get('angebotspreis')}")
            else:
                print(f"    {width}x{height}: FAILED")
            
            time.sleep(0.25)
    
    # Save profile CSV
    if profile_matrix:
        fname = f"{CSV_DIR}/gealan_pvc_{profile['id']}_preismatrix.csv"
        with open(fname, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=profile_matrix[0].keys())
            writer.writeheader()
            writer.writerows(profile_matrix)
        print(f"  Saved: {fname} ({len(profile_matrix)} rows)")

# Save combined matrix
if all_matrix_rows:
    fname = f"{CSV_DIR}/gealan_pvc_alle_profile_preismatrix.csv"
    with open(fname, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=all_matrix_rows[0].keys())
        writer.writeheader()
        writer.writerows(all_matrix_rows)
    print(f"\nSaved combined: {fname} ({len(all_matrix_rows)} rows)")

# ============================================================
# SECTION 3: SURCHARGES - All options for each step
# ============================================================
print("\n" + "="*70)
print("SECTION 3: SURCHARGES - All Configuration Options")
print("="*70)

surcharges = {
    "material": {
        "description": "Material type",
        "options": [
            {"id": "ma1", "name": "Kunststoff (PVC)"},
            {"id": "ma5", "name": "Kunststoff-Aluminium"},
            {"id": "ma2", "name": "Aluminium"},
            {"id": "ma3", "name": "Holz"},
            {"id": "ma4", "name": "Holz-Aluminium"},
        ]
    },
    "hersteller": {
        "description": "Manufacturer",
        "options": [
            {"id": "h1", "name": "DRUTEX"},
            {"id": "h3", "name": "Salamander"},
            {"id": "h8", "name": "aluplast"},
            {"id": "h7", "name": "GEALAN"},
            {"id": "h9", "name": "REHAU"},
            {"id": "h2", "name": "VEKA"},
            {"id": "h6", "name": "TROCAL"},
            {"id": "h5", "name": "Kömmerling"},
        ]
    },
    "blendrahmen": {
        "description": "Frame profile width",
        "options": [
            {"id": "br_1", "name": "Blendrahmenprofil 66mm"},
            {"id": "br_2", "name": "Blendrahmenprofil 74mm"},
            {"id": "br_3", "name": "Blendrahmenprofil 81mm"},
        ]
    },
    "fluegel": {
        "description": "Sash profile",
        "options": [
            {"id": "fl_1", "name": "78mm Standard"},
            {"id": "fl_3", "name": "78mm 8063 halbflächenversetzt"},
        ]
    },
    "fensterart": {
        "description": "Window type (number of sashes)",
        "options": [
            {"id": "a1", "name": "Einflügliges Fenster"},
            {"id": "a2", "name": "Zweiflügliges Fenster"},
            {"id": "a3", "name": "Dreiflügliges Fenster"},
        ]
    },
    "fenstertyp": {
        "description": "Window type with lights",
        "options": [
            {"id": "typ1", "name": "Einflügliges Fenster"},
            {"id": "typ1o1", "name": "Oberlicht Einerteilung"},
            {"id": "typ1o2", "name": "Oberlicht Zweierteilung"},
            {"id": "typ1o3", "name": "Oberlicht Dreierteilung"},
            {"id": "typ1u1", "name": "Unterlicht Einerteilung"},
            {"id": "typ1u2", "name": "Unterlicht Zweierteilung"},
            {"id": "typ1u3", "name": "Unterlicht Dreierteilung"},
        ]
    },
    "oeffnungsrichtung": {
        "description": "Opening direction",
        "options": [
            {"id": "fn_1_fest_ohne_fluegel", "name": "Fest ohne Flügel"},
            {"id": "fn_1_fest_fluegel", "name": "Fest mit Flügel"},
            {"id": "fn_1_kipp", "name": "Kipp"},
            {"id": "fn_1_drehrechts", "name": "Dreh Rechts"},
            {"id": "fn_1_drehlinks", "name": "Dreh Links"},
            {"id": "fn_1_drehkipp_rechts", "name": "Drehkipp Rechts"},
            {"id": "fn_1_drehkipp_links", "name": "Drehkipp Links"},
        ]
    },
    "dichtungsfarbe_aussen": {
        "description": "Seal color outside",
        "options": [
            {"id": "dfa_1", "name": "Lichtgrau"},
            {"id": "dfa_2", "name": "Schwarz"},
        ]
    },
    "dichtungsfarbe_innen": {
        "description": "Seal color inside",
        "options": [
            {"id": "dfi_1", "name": "Lichtgrau"},
            {"id": "dfi_2", "name": "Schwarz"},
        ]
    },
    "kernfarbe": {
        "description": "Core color",
        "options": [
            {"id": "kf_0", "name": "Weiß"},
            {"id": "kf_1", "name": "Grau"},
            {"id": "kf_2", "name": "Schwarz"},
        ]
    },
    "dekofarbe_aussen": {
        "description": "Decorative color outside",
        "config_key": "dekofarbe_a",
        "options": [
            {"id": "fs1_01", "name": "Weiß (Standard)"},
            {"id": "fs1_02", "name": "Cremeweiß"},
            {"id": "fs1_03", "name": "Hellgrau"},
            {"id": "fs1_04", "name": "Anthrazit"},
            {"id": "fs1_05", "name": "Schwarzbraun"},
            {"id": "fs1_06", "name": "Dunkelbraun"},
        ]
    },
    "dekofarbe_innen": {
        "description": "Decorative color inside",
        "config_key": "dekofarbe_i",
        "options": [
            {"id": "fs1_01_i", "name": "Weiß (Standard)"},
            {"id": "fs1_02_i", "name": "Cremeweiß"},
            {"id": "fs1_03_i", "name": "Hellgrau"},
            {"id": "fs1_04_i", "name": "Anthrazit"},
            {"id": "fs1_05_i", "name": "Schwarzbraun"},
            {"id": "fs1_06_i", "name": "Dunkelbraun"},
        ]
    },
    "verglasung": {
        "description": "Glazing type",
        "config_key": "glas",
        "options": [
            {"id": "g1", "name": "2-fach Verglasung"},
            {"id": "g2", "name": "3-fach Verglasung"},
            {"id": "g3", "name": "3-fach Verglasung Premium"},
            {"id": "g4", "name": "3-fach Verglasung Passivhaus"},
            {"id": "g5", "name": "2-fach Verglasung Solar"},
            {"id": "g6", "name": "3-fach Verglasung Solar"},
        ]
    },
    "schallschutz": {
        "description": "Sound insulation",
        "options": [
            {"id": "schallschutz_nein", "name": "Nein (Standard SSK1)"},
            {"id": "schallschutz_ja", "name": "Ja"},
        ]
    },
    "sicherheitsverglasung": {
        "description": "Safety glazing",
        "options": [
            {"id": "sicherheitsverglasung_0", "name": "Nein"},
            {"id": "sicherheitsverglasung_1", "name": "Ja"},
        ]
    },
    "ornament": {
        "description": "Ornament & sun protection glass",
        "options": [
            {"id": "ornament_0", "name": "Nein"},
            {"id": "ornament_1", "name": "Ja"},
        ]
    },
    "druckventil": {
        "description": "Pressure equalization valve",
        "config_key": "drv",
        "options": [
            {"id": "drv_0", "name": "Nein"},
            {"id": "drv_1", "name": "Ja"},
        ]
    },
    "sprossen": {
        "description": "Muntins/Bars",
        "options": [
            {"id": "sprossen_0", "name": "Nein"},
            {"id": "sprossen_1", "name": "Sprossen innenliegend"},
            {"id": "sprossen_2", "name": "Sprossen aufliegend"},
        ]
    },
    "rollladen": {
        "description": "Roller shutter",
        "config_key": "roll",
        "options": [
            {"id": "roll_0", "name": "Nein"},
            {"id": "roll_1", "name": "Aufsatzrollladen"},
            {"id": "roll_2", "name": "Vorsatzrollladen"},
        ]
    },
    "duenne_schweissnaht": {
        "description": "Thin weld seam (V-Perfect)",
        "config_key": "dsd",
        "options": [
            {"id": "dsd_0", "name": "Nein"},
            {"id": "dsd_1", "name": "Ja"},
        ]
    },
    "rahmenverbreiterung": {
        "description": "Frame widening",
        "options": [
            {"id": "rahmenverbreiterung_0", "name": "Nein"},
            {"id": "rahmenverbreiterung_1", "name": "Ja"},
        ]
    },
    "fensterbankanschluss": {
        "description": "Window sill connection",
        "config_key": "febaan",
        "options": [
            {"id": "febaan_0", "name": "Nein"},
            {"id": "febaan_1", "name": "Ja"},
        ]
    },
}

# For each surcharge category, test each option and record price difference
surcharge_results = {}
base_config = deepcopy(BASE_CONFIG)
base_result, _ = call_api(base_config)
base_price = base_result.get('angebotspreis', 47.48) if base_result else 47.48
base_empfehlung = base_result.get('preisempfehlung', 79.13) if base_result else 79.13
print(f"\nBase price (500x500, S8000, all defaults): {base_price} EUR (Empfehlung: {base_empfehlung} EUR)")

for category_key, category in surcharges.items():
    print(f"\n  Testing: {category['description']}")
    config_key = category.get('config_key', category_key)
    category_results = []
    
    for option in category['options']:
        config = deepcopy(BASE_CONFIG)
        
        # Apply the option
        if config_key in config:
            config[config_key] = option['id']
        elif category_key == 'hersteller':
            config['hersteller'] = option['id']
        elif category_key == 'blendrahmen':
            config['br'] = option['id']
        elif category_key == 'fluegel':
            config['fl'] = option['id']
        elif category_key == 'fensterart':
            config['art'] = option['id']
        elif category_key == 'fenstertyp':
            config['typ'] = option['id']
        elif category_key == 'oeffnungsrichtung':
            config['oer'] = option['id']
        elif category_key == 'dichtungsfarbe_aussen':
            config['dfa'] = option['id']
        elif category_key == 'dichtungsfarbe_innen':
            config['dfi'] = option['id']
        elif category_key == 'kernfarbe':
            config['kf'] = option['id']
        elif category_key == 'dekofarbe_aussen':
            config['dekofarbe_a'] = option['id']
        elif category_key == 'dekofarbe_innen':
            config['dekofarbe_i'] = option['id']
        elif category_key == 'rahmenverbreiterung':
            config['rahmenverbreiterung'] = option['id']
        
        result, html = call_api(config)
        if result:
            angebot = result.get('angebotspreis', 0)
            empfehlung = result.get('preisempfehlung', 0)
            surcharge = round(angebot - base_price, 2)
            surcharge_empfehlung = round(empfehlung - base_empfehlung, 2)
            
            opt_result = {
                'option_id': option['id'],
                'option_name': option['name'],
                'angebotspreis_eur': angebot,
                'preisempfehlung_eur': empfehlung,
                'aufpreis_angebot_eur': surcharge,
                'aufpreis_empfehlung_eur': surcharge_empfehlung,
            }
            category_results.append(opt_result)
            print(f"    {option['name']}: {angebot} EUR (Aufpreis: {surcharge:+.2f})")
        else:
            print(f"    {option['name']}: FAILED")
        
        time.sleep(0.3)
    
    surcharge_results[category_key] = {
        'description': category['description'],
        'base_price': base_price,
        'options': category_results
    }

# Save surcharges JSON
surcharges_file = f"{JSON_DIR}/gealan_pvc_aufpreise.json"
with open(surcharges_file, 'w', encoding='utf-8') as f:
    json.dump(surcharge_results, f, ensure_ascii=False, indent=2)
print(f"\nSaved surcharges: {surcharges_file}")

# ============================================================
# SECTION 4: MASSE STEP - Fensterbankanschluss + dimension types
# ============================================================
print("\n" + "="*70)
print("SECTION 4: MAßE STEP - Dimension Options")
print("="*70)

masse_options = {
    "fensterbankanschluss": {
        "description": "Window sill connection",
        "options": [
            {"config": {"febaan": "febaan_0"}, "name": "Nein"},
            {"config": {"febaan": "febaan_1"}, "name": "Ja"},
        ]
    }
}

masse_results = {}
for key, category in masse_options.items():
    print(f"\n  {category['description']}")
    results = []
    for option in category['options']:
        config = deepcopy(BASE_CONFIG)
        config.update(option['config'])
        result, _ = call_api(config)
        if result:
            results.append({
                'option': option['name'],
                'angebotspreis': result.get('angebotspreis'),
                'preisempfehlung': result.get('preisempfehlung'),
                'aufpreis': round(result.get('angebotspreis', 0) - base_price, 2)
            })
            print(f"    {option['name']}: {result.get('angebotspreis')} EUR")
        time.sleep(0.3)
    masse_results[key] = results

# ============================================================
# SECTION 5: ROLLLADEN - Detailed options
# ============================================================
print("\n" + "="*70)
print("SECTION 5: ROLLLADEN - Detailed Options")
print("="*70)

rollladen_options = [
    {"roll": "roll_0", "name": "Kein Rollladen"},
    {"roll": "roll_1", "name": "Aufsatzrollladen"},
    {"roll": "roll_2", "name": "Vorsatzrollladen"},
]

rollladen_results = []
for option in rollladen_options:
    config = deepcopy(BASE_CONFIG)
    config['roll'] = option['roll']
    result, _ = call_api(config)
    if result:
        rollladen_results.append({
            'option_id': option['roll'],
            'option_name': option['name'],
            'angebotspreis': result.get('angebotspreis'),
            'preisempfehlung': result.get('preisempfehlung'),
            'aufpreis': round(result.get('angebotspreis', 0) - base_price, 2)
        })
        print(f"  {option['name']}: {result.get('angebotspreis')} EUR (Aufpreis: {round(result.get('angebotspreis', 0) - base_price, 2):+.2f})")
    time.sleep(0.3)

# ============================================================
# SECTION 6: SONSTIGES - Extra options
# ============================================================
print("\n" + "="*70)
print("SECTION 6: SONSTIGES - Extra Options")
print("="*70)

sonstiges_options = {
    "duenne_schweissnaht": [
        {"dsd": "dsd_0", "name": "Nein"},
        {"dsd": "dsd_1", "name": "Ja (V-Perfect)"},
    ],
    "rahmenverbreiterung": [
        {"rahmenverbreiterung": "rahmenverbreiterung_0", "name": "Nein"},
        {"rahmenverbreiterung": "rahmenverbreiterung_1", "unten": "unten_30", "links": "links_30", "rechts": "rechts_30", "oben": "oben_30", "name": "Ja (alle Seiten 30mm)"},
    ]
}

sonstiges_results = {}
for key, options in sonstiges_options.items():
    print(f"\n  {key}")
    results = []
    for option in options:
        config = deepcopy(BASE_CONFIG)
        option_copy = dict(option)
        name = option_copy.pop('name')
        config.update(option_copy)
        result, _ = call_api(config)
        if result:
            results.append({
                'option': name,
                'angebotspreis': result.get('angebotspreis'),
                'preisempfehlung': result.get('preisempfehlung'),
                'aufpreis': round(result.get('angebotspreis', 0) - base_price, 2)
            })
            print(f"    {name}: {result.get('angebotspreis')} EUR (Aufpreis: {round(result.get('angebotspreis', 0) - base_price, 2):+.2f})")
        time.sleep(0.3)
    sonstiges_results[key] = results

# ============================================================
# SAVE ALL RESULTS
# ============================================================
print("\n" + "="*70)
print("SAVING ALL RESULTS")
print("="*70)

# Save comprehensive surcharges JSON
full_data = {
    "product": "GEALAN PVC Fenster",
    "url": "https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan/",
    "discount_factor": 0.60,
    "discount_percent": 40,
    "base_config": {
        "profil": "GEALAN S8000",
        "breite_mm": 500,
        "hoehe_mm": 500,
        "base_angebotspreis": base_price,
        "base_preisempfehlung": base_empfehlung
    },
    "profil_base_prices": profil_base_prices,
    "surcharges": surcharge_results,
    "masse": masse_results,
    "rollladen": rollladen_results,
    "sonstiges": sonstiges_results
}

full_json_file = f"{JSON_DIR}/gealan_pvc_complete_data.json"
with open(full_json_file, 'w', encoding='utf-8') as f:
    json.dump(full_data, f, ensure_ascii=False, indent=2)
print(f"Saved complete data: {full_json_file}")

# Save profil base prices CSV
if profil_base_prices:
    fname = f"{CSV_DIR}/gealan_pvc_profil_basispreise.csv"
    with open(fname, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=profil_base_prices[0].keys())
        writer.writeheader()
        writer.writerows(profil_base_prices)
    print(f"Saved: {fname}")

# Save surcharges as flat CSV
surcharge_rows = []
for cat_key, cat_data in surcharge_results.items():
    for opt in cat_data.get('options', []):
        surcharge_rows.append({
            'kategorie': cat_key,
            'beschreibung': cat_data['description'],
            'option_id': opt.get('option_id', ''),
            'option_name': opt.get('option_name', ''),
            'angebotspreis_eur': opt.get('angebotspreis_eur', 0),
            'preisempfehlung_eur': opt.get('preisempfehlung_eur', 0),
            'aufpreis_angebot_eur': opt.get('aufpreis_angebot_eur', 0),
            'aufpreis_empfehlung_eur': opt.get('aufpreis_empfehlung_eur', 0),
        })

if surcharge_rows:
    fname = f"{CSV_DIR}/gealan_pvc_aufpreise.csv"
    with open(fname, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=surcharge_rows[0].keys())
        writer.writeheader()
        writer.writerows(surcharge_rows)
    print(f"Saved: {fname}")

print("\n" + "="*70)
print("EXTRACTION COMPLETE!")
print("="*70)
print(f"Files saved to: {OUTPUT_DIR}")
print(f"  CSV: {CSV_DIR}")
print(f"  JSON: {JSON_DIR}")
print(f"  HTML: {HTML_DIR}")
