# Express Backend Configuration

This directory contains centralized configuration for the Express backend, mirroring the React frontend's config structure.

## Files

### `company.config.ts`

**Purpose:** Single source of truth for business identity and metadata

**Contents:**

- Company name and tagline
- Contact information (email, phone)
- Address (street, city, state, ZIP, country)
- Store location (coordinates for maps)
- Delivery radius in miles
- Business hours

**Used by:**

- `delivery.controller.ts` - Store info endpoints
- `checkout.controller.ts` - Order confirmation emails
- `orders.controller.ts` - Order metadata
- Email templates - Company branding

**To clone for a new business:**

1. Update all fields in `company.config.ts`
2. Ensure store location coordinates are correct
3. Update delivery radius
4. All dependent files will automatically use the new values

### `stripe.config.ts`

**Purpose:** Payment and Stripe-related configuration

**Contents:**

- Tax rate (as decimal: 0.07 = 7%)
- Delivery fee (in dollars)
- Order number prefix (KD = Keller Dirt, change as needed)
- Helper function: `generateOrderNumber()`

**Used by:**

- `checkout.controller.ts` - Order total calculation, order number generation
- `orders.controller.ts` - Order processing

**Why centralize:**

- Change tax rate in one place and affects all orders
- Delivery fee easily adjustable for promotions
- Order prefix consistent across the app

**To update:**

```typescript
// Change tax rate from 7% to 8%
taxRate: 0.08

// Change delivery fee from $24.99 to $19.99
deliveryFee: 19.99
```

### `email.config.ts`

**Purpose:** Email service configuration and template identifiers

**Contents:**

- From email and sender name
- Email template IDs (for SendGrid, Mailgun, etc.)
- Default subject line fallback

**Used by:**

- `services/mailer.ts` - Email sending
- Order confirmation workflow
- User auth workflow

**To update email templates:**

1. Update template IDs to match your email provider
2. Templates referenced here should be pre-configured in your email service
3. Email template content is managed in your email provider's dashboard

## Best Practices

### 1. Keep configs immutable

Use `as const` to ensure config values cannot be accidentally modified at runtime.

```typescript
// Good
export const COMPANY_CONFIG = { ... } as const

// Avoid
export const COMPANY_CONFIG = { ... }
COMPANY_CONFIG.name = 'New Name' // TypeScript error ✓
```

### 2. Export types

Always export the config type for type-checking in other files.

```typescript
export type CompanyConfig = typeof COMPANY_CONFIG
```

### 3. Add helper functions

For complex config logic, add helper functions to the config file.

```typescript
// In stripe.config.ts
export function generateOrderNumber(): string { ... }
```

### 4. Single responsibility

Each config file handles one domain (company info, payments, emails).

### 5. Add JSDoc comments

Document why settings exist and where they're used.

## Migration from old constants

### From `constants/brand.ts` to `config/company.config.ts`

```typescript
// Old
import { BRAND } from '../../constants/brand'
const name = BRAND.name

// New
import { COMPANY_CONFIG } from '../../config/company.config'
const name = COMPANY_CONFIG.name
```

### Files updated:

- ✅ `modules/delivery/delivery.controller.ts`
- ✅ `modules/checkout/checkout.controller.ts`
- ✅ `modules/orders/orders.controller.ts`

## Environment Variables

Configs use **hardcoded values** intentionally. For secrets, use environment variables in `env.ts`:

```typescript
// env.ts - use for secrets
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''

// config/stripe.config.ts - use for business logic
export const STRIPE_CONFIG = {
    taxRate: 0.07, // Business logic (not secret)
    // ...
}
```

## Testing

When adding new config values:

1. **Type check:** Ensure TypeScript validates the config shape
2. **Usage check:** Search for all imports and verify they work
3. **Integration test:** Test in the actual workflow (e.g., place order, send email)

## Checklist for cloning to new business

- [ ] Update `company.config.ts` with new business details
- [ ] Verify store location coordinates in Google Maps
- [ ] Update delivery radius based on service area
- [ ] Update business hours format
- [ ] Verify all dependent files load correctly
- [ ] Run integration tests (place order, send emails)
- [ ] Update email templates in your email provider if needed
- [ ] Update order number prefix if desired
- [ ] Update tax rate if different state/jurisdiction
- [ ] Test delivery fee calculations
