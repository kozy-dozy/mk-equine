# CLAUDE.md — Varsity-Spotlight Architecture Guide

This file is for Claude Code. Read it at the start of every session. It defines the architecture, conventions, and rules for this monorepo and any app derived from it.

---

## What This Project Is

`varsity-spotlight` is a production-ready, reusable full-stack monorepo template. It's used in two ways:

1. **As a starting point** — clone it and customize for a new app
2. **As a migration target** — convert existing apps (e.g., Next.js) to follow this architecture

The example business baked into this repo is **MK Equine** (plant/landscaping e-commerce). That's just a reference implementation — configs and content are swappable.

---

## Monorepo Structure

```
varsity-spotlight/
├── express/        # Express.js backend API
├── react/          # React frontend (Vite)
├── shared/         # Shared TypeScript DTOs (no framework code)
├── docs/           # Reference documentation
├── CLAUDE.md       # This file
└── package.json    # Yarn workspaces root
```

**Package manager:** Yarn workspaces. Always use `yarn`, never `npm`.

**Workspace names:**

- Backend: `varsity-spotlight-express`
- Frontend: `varsity-spotlight-react`

**Run commands:**

```bash
yarn workspace varsity-spotlight-express dev    # Backend (port 3000)
yarn workspace varsity-spotlight-react dev      # Frontend (port 5173)
yarn lint                              # Lint both workspaces
```

---

## Backend Architecture (`express/`)

### Entry Point

`express/src/index.ts` — Sets up middleware stack in order, then registers all module routes.

**Middleware order matters:**

1. Stripe webhook (raw JSON, must be before JSON parser)
2. JSON parser (1MB limit)
3. Cookie parser
4. Helmet (security headers)
5. Trust proxy
6. CORS
7. Rate limiter
8. Express session (MongoDB store)
9. Rate limit monitor
10. Sentry error handler

### Module Pattern

Every feature is a self-contained module in `express/src/modules/[feature]/`:

```
modules/auth/
├── index.ts             # Barrel export
├── auth.route.ts        # Express Router — only routing, no logic
├── auth.controller.ts   # Business logic and request handlers
└── auth.model.ts        # Mongoose schema (if this module owns data)
```

**Rules:**

- Routes only route — no business logic in `route.ts`
- Controllers call services for external APIs (email, Stripe, Maps)
- Always wrap async controllers with `asyncHandler()`
- Validate request bodies with Joi via `validators.ts`

### Auth Pattern

- JWT tokens stored in httpOnly cookies
- `requireAuth` middleware — verifies JWT, attaches `req.userId`
- `requireAdmin` middleware — checks admin role, use after `requireAuth`
- Passwords hashed with bcryptjs

### Config Files

`express/src/config/` — Change these to customize for a new business:

- `company.config.ts` — Name, address, hours, contact, social links
- `stripe.config.ts` — Tax rate, delivery fee, order number prefix
- `email.config.ts` — MailerSend configuration

### Environment Variables (never commit)

`express/.env` needs: `MONGODB_URI`, `SESSION_SECRET`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `SENTRY_DSN`, `MAILERSEND_API_TOKEN`, `RECAPTCHA_SECRET_KEY`, `GOOGLE_MAPS_API_KEY`, `NODE_ENV`, `PORT`, `FRONTEND_ORIGIN`

---

## Frontend Architecture (`react/`)

### Entry Points

- `react/src/main.tsx` — Initializes Google Analytics, wraps app in providers
- `react/src/App.tsx` — Route definitions using 3-layout system
- `react/src/providers/RootProviders.tsx` — Redux, Stripe, Unhead, theme

### 3-Layout System

Every route belongs to one layout:

- **EcomLayout** — Public-facing store pages
- **AuthLayout** — Sign in, sign up, password reset
- **AdminLayout** — Admin dashboard (requires admin role)

Route guards:

- `ProtectedRoute` — Requires authentication, redirects to sign-in
- `PublicRoute` — Redirects already-authenticated users away (e.g., sign-in)
- `AuthorityGuard` — Role-based: accepts array of allowed roles

### State Management (Redux Toolkit)

Slices live in `react/src/store/slices/`, organized by domain:

| Domain | Slices                                                                                                     |
| ------ | ---------------------------------------------------------------------------------------------------------- |
| auth   | `userSlice`, `sessionSlice`                                                                                |
| base   | `themeSlice`, `localeSlice`, `baseSlice`                                                                   |
| ecom   | `cartSlice`, `checkoutFulfillmentSlice`, `memberSlice`, `ordersSlice`, `compareSlice`, `featureFlagsSlice` |
| admin  | `productsSlice`, `productEditSlice`, `membersSlice`, `orderListSlice`, `dashboardSlice`                    |

**Rules:**

- Components use `useAppSelector` and `useAppDispatch` (never bare `useSelector`/`useDispatch`)
- API calls live in service files, not inside components or slices
- Async logic uses Redux Toolkit's `createAsyncThunk`

### Service Layer

`react/src/services/[Feature]Service.ts` — all API calls for a domain. Uses `ApiService.ts` as the base HTTP client.

```
services/
├── ApiService.ts         # Base axios/fetch wrapper
├── AuthService.ts
├── CartService.ts
├── CheckoutService.ts
├── OrderService.ts
└── ...
```

**Rule:** Never call `fetch` or `axios` directly in a component. Always go through a service.

### Config Files (customize for new app)

`react/src/config/`:

- `company.config.ts` — Brand name, social links, SEO defaults
- `integrations.config.ts` — API keys, S3 URL, Stripe public key, Google keys
- `theme.tokens.ts` — Brand colors and design tokens
- `content.config.ts` — Marketing copy, footer links

### Styling

**This varsity-spotlight uses TailwindCSS 4.** For new apps using **styled-components** instead:

1. Remove `react/tailwind.config.cjs` and `react/postcss.config.cjs`
2. Remove tailwind deps from `react/package.json`
3. Install `styled-components` and `@types/styled-components`
4. Create `react/src/styles/theme.ts` with design tokens matching `theme.tokens.ts`
5. Create `react/src/styles/GlobalStyle.ts` for CSS resets and base styles
6. Use a `ThemeProvider` from styled-components in `RootProviders.tsx`
7. See `/Users/jacob/Desktop/portfolio/sports/` for a working styled-components + registry SSR pattern (though that's Next.js — adapt the non-SSR parts)

---

## Shared DTOs (`shared/`)

TypeScript interfaces shared between frontend and backend. The single source of truth for API contracts.

```
shared/dtos/
├── index.ts            # Re-exports everything
├── ProductDto.ts
├── OrderDto.ts
├── MemberDto.ts
├── AddressDto.ts
└── FeatureFlagsDto.ts
```

**Rules:**

- Add a DTO when a new resource crosses the API boundary
- DTOs are plain TypeScript interfaces — no framework imports
- Backend models (Mongoose) and frontend types both derive from DTOs, not the other way around
- Import via `@shared/dtos` in both workspaces (path alias configured in both tsconfigs)

---

## Naming Conventions

| Thing            | Convention                    | Example                 |
| ---------------- | ----------------------------- | ----------------------- |
| React components | PascalCase                    | `ProductCard.tsx`       |
| Hooks            | camelCase with `use` prefix   | `useAuth.ts`            |
| Services         | PascalCase + `Service` suffix | `CartService.ts`        |
| Redux slices     | camelCase + `Slice` suffix    | `cartSlice.ts`          |
| Express modules  | kebab-case folder             | `modules/site-content/` |
| Route files      | `[feature].route.ts`          | `auth.route.ts`         |
| Controller files | `[feature].controller.ts`     | `auth.controller.ts`    |
| Model files      | `[feature].model.ts`          | `auth.model.ts`         |
| DTOs             | PascalCase + `Dto` suffix     | `MemberDto.ts`          |
| Constants        | camelCase + `.constant.ts`    | `roles.constant.ts`     |

---

## TypeScript Rules

- Strict mode is on — no `any` unless absolutely necessary and commented
- All async route handlers must be wrapped in `asyncHandler()`
- Express type augmentations live in `express/src/types/express.d.ts`
- Session types live in `express/src/types/session.d.ts`
- Frontend global types live in `react/src/@types/`
- Path aliases: `@/` → `react/src/`, `@shared/` → `shared/`

---

## Security Checklist

Never skip these when building a new module:

- [ ] Rate limit auth endpoints (5 req/15min in prod)
- [ ] Validate all request bodies with Joi before touching the DB
- [ ] Use `requireAuth` on all user-specific endpoints
- [ ] Use `requireAdmin` on all admin endpoints
- [ ] Verify reCAPTCHA on signup and login (production)
- [ ] Never log sensitive fields (passwords, tokens, card numbers)
- [ ] Use `asyncHandler()` to prevent unhandled promise rejections from crashing the server

---

## Starting a New App from This Varsity-Spotlight

1. Copy `varsity-spotlight/` to a new directory
2. Update `package.json` workspace names in all three `package.json` files
3. Update `express/src/config/company.config.ts` with new business info
4. Update `express/src/config/stripe.config.ts` with new tax/fee/prefix
5. Update `react/src/config/company.config.ts`, `theme.tokens.ts`, `content.config.ts`
6. Update `react/src/config/integrations.config.ts` with new API keys
7. Create fresh `.env` files (never copy .env from another project)
8. If replacing Tailwind with styled-components, follow the swap steps in the Styling section above
9. Remove or repurpose business-specific modules (e.g., `delivery/` if no delivery logic needed)
10. Update `shared/dtos/` to reflect the new domain's data shapes

---

## Migrating a Next.js App to This Architecture

**Reference app:** `/Users/jacob/Desktop/portfolio/sports/` (Next.js 15, App Router, styled-components, NextAuth, MongoDB)

### Key differences to resolve:

| Sports App (Next.js)          | Varsity-Spotlight Target                                        |
| ----------------------------- | ------------------------------------------------------ |
| Next.js API routes            | Express modules in `express/src/modules/`              |
| NextAuth sessions             | JWT in httpOnly cookies via `express/src/utils/jwt.ts` |
| `getServerSession()`          | `requireAuth` middleware on Express routes             |
| Redux in client only          | Redux in `react/src/store/` (same pattern, just moved) |
| Mongoose in API routes        | Mongoose in Express controllers/models                 |
| Styled-components (already ✓) | Styled-components (keep, adapt to ThemeProvider)       |
| `shared/dtos/` (already ✓)    | Move to monorepo root `shared/dtos/`                   |
| Next.js font optimization     | Standard web fonts or Vite font loading                |
| `/api/upload` presigned URL   | `express/src/modules/s3/` (already exists in varsity-spotlight) |

### Migration steps (high level):

1. Create new monorepo from varsity-spotlight, swap business config
2. Move Next.js API route logic into Express controllers, one module at a time
3. Replace NextAuth with JWT + bcrypt (varsity-spotlight's auth module is already built)
4. Move pages from `src/app/` into `react/src/views/` with React Router equivalents
5. Move Redux slices from `src/state/slices/` into `react/src/store/slices/`
6. Move services from `src/services/` into `react/src/services/`
7. Move DTOs from `shared/dtos/` to monorepo root `shared/dtos/`
8. Adapt styled-components: add `ThemeProvider`, move CSS variables to theme tokens

---

## What NOT to Do

- **Don't put business logic in route files** — routes only call controllers
- **Don't call APIs directly in React components** — use service files
- **Don't add a new dependency without checking if the existing stack already covers it**
- **Don't skip Joi validation** on any POST/PUT/PATCH endpoint
- **Don't use `npm`** — this repo uses Yarn workspaces
- **Don't commit `.env` files**
- **Don't add Tailwind** to apps using styled-components (pick one)
- **Don't create a new DTO file for every tiny response** — reuse and extend existing DTOs

---

## Reference Docs

- Full folder structure: `docs/PROJECT_STRUCTURE.md`
- Stripe integration: `docs/STRIPE_INTEGRATION.md`
- Security patterns: `docs/SECURITY.md`
- Migration examples: `docs/MIGRATION_EXAMPLES.md`
- App features list: `docs/APP_FEATURES.md`
