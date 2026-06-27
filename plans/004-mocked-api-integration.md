# Plan 004: Implement Route Handlers (/api) and Unified API Client

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat f22d074..HEAD -- src/`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans/003-client-area-integration.md
- **Category**: direction
- **Planned at**: commit `f22d074`, 2026-06-27

## Why this matters

Currently, the application imports in-memory mock repositories directly in both Client and Server Components, bypassing network requests. This creates tight coupling between the UI and local module-level variables. 

By introducing Route Handlers under `/api` and a unified `apiClient` abstraction, we simulate a real REST API. When migrating to a real external backend later, developers will only need to update the base URL in the `apiClient` or modify request/response sanitization, leaving the front-end pages and components completely untouched.

All endpoint behaviors and payloads are documented in the OpenAPI specification [openapi.yaml](file:///Users/eduardo/pg/true-crime-club/docs/openapi.yaml).


## Current state

- The mock data logic is located under `src/lib/domain/repositories.ts` and `src/lib/domain/mock-data.ts`.
- Components and Pages import repository functions directly (e.g. `listProducts`, `getCart`, `getCurrentCustomer`) and run server actions that mutate the in-memory state.
- Authentication state is tracked solely on the client using `localStorage.getItem('isLoggedIn')`.

Conventions:
- All pages are in Portuguese.
- Components use `@/src/...` path mapping.
- Prettier and ESLint configurations are configured for strict formatting and type checking.

## Commands you will need

| Purpose   | Command          | Expected on success |
|-----------|------------------|---------------------|
| Install   | `pnpm install`   | exit 0              |
| Typecheck | `pnpm typecheck` | exit 0, no errors   |
| Build     | `pnpm build`     | exit 0, no errors   |
| Lint      | `pnpm lint`      | exit 0              |

## Scope

**In scope** (the only files you should modify or create):
- `src/lib/api-client.ts` [NEW]
- `src/app/api/auth/login/route.ts` [NEW]
- `src/app/api/auth/logout/route.ts` [NEW]
- `src/app/api/auth/me/route.ts` [NEW]
- `src/app/api/products/route.ts` [NEW]
- `src/app/api/products/[slug]/route.ts` [NEW]
- `src/app/api/plans/route.ts` [NEW]
- `src/app/api/plans/[slug]/route.ts` [NEW]
- `src/app/api/cart/route.ts` [NEW]
- `src/app/api/cart/[itemId]/route.ts` [NEW]
- `src/app/api/cart/coupon/route.ts` [NEW]
- `src/app/api/checkout/shipping/route.ts` [NEW]
- `src/app/api/checkout/order/route.ts` [NEW]
- `src/app/api/customer/profile/route.ts` [NEW]
- `src/app/api/customer/addresses/route.ts` [NEW]
- `src/app/api/customer/addresses/[id]/route.ts` [NEW]
- `src/app/api/customer/orders/route.ts` [NEW]
- `src/app/api/customer/orders/[id]/route.ts` [NEW]
- `src/app/api/customer/subscription/route.ts` [NEW]
- `src/app/api/exclusive-content/route.ts` [NEW]
- `src/app/api/exclusive-content/[slug]/route.ts` [NEW]
- `src/app/api/cases/route.ts` [NEW]
- `src/app/actions.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(front-office)/loja/page.tsx`
- `src/app/(front-office)/loja/[slug]/page.tsx`
- `src/app/(front-office)/carrinho/page.tsx`
- `src/app/(front-office)/checkout/page.tsx`
- `src/components/shop/product-detail-actions.tsx`
- `src/components/layout/client-shell.tsx`
- `src/components/layout/public-header-content.tsx`
- `src/app/(cliente)/cliente/perfil/page.tsx`
- `src/app/(cliente)/cliente/assinatura/page.tsx`
- `src/app/(cliente)/cliente/pedidos/page.tsx`
- `src/app/casos/page.tsx`

**Out of scope**:
- Database integration or setting up Docker.
- Changing CSS layouts, styles, or branding assets.

## Git workflow

- Branch: `advisor/004-mocked-api-integration`
- Commits matching Conventional Commits pattern (e.g. `feat(api): implement products route handlers`).

## Steps

### Step 1: Create the API Route Handlers under `src/app/api`

We will write route handlers that bridge the frontend requests to the in-memory repositories in `src/lib/domain/repositories.ts`.

#### Auth routes:
- `/api/auth/login` (POST): Checks request body. Sets a `tcc_session` cookie (value: `mock-session-id`) and returns customer info.
- `/api/auth/logout` (POST): Clears the `tcc_session` cookie.
- `/api/auth/me` (GET): Checks the `tcc_session` cookie. Returns `getCurrentCustomer()` if present, or 401 if absent.

#### Product and Plan routes:
- `/api/products` (GET): Resolves query parameters `featured` and `category`, calls `listProducts(options)`, returns list.
- `/api/products/[slug]` (GET): Calls `getProductBySlug(slug)`.
- `/api/plans` (GET): Calls `listPlans()`.
- `/api/plans/[slug]` (GET): Calls `getPlanBySlug(slug)`.

#### Cart and Checkout routes:
- `/api/cart` (GET): Returns `getCart()` and `getCartTotals()`.
- `/api/cart` (POST): Parses `{ productId, quantity }` and calls `addCartItem()`.
- `/api/cart/[itemId]` (PUT): Parses `{ quantity }` and calls `updateCartItemQuantity()`.
- `/api/cart/[itemId]` (DELETE): Calls `removeCartItem()`.
- `/api/cart/coupon` (POST): Parses `{ code }` and calls `applyCoupon()`.
- `/api/checkout/shipping` (POST): Parses `{ zipCode }` and calls `calculateShipping()`.
- `/api/checkout/order` (POST): Calls `createOrder()` and returns the new order.

#### Customer dashboard & exclusive content routes:
- `/api/customer/profile` (GET): Returns profile and preference data.
- `/api/customer/profile` (PUT): Parses updated preferences, calls `updateSubscriberPreferences()`.
- `/api/customer/addresses` (POST): Adds address.
- `/api/customer/addresses/[id]` (DELETE): Deletes address.
- `/api/customer/orders` (GET): Returns `listOrders()`.
- `/api/customer/orders/[id]` (GET): Returns `getOrderById(id)`.
- `/api/customer/subscription` (GET): Returns `getSubscription()`.
- `/api/customer/subscription` (POST): Parses `{ action: 'cancel' | 'reactivate' }` and calls appropriate function.
- `/api/exclusive-content` (GET): Returns `listExclusiveContent()`.
- `/api/exclusive-content/[slug]` (GET): Returns `getExclusiveContentBySlug(slug)`.
- `/api/cases` (GET): Returns active case, progress, and clues.

**Verify**: Create a temporary script `test-api.ts` or run a local curl to make sure the API routes compile and return JSON correctly.

---

### Step 2: Create the API Client `src/lib/api-client.ts`

Implement a class/object wrapper `apiClient` using native `fetch`. It will act as the single source of requests:

```typescript
// src/lib/api-client.ts
const BASE_URL = typeof window === 'undefined' 
  ? (process.env.INTERNAL_API_URL || 'http://localhost:3000/api') 
  : '/api';

export const apiClient = {
  auth: {
    login: (body: any) => fetcher('/auth/login', { method: 'POST', body }),
    logout: () => fetcher('/auth/logout', { method: 'POST' }),
    me: () => fetcher('/auth/me'),
  },
  products: {
    list: (params?: any) => fetcher(`/products?${new URLSearchParams(params)}`),
    getBySlug: (slug: string) => fetcher(`/products/${slug}`),
  },
  // ... implement all resources mirroring the route structure
}
```
*Note*: `fetcher` is a lightweight helper that sets headers (`Content-Type: application/json`), automatically handles credentials/cookies, and throws formatted errors if response `!res.ok`.

**Verify**: `pnpm typecheck` compiles `src/lib/api-client.ts` without errors.

---

### Step 3: Connect authentication and layouts

Update components and pages that check the authentication status:
- Update `src/components/layout/public-header-content.tsx` and `src/components/layout/client-shell.tsx` to verify session status using `apiClient.auth.me()` instead of checking `localStorage` directly (keeping `localStorage` as a fallback or cache if needed).
- Update `src/app/(auth)/login/page.tsx`:
  - Upon submit, perform `await apiClient.auth.login({ email, password })`.
  - Set cookie and update state, then call `router.push('/cliente/pedidos')`.
- Update `src/app/casos/page.tsx` to redirect or block access based on `apiClient.auth.me()` status.

**Verify**: Launch `pnpm dev`, perform a login, and check if the `tcc_session` cookie is successfully created and dynamic navigation shows user details.

---

### Step 4: Connect Carrinho and Loja Catalog

- Update `src/app/(front-office)/loja/page.tsx` and `src/app/(front-office)/loja/[slug]/page.tsx` to fetch products using `apiClient.products.list()` and `apiClient.products.getBySlug()`.
- Update `src/components/shop/product-detail-actions.tsx`:
  - Call API route when adding to cart.
- Update `src/app/actions.ts`:
  - Rewrite server actions (`handleAddToCart`, etc.) to trigger API requests to `/api/cart` rather than mutating state directly via repositories.
- Update `src/app/(front-office)/carrinho/page.tsx`:
  - Replace server actions and direct repository imports with `apiClient` fetches and mutations. Let the page revalidate cache or reload state correctly.

**Verify**: Go to `/loja`, add products, verify cart updates, change quantities, and verify calculations.

---

### Step 5: Connect Checkout Flow

- Update `src/app/(front-office)/checkout/page.tsx` and `src/components/checkout/checkout-stepper.tsx`:
  - Fetch addresses, payment methods, and totals from `/api/customer/profile` and `/api/cart`.
  - Calculate shipping by hitting `/api/checkout/shipping`.
  - On complete, trigger `/api/checkout/order` to create the order.
  - Redirect on success to the confirmation page.

**Verify**: Complete checkout flow, check if the cart is cleared, and ensure the order was successfully added to orders array on the mock API.

---

### Step 6: Connect Cliente Dashboard pages

- Update `src/app/(cliente)/cliente/perfil/page.tsx`:
  - Fetch profile/addresses from `/api/customer/profile`.
  - Save details via `PUT /api/customer/profile`.
  - Save address via `POST /api/customer/addresses`.
  - Delete address via `DELETE /api/customer/addresses/[id]`.
- Update `src/app/(cliente)/cliente/assinatura/page.tsx`:
  - Fetch subscription from `/api/customer/subscription`.
- Update `src/app/(cliente)/cliente/pedidos/page.tsx`:
  - Fetch orders from `/api/customer/orders`.

**Verify**: Check all client panel tabs, edit preferences, add/delete addresses, and confirm updates persist in the mocked API memory.

---

## Test plan

### Manual Verification
1. Run `pnpm dev`.
2. Visit `/loja`, check if product catalog loads via API (check browser network tab).
3. Click on a product, add it to the cart. Verify `/api/cart` requests.
4. Go to `/carrinho`, type a valid coupon (e.g. `DETETIVE10` or others from `mock-data.ts`). Check calculation updates.
5. Log in via `/login`. Inspect request/cookies.
6. Go to `/checkout`, complete address and preferences, click confirm.
7. Go to `/cliente/pedidos`, verify the newly created order is listed.
8. Go to `/cliente/perfil`, change T-shirt/shoe preferences and save. Refresh page, check if updates persist.

---

## Done criteria

- [ ] `pnpm typecheck` exits 0.
- [ ] `pnpm build` exits 0.
- [ ] All pages/components in the dynamic path list do NOT import functions from `src/lib/domain/repositories.ts` directly.
- [ ] Network tab shows `/api/...` calls during auth, cart operations, checkout, and client dashboard view.
- [ ] `plans/README.md` status updated.

## STOP conditions

- If Next.js Route Handlers trigger middleware errors, stop and resolve middleware configuration before modifying pages.
- If Next.js Server Components fail to execute local fetch requests due to missing host headers, use the custom `BASE_URL` builder in `api-client.ts`.

## Maintenance notes

- When swapping to the real external API, modify `BASE_URL` in `src/lib/api-client.ts` to point to the external API endpoint and update request headers if custom headers (like `Authorization: Bearer token`) are required.
