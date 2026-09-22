# Brand Context, Taxonomy & Storefront Metadata — Ghazali Handicrafts

## 1. Physical Flagship & Local Provenance
- **Brand Name:** Ghazali Handicrafts
- **Flagship Store Address:** 27 New Anarkali, Lahore, Punjab, Pakistan
- **Google Maps Pin:** https://maps.app.goo.gl/fbt2FunN1MfoD7Px6
- **Storefront Context:** Rooted in Lahore's historic Anarkali Bazaar, the store bridges centuries of indigenous regional artisan trade with modern nationwide doorstep delivery.
- **Site Footer & Contact Schema:**
  - Display full address with an embedded Google Maps anchor link.
  - Implement JSON-LD `LocalBusiness` / `Store` structured data linking the Anarkali coordinates for local SEO dominance.

---

## 2. Craft Classifications & Materials (Taxonomy Level 1)
Use these exact 13 craft types for primary filtering, navigation ribbons, and Supabase category seeding:

1. **Blue Pottery** (Multani hand-painted cobalt glaze)
2. **Brass Metal** (Chiseled, etched, and cast brassware)
3. **Camel Bone** (Intricate inlay work)
4. **Glasswork** (Traditional glass art)
5. **Marble & Onyx** (Hand-carved and turned stone)
6. **Naqshi Art** (Hand-etched lacquer and decorative relief)
7. **Salt Lamps** (Himalayan rock salt carvings)
8. **Sheesham Wood** (Solid rosewood carving and brass inlays)
9. **Sword Frames & Arms** (Decorative traditional weaponry and displays)
10. **Truck Art** (Authentic indigenous Pakistani enamel artwork)
11. **Fridge Magnets** (Cultural miniature crafts)
12. **Swati Art** (Swati geometric wood carving and brass accents)
13. **Others** (Specialty regional curiosities)

---

## 3. Product Subcategories & Form Factors (Taxonomy Level 2)
Map all individual catalog listings to these functional item types:

- **Home Decor & Living:** Vases, Wall Clocks / Clocks, Wall Hangings, Lamps, Coffee Tables, Salt Lamps, Ship Models.
- **Tableware & Dining:** Plates, Tea Cups, Trays, Fruit Baskets, Brass Glasses, Sugar Pots, Candy Boxes, Imported China.
- **Keepsakes & Desk Accents:** Jewelry Boxes, Tissue Boxes, Pen Holders, Ash Trays, Keyrings, Charpai Bottles.
- **Games & Collectibles:** Chess Sets, Decorative Swords, Tabla Sets, Handcrafted Dolls, Animal Figurines, Souvenirs, Fridge Magnets.

---

## 4. Local SEO Schema Payload (`app/layout.tsx` or `/contact`)
Inject this structured data into the global root layout:

```json
{
  "@context": "[https://schema.org](https://schema.org)",
  "@type": "Store",
  "name": "Ghazali Handicrafts",
  "image": "[https://ghazalihandicrafts.com/images/hero/craft-hero.webp](https://ghazalihandicrafts.com/images/hero/craft-hero.webp)",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "27 New Anarkali",
    "addressLocality": "Lahore",
    "addressRegion": "Punjab",
    "addressCountry": "PK"
  },
  "hasMap": "[https://maps.app.goo.gl/fbt2FunN1MfoD7Px6](https://maps.app.goo.gl/fbt2FunN1MfoD7Px6)",
  "priceRange": "PKR",
  "currenciesAccepted": "PKR",
  "paymentAccepted": "Cash on Delivery"
}