# API-Based Price Extraction Guide

## DISCOVERY: Pricing API Endpoint Found

The `fktBerechnen` function calls a POST endpoint for price calculations.

---

## API Endpoint Pattern

```
POST /confapp/{Manufacturer}/{Product-Slug}/ajax/berechnen/
Content-Type: application/json
```

### Known Endpoints:

| Product | Manufacturer | Endpoint |
|---------|--------------|----------|
| PVC Fenster | Gealan | `/confapp/Gealan/PVC-Fenster-bestellen-gealan/ajax/berechnen/` |
| PVC Fenster | Drutex | `/confapp/Drutex/PVC-Fenster-bestellen-drutex/ajax/berechnen/` |
| Holz Fenster | (TBD) | `/confapp/{Mfg}/Holz-Fenster-bestellen-{mfg}/ajax/berechnen/` |
| Balkonturen | (TBD) | `/confapp/{Mfg}/Balkontueren-bestellen-{mfg}/ajax/berechnen/` |

---

## Extraction Script

Run this in the browser console on any configurator page:

```javascript
// API PRICE MATRIX EXTRACTOR
// Automatically extracts all prices by calling the berechnen API

(async function extractPriceMatrix() {
    console.log('=== PRICE MATRIX EXTRACTOR ===');
    
    // Get the iframe
    const iframe = document.querySelector('iframe');
    const iframeWindow = iframe.contentWindow;
    
    // Find the API endpoint from the page
    const currentURL = iframeWindow.location.href;
    const apiBase = currentURL.replace(/\/[^\/]*$/, '/ajax/berechnen/');
    console.log('API Endpoint:', apiBase);
    
    // Get the current configuration object
    const currentConfig = iframeWindow.obj_konfig || iframeWindow.konfig || {};
    console.log('Current Config:', currentConfig);
    
    // Define dimension ranges to test
    const widths = [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500];
    const heights = [500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800];
    
    const priceMatrix = [];
    const surcharges = {};
    
    // Extract base prices for different dimensions
    console.log('Extracting base prices...');
    
    for (let w of widths) {
        for (let h of heights) {
            const config = JSON.parse(JSON.stringify(currentConfig));
            config.breite = w;
            config.hoehe = h;
            
            try {
                const response = await fetch(apiBase, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config)
                });
                const result = await response.json();
                
                priceMatrix.push({
                    width: w,
                    height: h,
                    base_price: result.grundpreis || result.preis || result.price,
                    offer_price: result.angebotspreis || result.offer_price,
                    full_response: result
                });
                
                console.log(`${w}x${h}: ${result.angebotspreis || result.preis}`);
                
                // Small delay to avoid rate limiting
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.error(`Error for ${w}x${h}:`, e);
            }
        }
    }
    
    // Extract surcharges by testing option changes
    console.log('\nExtracting surcharges...');
    
    // Test profile changes
    const profiles = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
    surcharges.profiles = [];
    
    for (let p of profiles) {
        const config = JSON.parse(JSON.stringify(currentConfig));
        config.profil = p;
        config.breite = 1000;
        config.hoehe = 1000;
        
        try {
            const response = await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const result = await response.json();
            
            surcharges.profiles.push({
                profile: p,
                price: result.angebotspreis || result.preis
            });
            
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {}
    }
    
    // Test color changes
    const colors = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9'];
    surcharges.colors_exterior = [];
    
    for (let c of colors) {
        const config = JSON.parse(JSON.stringify(currentConfig));
        config.farbe_aussen = c;
        config.breite = 1000;
        config.hoehe = 1000;
        
        try {
            const response = await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const result = await response.json();
            
            surcharges.colors_exterior.push({
                color: c,
                price: result.angebotspreis || result.preis
            });
            
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {}
    }
    
    // Test glass changes
    const glasses = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8'];
    surcharges.glass = [];
    
    for (let g of glasses) {
        const config = JSON.parse(JSON.stringify(currentConfig));
        config.verglasung = g;
        config.breite = 1000;
        config.hoehe = 1000;
        
        try {
            const response = await fetch(apiBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const result = await response.json();
            
            surcharges.glass.push({
                glass: g,
                price: result.angebotspreis || result.preis
            });
            
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {}
    }
    
    // Compile results
    const fullData = {
        extracted_at: new Date().toISOString(),
        api_endpoint: apiBase,
        manufacturer: currentConfig.hersteller || 'unknown',
        product_type: currentConfig.produkttyp || 'unknown',
        base_config: currentConfig,
        price_matrix: priceMatrix,
        surcharges: surcharges
    };
    
    // Output results
    console.log('\n=== EXTRACTION COMPLETE ===');
    console.log('Price Matrix Entries:', priceMatrix.length);
    console.log('Profile Prices:', surcharges.profiles?.length || 0);
    console.log('Color Prices:', surcharges.colors_exterior?.length || 0);
    console.log('Glass Prices:', surcharges.glass?.length || 0);
    
    // Copy to clipboard
    const jsonString = JSON.stringify(fullData, null, 2);
    
    // Create download
    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price_data_${fullData.manufacturer}_${Date.now()}.json`;
    a.click();
    
    console.log('\nData downloaded as JSON file!');
    console.log('Also available in window.extractedPriceData');
    
    window.extractedPriceData = fullData;
    return fullData;
})();
```

---

## Quick Single API Test

To test the API works, run this simple version first:

```javascript
// Quick API test
(async function() {
    const iframe = document.querySelector('iframe');
    const iframeWindow = iframe.contentWindow;
    const config = iframeWindow.obj_konfig;
    const apiBase = iframeWindow.location.href.replace(/\/[^\/]*$/, '/ajax/berechnen/');
    
    console.log('API:', apiBase);
    console.log('Config:', config);
    
    const response = await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    
    const result = await response.json();
    console.log('API Response:', result);
    
    return result;
})();
```

---

## For Each Product to Verify

### Product 1: Fenster Kunststoff - Gealan

1. Go to: Gealan PVC Fenster configurator
2. Open DevTools (F12)
3. Run the extraction script
4. Save the downloaded JSON

### Product 2: Balkonturen Kunststoff

1. Go to: Balkonturen configurator (any manufacturer)
2. Run the extraction script
3. Save the downloaded JSON

### Product 3: Fenster Holz

1. Go to: Holz Fenster configurator (any manufacturer)
2. Run the extraction script
3. Save the downloaded JSON

---

## What the API Returns

Expected response structure:

```json
{
    "grundpreis": 150.00,
    "aufpreis_profil": 0.00,
    "aufpreis_farbe_aussen": 43.68,
    "aufpreis_farbe_innen": 0.00,
    "aufpreis_verglasung": 39.81,
    "aufpreis_griff": 0.00,
    "preisempfehlung": 233.49,
    "ersparnis": 93.40,
    "angebotspreis": 140.09
}
```

---

## Verification Questions

After extracting data from all 3 products, verify:

1. Does API response structure match across products?
2. Is discount formula always x0.60 (40% off)?
3. Are surcharge categories the same?
4. Do prices increase linearly with dimensions?

If YES to all: ONE pricing engine works for all products!

---

## Notes

- API requires valid session (must be on the configurator page)
- iFrame must be loaded before running script
- Rate limit: ~100ms delay between calls recommended
- Full matrix extraction takes ~2-3 minutes
