import mongoose, { Schema } from 'mongoose'

const AvailabilityRuleSchema = new Schema(
    {
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        slotDurationMinutes: { type: Number, default: 60 },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
)

export const AvailabilityRule = mongoose.model(
    'AvailabilityRule',
    AvailabilityRuleSchema,
    'availability_rules',
)

const AvailabilityBlockSchema = new Schema(
    {
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        reason: { type: String, default: '' },
    },
    { timestamps: true },
)

AvailabilityBlockSchema.index({ startDateTime: 1, endDateTime: 1 })

export const AvailabilityBlock = mongoose.model(
    'AvailabilityBlock',
    AvailabilityBlockSchema,
    'availability_blocks',
)

const BookingSchema = new Schema(
    {
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        consultationType: { type: String, required: true, default: 'private-60' },
        guestName: { type: String, required: true, trim: true },
        guestEmail: { type: String, required: true, trim: true, lowercase: true },
        guestPhone: { type: String, default: '' },
        memberId: { type: String },
        notes: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    { timestamps: true },
)

BookingSchema.index({ startDateTime: 1 })

export const Booking = mongoose.model('Booking', BookingSchema, 'bookings')
