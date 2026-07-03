import { Request, Response } from 'express'

import { Horse } from './horses.model'

function toDto(h: any) {
    return {
        id: String(h._id),
        name: h.name ?? '',
        breed: h.breed ?? '',
        age: Number(h.age ?? 0),
        sex: h.sex ?? '',
        discipline: h.discipline ?? '',
        price: Number(h.price ?? 0),
        status: h.status ?? 'available',
        description: h.description ?? '',
        imageUrl: h.imageUrl ?? '',
        sortOrder: Number(h.sortOrder ?? 0),
        createdAt: h.createdAt,
        updatedAt: h.updatedAt,
    }
}

const EDITABLE_FIELDS = [
    'name',
    'breed',
    'age',
    'sex',
    'discipline',
    'price',
    'status',
    'description',
    'imageUrl',
    'sortOrder',
] as const

function pickFields(body: any) {
    const out: Record<string, unknown> = {}
    for (const f of EDITABLE_FIELDS) {
        if (body[f] !== undefined) out[f] = body[f]
    }
    return out
}

// GET /api/horses  — public: only listings that are available or pending
export async function listPublicHorses(_req: Request, res: Response) {
    const horses = await Horse.find({ status: { $in: ['available', 'pending'] } })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean()
    res.json({ horses: horses.map(toDto) })
}

// GET /api/horses/admin — admin: all listings
export async function listAdminHorses(_req: Request, res: Response) {
    const horses = await Horse.find({})
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean()
    res.json({ horses: horses.map(toDto) })
}

// POST /api/horses — admin: create
export async function createHorse(req: Request, res: Response) {
    const data = pickFields(req.body)
    if (!data.name || String(data.name).trim() === '') {
        res.status(400).json({ error: 'Name is required' })
        return
    }
    const created = await Horse.create(data)
    res.status(201).json({ horse: toDto(created) })
}

// PATCH /api/horses/:id — admin: update
export async function updateHorse(req: Request, res: Response) {
    const data = pickFields(req.body)
    const updated = await Horse.findByIdAndUpdate(req.params.id, data, {
        new: true,
    }).lean()
    if (!updated) {
        res.status(404).json({ error: 'Horse not found' })
        return
    }
    res.json({ horse: toDto(updated) })
}

// DELETE /api/horses/:id — admin: delete
export async function deleteHorse(req: Request, res: Response) {
    const deleted = await Horse.findByIdAndDelete(req.params.id).lean()
    if (!deleted) {
        res.status(404).json({ error: 'Horse not found' })
        return
    }
    res.json({ ok: true })
}
