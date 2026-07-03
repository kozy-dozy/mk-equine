import mongoose from 'mongoose'

const MemberSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationTokenExpires: {
            type: Date,
        },
        password: {
            type: String,
            required: true,
        },
        authority: {
            type: [String],
            enum: ['user', 'admin'],
            default: ['user'],
        },
        passwordResetTokenHash: {
            type: String,
        },
        passwordResetTokenExpires: {
            type: Date,
        },
    },
    { timestamps: true },
)

export default mongoose.model('Member', MemberSchema, 'members')
