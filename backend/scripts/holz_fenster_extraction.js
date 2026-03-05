/**
 * HOLZ FENSTER - Complete Price Extraction Script
 * 
 * REAL OPTIONS FROM ACTUAL CONFIGURATOR
 * 
 * USAGE:
 * 1. Navigate to Holz Fenster configurator page
 * 2. Open DevTools (F12) -> Console
 * 3. Paste this entire script
 * 4. Wait 2-5 minutes
 * 5. JSON file auto-downloads
 */

(async function extractHolzFensterPricing() {
    console.log('='.repeat(60));
    console.log('HOLZ FENSTER EXTRACTION - Starting...');
    console.log('='.repeat(60));
    
    const results = {
        metadata: {
            product: 'Holz Fenster',
            material: 'Holz',
            extractionDate: new Date().toISOString(),
            url: window.location.href
        },
        basePrices: [],
        surcharges: {},
        rawResponses: [],
        errors: []
    };

    // =============================================
    // REAL HOLZ OPTIONS FROM CONFIGURATOR
    // =============================================
    
    const HOLZ_OPTIONS = {
        // STEP 1: PROFIL
        profil: {
            // Will be detected from page
            ids: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']
        },
        rahmenart: ['standard', 'fluegel'],
        fensterarten: ['einflugelig', 'zweiflugelig', 'dreiflugelig'],
        fenstertyp: ['t1', 't2', 't3', 't4', 't5', 't6', 't7'],
        oeffnungsrichtung: ['links', 'rechts', 'kipp', 'dreh_kipp_links', 'dreh_kipp_rechts', 'fest', 'dreh_links'],
        
        // STEP 2: MASSE
        fensterbankanschluss: [true, false],
        widths: [500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000],
        heights: [500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000],
        
        // STEP 3: FARBE - HOLZ SPECIFIC
        silikonfarbe: [
            'transparent',
            'weiss',
            'golden_oak',
            'sepia_braun'
        ],
        farben_auswahl: [
            'ral_farben',
            'holz_farben'
        ],
        dekorfarbe_aussen: [
            'holz_unbehandelt',
            'holz_impraegniert',
            'holz_grundierung_transparent',
            'lack_transparent',
            'weiss_deckend',
            'eiche_hell_lasur_006',
            'eiche_dunkel_lasur_009',
            'nussbaum_lasur_010',
            'mahagoni_lasur_045',
            'palisander_lasur_048',
            'teak_lasur_085'
        ],
        dekorfarbe_innen: [
            'holz_unbehandelt',
            'holz_impraegniert',
            'holz_grundierung_transparent',
            'lack_transparent',
            'weiss_deckend',
            'eiche_hell_lasur_006',
            'eiche_dunkel_lasur_009',
            'nussbaum_lasur_010',
            'mahagoni_lasur_045',
            'palisander_lasur_048',
            'teak_lasur_085'
        ],
        
        // STEP 4: GLAS
        verglasung: ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
        schallschutz: [true, false],
        sicherheitsverglasung: [true, false],
        ornament_sonnenschutz: [true, false],
        druckausgleichsventil: [true, false],
        
        // STEP 5: SPROSSEN
        sprossen: [
            'nein',
            'sprossen_innenliegend',
            'sprossen_aufliegend'
        ],
        
        // STEP 6: ROLLLADEN
        rollladen: [true, false],
        rollladen_type: ['aufsatz', 'vorsatz'],
        rollladen_motor: [true, false],
        
        // STEP 7: SONSTIGES - HOLZ SPECIFIC
        fensterbankfraesung: [
            'standardfalz_beidseitig',
            'fraesung_aussen',
            'fraesung_innen',
            'ohne_fraesung'
        ],
        wetterschenkel: [
            'alu_weiss',
            'alu_silber',
            'alu_bronze_hell',
            'alu_bronze_dunkel',
            'holz_retro_fensterfarbe'
        ],
        rahmenverbreiterung: [true, false],
        rahmenverbreiterung_oben: [0, 20, 30, 40, 50],
        rahmenverbreiterung_unten: [0, 20, 30, 40, 50],
        rahmenverbreiterung_links: [0, 20, 30, 40, 50],
        rahmenverbreiterung_rechts: [0, 20, 30, 40, 50]
    };

    // Helper functions
    function findApiEndpoint() {
        const path = window.location.pathname;
        return path.replace(/\/$/, '') + '/ajax/berechnen/';
    }

    function getCurrentConfig() {
        // Try to find config object
        if (window.obj_konfig) return JSON.parse(JSON.stringify(window.obj_konfig));
        
        // Check iframe
        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow && iframe.contentWindow.obj_konfig) {
            return JSON.parse(JSON.stringify(iframe.contentWindow.obj_konfig));
        }
        
        // Minimal default
        return { breite: 1000, hoehe: 1000 };
    }

    async function callApi(config) {
        try {
            const response = await fetch(findApiEndpoint(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(config)
            });
            return await response.json();
        } catch (e) {
            results.errors.push({ config, error: e.message });
            return null;
        }
    }

    function getPrice(response) {
        if (!response) return null;
        return response.preis || response.angebotspreis || response.preisempfehlung || 
               response.price || response.total || null;
    }

    const delay = ms => new Promise(r => setTimeout(r, ms));

    // Get base configuration and price
    let baseConfig = getCurrentConfig();
    const baseResponse = await callApi(baseConfig);
    const basePrice = getPrice(baseResponse);
    
    console.log('Base Config:', baseConfig);
    console.log('Base Price:', basePrice);
    
    results.rawResponses.push({ type: 'base', response: baseResponse });

    // =============================================
    // EXTRACT DIMENSION MATRIX
    // =============================================
    console.log('\n--- Extracting Dimension Matrix ---');
    
    for (let w of HOLZ_OPTIONS.widths) {
        for (let h of HOLZ_OPTIONS.heights) {
            const config = { ...baseConfig, breite: w, hoehe: h };
            const response = await callApi(config);
            const price = getPrice(response);
            
            if (price !== null) {
                results.basePrices.push({ width: w, height: h, price });
                console.log(`${w}x${h}: ${price}`);
            }
            await delay(50);
        }
    }

    // =============================================
    // TEST EACH OPTION CATEGORY
    // =============================================
    
    async function testOptions(category, options, configKey) {
        console.log(`\n--- Testing ${category} ---`);
        results.surcharges[category] = {};
        
        for (let opt of options) {
            const config = { ...baseConfig, [configKey]: opt };
            const response = await callApi(config);
            const price = getPrice(response);
            
            if (price !== null) {
                const surcharge = price - basePrice;
                results.surcharges[category][opt] = {
                    price,
                    surcharge: Math.round(surcharge * 100) / 100
                };
                console.log(`  ${opt}: ${price} (${surcharge >= 0 ? '+' : ''}${surcharge.toFixed(2)})`);
            }
            await delay(50);
        }
    }

    // Test all categories
    await testOptions('profil', HOLZ_OPTIONS.profil.ids, 'profil');
    await testOptions('rahmenart', HOLZ_OPTIONS.rahmenart, 'rahmenart');
    await testOptions('fensterarten', HOLZ_OPTIONS.fensterarten, 'fensterart');
    await testOptions('fenstertyp', HOLZ_OPTIONS.fenstertyp, 'fenstertyp');
    await testOptions('oeffnungsrichtung', HOLZ_OPTIONS.oeffnungsrichtung, 'oeffnungsrichtung');
    
    // Colors - HOLZ SPECIFIC
    await testOptions('silikonfarbe', HOLZ_OPTIONS.silikonfarbe, 'silikonfarbe');
    await testOptions('dekorfarbe_aussen', HOLZ_OPTIONS.dekorfarbe_aussen, 'dekor_aussen');
    await testOptions('dekorfarbe_innen', HOLZ_OPTIONS.dekorfarbe_innen, 'dekor_innen');
    
    // Glass
    await testOptions('verglasung', HOLZ_OPTIONS.verglasung, 'verglasung');
    await testOptions('schallschutz', HOLZ_OPTIONS.schallschutz, 'schallschutz');
    await testOptions('sicherheitsverglasung', HOLZ_OPTIONS.sicherheitsverglasung, 'sicherheitsverglasung');
    
    // Sprossen
    await testOptions('sprossen', HOLZ_OPTIONS.sprossen, 'sprossen');
    
    // Rollladen
    await testOptions('rollladen', [true, false], 'rollladen');
    await testOptions('rollladen_motor', HOLZ_OPTIONS.rollladen_motor, 'rollladen_motor');
    
    // Sonstiges - HOLZ SPECIFIC
    await testOptions('fensterbankfraesung', HOLZ_OPTIONS.fensterbankfraesung, 'fensterbankfraesung');
    await testOptions('wetterschenkel', HOLZ_OPTIONS.wetterschenkel, 'wetterschenkel');
    await testOptions('rahmenverbreiterung', HOLZ_OPTIONS.rahmenverbreiterung, 'rahmenverbreiterung');

    // =============================================
    // SUMMARY AND DOWNLOAD
    // =============================================
    console.log('\n' + '='.repeat(60));
    console.log('EXTRACTION COMPLETE');
    console.log('='.repeat(60));
    
    results.summary = {
        basePricesExtracted: results.basePrices.length,
        categoriesTested: Object.keys(results.surcharges).length,
        errorsCount: results.errors.length,
        holzSpecificOptions: ['silikonfarbe', 'fensterbankfraesung', 'wetterschenkel', 'lasur_farben']
    };
    
    console.log('Summary:', results.summary);
    
    // Download JSON
    const filename = `holz_fenster_${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`\nSaved to: ${filename}`);
    
    // Compare with Kunststoff
    console.log('\n--- HOLZ vs KUNSTSTOFF Differences ---');
    console.log('HOLZ has: Lasur colors, Wetterschenkel, Fensterbankfraesung');
    console.log('HOLZ missing: V-Perfect (Kunststoff only), Foil colors');
    
    return results;
})();
