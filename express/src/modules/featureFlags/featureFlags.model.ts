import mongoose, { Schema } from 'mongoose'

const FeatureFlagsSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            default: 'global',
        },
        compareEnabled: {
            type: Boolean,
            default: true,
        },
        darkModeEnabled: {
            type: Boolean,
            default: true,
        },
        cartEnabled: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

export default mongoose.model(
    'feature_flags',
    FeatureFlagsSchema,
    'feature_flags',
)
