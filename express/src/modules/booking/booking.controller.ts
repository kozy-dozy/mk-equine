import { Request, Response } from 'express'

import { sendEmail } from '../../services/mailer'

import {
    AvailabilityBlock,
    AvailabilityRule,
    Booking,
} from './booking.model'

import type {
    AvailabilityBlockDto,
    AvailabilityRuleDto,
    AvailableSlot,
    BookingDto,
    DayOfWeek,
} from '@shared/dtos'

const BUSINESS_TIMEZONE = 'America/Denver'

function toRuleDto(doc: any): AvailabilityRuleDto {
    return {
        id: doc._id?.toString() ?? doc.id,
        dayOfWeek: doc.dayOfWeek,
        startTime: doc.startTime,
        endTime: doc.endTime,
        slotDurationMinutes: doc.slotDurationMinutes ?? 60,
        active: doc.active ?? true,
        createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
        updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
    }
}

function toBlockDto(doc: any): AvailabilityBlockDto {
    return {
        id: doc._id?.toString() ?? doc.id,
        startDateTime: doc.startDateTime?.toISOString?.() ?? doc.startDateTime,
        endDateTime: doc.endDateTime?.toISOString?.() ?? doc.endDateTime,
        reason: doc.reason ?? '',
        createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
        updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
    }
}

function toBookingDto(doc: any): BookingDto {
    return {
        id: doc._id?.toString() ?? doc.id,
        startDateTime: doc.startDateTime?.toISOString?.() ?? doc.startDateTime,
        endDateTime: doc.endDateTime?.toISOString?.() ?? doc.endDateTime,
        consultationType: doc.consultationType,
        guestName: doc.guestName,
        guestEmail: doc.guestEmail,
        guestPhone: doc.guestPhone ?? '',
        memberId: doc.memberId,
        notes: doc.notes ?? '',
        status: doc.status ?? 'pending',
        createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
        updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
    }
}

// Convert a local datetime in the business timezone (e.g. "2026-06-15T14:00")
// to a UTC Date. Implementation uses the offset trick with Intl.DateTimeFormat.
function localToUtc(year: number, month: number, day: number, hour: number, minute: number): Date {
    // First, build a naive UTC date with the same components
    const naive = new Date(Date.UTC(year, month - 1, day, hour, minute))

    // Find the offset by formatting the naive date as if it were in the business TZ
    // and computing the difference
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: BUSINESS_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    })

    const parts = tzFormatter.formatToParts(naive)
    const asTzString = parts.reduce<Record<string, string>>((acc, p) => {
        if (p.type !== 'literal') acc[p.type] = p.value
        return acc
    }, {})

    // The naive date interpreted in business TZ
    const asTz = Date.UTC(
        Number(asTzString.year),
        Number(asTzString.month) - 1,
        Number(asTzString.day),
        Number(asTzString.hour === '24' ? '0' : asTzString.hour),
        Number(asTzString.minute),
        Number(asTzString.second),
    )

    // Offset between what we asked for and what got shown = TZ offset in ms
    const offsetMs = asTz - naive.getTime()
    return new Date(naive.getTime() - offsetMs)
}

function parseTime(timeStr: string): { hour: number; minute: number } {
    const [h, m] = timeStr.split(':').map(Number)
    return { hour: h ?? 0, minute: m ?? 0 }
}

const LESSON_TYPE_LABELS: Record<string, string> = {
    'private-60': 'Private Lesson · 1 hour',
    'private-30': 'Private Lesson · 30 minutes',
    'first-visit': 'First Visit / Meet & Greet',
}

function formatSlotForEmail(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
        timeZone: BUSINESS_TIMEZONE,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

// Send a confirmation to the guest and a notification to the instructor.
// Failures are swallowed so a mail problem never blocks the booking.
async function sendBookingEmails(doc: any) {
    const brand = process.env.BRAND_NAME || 'MK Equine'
    const instructorEmail =
        process.env.CONTACT_TO_EMAIL || process.env.MAILERSEND_FROM_EMAIL
    const when = `${formatSlotForEmail(doc.startDateTime.toISOString?.() ?? doc.startDateTime)} (Mountain Time)`
    const lessonLabel =
        LESSON_TYPE_LABELS[doc.consultationType] ?? doc.consultationType

    // Guest confirmation
    try {
        await sendEmail({
            to: doc.guestEmail,
            replyToEmail: instructorEmail || undefined,
            subject: `Your lesson request is in — ${brand}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #3d2e22; line-height: 1.6;">
                    <h2 style="color: #4a3426;">Thanks, ${doc.guestName}!</h2>
                    <p>I've received your lesson request and will be in touch shortly to confirm.</p>
                    <p style="background:#f7f1e7;border-radius:8px;padding:12px 16px;">
                        <strong>${lessonLabel}</strong><br/>
                        ${when}
                    </p>
                    ${doc.notes ? `<p><strong>Your note:</strong> ${doc.notes}</p>` : ''}
                    <p>Looking forward to seeing you at the barn!<br/>— ${brand}</p>
                </div>
            `,
        })
    } catch (err) {
        console.error('Guest booking email failed:', err)
    }

    // Instructor notification
    if (instructorEmail) {
        try {
            await sendEmail({
                to: instructorEmail,
                replyToEmail: doc.guestEmail,
                replyToName: doc.guestName,
                subject: `New lesson booking — ${doc.guestName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #3d2e22; line-height: 1.6;">
                        <h2 style="color: #4a3426;">New lesson booking</h2>
                        <p><strong>${lessonLabel}</strong><br/>${when}</p>
                        <p>
                            <strong>Name:</strong> ${doc.guestName}<br/>
                            <strong>Email:</strong> ${doc.guestEmail}<br/>
                            <strong>Phone:</strong> ${doc.guestPhone || '—'}
                        </p>
                        ${doc.notes ? `<p><strong>Notes:</strong> ${doc.notes}</p>` : ''}
                        <p>Manage it in your admin dashboard under Lesson Bookings.</p>
                    </div>
                `,
            })
        } catch (err) {
            console.error('Instructor booking email failed:', err)
        }
    }
}

// GET /availability/rules — admin
export async function getAvailabilityRules(_req: Request, res: Response) {
    const docs = await AvailabilityRule.find().sort({ dayOfWeek: 1, startTime: 1 }).lean()
    res.json(docs.map(toRuleDto))
}

// PUT /availability/rules — admin (replaces all)
export async function setAvailabilityRules(req: Request, res: Response) {
    const rules: Partial<AvailabilityRuleDto>[] = Array.isArray(req.body?.rules)
        ? req.body.rules
        : []

    await AvailabilityRule.deleteMany({})

    if (rules.length === 0) {
        res.json([])
        return
    }

    const docs = await AvailabilityRule.insertMany(
        rules.map((r) => ({
            dayOfWeek: r.dayOfWeek,
            startTime: r.startTime,
            endTime: r.endTime,
            slotDurationMinutes: r.slotDurationMinutes ?? 60,
            active: r.active ?? true,
        })),
    )

    res.json(docs.map(toRuleDto))
}

// GET /availability/blocks — admin
export async function getAvailabilityBlocks(req: Request, res: Response) {
    const from = req.query.from ? new Date(String(req.query.from)) : new Date()
    const to = req.query.to
        ? new Date(String(req.query.to))
        : new Date(Date.now() + 90 * 24 * 3600 * 1000)

    const docs = await AvailabilityBlock.find({
        startDateTime: { $lt: to },
        endDateTime: { $gt: from },
    })
        .sort({ startDateTime: 1 })
        .lean()

    res.json(docs.map(toBlockDto))
}

// POST /availability/blocks — admin
export async function createAvailabilityBlock(req: Request, res: Response) {
    const doc = await AvailabilityBlock.create({
        startDateTime: new Date(req.body.startDateTime),
        endDateTime: new Date(req.body.endDateTime),
        reason: req.body.reason ?? '',
    })
    res.status(201).json(toBlockDto(doc))
}

// DELETE /availability/blocks/:id — admin
export async function deleteAvailabilityBlock(req: Request, res: Response) {
    const existing = await AvailabilityBlock.findByIdAndDelete(req.params.id).lean()
    if (!existing) {
        res.status(404).json({ error: 'Block not found' })
        return
    }
    res.json({ message: 'Block deleted' })
}

// POST /booking/available-slots — public
// Body: { from: ISO, to: ISO }
// Returns: AvailableSlot[]
export async function getAvailableSlots(req: Request, res: Response) {
    const from = req.body?.from ? new Date(req.body.from) : new Date()
    const to = req.body?.to
        ? new Date(req.body.to)
        : new Date(Date.now() + 60 * 24 * 3600 * 1000)

    // Don't allow slots in the past or within next 2 hours
    const earliest = new Date(Date.now() + 2 * 3600 * 1000)
    const effectiveFrom = from < earliest ? earliest : from

    const [rules, blocks, bookings] = await Promise.all([
        AvailabilityRule.find({ active: true }).lean(),
        AvailabilityBlock.find({
            startDateTime: { $lt: to },
            endDateTime: { $gt: effectiveFrom },
        }).lean(),
        Booking.find({
            startDateTime: { $lt: to },
            endDateTime: { $gt: effectiveFrom },
            status: { $in: ['pending', 'confirmed'] },
        }).lean(),
    ])

    if (rules.length === 0) {
        res.json([])
        return
    }

    // Build a map of dayOfWeek -> rules[]
    const rulesByDay = new Map<DayOfWeek, any[]>()
    for (const r of rules) {
        const day = r.dayOfWeek as DayOfWeek
        if (!rulesByDay.has(day)) rulesByDay.set(day, [])
        rulesByDay.get(day)!.push(r)
    }

    const slots: AvailableSlot[] = []

    // Iterate each ET calendar date in the requested range.
    // Use noon UTC as the cursor so the same date interpretation in ET is unambiguous
    // (8am ET in summer / 7am ET in winter — never crosses into previous/next ET day).
    // Start 1 UTC day earlier and end 1 UTC day later as a safety net; slot-time filtering
    // on [effectiveFrom, to) below ensures nothing out of range leaks through.
    const cursor = new Date(effectiveFrom)
    cursor.setUTCDate(cursor.getUTCDate() - 1)
    cursor.setUTCHours(12, 0, 0, 0)

    const HARD_END = to.getTime() + 24 * 60 * 60 * 1000

    while (cursor.getTime() < HARD_END) {
        // What day-of-week is this date in business timezone?
        const dowFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: BUSINESS_TIMEZONE,
            weekday: 'short',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
        const parts = dowFormatter.formatToParts(cursor)
        const tzParts = parts.reduce<Record<string, string>>((acc, p) => {
            if (p.type !== 'literal') acc[p.type] = p.value
            return acc
        }, {})
        const weekdayMap: Record<string, DayOfWeek> = {
            Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
        }
        const dow = weekdayMap[tzParts.weekday]
        const y = Number(tzParts.year)
        const mo = Number(tzParts.month)
        const d = Number(tzParts.day)

        const rulesForDay = rulesByDay.get(dow) ?? []

        for (const rule of rulesForDay) {
            const { hour: startH, minute: startM } = parseTime(rule.startTime)
            const { hour: endH, minute: endM } = parseTime(rule.endTime)
            const slotMinutes = rule.slotDurationMinutes ?? 60

            // Generate slots
            let slotStart = localToUtc(y, mo, d, startH, startM)
            const windowEnd = localToUtc(y, mo, d, endH, endM)

            while (slotStart.getTime() + slotMinutes * 60 * 1000 <= windowEnd.getTime()) {
                const slotEnd = new Date(slotStart.getTime() + slotMinutes * 60 * 1000)

                if (slotStart >= effectiveFrom && slotEnd <= to) {
                    // Check for conflicts
                    const conflicts =
                        blocks.some(
                            (b: any) =>
                                slotStart < b.endDateTime && slotEnd > b.startDateTime,
                        ) ||
                        bookings.some(
                            (b: any) =>
                                slotStart < b.endDateTime && slotEnd > b.startDateTime,
                        )

                    if (!conflicts) {
                        slots.push({
                            startDateTime: slotStart.toISOString(),
                            endDateTime: slotEnd.toISOString(),
                        })
                    }
                }

                slotStart = new Date(slotStart.getTime() + slotMinutes * 60 * 1000)
            }
        }

        // Advance by 1 day
        cursor.setUTCDate(cursor.getUTCDate() + 1)
    }

    res.json(slots)
}

// POST /booking/create — public
export async function createBooking(req: Request, res: Response) {
    const {
        startDateTime,
        endDateTime,
        consultationType = 'private-60',
        guestName,
        guestEmail,
        guestPhone = '',
        notes = '',
    } = req.body ?? {}

    if (!startDateTime || !endDateTime || !guestName || !guestEmail) {
        res.status(400).json({
            error: 'startDateTime, endDateTime, guestName, and guestEmail are required',
        })
        return
    }

    const start = new Date(startDateTime)
    const end = new Date(endDateTime)

    if (start <= new Date()) {
        res.status(400).json({ error: 'Cannot book a slot in the past' })
        return
    }

    // Verify the slot is still available (no overlapping booking or block)
    const [conflictBooking, conflictBlock] = await Promise.all([
        Booking.findOne({
            startDateTime: { $lt: end },
            endDateTime: { $gt: start },
            status: { $in: ['pending', 'confirmed'] },
        }).lean(),
        AvailabilityBlock.findOne({
            startDateTime: { $lt: end },
            endDateTime: { $gt: start },
        }).lean(),
    ])

    if (conflictBooking || conflictBlock) {
        res.status(409).json({ error: 'This time is no longer available' })
        return
    }

    const userId = (req as any).userId
    const doc = await Booking.create({
        startDateTime: start,
        endDateTime: end,
        consultationType,
        guestName: String(guestName).trim(),
        guestEmail: String(guestEmail).trim().toLowerCase(),
        guestPhone: String(guestPhone),
        memberId: userId ?? undefined,
        notes: String(notes),
        status: 'pending',
    })

    await sendBookingEmails(doc)

    res.status(201).json(toBookingDto(doc))
}

// GET /booking — admin (list bookings)
export async function getBookings(req: Request, res: Response) {
    const from = req.query.from
        ? new Date(String(req.query.from))
        : new Date(Date.now() - 30 * 24 * 3600 * 1000)
    const to = req.query.to
        ? new Date(String(req.query.to))
        : new Date(Date.now() + 90 * 24 * 3600 * 1000)

    const docs = await Booking.find({
        startDateTime: { $lt: to, $gte: from },
    })
        .sort({ startDateTime: 1 })
        .lean()

    res.json(docs.map(toBookingDto))
}

// PATCH /booking/:id/status — admin
export async function updateBookingStatus(req: Request, res: Response) {
    const { status } = req.body ?? {}
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!allowed.includes(status)) {
        res.status(400).json({ error: 'Invalid status' })
        return
    }
    const updated = await Booking.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
    ).lean()
    if (!updated) {
        res.status(404).json({ error: 'Booking not found' })
        return
    }
    res.json(toBookingDto(updated))
}

// DELETE /booking/:id — admin
export async function deleteBooking(req: Request, res: Response) {
    const existing = await Booking.findByIdAndDelete(req.params.id).lean()
    if (!existing) {
        res.status(404).json({ error: 'Booking not found' })
        return
    }
    res.json({ message: 'Booking deleted' })
}
