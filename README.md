# 🔐 Wyze Bundle Builder — Frontend Take-Home

A production-quality multi-step security system bundle builder built as a React prototype. Shoppers walk through a 4-step accordion to assemble their custom security system, with a live review panel that updates in real-time as selections are made.

---

## 🚀 Quick Start

```bash
git clone https://github.com/MusfirahSheikh8/react-bundle-builder
cd Ecome-Expert

npm install

npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
npm run build

npm run preview
```

> **Requirements:** Node.js ≥ 18, npm ≥ 9

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 19 (latest stable) | UI framework |
| **TypeScript** | 5.x | Type safety throughout |
| **Vite** | 8.x | Fast dev server + bundler |
| **Tailwind CSS** | v4 (via `@tailwindcss/vite`) | Pixel-perfect utility styling |
| **Context API + useReducer** | built-in | Global state management |
| **React Icons** (`react-icons/fi`, `bi`) | 5.x | Iconography |
| **localStorage** | Web API | "Save my system for later" persistence |
| **JSON file** | `src/data/products.json` | Data source (no backend required) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Builder.tsx        # 4-step accordion with product grids
│   ├── ProductCard.tsx    # Individual product card (image, badge, variants, stepper, price)
│   └── ReviewPanel.tsx    # Live summary — two-column layout with totals & CTA
├── context/
│   └── BuilderContext.tsx # Global state: cart + activeStep, useReducer, localStorage init
├── data/
│   └── products.json      # All categories, products, variants & initial cart state
├── App.tsx                # Layout shell — header, main content, footer
└── index.css              # Tailwind v4 @import + custom .stepper utility class
```

---

## ✅ Features Implemented

### Accordion Builder (Left)
- **4-step accordion** — Step 1 (Choose your cameras) expands by default on load
- Each step header shows: step indicator (`STEP X OF 4`), icon, title, **"N selected" pill badge**, and up/down chevron
- Collapsing / expanding steps works independently
- **"Next: …" CTA button** at the bottom of each open step advances to the next
- Open step gets a **light blue-purple background** (`#eef1fb`) matching the Figma design

### Product Cards
- **Optional discount badge** (e.g. "Save 21%") — only rendered when present in data
- Product image, title, short description, "Learn More" link
- **Color/variant selector** — shows circular color swatches with active-state ring outline
- **Quantity stepper** — `–` count `+` inline control; decrement disabled at zero
- **Pricing row** — struck-through compare-at price (when applicable) + active price
- **Selected-state highlight** — purple border + ring glow when any variant has qty > 0
- Products without variants (e.g. doorbell) show no color selector — stepper controls base product directly

### Variant Selector — Key Behavior
- **Each variant tracks its own quantity independently**
- The card stepper is **bound to the currently active variant** — switching color shows that color's qty
- All variants with qty > 0 each appear as **their own line in the review panel**
- Changing the active swatch on the card does **not remove other variants** from the review panel

### Review Panel (Below Builder — matches design)
- **Two-column layout**: item list (left) + guarantee badge + pricing + CTA (right)
- Items grouped by category subheadings: **CAMERAS, SENSORS, ACCESSORIES, PLAN**
- Per-item: thumbnail, product name + variant, inline `– qty +` stepper, struck-through + active price
- **Plan row** gets special treatment: Wyze shield icon + "Cam **Unlimited**" split styling + monthly pricing
- **Shipping row** always shown — "$5.99" struck through, "FREE" in green
- **30-day satisfaction guarantee** — circular purple stamp badge + returns copy
- **Financing line** — "as low as $X.XX/mo" pill
- **Total** — struck-through original, bold current price
- **Savings callout** — green text when bundle discount applies
- **Checkout button** — shows a confirmation `alert()` (placeholder, no route)
- **Save my system for later** — saves cart to `localStorage`; reloads restore it exactly

### Persistence
- Cart is initialized from `localStorage` on first render via `useReducer`'s lazy initializer — zero flash
- Clicking "Save my system for later" explicitly persists the current cart
- On any return visit (including hard reload), the full system — products, variants, quantities — is restored

### Responsiveness
- **Desktop (≥ 1024px):** Full layout, 3-column product grid in open steps, two-column review panel
- **Tablet (768–1023px):** 2-column product grid, review panel stacks vertically
- **Mobile (< 768px):** Single-column everything, steppers and prices remain accessible

---

## 🗂️ Data Model

All content is driven from `src/data/products.json`. No markup is hardcoded per-product.

```jsonc
{
  "categories": [  4 steps with id, title, icon, step number ],
  "products": [
    {
      "id": "cam-v4",
      "categoryId": "cameras",
      "title": "Wyze Cam v4",
      "price": 29.99,
      "compareAtPrice": 38.00,    // optional — renders struck-through price
      "badge": "Save 21%",        // optional — renders badge pill
      "imageUrl": "...",          // fallback image (used when no variant selected)
      "variants": [               // optional — omit for single-variant products
        { "id": "white", "name": "White", "colorCode": "#E8E8E8", "imageUrl": "..." },
        { "id": "black", "name": "Black", "colorCode": "#1a1a1a", "imageUrl": "..." }
      ]
    }
    // ...
  ],
  "initialState": [
    { "productId": "cam-v4", "variantId": "white", "quantity": 1 }
  ]
}
```

---

## 🧠 Architectural Decisions

### Context API + `useReducer` over Zustand
Chosen to keep the dependency tree minimal and demonstrate idiomatic React patterns. The reducer handles three action types: `UPDATE_QUANTITY`, `SET_ACTIVE_STEP`, `SET_CART`. All business logic lives in one place — easy to unit-test or swap for Zustand/Redux if the app scales.

### localStorage initializer (not `useEffect`)
```ts
useReducer(reducer, initialState, (init) => {
  const saved = localStorage.getItem('builderCart');
  return { ...init, cart: saved ? JSON.parse(saved) : data.initialState };
});
```
Using the lazy initializer (third argument) means state is correct on the **very first render** — no flash of empty cart, no layout shift.

### Tailwind CSS v4 via Vite plugin
v4's `@import "tailwindcss"` approach (no `tailwind.config.js`) pairs perfectly with Vite. JIT scanning works out of the box; no config file to maintain.

### Variants as independent cart items
Each `(productId, variantId)` pair is treated as a distinct cart entry. This cleanly handles the "2 White + 0 Black simultaneously in the panel" requirement without any special merging logic.

### Data-driven rendering
Zero per-product JSX. Every card, category, and line item renders from the JSON source. Adding a new product or category requires only a JSON edit — no component changes.

---

## ⚖️ Trade-offs & Known Limitations

| Item | Decision |
|------|----------|
| **Images** | Using Unsplash URLs (free, representative). A real project would use Wyze CDN product images. |
| **Checkout** | Triggers `window.alert()`. Requirement explicitly states "a placeholder is fine." |
| **Backend/API** | Not implemented — JSON file is the data source. The bonus requirement was skipped. |
| **Animation** | Accordion open/close has no height-transition animation. A `<details>` or Framer Motion approach would improve perceived smoothness. |
| **Accessibility** | Basic `aria-expanded`, `aria-label` attributes added. A full audit (focus trapping, keyboard nav for steppers) would be next. |
| **Unit tests** | Not included. The reducer is pure and easily testable with Vitest + Testing Library. |
| **Colour-chip highlight** | The spec says "don't worry about the selected-chip styling for now" — we use a simple ring outline as a minimal indicator. |

---

## 🔖 Requirements Checklist

- [x] 4-step vertical accordion builder
- [x] Step 1 open by default on load
- [x] "STEP X OF 4" header with icon, title, N-selected count, chevron
- [x] "Next: …" button advances to next step
- [x] Product cards: badge, image, title, description, Learn More, color variants, stepper, pricing
- [x] Selected card highlighted border
- [x] Variant selector: per-variant quantity, stepper bound to active variant
- [x] Review panel below builder (per screenshot): items grouped by category
- [x] Review panel: thumbnail, name, stepper, pricing per line
- [x] Steppers in sync between card and review panel
- [x] Live total recalculation
- [x] Shipping row, guarantee badge, financing line, savings callout
- [x] Checkout placeholder
- [x] "Save my system for later" → localStorage persistence → restored on reload
- [x] Data-driven from `products.json` — no hardcoded markup
- [x] Pre-seeded initial state matching design
- [x] Responsive: desktop → tablet → mobile
- [x] TypeScript throughout
- [x] Tailwind CSS v4
- [x] React Icons
- [x] Context API + useReducer

---

## 📸 Design Reference

[Figma File](https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-8088)

---

## 👤 Author

Built as a frontend take-home assessment. Developed with production standards in mind: scalable architecture, maintainable component structure, and pixel-faithful UI fidelity.


## Note
Please note that I have used random images from Unsplash and it may not match the design exactly. My main focus was on React and styling thus the pictures do not match the design you provided.
