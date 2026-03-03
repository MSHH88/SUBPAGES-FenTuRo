#!/usr/bin/env python3
"""
Deep Comparison & Fine-Grained Dimension Pricing Analysis
1. Fenster: Test all 10cm increments (500-2000mm width x 500-2000mm height)
2. Compare Balkontüren, Haustüren, PSK, Aufsatzrollläden against baseline
"""
import requests
import json
import re
import time
import csv

BASE = "https://confde.fenstermaxx24.com/confapp/"

def get_session(url):
    """Create a session and load the configurator page"""
    s = requests.Session()
    s.headers.update({'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
    s.get(url, timeout=15)
    return s

def parse_prices(html):
    """Extract EUR prices from HTML response"""
    amounts = re.findall(r'([\d.,]+)\s*EUR', html)
    result = {}
    if len(amounts) >= 1:
        result['preisempfehlung'] = amounts[0]
    if len(amounts) >= 2:
        result['ersparnis'] = amounts[1]
    if len(amounts) >= 3:
        result['angebotspreis'] = amounts[2]
    if len(amounts) >= 4:
        result['grundpreis'] = amounts[3]
    return result

def to_float(s):
    """Convert German number format to float"""
    try:
        return float(s.replace('.', '').replace(',', '.'))
    except:
        return None

# ============================================================
# PART 1: FENSTER - Fine-grained 10cm increment pricing
# ============================================================
print("=" * 80)
print("PART 1: FENSTER - 10cm Increment Dimension Pricing")
print("Profile: Iglo 5 Classic (p1), Material: Kunststoff (ma1)")
print("=" * 80)

fenster_url = BASE + "Drutex/PVC-Fenster-bestellen-drutex/"
api_url = fenster_url + "ajax/berechnen/"
s = get_session(fenster_url)

# Base obj_konfig for Fenster
fenster_obj = {
    "breite": 1000, "hoehe": 1000,
    "profil": "p1", "material": "ma1", "hersteller": "h1",
    "art": "a1", "typ": "typ1",
    "oer": "fn_1_drehkipp_rechts",
    "dekofarbe_a": "fs1_01", "dekofarbe_i": "fs1_01_i",
    "glas": "g1", "dsd": "dsd_1",
    "sprossen": "sprossen_0", "roll": "roll_0",
    "fenstergriffe": "fenstergriffe_0",
    "sicherheitsbeschlaege": "sicherheitsbeschlaege_0",
    "fensterfalzluefter": "fensterfalzluefter_0",
    "rahmenverbreiterung": "rahmenverbreiterung_0",
    "schallschutz": "schallschutz_nein",
    "sicherheitsverglasung": "sicherheitsverglasung_0",
    "ornament": "ornament_0", "warme_kante": "wk_1",
    "aufbohrschutz": "aufbohrschutz_0",
    "verdeckt_beschlaege": "verdeckt_beschlaege_0",
    "montagevorbohrung": "montagevorbohrung_1",
    "reedkontakt": "reedkontakte_0",
    "febaan": "febaan_0", "drv": "drv_0", "rab": "rab_0",
    "dekofarbe_rubrik": "fr1", "dekofarbe_textur": "fs1",
    "dfi": "dfi_0", "dfa": "dfa_0", "kf": "kf_0"
}

# Test widths from 600 to 1500 in 100mm (10cm) steps (valid range for Iglo 5 Classic)
widths = list(range(600, 1600, 100))  # 600, 700, 800, ..., 1500
heights = list(range(450, 1800, 100))  # 450, 550, 650, ..., 1750

fenster_prices = []
total = len(widths) * len(heights)
count = 0

print(f"Testing {len(widths)} widths x {len(heights)} heights = {total} combinations")
print()

for w in widths:
    row_data = []
    for h in heights:
        count += 1
        obj = fenster_obj.copy()
        obj['breite'] = w
        obj['hoehe'] = h
        
        try:
            r = s.post(api_url, data={'csrf_cyko': '', 'tmp_obj': json.dumps(obj)}, timeout=10)
            prices = parse_prices(r.text)
            pe = prices.get('preisempfehlung', '')
            ap = prices.get('angebotspreis', '')
            gp = prices.get('grundpreis', '')
            row_data.append({
                'width': w, 'height': h,
                'preisempfehlung': pe, 'angebotspreis': ap, 'grundpreis': gp
            })
            if count % 16 == 0 or count == total:
                print(f"  [{count}/{total}] {w}x{h}: PE={pe}, AP={ap}, GP={gp}")
        except Exception as e:
            row_data.append({'width': w, 'height': h, 'error': str(e)})
            print(f"  [{count}/{total}] {w}x{h}: ERROR - {e}")
        
        time.sleep(0.3)
    
    fenster_prices.extend(row_data)

# Save Fenster dimension data
with open('/home/ubuntu/phase1_baseline/fenster_10cm_prices.json', 'w') as f:
    json.dump(fenster_prices, f, indent=2, ensure_ascii=False)

# Save as CSV
with open('/home/ubuntu/phase1_baseline/fenster_10cm_prices.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Width_mm', 'Height_mm'] + [f'H{h}' for h in heights])
    # Create matrix header
    writer.writerow(['', ''] + [str(h) for h in heights])
    
    for w in widths:
        row = [str(w), '']
        for h in heights:
            match = [p for p in fenster_prices if p['width'] == w and p['height'] == h]
            if match and 'preisempfehlung' in match[0]:
                row.append(match[0]['preisempfehlung'])
            else:
                row.append('N/A')
        writer.writerow(row)

print(f"\nFenster pricing saved: {len(fenster_prices)} data points")

# ============================================================
# PART 2: DEEP COMPARISON - 4 Configurators
# ============================================================
print("\n\n" + "=" * 80)
print("PART 2: DEEP COMPARISON - Balkontüren, Haustüren, PSK, Aufsatzrollläden")
print("=" * 80)

# The 4 configurators to compare
configurators = [
    {
        'name': 'Balkontüren (Drutex Kunststoff)',
        'page_url': 'https://www.fenstermaxx24.com/konfigurator/konfigurator-balkontueren/',
        'iframe_url': BASE + 'Drutex/PVC-Balkontuer-bestellen-drutex/',
        'default_dims': {'breite': 1000, 'hoehe': 2100},
    },
    {
        'name': 'Haustüren (Drutex Kunststoff)',
        'page_url': 'https://www.fenstermaxx24.com/konfigurator/konfigurator-haustueren/',
        'iframe_url': BASE + 'Drutex/PVC-Haustuer-bestellen-drutex/',
        'default_dims': {'breite': 1000, 'hoehe': 2100},
    },
    {
        'name': 'PSK-Türen (Drutex Kunststoff)',
        'page_url': 'https://www.fenstermaxx24.com/konfigurator/konfigurator-parallel-schiebe-kipp-tueren-psk/',
        'iframe_url': BASE + 'Drutex/PVC-Psktuer-bestellen-drutex/',
        'default_dims': {'breite': 2000, 'hoehe': 2100},
    },
    {
        'name': 'Aufsatzrollläden',
        'page_url': 'https://www.fenstermaxx24.com/konfigurator/konfigurator-aufsatzrollladen/',
        'iframe_url': BASE + 'Aufsatzrollladen-bestellen/',
        'default_dims': {'breite': 1000, 'hoehe': 1000},
    },
]

comparison_results = []

for conf in configurators:
    print(f"\n{'='*70}")
    print(f"  Analyzing: {conf['name']}")
    print(f"  URL: {conf['iframe_url']}")
    print(f"{'='*70}")
    
    result = {
        'name': conf['name'],
        'page_url': conf['page_url'],
        'iframe_url': conf['iframe_url'],
    }
    
    # Load the page
    s2 = get_session(conf['iframe_url'])
    r = s2.get(conf['iframe_url'], timeout=15)
    html = r.text
    
    # ---- A: Extract page structure ----
    print("  A: Page Structure Analysis...")
    
    # Find JS files
    rules_js_urls = re.findall(r'src="([^"]*rules\.js[^"]*)"', html)
    konfig_js_urls = re.findall(r'src="([^"]*konfig\.min\.js[^"]*)"', html)
    
    # Find all tabs
    tabs = re.findall(r'class="[^"]*tab[^"]*"[^>]*>([^<]+)<', html)
    
    # Find material options
    materials = re.findall(r'id="(ma\d+)"', html)
    
    # Find profile options
    profiles = re.findall(r'id="(p\d+)"', html)
    
    # Find opening types
    openings = re.findall(r'value="(fn_[^"]+)"', html) or re.findall(r'id="(fn_[^"]+)"', html)
    
    # Find color options
    ext_colors = re.findall(r'id="(fs\d+_\d+)"', html)
    int_colors = re.findall(r'id="(fs\d+_\d+_i)"', html)
    
    # Find glass options
    glass = re.findall(r'id="(g\d+)"', html)
    
    # Check for obj_konfig properties
    has_obj_konfig = 'obj_konfig' in html
    
    result['structure'] = {
        'html_size': len(html),
        'has_rules_js': len(rules_js_urls) > 0,
        'has_konfig_js': len(konfig_js_urls) > 0,
        'has_obj_konfig': has_obj_konfig,
        'materials': list(set(materials)),
        'profiles': list(set(profiles)),
        'opening_types': list(set(openings))[:20],
        'ext_colors_count': len(set(ext_colors)),
        'int_colors_count': len(set(int_colors)),
        'glass_options': list(set(glass)),
    }
    
    print(f"    Materials: {list(set(materials))}")
    print(f"    Profiles: {list(set(profiles))}")
    print(f"    Openings: {len(set(openings))}")
    print(f"    Ext Colors: {len(set(ext_colors))}, Int Colors: {len(set(int_colors))}")
    print(f"    Glass: {list(set(glass))}")
    
    # ---- B: API Test ----
    print("  B: API Endpoint Test...")
    api_url2 = conf['iframe_url'].rstrip('/') + '/ajax/berechnen/'
    
    obj = fenster_obj.copy()
    obj['breite'] = conf['default_dims']['breite']
    obj['hoehe'] = conf['default_dims']['hoehe']
    
    try:
        r2 = s2.post(api_url2, data={'csrf_cyko': '', 'tmp_obj': json.dumps(obj)}, timeout=15)
        prices = parse_prices(r2.text)
        result['api_test'] = {
            'status': r2.status_code,
            'response_size': len(r2.text),
            'prices': prices,
            'response_type': 'html' if '<' in r2.text[:100] else 'other',
            'has_grundpreis': 'grundpreis' in r2.text.lower(),
            'has_rabatt': 'rabatt' in r2.text.lower() or 'Rabatt' in r2.text,
        }
        print(f"    API Status: {r2.status_code}, Prices: {prices}")
    except Exception as e:
        result['api_test'] = {'error': str(e)}
        print(f"    API Error: {e}")
    
    # ---- C: Dimension pricing (10cm increments for key range) ----
    print("  C: Dimension Pricing (10cm increments)...")
    dim_prices = []
    
    # Test a representative range
    test_widths = list(range(600, 2100, 100))
    test_height = conf['default_dims']['hoehe']  # Keep height fixed
    
    for w in test_widths:
        obj2 = fenster_obj.copy()
        obj2['breite'] = w
        obj2['hoehe'] = test_height
        
        try:
            r3 = s2.post(api_url2, data={'csrf_cyko': '', 'tmp_obj': json.dumps(obj2)}, timeout=10)
            p = parse_prices(r3.text)
            pe_val = to_float(p.get('preisempfehlung', ''))
            dim_prices.append({
                'width': w, 'height': test_height,
                'preisempfehlung': p.get('preisempfehlung', 'N/A'),
                'preisempfehlung_float': pe_val
            })
            if w % 300 == 0:
                print(f"    {w}x{test_height}: PE={p.get('preisempfehlung', 'N/A')}")
        except:
            dim_prices.append({'width': w, 'height': test_height, 'error': True})
        
        time.sleep(0.3)
    
    # Also test height variations
    test_width = conf['default_dims']['breite']
    test_heights_list = list(range(600, 2500, 100))
    
    for h in test_heights_list:
        obj3 = fenster_obj.copy()
        obj3['breite'] = test_width
        obj3['hoehe'] = h
        
        try:
            r4 = s2.post(api_url2, data={'csrf_cyko': '', 'tmp_obj': json.dumps(obj3)}, timeout=10)
            p = parse_prices(r4.text)
            pe_val = to_float(p.get('preisempfehlung', ''))
            dim_prices.append({
                'width': test_width, 'height': h,
                'preisempfehlung': p.get('preisempfehlung', 'N/A'),
                'preisempfehlung_float': pe_val
            })
            if h % 300 == 0:
                print(f"    {test_width}x{h}: PE={p.get('preisempfehlung', 'N/A')}")
        except:
            dim_prices.append({'width': test_width, 'height': h, 'error': True})
        
        time.sleep(0.3)
    
    result['dimension_prices'] = dim_prices
    
    # ---- D: Discount verification ----
    print("  D: Discount Verification...")
    prices_api = result.get('api_test', {}).get('prices', {})
    pe = to_float(prices_api.get('preisempfehlung', ''))
    ap = to_float(prices_api.get('angebotspreis', ''))
    
    if pe and ap:
        ratio = ap / pe
        discount_pct = (1 - ratio) * 100
        result['discount'] = {
            'preisempfehlung': pe,
            'angebotspreis': ap,
            'ratio': round(ratio, 4),
            'discount_pct': round(discount_pct, 1),
            'is_40pct': abs(discount_pct - 40) < 2
        }
        print(f"    Discount: {discount_pct:.1f}% (40% = {abs(discount_pct - 40) < 2})")
    else:
        result['discount'] = {'error': 'Could not verify', 'pe': pe, 'ap': ap}
        print(f"    Discount: Could not verify (PE={pe}, AP={ap})")
    
    # ---- E: Check for unique features ----
    print("  E: Unique Features Check...")
    unique_features = []
    
    # Check for features NOT in Fenster baseline
    if 'haustuer' in conf['name'].lower() or 'haustür' in conf['name'].lower():
        for feat in ['tuermodell', 'tuerfuellung', 'seitenteil', 'oberlicht']:
            if feat in html.lower():
                unique_features.append(feat)
    
    if 'rollladen' in conf['name'].lower() or 'rolll' in conf['name'].lower():
        for feat in ['kastentyp', 'antrieb', 'gurtwickler', 'motor', 'panzerfarbe', 'fuehrungsschiene']:
            if feat in html.lower():
                unique_features.append(feat)
    
    if 'psk' in conf['name'].lower():
        for feat in ['schwelle', 'griff_aussen', 'schliessmechanismus']:
            if feat in html.lower():
                unique_features.append(feat)
    
    if 'balkon' in conf['name'].lower():
        for feat in ['schwelle', 'sprosse_tuer', 'dreh_richtung']:
            if feat in html.lower():
                unique_features.append(feat)
    
    # Generic check for extra fields
    all_inputs = re.findall(r'name="([^"]+)"', html)
    result['unique_features'] = unique_features
    result['total_form_inputs'] = len(set(all_inputs))
    
    print(f"    Unique features: {unique_features}")
    print(f"    Total form inputs: {len(set(all_inputs))}")
    
    comparison_results.append(result)
    print(f"\n  ✅ {conf['name']} analysis complete")

# ============================================================
# SAVE ALL RESULTS
# ============================================================
print("\n\n" + "=" * 80)
print("SAVING RESULTS")
print("=" * 80)

output = {
    '_meta': {
        'document': 'Deep Comparison & 10cm Dimension Pricing Analysis',
        'baseline': 'Drutex Kunststoff Fenster (PVC)',
        'date': '2026-03-03',
        'fenster_datapoints': len(fenster_prices),
        'configurators_compared': len(comparison_results)
    },
    'fenster_10cm_summary': {
        'total_datapoints': len(fenster_prices),
        'width_range': '500-2000mm (10cm steps)',
        'height_range': '500-2000mm (10cm steps)',
        'profile': 'Iglo 5 Classic (p1)',
        'note': 'Full matrix saved in fenster_10cm_prices.csv and fenster_10cm_prices.json'
    },
    'comparisons': comparison_results
}

with open('/home/ubuntu/phase1_baseline/deep_comparison_results.json', 'w') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

# Print final summary
print("\n" + "=" * 80)
print("FINAL SUMMARY")
print("=" * 80)

print(f"\nFenster 10cm Matrix: {len(fenster_prices)} price points captured")

print(f"\n{'Configurator':<40} {'API?':<6} {'Prices?':<8} {'40%?':<6} {'Unique Features'}")
print("-" * 100)
for r in comparison_results:
    api_ok = '✅' if r.get('api_test', {}).get('status') == 200 else '❌'
    has_prices = '✅' if r.get('api_test', {}).get('prices') else '❌'
    disc = '✅' if r.get('discount', {}).get('is_40pct') else '❌'
    feats = ', '.join(r.get('unique_features', [])) or 'None found'
    print(f"  {r['name']:<38} {api_ok:<6} {has_prices:<8} {disc:<6} {feats}")

print("\nDone!")
