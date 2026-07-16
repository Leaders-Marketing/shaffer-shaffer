# Landing Page Refactor Prompt (Reusable Template)

Copy this prompt when refactoring a **single-file HTML landing page** into a clean, maintainable project. Replace bracketed placeholders (`[like this]`) with project-specific values.

---

## Prompt

Please refactor this single-file HTML landing page into a clean, maintainable project structure.

### File structure

- Separate into: `index.html`, `css/styles.css`, `js/main.js`, and `assets/images/`
- Extract all inline/base64 images into `assets/images/` (**deduplicate** — any image used more than once should reference one file)
- Link external CSS and JS from the HTML (**no inline styles or scripts**)
- Name image files semantically (e.g. `logo.png`, `hero-[subject].jpg`, `bg-[section].jpg`, `[section]-[description].jpg`)

### Code quality

- Format all code cleanly
- Use **BEM** class naming throughout (blocks, elements, modifiers — e.g. `.header__nav-link`, `.btn--primary`, `.section--large`)
- Remove duplicate code (repeated markup, duplicated assets, redundant styles)
- Remove unused CSS and JS
- Keep existing content, copy, and visual design intact

### Layout

- Use a sensible `max-width` on the main container (e.g. `[1320px]` via `.container`)
- Replace inline styles with BEM modifiers (e.g. `.section__eyebrow--light` for alternate eyebrow color on dark sections)

---

### Header & navigation

- Add a working hamburger/mobile menu with:
  - Slide-in panel, overlay, animated icon, body scroll lock
  - Close on link click, overlay click, and Escape key
  - Auto-close on resize back to desktop
  - Proper `aria-expanded`, `aria-hidden`, and `aria-label` attributes
- **Do not let the logo shrink** — use `flex-shrink: 0` and `max-width: none` on logo images
- **Prevent nav link overlap** — measure when the full nav (logo + links + phone + CTA) no longer fits; switch to hamburger at `max-width: [1200px]` (adjust per design — do not default to 980px if nav needs more room)
- Set `flex-shrink: 0` on nav links so global `min-width: 0` doesn't compress them into each other
- On mobile (≤ breakpoint), hide header phone + CTA in the top bar; show them inside the slide-in panel (e.g. `.header__nav-extras`)

---

### Hero section

#### Viewport height — hero only

- **Only the hero section** should fill the remaining viewport on first load
- Any strip/section directly below the hero (trust badges, logos, stats bar, etc.) sits at natural height and scrolls in normally — **do not include it in the viewport calc**
- Hero height:
  ```css
  height: calc(100vh - var(--site-chrome-height));
  height: calc(100dvh - var(--site-chrome-height));
  height: calc(100svh - var(--site-chrome-height));
  ```
- `--site-chrome-height` = sum of all fixed top chrome (e.g. utility/announcement bar + full header height including nav row)
- Measure dynamically in `js/main.js` via `ResizeObserver` on chrome elements; update on resize, load, and `document.fonts.ready`

#### Hero padding

- Add responsive padding so text/headings don't touch screen edges when the browser shrinks:
  - Hero: top + side padding via `clamp()`; **no bottom padding** if a bottom-anchored hero image is used
  - Content column: additional inner padding via `clamp()` values
  - On mobile (≤768px): increase padding slightly; allow content `max-width: 100%`

#### Hero image — prevent "floating" cutout subjects

When the hero includes a person, product, or cutout image anchored to the bottom:

- **Bug to avoid:** Image clipped mid-body with a hard horizontal edge, making the subject appear to hover above the page
- **Fix:**
  - Place `.hero__visual` **outside** the text grid as a direct child of `.hero`
  - Absolutely position the visual at `right: 0; bottom: 0` so the subject sits on the hero floor (bottom edge of the hero section)
  - Use `height: 100%`, `object-fit: contain`, `object-position: bottom center` (or `bottom right`) on the hero image
  - **No bottom padding** on `.hero` when using bottom-anchored images — bottom padding creates a visible gap beneath the subject
  - **Avoid drop-shadow** on cutout hero images — it emphasizes a floating effect
  - Do **not** clip the image with `overflow: hidden` on the visual column; clip only at the hero level if needed
  - On mobile (≤768px): switch the visual to `position: relative` in normal document flow below the text

#### Hero text vs. visual layout

- Reset section padding on the hero — don't let global `section { padding }` squeeze a fixed/flex hero height
- Prevent the hero image from overlapping the text column:
  - Use `minmax(0, …)` on grid columns if using a grid
  - Give the text column a higher `z-index`
  - Align the image to the right (or appropriate side) with `overflow: hidden` only on the visual column if needed for horizontal bleed control
- Text column: higher `z-index`, constrained `max-width` (e.g. `~50–55%` of hero or `min(100%, [640px])`)
- Visual column: `z-index` below text, `width: ~[45–55]%`, bottom-anchored

---

### Buttons & mobile

- Primary CTA buttons must not overflow on mobile:
  - Allow text wrapping (`white-space: normal`) below `[980px]`
  - Reduce font size and padding on small screens
  - Full-width buttons in stacked hero actions at `≤[640px]`
  - `max-width: 100%` and `line-height: 1.35` for multi-line button text

---

### JavaScript (`js/main.js`)

1. Mobile menu toggle (open/close, aria attributes, body scroll lock)
2. Close menu on: link click, overlay click, Escape, resize above nav breakpoint
3. Set `--site-chrome-height` CSS custom property from measured top-chrome element heights

---

## Reference HTML pattern (hero + strip below)

```html
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__content">
      <!-- eyebrow, title, subtitle, CTAs -->
    </div>
  </div>
  <div class="hero__visual">
    <img class="hero__image" src="assets/images/hero-[name].png" alt="[descriptive alt text]">
  </div>
</section>

<!-- Trust strip / logos / stats — NOT included in viewport height -->
<div class="[strip-block]">
  <div class="container [strip-block]__inner">
    <!-- content -->
  </div>
</div>
```

---

## Reference CSS pattern (hero viewport + bottom-anchored image)

```css
:root {
  --site-chrome-height: [fallback, e.g. 174px]; /* updated by JS */
  --container-max: [1320px];
  --nav-breakpoint: [1200px];
}

.hero {
  position: relative;
  padding: clamp(24px, 4vw, 56px) clamp(20px, 3vw, 40px) 0;
  overflow: hidden;
  height: calc(100vh - var(--site-chrome-height));
  height: calc(100dvh - var(--site-chrome-height));
  height: calc(100svh - var(--site-chrome-height));
}

.hero__visual {
  position: absolute;
  right: 0;
  bottom: 0;
  width: [55%];
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

.hero__image {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  object-position: bottom center;
}
```

---

## QA checklist (common bugs)

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Hero image clipped | Subject cut off at waist/knees | `object-fit: contain`, full height chain, bottom anchoring |
| Subject "floating" | Hard cut + visible gap below feet/base | Absolute `bottom: 0`, no hero bottom padding, no drop-shadow |
| Strip included in viewport | Content below hero squeezed on first screen | Viewport height on `.hero` only — not on wrapper or strip |
| Text touching edges | Headings flush to sides on resize | Responsive `clamp()` padding on hero + content |
| Nav overlap | Links compress into each other | Hamburger at correct breakpoint, `flex-shrink: 0` on nav links and logo |
| Duplicate assets | Same image embedded multiple times | One file per unique image; reference everywhere |
| Chrome height drift | Hero too tall/short after resize or font load | `ResizeObserver` + recalc on load and `document.fonts.ready` |
| CTA overflow | Button text spills off-screen on mobile | `white-space: normal`, smaller padding, full-width at small breakpoints |

---

## Per-project customization

Fill these in before running the prompt on a new design:

| Setting | Example | Notes |
|---------|---------|-------|
| Container max-width | `1320px` | Match design comp |
| Nav hamburger breakpoint | `1200px` | Measure when nav overflows |
| Button wrap breakpoint | `980px` | When CTAs need to wrap |
| Full-width CTA breakpoint | `640px` | Stacked hero actions |
| Top chrome elements | utility bar + header | What to measure for `--site-chrome-height` |
| Hero image position | bottom-right | Adjust for LTR/RTL or layout |
| Strip below hero | accolades, logos, stats | Name the BEM block per design |

---

## Asset naming conventions

| Pattern | Example | Use when |
|---------|---------|----------|
| `logo.[ext]` | `logo.png` | Brand mark used in multiple places |
| `hero-[subject].[ext]` | `hero-team.png` | Primary hero visual |
| `bg-[section].[ext]` | `bg-testimonial.jpg` | CSS background image for a section |
| `badge-[name].[ext]` | `badge-partner.png` | Logo/badge in a strip |
| `[section]-[desc].[ext]` | `about-office.jpg` | Section-specific photo |
| `[category]-[item].[ext]` | `service-consulting.jpg` | Cards, grids, galleries |

Deduplicate: if the same base64 or file appears in HTML **and** CSS `url()`, extract once and reference from both.
