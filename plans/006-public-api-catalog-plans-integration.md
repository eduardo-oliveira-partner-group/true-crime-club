# Plan 006: Public API Integration for Catalog and Plans

This plan migrates the front office Catalog + Plans slice to consume `tcc-front-office-api` as the public API contract while preserving local mocks as fallback until the API is published.

## Objective

Make the Next.js front office consume the public FastAPI contract for products and plans consistently.

The goal is not to remove the mock system. The goal is to stop treating local mocks as the only source of truth for this slice.

## Canonical Contract

For this slice, the canonical contract is the real behavior of `tcc-front-office-api`.

Update `docs/openapi.yaml` to reflect the current API behavior for:

- `GET /produtos`
- `GET /produtos/{identificador}`
- `GET /planos`
- `GET /planos/{identificador}`

Do not force the API to match outdated YAML if the existing front/API contract already works.

## Scope

Included:

- Product listing.
- Product detail.
- Subscription plans.
- Plan cards and plan selection entry points.
- Loading, empty, error and unavailable-product states for this slice.

Out of scope:

- Cart.
- Checkout.
- Customer area.
- Authentication.
- Payment flows.
- Back-office integration.

## Execution Steps

### 1. Update OpenAPI Documentation

- Update `docs/openapi.yaml` to match the verified FastAPI responses.
- Document product and plan list/detail endpoints.
- Include query parameters for product listing: `destaque` and `categoria`.
- Include not-found responses for product and plan detail.
- Keep the public field names in Portuguese.

### 2. Create an API-First Catalog/Plans Data Layer

- Add or adapt a front data-access layer for products and plans.
- Prefer `apiClient.products` and `apiClient.plans` when `NEXT_PUBLIC_API_BASE_URL` is configured.
- Fall back to existing local mock repositories when the API base URL is not configured or when explicitly running in local mock mode.
- Keep the returned objects in the existing front domain types so page components do not need to know whether data came from API or mocks.

### 3. Migrate Front Office Screens

Migrate the primary front-office surfaces for this slice:

- Store listing page.
- Product detail page.
- Subscription page.
- Landing plan cards.
- Any product/plan sections that are part of the current public journey.

Avoid migrating duplicated experimental routes unless they are still part of the active user-facing flow.

### 4. Reduce Direct Mock Repository Usage

- Replace direct calls to `listProducts`, `getProductBySlug`, `listPlans`, and `getPlanBySlug` in this slice with the new API-first data layer.
- Keep mock repository functions available for fallback and for routes that are outside this plan.
- Do not remove mock data in this plan.

### 5. Add UX States

Ensure affected screens handle:

- Loading state.
- Empty product or plan list.
- API error state.
- Product not found.
- Product unavailable or out of stock.

States should preserve the True Crime Club visual direction and should not block unaffected navigation.

### 6. Verify

Run:

```bash
pnpm typecheck
```

If the implementation changes page rendering, metadata generation, route behavior, or server/client boundaries, also run:

```bash
pnpm build
```

There is no dedicated frontend test suite configured at the time of this plan.

## Recommended Execution

Execute in two blocks:

1. **Contract and data layer:** steps 1 and 2.
2. **Screens, states and validation:** steps 3 through 6.

Reason: the first block creates a stable integration boundary. The second block can then update UI surfaces without mixing contract decisions with component work.

