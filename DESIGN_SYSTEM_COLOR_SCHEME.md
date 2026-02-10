# 🎨 Design System - Color Scheme & Typography

**Document Version:** 1.0  
**Last Updated:** February 10, 2026  
**Status:** Production Ready for Subpage Implementation

---

## 📋 PURPOSE

This document defines the complete color scheme and typography system for the frontend glass configurator project. Use this as the definitive reference when implementing subpages to ensure consistency across the entire website.

---

## 🔤 TYPOGRAPHY

### **Primary Font Family**

**Font:** Berlin Sans FB Demi Bold

**Usage:**
- Headers
- Navigation
- Body text
- Buttons
- All UI elements

**Implementation:**
```css
body, h1, h2, h3, h4, h5, h6, p, a, button, input {
    font-family: 'Berlin Sans FB Demi', 'Berlin Sans FB', 'Arial Black', sans-serif;
    font-weight: 600; /* Demi Bold */
}
```

**Font Stack:**
1. Berlin Sans FB Demi (primary)
2. Berlin Sans FB (fallback)
3. Arial Black (fallback)
4. sans-serif (system fallback)

---

## 🎨 COLOR PALETTE

### **Primary Colors**

#### **1. Purple (Primary Brand Color)**
- **Hex:** `#E6690CC`
- **RGB:** rgb(230, 105, 12)
- **Usage:** Primary buttons, links, accents, brand elements
- **Notes:** Main brand color - use for call-to-action elements

#### **2. Navy Blue (Secondary Brand Color)**
- **Hex:** `#000C49`
- **RGB:** rgb(0, 12, 73)
- **Usage:** Headers, navigation, text overlays, dark backgrounds
- **Notes:** Professional, trustworthy feeling

---

### **Neutral Colors**

#### **3. Grey (Body & Borders)**
- **Hex:** To be specified based on context
- **Common Options:**
  - Light Grey: `#F5F5F5` (backgrounds)
  - Medium Grey: `#CCCCCC` (borders)
  - Dark Grey: `#666666` (secondary text)
  - Charcoal: `#333333` (body text)
- **Usage:** Body text, borders, backgrounds, subtle elements
- **Notes:** Use consistently across all pages

#### **4. Black (Primary Text)**
- **Hex:** To be specified based on context
- **Common Options:**
  - Pure Black: `#000000` (headers, emphasis)
  - Off-Black: `#1A1A1A` (body text, softer)
  - Rich Black: `#0A0A0A` (maximum contrast)
- **Usage:** Primary text, headers, high-contrast elements
- **Notes:** Ensures readability

---

### **Accent Colors**

#### **5. Hermes Orange**
- **Hex:** To be specified (typical Hermes Orange: `#FF7F00` or similar)
- **RGB:** Approximately rgb(255, 127, 0)
- **Usage:** Highlights, special offers, attention-grabbing elements
- **Notes:** Use sparingly for maximum impact

#### **6. Sage Green**
- **Hex:** To be specified (typical Sage Green: `#8FB99B` or similar)
- **RGB:** Approximately rgb(143, 185, 155)
- **Usage:** Success states, eco-friendly messaging, calm sections
- **Notes:** Provides natural, calming accent

---

## 🎯 COLOR USAGE GUIDELINES

### **Primary Actions**
```css
.button-primary {
    background-color: #E6690CC; /* Purple */
    color: #FFFFFF;
}

.button-primary:hover {
    background-color: #D05808; /* Darker purple */
}
```

### **Secondary Actions**
```css
.button-secondary {
    background-color: #000C49; /* Navy */
    color: #FFFFFF;
}

.button-secondary:hover {
    background-color: #001A73; /* Lighter navy */
}
```

### **Headers**
```css
h1, h2, h3 {
    color: #000C49; /* Navy */
    font-family: 'Berlin Sans FB Demi', sans-serif;
}
```

### **Body Text**
```css
body, p {
    color: #1A1A1A; /* Off-black */
    font-family: 'Berlin Sans FB Demi', sans-serif;
}
```

### **Links**
```css
a {
    color: #E6690CC; /* Purple */
    text-decoration: none;
}

a:hover {
    color: #000C49; /* Navy */
    text-decoration: underline;
}
```

---

## 📊 COLOR CONTRAST RATIOS

**For Accessibility (WCAG 2.1 AA):**

### **Text Contrast**
- Large text (18pt+): 3:1 minimum
- Normal text: 4.5:1 minimum

### **Recommended Combinations**

**High Contrast (Excellent):**
- Purple `#E6690CC` on White `#FFFFFF` ✅
- Navy `#000C49` on White `#FFFFFF` ✅
- Black `#000000` on White `#FFFFFF` ✅
- White `#FFFFFF` on Navy `#000C49` ✅

**Medium Contrast (Good):**
- Dark Grey `#666666` on White `#FFFFFF` ✅
- Sage Green `#8FB99B` on Navy `#000C49` ✅

**Avoid:**
- Light colors on light backgrounds ❌
- Hermes Orange on White (may need testing) ⚠️

---

## 🎨 GLASS MORPHISM EFFECTS

### **Header Glass Effect**
```css
.site-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
}
```

### **Card Glass Effect**
```css
.glass-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

## 🔄 GRADIENT USAGE

### **Primary Gradient (Purple to Navy)**
```css
.gradient-primary {
    background: linear-gradient(135deg, #E6690CC 0%, #000C49 100%);
}
```

### **Accent Gradient (Orange to Sage)**
```css
.gradient-accent {
    background: linear-gradient(135deg, #FF7F00 0%, #8FB99B 100%);
}
```

---

## 🎯 SUBPAGE IMPLEMENTATION CHECKLIST

### **Before Starting Any Subpage:**

- [ ] Font loaded: Berlin Sans FB Demi Bold
- [ ] Primary colors defined: Purple `#E6690CC`, Navy `#000C49`
- [ ] Neutral colors selected and documented
- [ ] Accent colors (Hermes Orange, Sage Green) values confirmed
- [ ] Black color value chosen and applied
- [ ] All color variables defined in CSS
- [ ] Contrast ratios tested for accessibility
- [ ] Glass morphism effects applied where appropriate

### **During Implementation:**

- [ ] Use color variables, not hardcoded hex values
- [ ] Maintain consistent button styles
- [ ] Apply proper text colors for readability
- [ ] Test hover states on all interactive elements
- [ ] Ensure brand colors are prominent
- [ ] Use accent colors sparingly for emphasis

### **After Implementation:**

- [ ] Visual consistency check across pages
- [ ] Accessibility contrast test (use online tools)
- [ ] Cross-browser color rendering test
- [ ] Mobile color display verification
- [ ] Print/grayscale test (if applicable)

---

## 📝 CSS VARIABLES TEMPLATE

```css
:root {
    /* Primary Colors */
    --color-primary: #E6690CC;
    --color-secondary: #000C49;
    
    /* Neutral Colors */
    --color-light-grey: #F5F5F5;
    --color-medium-grey: #CCCCCC;
    --color-dark-grey: #666666;
    --color-charcoal: #333333;
    
    /* Text Colors */
    --color-text-primary: #1A1A1A;
    --color-text-secondary: #666666;
    --color-text-inverse: #FFFFFF;
    
    /* Accent Colors */
    --color-orange: #FF7F00; /* Hermes Orange - to be confirmed */
    --color-sage: #8FB99B; /* Sage Green - to be confirmed */
    
    /* Black Variants */
    --color-black: #000000;
    --color-off-black: #1A1A1A;
    --color-rich-black: #0A0A0A;
    
    /* Typography */
    --font-primary: 'Berlin Sans FB Demi', 'Berlin Sans FB', 'Arial Black', sans-serif;
    --font-weight-demi: 600;
    
    /* Glass Morphism */
    --glass-white: rgba(255, 255, 255, 0.95);
    --glass-blur: blur(15px);
}
```

---

## 🚀 QUICK START FOR SUBPAGES

1. **Copy CSS Variables** from template above
2. **Apply Berlin Sans FB Demi Bold** to all text
3. **Use Primary Purple** `#E6690CC` for CTAs
4. **Use Navy Blue** `#000C49` for headers
5. **Choose Grey** from neutral palette for body text
6. **Add Hermes Orange** for special highlights
7. **Add Sage Green** for success/calm states
8. **Test Contrast** for accessibility
9. **Apply Glass Effects** where appropriate
10. **Verify Consistency** with homepage-v1.html

---

## 📚 REFERENCE FILES

**Master Template:**
- `homepage-v1.html` - See implementation examples

**Design Documentation:**
- `V33_DESIGN_SYSTEM_DOCUMENTATION.md` - Extended design system
- `ICON-COLOR-SCHEME.md` - Icon-specific colors
- `HEADER_INTEGRATION_MASTER_GUIDE.md` - Header implementation

**Preview Files:**
- `icon-pop-out-preview.html` - Icon color examples
- `icons-preview.html` - Icon variations
- `homepage-v34.html` - Alternative reference

---

## ⚠️ IMPORTANT NOTES

### **Color Confirmation Needed:**
The following colors need exact hex values confirmed:
- Grey (body text and borders) - specify exact shade
- Hermes Orange - confirm exact hex value
- Sage Green - confirm exact hex value  
- Black (primary text) - specify exact shade

**Action:** Update this document once exact values are confirmed.

### **Consistency is Key:**
- Always use the same hex values across all pages
- Define colors as CSS variables
- Never use slightly different shades
- Test colors in different lighting conditions

### **Accessibility:**
- Always check contrast ratios
- Test with colorblind simulators
- Ensure text is readable on all backgrounds
- Provide alternatives for color-only information

---

## 🎯 SUMMARY

**Typography:** Berlin Sans FB Demi Bold  
**Primary Colors:** Purple `#E6690CC`, Navy `#000C49`  
**Neutrals:** Grey (TBD), Black (TBD)  
**Accents:** Hermes Orange (TBD), Sage Green (TBD)  

**Status:** ✅ Ready for subpage implementation (pending final color confirmations)

---

**Last Updated:** February 10, 2026  
**Maintainer:** Development Team  
**Next Review:** When implementing first subpage
