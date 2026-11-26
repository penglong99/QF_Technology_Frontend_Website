# QF Technology — Computer Store Frontend

The website for **QF Technology**, a computer store in Phnom Penh, Cambodia. It is a read-only storefront that showcases the store's products: home page, catalog with filters, search, product pages, compare, buying guide, about, contact and policies. It is built from the Figma design.

Product data will come from the store's **POS system**, the single source of truth for products. Until that connection is live, the site runs on local **mock data**. See [POS_INTEGRATION.md](POS_INTEGRATION.md).

## Requirements

- **Node.js 20.19+** (or 22.12+) and npm

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Development server with hot reload                              |
| `npm run build`     | Type-check, then production build into `dist/`                  |
| `npm run preview`   | Serve the production build locally                              |
| `npm run typecheck` | Strict TypeScript check                                         |
| `npm run lint`      | ESLint                                                          |
| `npm run format`    | Format everything with Prettier                                 |
| `npm run test`      | Run the Vitest + React Testing Library suite once               |
| `npm run check`     | typecheck + lint + format check + tests (run before committing) |

In development, **`/design-system`** shows every shared UI component, mirroring the Figma "Design System" frame. This page is not included in production builds.

## Tech stack

React 19 · Vite 8 · TypeScript (strict) · CSS Modules · React Router 7 · Zustand (recent searches) · Lucide icons · Geist font (self-hosted via `@fontsource-variable/geist`) · ESLint · Prettier · Vitest + React Testing Library.

No UI kit, Tailwind or CSS-in-JS is used.

## Project structure

```
src/
  app/             router.tsx, paths.ts (every URL in one place), App.tsx
  assets/brand/    QF logo (colour + white)
  styles/          variables.css (design tokens), globals.css (reset, base type, a11y)
  components/
    ui/            reusable UI: Button, Badge, Checkbox, SelectField, Tabs, Modal, Pagination,
                   Breadcrumb, EmptyState, Price, Skeleton, Spinner…
    layout/        AnnouncementBar, Header, Footer, MainLayout, Container, SectionHeading, CtaBand
  features/        one folder per domain: types, components, logic
    products/      product types, website categories, ProductCard, gallery, spec list
    catalog/       filtering/sorting logic, URL-backed filter state, filter sidebar
    search/        search bar with suggestions, recent searches
    store-info/    store address, hours, map, "Visit the Shop"
    guides/        buying-guide checklist
  services/        the data-access layer (see below)
    mock/          TEMPORARY sample catalogue and mock source
    pos/           POS API calls, response types and mapper
  hooks/           useAsync, usePageTitle
  lib/             classNames, formatPrice, safeStorage
  pages/           one folder per route (page-specific components live with their page)
  test/            test setup and helpers
public/images/     optimised WebP product and site photos
```

## Design tokens

All colours, type sizes, spacing, radii, shadows and breakpoints from the Figma handoff guide are in `src/styles/variables.css`. Components only use the **semantic** tokens (`--surface-*`, `--text-*`, `--action-*`, `--status-*`). To restyle the site, change values there rather than in component CSS.

Breakpoints follow Figma: mobile < 768px, tablet ≥ 768px, laptop ≥ 1280px, desktop ≥ 1440px.

## Product data and the POS

Pages never touch data directly. They call the services in `src/services/`:

- `productService`: `list(query)`, `getBySlug`, `getFeatured`, `getRelated`, `suggest`, `listComparable`, `searchComparable`, `countByCategory`
- `brandService.list()`, `categoryService.list()`

These are built on a `productSource`, chosen by `VITE_PRODUCT_SOURCE`:

- `mock` (default): sample data in `src/services/mock/`.
- `pos`: the POS API, through `src/services/pos/`. Responses are converted to the website's types by `posMapper.ts`.

Every page already handles loading, empty and error states. How to connect the POS, which endpoints it needs, and the open questions for the POS team are all in **[POS_INTEGRATION.md](POS_INTEGRATION.md)**.

Never put secret keys or database credentials in frontend code. Only public values belong in `VITE_*` variables.

## Notes and decisions

- **Branding:** the Figma file was designed as "EZ Tech". The site uses the QF Technology logo, name and copy (house products are "QFBook", "QF CoreLine"…). Layout, colours and typography follow Figma. The logo blue (`#2B52A2`) is used only for the logo itself.
- **Extra categories** (monitors, components, printers, CCTV, repair services) use the existing catalog and card designs. Items without a photo show a neutral category-icon placeholder. The category list, with names, descriptions and icons, is in `src/features/products/categories.ts`.
- **Responsive layouts** for tablet and mobile were derived from the breakpoint spec, since Figma only has desktop frames.
- **Placeholders to update:** the store email (`features/store-info/data.ts`), the About page stats and team, and the policy text (`pages/PoliciesPage`).
- **Not in Figma, added to make the agreed scope work:** policies page and product prices on cards. Both follow the existing component styles.
- **Removed:** the demo login and the admin/seller dashboards, which managed products on the website. Product management belongs in the POS.
