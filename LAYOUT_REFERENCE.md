# LAYOUT REFERENCE
## Base Configurator Layout from Drutex Template

---

## 📍 Reference File

**Source:** `Backend/Kunststofffenster.Konfigurator.Drutex.html`
**Original:** Based on fenstermaxx24.com configurator design

---

## 🏗️ LAYOUT STRUCTURE

### Overall Page Structure
```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
│  ┌─────────┬──────────────────────────┬─────────────────┐   │
│  │  LOGO   │     NAVIGATION MENU      │  ICONS/CART     │   │
│  └─────────┴──────────────────────────┴─────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    CONFIGURATOR BODY                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              STEP INDICATOR (Progress)               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┬──────────────────────────────┐   │
│  │                      │                              │   │
│  │   OPTIONS PANEL      │    PRODUCT IMAGE /           │   │
│  │   (Selection Area)   │    CONFIGURATION SUMMARY     │   │
│  │                      │                              │   │
│  │   □ Option 1         │    ┌──────────────────────┐  │   │
│  │   □ Option 2         │    │                      │  │   │
│  │   □ Option 3         │    │   [PRODUCT IMAGE]    │  │   │
│  │                      │    │                      │  │   │
│  │                      │    └──────────────────────┘  │   │
│  │                      │                              │   │
│  │                      │    SELECTED OPTIONS:         │   │
│  │                      │    • Size: 100x120 cm        │   │
│  │                      │    • Color: White            │   │
│  │                      │    • Glass: 3-fach           │   │
│  │                      │                              │   │
│  │                      │    PRICE: €XXX.XX            │   │
│  │                      │                              │   │
│  └──────────────────────┴──────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [← ZURÜCK]                           [WEITER →]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                         FOOTER                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 COMPONENT BLOCKS

### Block 1: Header ✅ (Existing)
```html
<!-- Already have: -->
- Logo
- Navigation menu
- Search icon
- User account icon
- Cart icon with counter
- Hamburger menu (mobile)
```

### Block 2: Step Indicator
```
Current Step Visual:
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│   1    │━━━━│   2    │━━━━│   3    │- - -│   4    │- - -│   5    │
│ Profil │    │ Maße   │    │ Farbe  │    │ Glas   │    │ Extras │
│   ✓    │    │ Active │    │        │    │        │    │        │
└────────┘    └────────┘    └────────┘    └────────┘    └────────┘
  Done         Current       Upcoming      Upcoming      Upcoming
```

### Block 3: Options Panel (Left Side)
```html
<!-- Selection area with options -->
<div class="options-panel">
    <h3>Select Profile</h3>
    
    <div class="option-card selected">
        <img src="profile1.jpg" alt="Ideal 4000">
        <span>Ideal 4000</span>
        <span class="price">+€0</span>
    </div>
    
    <div class="option-card">
        <img src="profile2.jpg" alt="Ideal 5000">
        <span>Ideal 5000</span>
        <span class="price">+€15</span>
    </div>
    
    <!-- More options... -->
</div>
```

### Block 4: Product Image / Summary (Right Side)
```html
<!-- Configuration summary that updates live -->
<div class="summary-panel">
    <!-- Product visualization -->
    <div class="product-image">
        <img src="window-preview.jpg" alt="Your Window">
    </div>
    
    <!-- Selected options summary -->
    <div class="selected-options">
        <h4>Ihre Auswahl:</h4>
        <ul>
            <li>Profil: <span>Ideal 4000</span></li>
            <li>Maße: <span>100 x 120 cm</span></li>
            <li>Farbe: <span>Weiß</span></li>
            <li>Verglasung: <span>3-fach</span></li>
        </ul>
    </div>
    
    <!-- Live price -->
    <div class="price-display">
        <span class="label">Preis:</span>
        <span class="amount">€349,99</span>
        <span class="vat">inkl. 19% MwSt.</span>
    </div>
</div>
```

### Block 5: Navigation Buttons
```html
<div class="step-navigation">
    <button class="btn-back" onclick="prevStep()">
        ← Zurück
    </button>
    <button class="btn-next" onclick="nextStep()">
        Weiter →
    </button>
</div>
```

### Block 6: Footer ✅ (Existing)
```html
<!-- Already have: -->
- Contact information
- Links
- Social media
- Copyright
```

---

## 🎨 DESIGN ELEMENTS (Existing)

### Colors
```css
/* From existing design */
--primary-color: #1a73e8;     /* Blue accent */
--secondary-color: #333;       /* Dark text */
--background: #f5f5f5;         /* Light gray */
--white: #ffffff;
--accent: #ff6600;             /* Orange for CTA */
```

### Fonts
```css
/* From existing design */
font-family: 'Open Sans', sans-serif;
/* Or whatever is used in current header */
```

### Buttons
```css
/* Primary button */
.btn-primary {
    background: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
}

/* Option card */
.option-card {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
}

.option-card.selected {
    border-color: var(--primary-color);
    background: rgba(26, 115, 232, 0.1);
}
```

---

## 📱 RESPONSIVE BEHAVIOR

### Desktop (>1024px)
```
┌──────────────────────┬────────────────────────┐
│    OPTIONS (60%)     │    SUMMARY (40%)       │
└──────────────────────┴────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────────────────┬────────────────────────┐
│    OPTIONS (50%)     │    SUMMARY (50%)       │
└──────────────────────┴────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────────────────────────────────┐
│                   OPTIONS                      │
├────────────────────────────────────────────────┤
│                   SUMMARY                      │
│              (Collapsible/Modal)               │
└────────────────────────────────────────────────┘
```

---

## 🛒 CART/SUMMARY PANEL

### Floating Summary (Mobile)
```
┌─────────────────────────────────────────────────────────┐
│ ≡ Ihre Auswahl (3)                           €349,99 ▼ │
└─────────────────────────────────────────────────────────┘
```

### Expanded Summary
```
┌─────────────────────────────────────────────────────────┐
│ Ihre Auswahl                                       ▲    │
├─────────────────────────────────────────────────────────┤
│ • Profil: Ideal 4000                               €0   │
│ • Maße: 100 x 120 cm                        (included)  │
│ • Farbe: Weiß RAL 9016                             €0   │
│ • Verglasung: 3-fach                              €45   │
│ • Griff: Standard                                  €0   │
├─────────────────────────────────────────────────────────┤
│ Basispreis:                                   €299,00   │
│ Aufpreise:                                     €45,00   │
│ ──────────────────────────────────────────────────────  │
│ Gesamtpreis:                                  €349,99   │
│ (inkl. 19% MwSt.)                                       │
├─────────────────────────────────────────────────────────┤
│         [🛒 In den Warenkorb]                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📷 IMAGE SOURCES

### For Development/Design
1. **Placeholder images:** https://placeholder.com
2. **Product images:** From existing catalog
3. **Icons:** Already have in existing header

### For Production
- Real product images from manufacturer catalog
- Optimized/compressed for web
- WebP format with fallbacks

---

## ✅ WHAT WE HAVE

| Component | Status | Location |
|-----------|--------|----------|
| Header | ✅ Complete | Existing templates |
| Logo | ✅ Complete | Existing |
| Navigation | ✅ Complete | Existing |
| Icons | ✅ Complete | Existing |
| Footer | ✅ Complete | Existing |
| Colors | ✅ Defined | CSS variables |
| Fonts | ✅ Defined | Existing |

---

## 🔨 WHAT TO BUILD

| Component | Priority | Phase |
|-----------|----------|-------|
| Step Indicator | High | 3.5 Week 11 |
| Options Panel | High | 3.5 Week 12 |
| Summary Panel | High | 3.5 Week 12 |
| Price Display | High | 3.5 Week 12 |
| Navigation Buttons | Medium | 3.5 Week 12 |
| Cart Sidebar | Medium | 3.5 Week 13 |
| Quote Form | Medium | 3.5 Week 14 |
| Checkout Form | Medium | 3.5 Week 14 |

---

## 📋 IMPLEMENTATION NOTES

1. **Copy existing header/footer** - Don't rebuild
2. **Match existing styles** - Use same colors, fonts
3. **Build components separately** - Test each one
4. **Mobile first** - Design for mobile, then desktop
5. **Use placeholder data** - Real data comes from backend

---

## Summary

The base layout from `Kunststofffenster.Konfigurator.Drutex.html` provides:
- ✅ Full header with navigation
- ✅ Icon set for cart, user, search
- ✅ Footer structure
- ✅ Color scheme
- ✅ Font choices
- ✅ Section-based layout pattern

We need to build:
- Step indicator (progress bar)
- Options selection panel
- Configuration summary panel
- Price display
- Navigation buttons
- Quote form
- Checkout form
