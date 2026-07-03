import mongoose, { Schema } from 'mongoose'

const HorseSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        breed: { type: String, default: '', trim: true },
        age: { type: Number, default: 0 },
        sex: { type: String, default: '', trim: true },
        discipline: { type: String, default: '', trim: true },
        price: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['available', 'pending', 'sold'],
            default: 'available',
        },
        description: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true },
)

HorseSchema.index({ sortOrder: 1, createdAt: -1 })

export const Horse = mongoose.model('Horse', HorseSchema, 'horses')
