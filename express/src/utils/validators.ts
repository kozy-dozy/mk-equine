import Joi from 'joi'

// Type interfaces
export interface SignUpData {
    email: string
    password: string
    firstName: string
    lastName: string
    recaptchaToken: string
}

export interface SignInData {
    email: string
    password: string
    rememberMe?: boolean
}

/**
 * Password validation schema
 * Requires:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
        'string.pattern.base':
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must not exceed 128 characters',
    })

export const emailSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .max(254)
    .required()
    .messages({
        'string.email': 'Invalid email address',
        'string.max': 'Email must not exceed 254 characters',
    })

export const signUpSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    firstName: Joi.string().trim().max(100).required(),
    lastName: Joi.string().trim().max(100).required(),
    recaptchaToken: Joi.string().required(),
}).unknown(false) // Reject unknown fields

export const signInSchema = Joi.object({
    email: emailSchema,
    password: Joi.string().required(),
    rememberMe: Joi.boolean().default(true),
}).unknown(false)

export const updateMemberSchema = Joi.object({
    firstName: Joi.string().trim().max(100),
    lastName: Joi.string().trim().max(100),
    avatar: Joi.string().uri().allow(null, ''),
}).unknown(false)

/**
 * Generic validation function
 */
export function validate<T>(
    data: unknown,
    schema: Joi.ObjectSchema,
): { value: T; error: null } | { value: null; error: Joi.ValidationError } {
    const { value, error } = schema.validate(data, {
        abortEarly: true,
        stripUnknown: true,
    })
    if (error) {
        return { value: null, error }
    }
    return { value: value as T, error: null }
}

/**
 * Sanitize user input to prevent NoSQL injection in MongoDB regex queries
 */
export function sanitizeRegexInput(input: string): string {
    if (!input || typeof input !== 'string') return ''
    // Escape special regex characters
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
