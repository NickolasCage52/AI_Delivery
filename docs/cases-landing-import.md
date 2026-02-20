# Cases Landing Import

## Summary

The standalone cases portfolio landing page (originally at `https://nickolascage52.github.io/NikitaMorus_Cases/`) has been fully integrated into the Next.js site as the `/cases` page.

## What was done

| Action | Details |
|--------|---------|
| HTML → React | Converted all landing HTML templates to React components |
| CSS → CSS Modules | `cases-landing.module.css` — fully scoped, no global leaks |
| JS → React hooks | Filter tabs, card tilt, gallery lightbox, intersection observer — all via `useState`/`useEffect` |
| Fonts | Removed Google Fonts CDN link; inherits site fonts (`--font-sans`, `--font-display`) |
| Colors | All color tokens mapped to site CSS variables (`--bg-primary`, `--accent`, `--text-primary`, etc.) |
| Header/Footer | Removed landing's own topbar/footer; uses site `<Header>` and `<Footer>` |
| Images | Paths changed from `./assets/images/cases/` to `/cases-landing/` (served from `public/`) |
| Gallery lightbox | Ported as React component with keyboard navigation and body scroll lock |
| Form | Client-side validation; Telegram CTA redirect (no serverless endpoint needed) |
| SEO | Breadcrumb JSON-LD, proper metadata via `buildMetadata()` |

## File structure

```
app/cases/
  page.tsx                      ← Route component (server), renders Header + CasesShowcase + Footer
  cases-landing.module.css      ← Scoped styles (all landing CSS adapted to site tokens)
  [slug]/page.tsx               ← Unchanged — old JSON-based case detail pages still work

components/cases-landing/
  CasesShowcase.tsx             ← Main client component (hero, filters, grid, detail, CTA)
  GalleryLightbox.tsx           ← Photo gallery modal
  cases-data.ts                 ← Case data (6 cases), filter definitions, types

public/cases-landing/
  case-01.png … case-06-5.png   ← Case screenshots (must be added manually)
```

## Image assets

Screenshots are referenced but not included in the repo. Place PNG files in `public/cases-landing/`:

- `case-01.png`, `case-01-2.png` … `case-01-5.png`
- `case-02.png`, `case-02-2.png` … `case-02-5.png`
- (same pattern for case-03 through case-06)

If an image is missing, the shot container hides gracefully via Next.js Image error handling.

## How routing works

- `/cases` — Shows the full portfolio landing (hero, filter tabs, case cards grid, process, trust, CTA)
- `/cases?case=<slug>` — Shows case detail view inline (no separate route needed)
- `/cases/<slug>` — Still serves old JSON-based case detail pages (3 existing cases)

The `?case=` parameter is handled client-side via `pushState`/`popstate`, enabling smooth transitions without full page reloads.

## How to update content

1. **Add/edit a case**: Update `components/cases-landing/cases-data.ts` — the `CASES` array
2. **Add screenshots**: Drop PNGs into `public/cases-landing/`
3. **Change styles**: Edit `app/cases/cases-landing.module.css` (scoped, won't affect other pages)
4. **Adjust filters**: Update the `FILTERS` array in `cases-data.ts`

## Color token mapping

| Landing variable | Site variable |
|------------------|---------------|
| `--bg` | `--bg-primary` |
| `--bg-2` | `--bg-secondary` |
| `--surface` | custom (kept similar violet tones) |
| `--text` | `--text-primary` |
| `--text-muted` | `--text-secondary` |
| `--accent` | `--accent` |
| `--accent-2` | `--accent-strong` |
| `--ok` | `#a5f3fc` (kept, unique to KPIs) |

## Coexistence with old case system

The old case system (`content/cases/*.json` → `lib/content/cases.ts` → `app/cases/[slug]/page.tsx`) is fully intact. The homepage Cases section still shows 3 JSON-based cases with their own detail pages. The new landing cases use query-param routing (`?case=slug`) within the `/cases` page itself.
