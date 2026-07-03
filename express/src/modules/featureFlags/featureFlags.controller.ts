import { Request, Response } from 'express'
import FeatureFlags from './featureFlags.model'

import type { FeatureFlagsDto } from '@shared/dtos'

function toDto(doc: any): FeatureFlagsDto {
    return {
        compareEnabled: Boolean(doc?.compareEnabled ?? true),
        darkModeEnabled: Boolean(doc?.darkModeEnabled ?? true),
        cartEnabled: Boolean(doc?.cartEnabled ?? false),
        updatedAt: doc?.updatedAt?.toISOString?.() ?? undefined,
    }
}

async function getOrCreateGlobal() {
    const existing = await FeatureFlags.findOne({ key: 'global' })
    if (existing) return existing
    return FeatureFlags.create({ key: 'global' })
}

// PUBLIC: GET /feature-flags
export async function getPublicFeatureFlags(_req: Request, res: Response) {
    const doc = await getOrCreateGlobal()
    return res.json(toDto(doc))
}

// ADMIN: GET /admin/feature-flags
export async function getAdminFeatureFlags(_req: Request, res: Response) {
    const doc = await getOrCreateGlobal()
    return res.json(toDto(doc))
}

// ADMIN: PATCH /admin/feature-flags
export async function patchAdminFeatureFlags(req: Request, res: Response) {
    const payload = req.body ?? {}

    const allowed: (keyof FeatureFlagsDto)[] = ['compareEnabled', 'darkModeEnabled', 'cartEnabled']

    const update: any = {}
    for (const k of allowed) {
        if (typeof payload[k] === 'boolean') update[k] = payload[k]
    }

    const updated = await FeatureFlags.findOneAndUpdate(
        { key: 'global' },
        { $set: update },
        { upsert: true, new: true },
    )

    return res.json(toDto(updated))
}
