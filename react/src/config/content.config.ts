export const CONTENT_CONFIG = {
    // Homepage hero (consumed by marketing/sections/Hero.tsx)
    home: {
        heroTitle: 'Confidence Starts In The Saddle',
        heroSubtitle:
            'Horseback riding lessons for every age and experience level—from meeting a horse for the very first time to sharpening your skills with barrel racing and pole bending.',
        heroCtaSecondary: { text: 'Get In Touch', href: '/contact' },
    },

    // Footer columns
    footer: {
        columns: [
            {
                title: 'Explore',
                links: [
                    { label: 'Lessons', href: '/lessons' },
                    { label: 'Training & Sales', href: '/horses' },
                    { label: 'Photo Gallery', href: '/gallery' },
                    { label: 'About', href: '/about' },
                ],
            },
            {
                title: 'Support',
                links: [
                    { label: 'FAQ', href: '/faq' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Book a Lesson', href: '/contact' },
                ],
            },
            {
                title: 'Legal',
                links: [
                    { label: 'Privacy', href: '/privacy' },
                    { label: 'Terms', href: '/terms' },
                ],
            },
        ],
    },

    // Announcement bar
    announcement: {
        enabled: false,
        badge: 'Limited Spots',
        message: 'Work for Lessons spots are limited — reach out today →',
    },
} as const
