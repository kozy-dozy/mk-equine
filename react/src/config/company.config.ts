import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export const COMPANY_CONFIG = {
    name: 'MK Equine',
    tagline: 'Horseback riding lessons that build confidence and horsemanship.',

    contact: {
        email: 'hello@mkequine.com',
        phone: '',
    },

    social: [
        {
            key: 'instagram',
            icon: FaInstagram,
            label: 'Instagram',
            url: 'https://instagram.com/mkequine',
        },
        {
            key: 'facebook',
            icon: FaFacebook,
            label: 'Facebook',
            url: 'https://facebook.com/mkequine',
        },
        {
            key: 'twitter',
            icon: FaTwitter,
            label: 'Twitter',
            url: 'https://twitter.com/mkequine',
        },
    ],

    domain: 'https://mkequine.com',

    seo: {
        defaultTitle: 'MK Equine | Horseback Riding Lessons',
        defaultDescription:
            'Private and work-for-lessons horseback riding instruction for all ages and experience levels—horse safety, horsemanship, and confidence in the saddle.',
        ogImage: '/images/og-default.png',
    },
} as const
