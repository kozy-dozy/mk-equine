import '../env'

import mongoose from 'mongoose'

import { AvailabilityRule } from '../modules/booking/booking.model'

// Default weekly lesson availability (times are in the business timezone,
// America/Denver / Mountain Time). Adjust anytime via Admin → Availability.
// dayOfWeek: 0 = Sunday ... 6 = Saturday
const DEFAULT_RULES = [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
    dayOfWeek,
    startTime: '09:00',
    endTime: '18:00',
    slotDurationMinutes: 60,
    active: true,
}))

async function run() {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is not set')

    await mongoose.connect(uri)
    console.log('Connected to', mongoose.connection.name)

    const removed = await AvailabilityRule.deleteMany({})
    const docs = await AvailabilityRule.insertMany(DEFAULT_RULES)

    console.log(
        `Removed ${removed.deletedCount} old rule(s); inserted ${docs.length} ` +
            `(Mon–Sat 9:00 AM–6:00 PM Mountain Time, 60-minute slots).`,
    )

    await mongoose.disconnect()
    process.exit(0)
}

run().catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
})
