# Plan 004: CMS Delivery Strategy for the Front Office

This plan establishes the external CMS as the authoritative source for the public-facing pages (home page and custom landing pages), using typed, ordered sections instead of static, client-side route handlers.

Operational APIs (catalog, cart, checkout, auth, client panel) continue to follow the contracts in `openapi.yaml`.

## Motivation

The initial home page contract modeled dynamic content purely as key-value pairs and separate SEO blocks. The final landing page is a rich composition of sections (Hero, Marquee, Intro, Testimonials, Plans, Archives, etc.). A page builder CMS delivering structured blocks is the correct approach to let non-technical editors manage front-office layouts without modifying React code.

---

## Technical Specifications

### 1. CMS API Contracts (OpenAPI)

New read-only endpoints are exposed under `/paginas` and `/menus/{chave}`:
- **`GET /paginas?rota=/`**: Returns the full layout tree of a published page.
- **`GET /paginas`**: Lists all published pages (for sitemaps, navigation, and discovery).
- **`GET /menus/{chave}`**: Returns public navigation structures (e.g. `header-principal` and `footer-principal`).

#### New Components:
- **`PaginaCms`**: id, rota, slug, titulo, status, locale, seo, sections, updatedAt.
- **`SeoPagina`**: replaces EntradaSeo inside the page payload.
- **`SecaoCms`**: id, tipo, ordem, props, dataBindings.
- **`DataBinding`**: declarative links to operational catalog data.

---

## Architecture and Execution Steps

### 1. Types & Mock Setup
- Define CMS domain types in `src/lib/domain/types.ts`.
- Set up local mock data trees for the home page `/` and custom pages (e.g. `/sobre-o-clube`) in `src/lib/domain/mock-data.ts`.

### 2. Repository Layer
- Implement `getCmsPageByRoute`, `listCmsPages`, and `getCmsMenu` in `src/lib/domain/repositories.ts`.
- Integrate `process.env.CMS_DELIVERY_BASE_URL` to fetch from the external CMS, falling back to local mocks in dev.
- Adapt `getSeoEntry` to resolve metadata from the CMS page.

### 3. Dynamic Section Rendering
- Update section components under `src/app/(front-office)/_landing/sections/` to accept customizable props with robust defaults.
- Implement the `PageRenderer` component to map `section.tipo` to section components.
- Make the main `Landing` component render its layout dynamically through `PageRenderer`.

### 4. Catch-All Routing
- Add a catch-all route `src/app/(front-office)/[...slug]/page.tsx` to render any custom CMS page.
- Exclude collision with existing operational routes (`/loja`, `/assinatura`, `/faq`, `/carrinho`, `/checkout`, `/cliente`, `/casos`, `/api`, `/api-docs`).

### 5. Indexing & API Mocking
- Update `src/app/sitemap.ts` to index published pages.
- Simulate the new CMS endpoints within `src/app/api/[...rota]/route.ts` during local development.
