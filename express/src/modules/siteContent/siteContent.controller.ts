// controllers/siteContent.ts
import { Request, Response } from 'express'
import SiteContent from './siteContent.model'

function ensure4Categories(home: any) {
    const cats = Array.isArray(home?.categories) ? home.categories : []
    const normalized = cats.slice(0, 4).map((c: any) => ({
        imageUrl: String(c?.imageUrl ?? ''),
        label: String(c?.label ?? ''),
        href: String(c?.href ?? ''),
    }))

    while (normalized.length < 4) {
        normalized.push({ imageUrl: '', label: '', href: '' })
    }

    home.categories = normalized
}

async function getOrCreateSingleton() {
    let doc = await SiteContent.findOne()
    if (!doc) doc = await SiteContent.create({}) // defaults fill home/categories

    if (!doc.home) (doc as any).home = { heroImageUrl: '', categories: [] }

    ensure4Categories(doc.home)
    await doc.save()

    return doc
}

/** PUBLIC: GET /site-content/home */
export async function getHomeContentPublic(_req: Request, res: Response) {
    const doc = await getOrCreateSingleton()
    res.json({
        home: {
            heroImageUrl: doc.home.heroImageUrl ?? '',
            categories: doc.home.categories ?? [],
        },
    })
}

/** ADMIN: GET /site-content/admin */
export async function getSiteContentAdmin(_req: Request, res: Response) {
    const doc = await getOrCreateSingleton()
    res.json({ home: doc.home })
}

/** ADMIN: PUT /site-content/admin/home-hero */
export async function updateHomeHero(req: Request, res: Response) {
    const doc = await getOrCreateSingleton()
    const heroImageUrl = String(req.body?.heroImageUrl ?? '').trim()

    doc.home.heroImageUrl = heroImageUrl
    await doc.save()

    res.json({ heroImageUrl: doc.home.heroImageUrl })
}

/** ADMIN: PUT /site-content/admin/home-categories */
export async function updateHomeCategories(req: Request, res: Response) {
    const doc = await getOrCreateSingleton()

    const incoming = Array.isArray(req.body?.categories)
        ? req.body.categories
        : []
    doc.home.categories = incoming.slice(0, 4).map((c: any) => ({
        imageUrl: String(c?.imageUrl ?? '').trim(),
        label: String(c?.label ?? '').trim(),
        href: String(c?.href ?? '').trim(),
    }))

    ensure4Categories(doc.home)
    await doc.save()

    res.json({ categories: doc.home.categories })
}
