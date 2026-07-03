import { Router } from 'express'

import asyncHandler from '../../utils/asyncHandler'

const router = Router()

router.get(
    '/sitemap.xml',
    asyncHandler(async (_req, res) => {
        const baseUrl = process.env.FRONTEND_BASE_URL || 'https://example.com'

        const staticPages = [
            '',
            '/about',
            '/contact',
            '/faq',
            '/terms',
            '/privacy',
        ]

        const urls: string[] = []

        for (const p of staticPages) {
            urls.push(`
            <url>
                <loc>${baseUrl}${p}</loc>
                <changefreq>weekly</changefreq>
                <priority>${p === '' ? '1.0' : '0.8'}</priority>
            </url>
        `)
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

        res.header('Content-Type', 'application/xml')
        res.send(xml)
    }),
)

export default router
