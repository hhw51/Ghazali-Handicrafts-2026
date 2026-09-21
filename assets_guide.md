# Asset Guidelines & Real Imagery Protocol — Ghazali Handicrafts

## 1. Zero Stock Photography Policy (Strict Rule)
- **NO UNSPLASH / PEXELS / SHUTTERSTOCK:** Never insert generic, artificial stock photos of pottery, Western ceramic workshops, or stylized retail models.
- **NO PLACEHOLDER SVGs OR SKELETON REPLACEMENTS:** Real craft inventory photos must be used across the catalog, hero sections, and collection banners.
- **AUTHENTICITY FOCUS:** Images must showcase real Pakistani artisanal craft details: authentic Multani cobalt blue glaze brushstrokes, Swati hand-carved floral woodwork reliefs, raw chiseled marble veining, and authentic Pakistani truck art pigment work.

## 2. Directory Structure & Naming Conventions
Place your provided high-resolution photographs into the `/public/images/products/` directory following this schema:
public/
└── images/
├── hero/
│   └── craft-hero.webp              # Flagship artisanal hero banner
├── collections/
│   ├── blue-pottery.webp           # Multani glazed ceramics
│   ├── swati-wood.webp             # Carved Swati walnut & cedar
│   ├── marble-crafts.webp          # Hand-turned onyx & marble
│   └── truck-art.webp              # Authentic truck art items
└── products/
├── [slug]-1.webp               # Primary studio shot
├── [slug]-2.webp               # Detail / Glaze macro shot
└── [slug]-3.webp               # Lifestyle / In-situ shot
## 3. Image Optimization Pipeline
- **Formats:** Convert all input images to modern `.webp` format.
- **Aspect Ratio:** Enforce consistent `4:5` aspect ratios (`aspect-[4/5]`) on product cards to prevent cumulative layout shifts (CLS).
- **Next.js `<Image />` Standard:**
  - Always provide explicit `width`, `height`, and `sizes` attributes.
  - Set `priority` only on the above-the-fold Hero and primary PDP gallery image.
  - Enable smooth image transitions with a subtle blur placeholder or background wash (`#F4EFE6`).