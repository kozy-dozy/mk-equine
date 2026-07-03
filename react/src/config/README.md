# Centralized Configuration Guide

This directory contains all centralized configuration files for the application. These configs make it easy to clone the app for a new business by updating values in one place.

## 📁 Config Files

### 1. `company.config.ts`

**Business identity and contact information**

Contains:

- Company name and tagline
- Contact info (email, phone)
- Physical address
- Business hours
- Social media links
- Domain URL
- SEO defaults
- Feature flags

**When to update:**

- Cloning for a new business
- Changing company contact details
- Adding/removing social media platforms
- Enabling/disabling feature sections

**Example:**

```typescript
export const COMPANY_CONFIG = {
    name: 'Your Business Name',
    tagline: 'Your catchy tagline',
    contact: {
        email: 'hello@yourbusiness.com',
        phone: '(555) 123-4567',
    },
    // ... more fields
}
```

### 2. `theme.tokens.ts`

**Visual design tokens and brand colors**

Contains:

- Primary brand color (Tailwind color name)
- Color levels (100-900)
- Default theme mode (light/dark)
- Hex color for meta tags
- Component-specific color tokens

**When to update:**

- Rebranding with new colors
- Changing default theme mode
- Customizing component appearances

**Example:**

```typescript
export const THEME_TOKENS = {
    primaryColor: 'blue', // Change from 'emerald' to your brand color
    primaryColorLevel: 600,
    themeColorHex: '#2563eb', // Must match primaryColor-primaryColorLevel
    // ... component tokens
}
```

**Important:** After changing `primaryColor`, update Tailwind safelist if needed.

### 3. `integrations.config.ts`

**External service API keys and URLs**

Contains:

- S3/CDN configuration
- Google services (Analytics, Maps, reCAPTCHA)
- Stripe payment keys
- Backend API URL

**When to update:**

- Setting up new environment
- Changing CDN/storage provider
- Updating payment processor
- Switching analytics providers

**Environment variables required:**

```bash
VITE_S3_IMAGE_URL=https://your-bucket.s3.amazonaws.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_RECAPTCHA_SITE_KEY=6Le...
VITE_GA_MEASUREMENT_ID=G-...
VITE_API_BASE=http://localhost:3000/api
```

**Helper functions:**

- `getLogoUrl()` - Returns full logo URL
- `getFaviconUrl()` - Returns full favicon URL
- `getAssetUrl(path)` - Builds full asset URL

### 4. `content.config.ts`

**Marketing copy and content structure**

Contains:

- Homepage hero content
- Footer navigation columns and links
- Announcement bar content

**When to update:**

- Changing homepage messaging
- Restructuring footer navigation
- Updating promotional messages
- Adding/removing content sections

**Example:**

```typescript
export const CONTENT_CONFIG = {
    home: {
        heroTitle: 'Your compelling headline',
        heroSubtitle: 'Supporting description',
        heroCtaPrimary: { text: 'Shop Now', href: '/shop' },
    },
    // ... footer and announcement
}
```

## 🔄 Migration from Old Structure

The old constants have been updated to import from these configs:

**Before:**

```typescript
// Multiple hardcoded values scattered across files
const logo = `${import.meta.env.VITE_S3_IMAGE_URL}/global/logo.png`
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
```

**After:**

```typescript
import { getLogoUrl } from '@/config/integrations.config'
import { INTEGRATIONS_CONFIG } from '@/config/integrations.config'

const logo = getLogoUrl()
const apiKey = INTEGRATIONS_CONFIG.google.mapsApiKey
```

### Backwards Compatibility

**`constants/brand.constant.ts`** still exists but now re-exports from `company.config.ts`:

```typescript
export const BRAND = COMPANY_CONFIG
```

This ensures existing code continues to work while we migrate to the new structure.

## 🚀 Cloning for a New Business

### Quick Start Checklist

1. **Update Company Config** (`company.config.ts`)
    - [ ] Change company name and tagline
    - [ ] Update contact email and phone
    - [ ] Update physical address
    - [ ] Update business hours
    - [ ] Update social media URLs (or disable)
    - [ ] Update domain URL
    - [ ] Update SEO defaults

2. **Update Theme Tokens** (`theme.tokens.ts`)
    - [ ] Choose primary brand color
    - [ ] Calculate matching hex value
    - [ ] Review component tokens

3. **Setup Integrations** (`integrations.config.ts`)
    - [ ] Upload logo to S3 at `/global/logo.png`
    - [ ] Upload favicon to S3 at `/global/favicon.ico`
    - [ ] Create `.env` with all required variables
    - [ ] Verify S3 bucket URL
    - [ ] Setup Stripe account
    - [ ] Create Google Maps API key
    - [ ] Setup Google Analytics
    - [ ] Setup reCAPTCHA

4. **Update Content** (`content.config.ts`)
    - [ ] Rewrite homepage hero content
    - [ ] Update footer navigation structure
    - [ ] Customize announcement bar message

5. **Update Other Files**
    - [ ] `react/index.html` - Update title and meta tags
    - [ ] `react/public/manifest.json` - Update app name
    - [ ] `react/public/robots.txt` - Update sitemap URL
    - [ ] Legal pages (Privacy, Terms) - Customize content

### Feature Flags

Toggle domain-specific features in `company.config.ts`:

```typescript
features: {
  enableHardinessZones: false,  // Disable plant-specific pages
  enableCareGuides: false,
  enablePlantFinder: false,
  enableCompare: true,
}
```

Then update routing logic to respect these flags.

## 📝 Best Practices

1. **Never hardcode business-specific values in components**
    - ❌ `<h1>MK Equine</h1>`
    - ✅ `<h1>{COMPANY_CONFIG.name}</h1>`

2. **Use helper functions for URLs**
    - ❌ `src={import.meta.env.VITE_S3_IMAGE_URL + '/global/logo.png'}`
    - ✅ `src={getLogoUrl()}`

3. **Document environment variables**
    - Create `.env.example` with all required variables
    - Add comments explaining what each variable does

4. **Keep configs TypeScript**
    - Type safety helps catch errors
    - Use `as const` for readonly configs

5. **Group related configs**
    - Don't mix business logic with config
    - Keep config files focused on data, not behavior

## 🐛 Troubleshooting

**Logo not loading?**

- Verify `VITE_S3_IMAGE_URL` in `.env`
- Check logo exists at `/global/logo.png` in your bucket
- Ensure bucket has public read permissions

**Colors not applying?**

- Check Tailwind safelist includes your color
- Run build to regenerate CSS
- Verify `themeColorHex` matches Tailwind color

**API calls failing?**

- Verify `VITE_API_BASE` points to correct backend
- Check CORS settings on backend
- Ensure backend is running

**Missing social icons?**

- Import correct react-icons in `company.config.ts`
- Verify icon package is installed

## 📚 Related Documentation

- See main project README for full setup instructions
- See `/docs/MIGRATION_EXAMPLES.md` for code examples
- See `/docs/BUSINESS_OVERVIEW.md` for business context
