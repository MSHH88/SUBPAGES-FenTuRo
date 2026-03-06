# QUICK REFERENCE - Subpage Redesign

**One-page checklist for fast integration**

---

## ⛔ STOP - READ BEFORE ANY CHANGES

### MANDATORY ANALYSIS STEPS
1. **Find existing HTML structure** - What elements exist?
2. **Find existing CSS** - What layout system? (Grid/Flexbox?)
3. **Identify key classes** - What classes create the current layout?
4. **NEVER create custom HTML/CSS that's incompatible with existing code**
5. **ALWAYS use existing classes where possible**

### EXISTING NAVIGATION MENU STRUCTURE
```
- Uses CSS Grid (NOT Flexbox)
- .collapse-inner = Grid container
- .level1 = Section headers
- .level2 = Links
- .menuPadding = General spacing
- .forcedColBreak = Forces new column in grid
```

### ❌ DON'T DO THIS:
```html
<!-- WRONG - Custom incompatible structure -->
<div class="konfig-sections-row">
    <div class="konfig-column">...</div>
</div>
```

### ✅ DO THIS INSTEAD:
```html
<!-- RIGHT - Use existing structure -->
<ul class="collapse-inner">
    <li class="level1 menuPadding">Header</li>
    <li class="level2 menuPadding">Link</li>
    <li class="level1 forcedColBreak">Next Column Header</li>
</ul>
```

---

## 🚨 CRITICAL CSS RULES (Copy exactly)

### Sticky Header (MUST INCLUDE ALL 4)
```css
.site-header.sticky {
    position: fixed;           /* #1 REQUIRED */
    top: 0;                    /* #2 REQUIRED */
    width: 100%;               /* #3 REQUIRED */
    z-index: 999;              /* #4 REQUIRED */
    background: transparent;    /* Floating effect */
    backdrop-filter: none;
    box-shadow: none;
    height: 80px;
}
```

### Icon Positioning (Use :not(.sticky))
```css
/* Normal state - MUST use :not(.sticky) */
#searchIcon:not(.sticky) { left: calc(100% - 414px); }
#accountIcon:not(.sticky) { left: calc(100% - 361px); }
#cartIcon:not(.sticky) { left: calc(100% - 308px); }

/* Sticky state - Use right positioning */
#searchIcon.sticky { right: 140px; }
#accountIcon.sticky { right: 90px; }
#cartIcon.sticky { right: 40px; }
```

---

## 📏 MEASUREMENTS

| Item | Normal | Sticky |
|------|--------|--------|
| Header Height | 155px | 80px |
| Logo Size | 150px | 75px |
| Icon Size | 44px | 35px |
| Icon Spacing | 53px | 50px |
| Scroll Trigger | - | 100px |

---

## 🎨 COLORS

| Use | Value |
|-----|-------|
| Primary (Orange) | `#E6690C` |
| Navy Blue | `#000C49` |
| Header BG (normal) | `rgba(255, 255, 255, 0.95)` |
| Header BG (sticky) | `transparent` |
| Icon BG | `rgba(66, 133, 244, 0.08)` |

---

## 📐 Z-INDEX STACK

| Z-Index | Element |
|---------|---------|
| 9999 | Dropdowns |
| 9998 | Overlay |
| 1000 | Logo & Icons (sticky) |
| 999 | Header (sticky) |
| 110 | Icons (normal) |
| 100 | Header (normal) |

---

## ✅ TEST AFTER EVERY CHANGE

1. [ ] Scroll to 100px → Header sticks
2. [ ] Logo shrinks to 75px, moves top-left
3. [ ] Icons shrink to 35px, move top-right
4. [ ] Background is transparent
5. [ ] All icons clickable
6. [ ] All dropdowns work
7. [ ] **Cart add works**
8. [ ] **Cart remove works**
9. [ ] **Cart total updates**
10. [ ] No console errors

---

## 🚫 NEVER DO

- ❌ Use `!important`
- ❌ Use `left: auto` for overrides
- ❌ Skip cart testing
- ❌ Copy HTML without CSS
- ❌ Random z-index values
- ❌ Skip `.site-header.sticky { position: fixed }`
- ❌ Skip `:not(.sticky)` for icon positioning

---

## 🔧 BOOTSTRAP FALLBACKS (Include if nav not showing)

```css
.d-lg-block { display: block !important; }
.d-none { display: none !important; }
@media (min-width: 992px) {
    .d-lg-block { display: block !important; }
}
```

---

## 📝 FONT

**Primary:** Berlin Sans FB Demi Bold  
**Fallbacks:** Arial Black, sans-serif  
**Weight:** Headers 600-700, Body 400-500

---

**Print this page and keep beside monitor during development.**
