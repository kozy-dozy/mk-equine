import { Request, Response } from 'express'

import Member from '../members/members.model'

import type { PipelineStage } from 'mongoose'

type RangeKey = 'daily' | 'weekly' | 'monthly'

const RANGE_TO_DAYS: Record<RangeKey, number> = {
    daily: 14,
    weekly: 12 * 7,
    monthly: 365,
}

function startOfWeek() {
    const d = new Date()
    const diff = (d.getDay() + 6) % 7
    d.setDate(d.getDate() - diff)
    d.setHours(0, 0, 0, 0)
    return d
}

function startDateFor(range: RangeKey) {
    return new Date(Date.now() - RANGE_TO_DAYS[range] * 24 * 60 * 60 * 1000)
}


// GET /admin/dashboard
export async function getAdminDashboard(_req: Request, res: Response) {
    const [membersTotal, membersNewThisWeek, newestMembers] = await Promise.all([
        Member.countDocuments({}),
        Member.countDocuments({ createdAt: { $gte: startOfWeek() } }),
        Member.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('firstName lastName email emailVerified authority createdAt avatar')
            .lean(),
    ])

    res.json({
        stats: {
            membersTotal,
            membersNewThisWeek,
        },
        newestMembers: newestMembers.map((m: any) => ({
            id: String(m._id),
            firstName: m.firstName ?? '',
            lastName: m.lastName ?? '',
            email: m.email ?? '',
            emailVerified: Boolean(m.emailVerified),
            authority: m.authority ?? ['user'],
            createdAt: m.createdAt,
            avatar: m.avatar ?? '',
        })),
    })
}


function buildTimePipeline(range: RangeKey, since: Date): PipelineStage[] {
    const bucketExpr =
        range === 'daily'
            ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            : range === 'weekly'
              ? {
                    $concat: [
                        { $toString: { $isoWeekYear: '$createdAt' } },
                        '-W',
                        {
                            $cond: [
                                { $lt: [{ $isoWeek: '$createdAt' }, 10] },
                                { $concat: ['0', { $toString: { $isoWeek: '$createdAt' } }] },
                                { $toString: { $isoWeek: '$createdAt' } },
                            ],
                        },
                    ],
                }
              : { $dateToString: { format: '%Y-%m', date: '$createdAt' } }

    return [
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: bucketExpr as any, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]
}

// GET /admin/dashboard/overview?range=daily|weekly|monthly
export async function getAdminOverview(_req: Request, res: Response) {
    const keys: RangeKey[] = ['daily', 'weekly', 'monthly']

    // Member signup chart — over time by range
    const memberChartResults = await Promise.all(
        keys.map(async (k) => {
            const rows = await Member.aggregate(buildTimePipeline(k, startDateFor(k)))
            return [k, { labels: rows.map((r) => String(r._id)), data: rows.map((r) => Number(r.count)) }] as const
        }),
    )

    res.json({
        chart: Object.fromEntries(memberChartResults),
    })
}
