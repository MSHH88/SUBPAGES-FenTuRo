#!/usr/bin/env python3
"""Quick test of the pricing API"""

import requests
import json
import re
from bs4 import BeautifulSoup

BASE_URL = "https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan"
API_URL = f"{BASE_URL}/ajax/berechnen/"

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Referer': 'https://confde.fenstermaxx24.com/confapp/Gealan/PVC-Fenster-bestellen-gealan/',
    'Origin': 'https://confde.fenstermaxx24.com',
    'Content-Type': 'application/x-www-form-urlencoded',
})

print("Step 1: Getting page...")
resp = session.get(f"{BASE_URL}/", timeout=15)
print(f"Status: {resp.status_code}, Length: {len(resp.text)}")

# Find CSRF token
csrf = ''
for match in re.finditer(r'global_hash\s*=\s*["\']([^"\']*)["\']', resp.text):
    csrf = match.group(1)
    print(f"CSRF found: '{csrf}'")

# Also check cookies
print(f"Cookies: {dict(session.cookies)}")

# Test config
config = {
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

print("\nStep 2: Calling pricing API...")
data = {'csrf_cyko': csrf, 'tmp_obj': json.dumps(config)}
resp2 = session.post(API_URL, data=data, timeout=15)
print(f"API Status: {resp2.status_code}")
print(f"Response length: {len(resp2.text)}")
print(f"Response preview: {resp2.text[:500]}")

# Parse prices
grundpreis = re.search(r'Grundpreis[:\s]*([\d.,]+)\s*EUR', resp2.text)
angebot = re.search(r'<h2>([\d.,]+)\s*EUR', resp2.text)
empfehlung = re.search(r'id="topStrokePrice"[^>]*>([\d.,]+)\s*EUR', resp2.text)

print(f"\nGrundpreis: {grundpreis.group(1) if grundpreis else 'NOT FOUND'}")
print(f"Angebotspreis: {angebot.group(1) if angebot else 'NOT FOUND'}")
print(f"Preisempfehlung: {empfehlung.group(1) if empfehlung else 'NOT FOUND'}")
