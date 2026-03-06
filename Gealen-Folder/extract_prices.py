#!/usr/bin/env python3
"""
Price Matrix Extractor for Gealan Window Configurator
Extracts pricing data from fenstermaxx24.com configurator API
"""

import requests
import json
import csv
import time
import re
from bs4 import BeautifulSoup
from copy import deepcopy

BASE_URL = "https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan"
API_URL = f"{BASE_URL}/ajax/berechnen/"

# Session to maintain cookies
session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan/',
    'Origin': 'https://confde.fenstermaxx24.com',
    'Content-Type': 'application/x-www-form-urlencoded',
})

# First, get the page to obtain CSRF token
def get_csrf_token():
    resp = session.get(f"{BASE_URL}/")
    # Look for csrf token in page
    soup = BeautifulSoup(resp.text, 'html.parser')
    # Check for hidden inputs
    csrf_input = soup.find('input', {'name': 'csrf_cyko'})
    if csrf_input:
        return csrf_input.get('value', '')
    # Look in scripts
    for script in soup.find_all('script'):
        text = script.string or ''
        match = re.search(r'global_hash\s*=\s*["\']([^"\']+)["\']', text)
        if match:
            return match.group(1)
    return ''

# Base configuration object (default state)
BASE_CONFIG = {
    "breite": 500,
    "hoehe": 500,
    "hoehe_ol": 0,
    "hoehe_ul": 0,
    "mass_txt": "",
    "material": "ma1",
    "hersteller": "h7",
    "rab": "rab_0",
    "profil": "p1",
    "br": "br_1",
    "fl": "fl_1",
    "art": "a1",
    "typ": "typ1",
    "oer": "fn_1_fest_ohne_fluegel",
    "oer_oben": "-",
    "oer_unten": "-",
    "dekofarbe_rubrik": "fr1",
    "dekofarbe_textur": "fs1",
    "dekofarbe_a": "fs1_01",
    "dekofarbe_i": "fs1_01_i",
    "dfi": "dfi_1",
    "dfa": "dfa_1",
    "kf": "kf_0",
    "glas": "g1",
    "schallschutz": "schallschutz_nein",
    "schallschutz_db": "schallschutz_stufe01",
    "sicherheitsverglasung": "sicherheitsverglasung_0",
    "sicherheitsverglasung_typ": "verglasung_typ_2_1",
    "ornament": "ornament_0",
    "ornament_typ": "ornament_typ_1",
    "warme_kante": "--",
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
    "roll_kh": "roll_kh_210",
    "roll_fk": "roll_fk_0",
    "dekofarbe_fb": "fk1_01",
    "roll_antriebart": "roll_antriebart_1",
    "roll_as": "roll_as_l",
    "roll_lambreite": "roll_lambreite_37 ",
    "roll_pt": "roll_pt_0",
    "roll_schallschutz": "roll_schallschutz_0",
    "roll_stahlverstaerkung": "roll_stahlverstaerkung_0",
    "roll_stahlverstaerkung_art": "roll_stahlverstaerkung_art_1",
    "roll_vormontiert": "roll_vormontiert_0",
    "roll_fs_schraege": "roll_fs_schraege_0",
    "roll_fs_verlaengerung": "0",
    "fenstergriffe": "fenstergriffe_0",
    "fenstergriffart": "fenstergriffart_1_1",
    "fenstergriffart_ral": "",
    "oberlichtoeffner": "oberlichtoeffner_0",
    "main_handleside": "main_handleside_0",
    "ol_handleside": "ol_handleside_0",
    "ul_handleside": "ul_handleside_0",
    "griffhoehe": "griffhoehe_0",
    "griffhoehe_value": "183mm",
    "aufbohrschutz": "aufbohrschutz_0",
    "sicherheitsbeschlaege": "sicherheitsbeschlaege_0",
    "sicherheitsbeschlaegeart": "sicherheitsbeschlaege_art_1_1",
    "verdeckt_beschlaege": "verdeckt_beschlaege_0",
    "montagevorbohrung": "montagevorbohrung_1",
    "reedkontakt": "reedkontakte_0",
    "febaan": "febaan_0",
    "fensterfalzluefter": "fensterfalzluefter_0",
    "fensterfalzluefter_art": "fensterfalzluefter_art_1",
    "dsd": "dsd_0",
    "rahmenverbreiterung": "rahmenverbreiterung_0",
    "unten": "unten_0",
    "links": "links_0",
    "rechts": "rechts_0",
    "oben": "oben_0",
}

def parse_price_from_html(html_text):
    """Extract price data from the API response HTML"""
    soup = BeautifulSoup(html_text, 'html.parser')
    
    result = {}
    
    # Get Preisempfehlung (recommended price before discount)
    stroke_price = soup.find(id='topStrokePrice')
    if stroke_price:
        price_text = stroke_price.get_text(strip=True)
        match = re.search(r'([\d.,]+)\s*EUR', price_text)
        if match:
            result['preisempfehlung'] = float(match.group(1).replace('.', '').replace(',', '.'))
    
    # Get Angebotspreis (offer price = 60% of recommended)
    h2_tags = soup.find_all('h2')
    for h2 in h2_tags:
        text = h2.get_text(strip=True)
        match = re.search(r'([\d.,]+)\s*EUR', text)
        if match:
            result['angebotspreis'] = float(match.group(1).replace('.', '').replace(',', '.'))
            break
    
    # Get Grundpreis (base price)
    all_text = soup.get_text()
    grundpreis_match = re.search(r'Grundpreis[:\s]*([\d.,]+)\s*EUR', all_text)
    if grundpreis_match:
        result['grundpreis'] = float(grundpreis_match.group(1).replace('.', '').replace(',', '.'))
    
    # Extract all line items with prices
    rows = soup.find_all('div', class_='row')
    line_items = []
    for row in rows:
        cols = row.find_all(['div', 'small', 'p'])
        texts = [c.get_text(strip=True) for c in cols if c.get_text(strip=True)]
        if len(texts) >= 2:
            # Look for price patterns
            for i, text in enumerate(texts):
                if re.search(r'[\d.,]+', text) and i > 0:
                    line_items.append({'label': texts[0], 'value': texts[-1]})
                    break
    
    result['line_items'] = line_items
    
    # Extract all prices from text
    price_lines = []
    for line in all_text.split('\n'):
        line = line.strip()
        if line and (re.search(r'[\d.,]+\s*EUR', line) or re.search(r'[\d.,]+$', line)):
            price_lines.append(line)
    result['price_lines'] = price_lines[:50]
    
    return result

def call_api(config, csrf=''):
    """Call the pricing API with given configuration"""
    try:
        data = {
            'csrf_cyko': csrf,
            'tmp_obj': json.dumps(config)
        }
        resp = session.post(API_URL, data=data, timeout=30)
        if resp.status_code == 200:
            return parse_price_from_html(resp.text), resp.text
        else:
            print(f"Error: HTTP {resp.status_code}")
            return None, None
    except Exception as e:
        print(f"Exception: {e}")
        return None, None

def extract_grundpreis(html_text):
    """Extract just the Grundpreis from HTML"""
    match = re.search(r'Grundpreis[:\s]*([\d.,]+)\s*EUR', html_text)
    if match:
        return float(match.group(1).replace('.', '').replace(',', '.'))
    return None

def extract_angebotspreis(html_text):
    """Extract the Angebotspreis from HTML"""
    soup = BeautifulSoup(html_text, 'html.parser')
    h2_tags = soup.find_all('h2')
    for h2 in h2_tags:
        text = h2.get_text(strip=True)
        match = re.search(r'([\d.,]+)\s*EUR', text)
        if match:
            return float(match.group(1).replace('.', '').replace(',', '.'))
    return None

def extract_preisempfehlung(html_text):
    """Extract the Preisempfehlung from HTML"""
    match = re.search(r'id="topStrokePrice"[^>]*>([\d.,]+)\s*EUR', html_text)
    if match:
        return float(match.group(1).replace('.', '').replace(',', '.'))
    return None

print("Starting price extraction...")
print("Getting CSRF token...")
csrf = get_csrf_token()
print(f"CSRF token: '{csrf}'")

# Test basic call
print("\nTesting basic API call...")
config = deepcopy(BASE_CONFIG)
result, html = call_api(config, csrf)
if result:
    print(f"Basic test - Grundpreis: {result.get('grundpreis')}, Angebotspreis: {result.get('angebotspreis')}, Preisempfehlung: {result.get('preisempfehlung')}")
else:
    print("Basic test failed!")

# ============================================================
# PHASE 1: Base Price Matrix - Width x Height for each Profile
# ============================================================
print("\n" + "="*60)
print("PHASE 1: Base Price Matrix (Width x Height)")
print("="*60)

# Profiles for Gealan/Kunststoff
profiles = [
    {"id": "p1", "name": "GEALAN S8000", "br": "br_1"},
    {"id": "p4", "name": "GEALAN-LINEAR", "br": "br_1"},
    {"id": "p2", "name": "GEALAN S9000", "br": "br_1"},
]

# Dimension ranges to test
widths = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000]
heights = [400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1800, 2000]

all_matrix_data = []

for profile in profiles:
    print(f"\nProfile: {profile['name']} ({profile['id']})")
    matrix_data = []
    
    for width in widths:
        for height in heights:
            config = deepcopy(BASE_CONFIG)
            config['profil'] = profile['id']
            config['br'] = profile['br']
            config['breite'] = width
            config['hoehe'] = height
            
            result, html = call_api(config, csrf)
            if result:
                grundpreis = result.get('grundpreis', 0)
                angebotspreis = result.get('angebotspreis', 0)
                preisempfehlung = result.get('preisempfehlung', 0)
                
                row = {
                    'profil': profile['name'],
                    'profil_id': profile['id'],
                    'breite_mm': width,
                    'hoehe_mm': height,
                    'flaeche_m2': round((width/1000) * (height/1000), 4),
                    'grundpreis_eur': grundpreis,
                    'preisempfehlung_eur': preisempfehlung,
                    'angebotspreis_eur': angebotspreis,
                    'rabatt_faktor': round(angebotspreis / preisempfehlung, 4) if preisempfehlung else None
                }
                matrix_data.append(row)
                all_matrix_data.append(row)
                print(f"  {width}x{height}: Grundpreis={grundpreis}, Angebot={angebotspreis}")
            else:
                print(f"  {width}x{height}: FAILED")
            
            time.sleep(0.3)  # Be respectful
    
    # Save profile-specific CSV
    if matrix_data:
        csv_file = f"/home/ubuntu/fenster_konfigurator/csv/gealan_pvc_{profile['id']}_preismatrix.csv"
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=matrix_data[0].keys())
            writer.writeheader()
            writer.writerows(matrix_data)
        print(f"  Saved: {csv_file}")

# Save combined matrix
if all_matrix_data:
    csv_file = "/home/ubuntu/fenster_konfigurator/csv/gealan_pvc_alle_profile_preismatrix.csv"
    with open(csv_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=all_matrix_data[0].keys())
        writer.writeheader()
        writer.writerows(all_matrix_data)
    print(f"\nSaved combined matrix: {csv_file}")

print("\nPhase 1 complete!")
