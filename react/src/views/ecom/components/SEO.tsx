import { useHead } from '@unhead/react'
import { useLocation } from 'react-router-dom'

import { COMPANY_CONFIG } from '@/config/company.config'

const SITE_URL = COMPANY_CONFIG.domain

type SEOProps = {
    title: string
    description?: string
    image?: string
    canonicalPath?: string
    noindex?: boolean
}

export default function SEO({
    title,
    description,
    image,
    canonicalPath,
    noindex,
}: SEOProps) {
    const location = useLocation()

    const canonicalUrl = (() => {
        if (!SITE_URL) return undefined
        const path = canonicalPath ?? location.pathname
        return `${String(SITE_URL).replace(/\/$/, '')}${path}`
    })()

    const isProd = import.meta.env.MODE === 'production'
    const shouldNoindex = noindex ?? !isProd

    useHead({
        title,
        meta: [
            description && { name: 'description', content: description },

            {
                name: 'robots',
                content: shouldNoindex ? 'noindex,nofollow' : 'index,follow',
            },

            // Open Graph
            canonicalUrl && { property: 'og:url', content: canonicalUrl },
            { property: 'og:title', content: title },
            description && { property: 'og:description', content: description },
            { property: 'og:type', content: 'website' },
            image && { property: 'og:image', content: image },

            // Twitter
            {
                name: 'twitter:card',
                content: image ? 'summary_large_image' : 'summary',
            },
            { name: 'twitter:title', content: title },
            description && {
                name: 'twitter:description',
                content: description,
            },
            image && { name: 'twitter:image', content: image },
        ].filter(Boolean) as any,
        link: canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : [],
    })

    return null
}
