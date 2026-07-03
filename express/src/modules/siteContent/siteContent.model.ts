import mongoose from 'mongoose'

const HomeCategorySchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            default: '',
            trim: true,
        },
        label: {
            type: String,
            default: '',
            trim: true,
        },
        href: {
            type: String,
            default: '',
            trim: true,
        },
    },
    { _id: false },
)

const HomeSchema = new mongoose.Schema(
    {
        heroImageUrl: {
            type: String,
            default: '',
            trim: true,
        },
        categories: {
            type: [HomeCategorySchema],
            default: () =>
                Array.from({ length: 4 }).map(() => ({
                    imageUrl: '',
                    label: '',
                    href: '',
                })),
        },
    },
    { _id: false },
)

const SiteContentSchema = new mongoose.Schema(
    {
        home: {
            type: HomeSchema,
            default: () => ({}),
        },
    },
    { timestamps: true },
)

export default mongoose.model('site_content', SiteContentSchema, 'siteContent')
