/**
 * Centralized image manifest for the marketing site.
 *
 * Every photo used across the public pages is referenced from here, so
 * swapping in real photography later is a single-file change. Replace the
 * URLs below with your own asset URLs (S3, /public, a CDN, etc.) and the
 * whole site updates.
 *
 * Current values are verified-loading Unsplash placeholders.
 */

const unsplash = (id: string, w = 1600, h?: number) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}` +
    (h ? `&h=${h}` : '')

export const SITE_IMAGES = {
    // Hero — large full-bleed background
    hero: unsplash('1553284965-83fd3e82fa5a', 2400),

    // Lesson option cards
    lessons: {
        privateLessons: unsplash('1534773728080-33d31da27ae5', 900),
        workForLessons: unsplash('1503416997304-7f8bf166c121', 900),
        barrelRacing: unsplash('1568605117036-5fe5e7bab0b7', 900),
        poleBending: unsplash('1598974357801-cbca100e65d3', 900),
    },

    // About the instructor
    about: {
        portrait: unsplash('1485827404703-89b55fcc595e', 1000, 1200),
        secondary: unsplash('1450052590821-8bf91254a353', 900),
    },

    // Gallery preview grid (home page — first 6)
    gallery: [
        unsplash('1511994298241-608e28f14fde', 900),
        unsplash('1500595046743-cd271d694d30', 900),
        unsplash('1469041797191-50ace28483c3', 900),
        unsplash('1452857297128-d9c29adba80b', 900),
        unsplash('1543466835-00a7907e9de1', 900),
        unsplash('1504208434309-cb69f4fe52b0', 900),
    ],

    // Full gallery grid (Photo Gallery page)
    galleryFull: [
        unsplash('1511994298241-608e28f14fde', 900),
        unsplash('1500595046743-cd271d694d30', 900),
        unsplash('1469041797191-50ace28483c3', 900),
        unsplash('1452857297128-d9c29adba80b', 900),
        unsplash('1543466835-00a7907e9de1', 900),
        unsplash('1504208434309-cb69f4fe52b0', 900),
        unsplash('1438283173091-5dbf5c5a3206', 900),
        unsplash('1599839619722-39751411ea63', 900),
        unsplash('1591824438708-ce405f36ba3d', 900),
        unsplash('1502673530728-f79b4cab31b1', 900),
        unsplash('1469854523086-cc02fe5d8800', 900),
        unsplash('1486365227551-f3f90034a57c', 900),
    ],

    // Testimonial author avatars
    testimonials: {
        avatarA: unsplash('1546182990-dffeafbe841d', 200, 200),
        avatarB: unsplash('1571752726703-5e7d1f6a986d', 200, 200),
        avatarC: unsplash('1534083220759-4c3c00112ea0', 200, 200),
    },

    // Contact CTA background
    contactCta: unsplash('1416879595882-3373a0480b5b', 2400),

    // Training & Sales page
    training: {
        hero: unsplash('1568605117036-5fe5e7bab0b7', 2400),
        approach: unsplash('1450052590821-8bf91254a353', 1000),
    },

    // Horses-for-sale listing photos
    horsesForSale: [
        unsplash('1534773728080-33d31da27ae5', 900),
        unsplash('1591382386627-349b692688ff', 900),
        unsplash('1559666126-84f389727b9a', 900),
        unsplash('1486365227551-f3f90034a57c', 900),
    ],
} as const
