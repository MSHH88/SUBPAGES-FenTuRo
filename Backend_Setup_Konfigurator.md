# Backend Setup Konfigurator - Blueprint for Custom Backend ("The Engine")

## Document Version: 1.0 (Phase 1 Complete)
**Date:** 2026-03-02
**Status:** Phase 1 - Initial Analysis Complete

---

## Table of Contents
1. [Project Vision: Three-Tier Architecture](#1-project-vision-three-tier-architecture)
2. [Frontend-Backend Connection Analysis](#2-frontend-backend-connection-analysis)
3. [Discovered Endpoints](#3-discovered-endpoints)
4. [Communication Protocol](#4-communication-protocol)
5. [Pricing Components Identified](#5-pricing-components-identified)
6. [Price Calculation Logic](#6-price-calculation-logic)
7. [UI Mapping](#7-ui-mapping)
8. [Next Steps Required](#8-next-steps-required)

---

## 1. Project Vision: Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         THREE-TIER ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   THE FRONTEND  │     │   THE ENGINE    │     │   THE OFFICE    │       │
│  │   (The UI)      │ ←→  │ (Custom Backend)│ ←→  │  (Custom CRM)   │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│                                                                              │
│  • Configurator UI       • Node.js/Python        • Order Processing        │
│  • User interactions     • Price calculations    • Customer Data           │
│  • Visual display        • Business logic        • Invoicing               │
│  • PostMessage API       • mm-precise math       • Administration          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend-Backend Connection Analysis

### Architecture Overview

The fenstermaxx24.com configurator uses a **two-layer frontend architecture**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WordPress/WooCommerce Host                       │
│    (fenstermaxx24.com/konfigurator/konfigurator-fenster/)           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    PARENT PAGE                                 │  │
│  │  • Price display box (#price-box)                             │  │
│  │  • Cart integration (WooCommerce)                             │  │
│  │  • Session management                                          │  │
│  │  • PostMessage listener                                        │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │              CONFIGURATOR IFRAME                        │  │  │
│  │  │              (id="configurator-iframe")                 │  │  │
│  │  │                                                         │  │  │
│  │  │  • Visual configurator UI                               │  │  │
│  │  │  • All configuration options                            │  │  │
│  │  │  • Internal price calculation                           │  │  │
│  │  │  • PostMessage sender                                   │  │  │
│  │  │                                                         │  │  │
│  │  │  Sends: PRODUCT_CREATED with productId                  │  │  │
│  │  │                                                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Finding: Iframe-Based Architecture

The configurator is embedded as an **iframe** inside the WordPress page:

```html
<iframe loading="lazy" 
        id="configurator-iframe" 
        src="./Kunststofffenster.Konfigurator.Drutex_files/saved_resource.html" 
        width="100%" 
        height="600px" 
        style="border: 0px; width: 100%; height: 1785px;" 
        frameborder="0">
</iframe>
```

**Implication for Custom Backend:**
- The configurator logic lives INSIDE the iframe
- The iframe source needs to be captured from the live site
- The parent page communicates with iframe via `postMessage`

---

## 3. Discovered Endpoints

### WordPress/WooCommerce AJAX Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wp-admin/admin-ajax.php?action=get_product_by_id&product_id={id}` | GET | Fetch product details after configuration |
| `/wp-admin/admin-ajax.php?action=get_last_added_product` | GET | Fallback: Get most recently added product |
| `/wp-admin/admin-ajax.php?action=rest-nonce` | GET | Get security nonce for API calls |
| `/wp-admin/admin-ajax.php` | POST | General WooCommerce AJAX handler |

### Data Flow

```
User Configures Window in Iframe
            │
            ▼
Iframe sends postMessage: { type: 'PRODUCT_CREATED', productId: 12345 }
            │
            ▼
Parent page receives message
            │
            ▼
Parent fetches: GET admin-ajax.php?action=get_product_by_id&product_id=12345
            │
            ▼
Response: { success: true, data: { name, price, options... } }
            │
            ▼
Update cart modal with product details
```

---

## 4. Communication Protocol

### PostMessage Events

#### PRODUCT_CREATED Event
When a user finalizes a configuration and adds it to cart:

```javascript
// Sent FROM iframe TO parent
window.parent.postMessage({
    type: 'PRODUCT_CREATED',
    productId: 12345
}, '*');
```

#### getPriceInfo Request
The parent page periodically requests price info from the iframe:

```javascript
// Sent FROM parent TO iframe
iframe.contentWindow.postMessage({action: 'getPriceInfo'}, '*');
```

### Event Listeners in Parent Page

```javascript
window.addEventListener('message', function(event) {
    if (!event.data || typeof event.data !== 'object') return;
    
    if (event.data.type === 'PRODUCT_CREATED') {
        lastProductId = parseInt(event.data.productId, 10);
        // Store in sessionStorage for persistence
        sessionStorage.setItem('last_created_product_id', String(lastProductId));
        sessionStorage.setItem('last_created_product_timestamp', String(Date.now()));
        
        // Fetch product data via AJAX
        fetch('admin-ajax.php?action=get_product_by_id&product_id=' + lastProductId)
            .then(response => response.json())
            .then(data => {
                // Process product data
            });
    }
}, false);
```

---

## 5. Pricing Components Identified

### Price Display Structure

The price display uses two values:

| Element ID | Description | Example |
|------------|-------------|---------|
| `#p-old` | Original price (before discount) | `1.199,90 €` |
| `#p-new` | Discounted price (Angebotspreis) | `719,94 €` |

### Price Extraction Patterns (from parent page JavaScript)

```javascript
// Pattern 1: UVP Price
/UVP[:\s]*(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:EUR|€)/i

// Pattern 2: Angebotspreis
/Angebotspreis[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:EUR|€)/i
```

### Discount Logic Discovered

**Special 40% Discount Rule** for specific product types:

```javascript
// For: alu-haustuer, aufsatzrollladen, vorsatzrollladen
if (newPrice && !oldPrice) {
    // Calculate old price from new price (40% discount = 60% of original)
    var newPriceNum = parseFloat(newPrice.replace(/\./g, '').replace(',', '.'));
    var oldPriceNum = newPriceNum / 0.6;  // Reverse calculate original
}
```

**Formula:**
```
New Price = Original Price × 0.6  (40% discount)
Original Price = New Price / 0.6
```

### Price Components to Track for CRM

| Component | German Name | Description |
|-----------|-------------|-------------|
| Base Price | Grundpreis | Raw calculation before discounts |
| Discount | Rabatt | Percentage or fixed amount off |
| 40% Aktion | 40% Aktion | Special promotional discount |
| Color Surcharge | Farbauswahl Aufpreis | Extra cost for colors |
| Glass Surcharge | Glasauswahl Aufpreis | Extra cost for glass types |
| Extras | Zusätze | Add-ons like V-Perfect (0,66 EUR) |
| Vorkasse Rabatt | Vorkasse-Rabatt | Prepayment discount |

---

## 6. Price Calculation Logic

### Known Formulas

#### 1. Standard Discount Formula
```
Final Price = Base Price × (1 - Discount Rate)
```

#### 2. 40% Promotional Discount
```
Promotional Price = Original Price × 0.60
```

#### 3. Reverse Calculation (for display)
```
Display Original = Final Price / 0.60
```

### CSS Classes for Price Styling

```css
/* Rabatt amounts - displayed in red */
.rabatt-amount,
.rabatt-amount .woocommerce-Price-amount {
    color: red;
}

/* Vorkasse (prepayment) discount - red */
.wc-block-components-totals-fees__vorkasse-2-rabatt {
    color: red;
}

/* Total amount styling */
.gesamt-amount .woocommerce-Price-amount {
    /* Final total styling */
}
```

### Price Format

German locale formatting:
- Thousands separator: `.` (period)
- Decimal separator: `,` (comma)
- Currency: `EUR` or `€`
- Example: `1.199,90 €`

---

## 7. UI Mapping

### Summary Box Structure

The "MEIN DRUTEX KUNSTSTOFF FENSTER" summary box displays:

1. **Product Name** (from iframe title or product data)
2. **Configuration Choices** (dimensions, materials, colors)
3. **Old Price** (struck through)
4. **New Price** (highlighted)
5. **Add to Cart Button**

### Price Box Elements

```html
<div id="price-box">
    <span id="p-old">1.199,90 €</span>  <!-- Original/UVP price -->
    <br id="p-old-br">
    <span id="p-new">719,94 €</span>    <!-- Discount price -->
</div>
```

### Update Mechanism

The parent page polls/updates prices every second:

```javascript
setInterval(updateBox, 1000);  // Check every second
setInterval(requestIframeData, 3000);  // Request from iframe every 3 seconds
```

---

## 8. Next Steps Required

### Phase 2: Deep Iframe Analysis (REQUIRES LIVE SITE ACCESS)

To complete the backend blueprint, we need to:

1. **Capture Iframe Network Traffic**
   - [ ] Intercept all API calls made FROM the iframe
   - [ ] Document the configurator's internal API endpoints
   - [ ] Record the full request/response cycle for dimension changes

2. **Parameter Mapping**
   - [ ] Map all configuration parameters:
     - Width (Breite)
     - Height (Höhe)
     - Profile type
     - Opening mechanism
     - Glass type
     - Color selection
     - Hardware selection
     - Extras/add-ons

3. **Price Formula Extraction**
   - [ ] Capture base price per profile
   - [ ] Document size multipliers (price per mm²)
   - [ ] Map all surcharge triggers

### Phase 3: Backend Implementation

Once all data is gathered:

1. **Create Node.js/Python Backend**
   - Replicate pricing logic exactly
   - Handle all configuration options
   - Return identical price calculations

2. **API Design**
   - RESTful endpoints for frontend
   - WebSocket for real-time updates
   - CRM integration endpoints

3. **Database Schema**
   - Products table
   - Pricing rules table
   - Discounts table
   - Orders table

---

## Access Requirements for Complete Analysis

⚠️ **IMPORTANT:** The current analysis is based on the static HTML snapshot. To complete Phase 2, we need:

1. **Live Website Access**
   - Access to https://www.fenstermaxx24.com/konfigurator/konfigurator-fenster/
   - Browser DevTools to intercept Network traffic
   - Ability to change configurations and record API calls

2. **Iframe Content**
   - The iframe's source code
   - The iframe's internal JavaScript logic
   - The iframe's API endpoints

3. **Backend Access** (if available)
   - Database structure
   - Pricing table data
   - Product catalog data

---

## Summary: What We Know

| Category | Status | Details |
|----------|--------|---------|
| Architecture | ✅ Complete | Iframe-based with PostMessage communication |
| Parent Page Endpoints | ✅ Complete | 4 endpoints identified |
| Communication Protocol | ✅ Complete | PRODUCT_CREATED event documented |
| Price Display Logic | ✅ Complete | #p-old, #p-new elements |
| 40% Discount Formula | ✅ Complete | price × 0.6 |
| Iframe Internal API | ⏳ Pending | Requires live site network capture |
| Full Parameter List | ⏳ Pending | Requires live configuration testing |
| Base Price Tables | ⏳ Pending | Requires backend/database access |

---

## 9. Detailed Code Analysis (From Reference HTML)

### 9.1 PostMessage Event Handler (Lines 6342-6420)

The parent page listens for messages from the configurator iframe:

```javascript
window.addEventListener('message', function(event) {
    // Main event type: 'setFixedInfo'
    if (event.data && event.data.data === 'setFixedInfo' && event.data.value) {
        var html = event.data.value;
        
        // Extract old price from strikethrough HTML
        var oldMatch = html.match(/<span[^>]*style="text-decoration:line-through"[^>]*>([^<]+)<\/span>/i);
        
        // Extract new price from strong tag with txt-red class
        var newMatch = html.match(/<strong[^>]*(?:class="txt-red")?[^>]*>([^<]+)<\/strong>/i);
    }
});
```

**Key Insight:** The iframe sends formatted HTML containing prices, which the parent page parses.

### 9.2 Iframe Element (Line 4226)

```html
<iframe loading="lazy" 
        id="configurator-iframe" 
        src="[CONFIGURATOR_URL]" 
        width="100%" 
        height="600px" 
        style="border: 0px; width: 100%; height: 1785px;" 
        frameborder="0">
</iframe>
```

### 9.3 Price Extraction Methods (Multiple Fallbacks)

The parent page uses **5 different methods** to extract prices:

| Method | Priority | Source | Selector |
|--------|----------|--------|----------|
| 1 | Highest | PostMessage | `setFixedInfo` event |
| 2 | High | DOM ID | `#topStrokePrice` |
| 3 | Medium | Sidebar | `#sidebar_basket h2` |
| 4 | Low | CSS Class | `.product-summary` text |
| 5 | Fallback | Full Page | Body text search |

### 9.4 Price Display Elements

```javascript
var oldElem = document.getElementById('p-old');  // Strikethrough (original) price
var newElem = document.getElementById('p-new');  // Red (discounted) price
var nameElem = document.getElementById('p-name'); // Product name
```

### 9.5 40% Discount Formula (Confirmed in Code)

Found at lines 6373, 6465, 6565:

```javascript
// Calculate old price from new price (when only new price available)
var oldPriceNum = priceNum / 0.6;

// Reverse formula: oldPrice = newPrice / 0.6
// Which means: newPrice = oldPrice × 0.6
// Discount: 40% off original price
```

### 9.6 Price Formatting (German Locale)

```javascript
// Parse German price format: "1.234,56 €"
var priceNum = parseFloat(newText
    .replace(/[^\d,]/g, '')   // Remove non-digits except comma
    .replace(/\./g, '')        // Remove thousand separators
    .replace(',', '.')         // Convert decimal comma to point
);

// Format back to German: 
var formatted = priceNum.toFixed(2).replace('.', ',');  // Decimal
parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Thousands
```

### 9.7 Product URL Patterns (Configurator Variations)

Found in HTML - different products use different pricing rules:

| URL Pattern | Special Handling |
|-------------|------------------|
| `/alu-haustuer/` | Calculate old from new (40%) |
| `/aufsatzrollladen/` | Calculate old from new (40%) |
| `/vorsatzrollladen/` | Calculate old from new (40%) |
| Other configurators | Both prices sent via PostMessage |

### 9.8 Text Extraction Patterns

**Price Patterns:**
```javascript
// Find Preisempfehlung (recommended price)
/Preisempfehlung[:\s]*(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:EUR|€)/i

// Find Angebotspreis (offer price)
/Angebotspreis[^:]*[:\s]*(\d{1,3}(?:\.\d{3})*,\d{2})\s*(?:EUR|€)/i

// Generic price extraction
/(\d{1,3}(?:\.\d{3})*,\d{2})/
```

### 9.9 Iframe Communication Request

```javascript
// Parent page requests price info from iframe
function requestIframeData() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
        try {
            iframes[i].contentWindow.postMessage({action: 'getPriceInfo'}, '*');
        } catch(e) {}
    }
}

// Called on intervals
setInterval(requestIframeData, 3000);
```

---

## 10. Data Collection Instructions for Live Site

### What You Need to Capture

Using Chrome DevTools on the live website:

#### Step 1: Open Network Tab
1. Go to https://www.fenstermaxx24.com/konfigurator/konfigurator-fenster/
2. Open DevTools (F12) → Network tab
3. Check "Preserve log" checkbox
4. Filter by "XHR" or "Fetch"

#### Step 2: Capture Iframe Traffic
1. Look for requests from the iframe domain (likely `conf.fenstermaxx24.com` or similar)
2. Record:
   - Request URL
   - Request Method (GET/POST)
   - Request Headers
   - Request Payload (JSON body)
   - Response Data

#### Step 3: Test Configuration Changes
Change these parameters and record the API calls:

| Parameter | Test Values |
|-----------|-------------|
| Width (Breite) | 500mm, 800mm, 1200mm |
| Height (Höhe) | 600mm, 1000mm, 1400mm |
| Profile | Different profile selections |
| Glass (Glas) | Standard, 3-fach, Sonnenschutz |
| Color (Farbe) | White, different RAL colors |
| Handle (Griff) | Different handle options |
| Hardware (Beschlag) | Standard, enhanced security |

#### Step 4: Document JSON Structure
For each API call, document:

```json
{
  "endpoint": "/api/price-calculation",
  "method": "POST",
  "payload": {
    "product_type": "fenster",
    "width_mm": 800,
    "height_mm": 1000,
    "profile_id": "drutex-iglo5",
    "glass_type": "2-fach",
    "color_inside": "white",
    "color_outside": "white"
  },
  "response": {
    "base_price": 350.00,
    "surcharges": [...],
    "discount_percent": 40,
    "final_price": 210.00
  }
}
```

---

## 11. Backend Requirements (Based on Analysis)

### 11.1 Required Endpoints for Custom Backend

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | List available window types |
| `/api/products/{id}/profiles` | GET | Get profiles for product |
| `/api/price/calculate` | POST | Calculate price for configuration |
| `/api/options/glass` | GET | List glass options |
| `/api/options/colors` | GET | List color options |
| `/api/options/hardware` | GET | List hardware options |
| `/api/cart/add` | POST | Add configured product to cart |

### 11.2 Price Calculation Endpoint Request

```typescript
interface PriceCalculationRequest {
  product_type: string;       // "fenster", "balkontuer", etc.
  profile_id: string;         // "drutex-iglo5"
  width_mm: number;           // 500-2500
  height_mm: number;          // 500-2500
  glass_type: string;         // "2-fach-standard"
  color_inside: string;       // "white" or RAL code
  color_outside: string;      // "white" or RAL code
  handle_type: string;        // Handle selection
  hardware_level: string;     // "standard", "rc2", etc.
  additional_options: string[]; // ["thin_weld", "insect_screen"]
}
```

### 11.3 Price Calculation Response

```typescript
interface PriceCalculationResponse {
  base_price: number;         // Grundpreis
  base_price_formatted: string; // "1.199,00 €"
  
  surcharges: Surcharge[];    // Additional costs
  
  subtotal: number;           // Before discount
  discount_percent: number;   // 40 (for 40% Aktion)
  discount_amount: number;    // Amount saved
  
  final_price: number;        // Angebotspreis
  final_price_formatted: string; // "719,40 €"
  
  product_name: string;       // "Drutex IGLO 5 Kunststofffenster"
  configuration_summary: string; // Human-readable config
}

interface Surcharge {
  name: string;              // "Dünne Schweißnaht V-Perfect"
  amount: number;            // 0.66
  type: "fixed" | "percent";
}
```

### 11.4 PostMessage Output Format

For compatibility with existing frontend, backend should generate:

```javascript
// Send to parent window
window.parent.postMessage({
    data: 'setFixedInfo',
    value: `${productName}<br>
            <span style="text-decoration:line-through">${oldPrice} EUR</span><br>
            <strong class="txt-red">${newPrice} EUR</strong>`
}, '*');
```

---

## Summary: What We Know (Updated)

| Category | Status | Details |
|----------|--------|---------|
| Architecture | ✅ Complete | Iframe-based with PostMessage communication |
| Parent Page Endpoints | ✅ Complete | 4 endpoints identified |
| Communication Protocol | ✅ Complete | PRODUCT_CREATED & setFixedInfo events |
| Price Display Logic | ✅ Complete | #p-old, #p-new, #p-name elements |
| 40% Discount Formula | ✅ Complete | newPrice = oldPrice × 0.6 |
| Price Parsing | ✅ Complete | German locale (1.234,56 €) |
| PostMessage Format | ✅ Complete | HTML with strikethrough + strong tags |
| Fallback Methods | ✅ Complete | 5 price extraction methods documented |
| Special URL Handling | ✅ Complete | alu-haustuer, rollladen variants |
| Iframe Internal API | ⏳ Pending | Requires live site network capture |
| Full Parameter List | ⏳ Pending | Requires live configuration testing |
| Base Price Tables | ⏳ Pending | Requires backend/database access |

---

*Document updated: 2026-03-02 (Phase 1 Extended Analysis from Reference HTML)*
