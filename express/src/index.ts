import './env'

import * as Sentry from '@sentry/node'
// import bodyParser from 'body-parser'
import connectMongoDBSession from 'connect-mongodb-session'
import cookieParser from 'cookie-parser' // note: this is for csrf
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import helmet from 'helmet'
import mongoose from 'mongoose'

// NEW: Sentry import

import { ONE_MONTH_MS } from './constants/time'
import { adminRoutes } from './modules/admin'
import { authRoutes } from './modules/auth'
import { bookingRoutes } from './modules/booking'
import { contactRoutes } from './modules/contact'
import { featuresRoutes } from './modules/featureFlags'
import { horsesRoutes } from './modules/horses'
import { membersRoutes } from './modules/members'
import { s3Routes } from './modules/s3'
import { siteContentRoutes } from './modules/siteContent'
import { sitemapRoutes } from './modules/sitemap'
import { statusRoutes } from './modules/status'
import { rateLimitMonitor } from './middleware/rateLimitMonitor'

const isProd = process.env.NODE_ENV === 'production'
const sameSite = isProd ? ('none' as const) : ('lax' as const)
const secure = isProd

const MongoDBStore = connectMongoDBSession(session)

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
}

// 🔹 SENTRY INIT (do this early)
Sentry.init({
    dsn: process.env.SENTRY_DSN, // set this in your .env files
    environment: process.env.NODE_ENV ?? 'development',
    // If you want performance traces later, uncomment one of these:
    // tracesSampleRate: 1.0,
    integrations: [
        Sentry.expressIntegration(), // Express + OpenTelemetry integration
    ],
})

// 🔹 RATE LIMITERS
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: () => !isProd, // Skip rate limiting entirely in development
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProd ? 5 : 100, // More lenient in development
    skipSuccessfulRequests: true, // don't count successful requests
    message: 'Too many login attempts, please try again later.',
})

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: isProd ? 30 : 1000, // Much more lenient in development
    skip: () => !isProd, // Skip rate limiting entirely in development
})

const app = express()
const store: session.Store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
})

// IMPORTANT: your normal middleware stack
//app.use(bodyParser.json())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// 🔹 HELMET: Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    },
}))

// Trust proxy for correct protocol/secure cookies behind Render/Proxies
app.set('trust proxy', 1)

// CORS: allow your front-end (set CORS_ORIGIN on Render)
// ⚠️ MUST come BEFORE rate limiting to allow preflight requests
const originList = process.env.CORS_ORIGIN?.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

// In development, allow localhost:5173 (Vite default) + any whitelisted origins
const allowedOrigins = isProd
    ? originList || false
    : ['http://localhost:5173', 'http://localhost:3000', ...(originList || [])]

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
)

// 🔹 APPLY GENERAL RATE LIMITER (after CORS)
app.use(generalLimiter)

app.use(
    session({
        name: 'sid',
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            httpOnly: true,
            sameSite,
            secure,
            maxAge: ONE_MONTH_MS,
        },
    }),
)

// 🔹 RATE LIMIT MONITORING: Capture 429 errors and send to Sentry
app.use(rateLimitMonitor)

// Your routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/admin', apiLimiter, adminRoutes)
app.use('/api/members', apiLimiter, membersRoutes)
app.use('/api/horses', apiLimiter, horsesRoutes)
app.use('/api/booking', apiLimiter, bookingRoutes)
app.use('/api/s3', apiLimiter, s3Routes)
app.use('/api', apiLimiter, statusRoutes)
app.use('/api/site-content', apiLimiter, siteContentRoutes)
app.use('/api/contact', apiLimiter, contactRoutes)
app.use('/api/feature-flags', apiLimiter, featuresRoutes)
app.use('/', sitemapRoutes)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/api/sentry-test', () => {
    throw new Error('🧪 Backend Sentry test error')
})

// 🔹 SENTRY EXPRESS ERROR HANDLER
// Must be AFTER all routes, and BEFORE any custom error middleware.
Sentry.setupExpressErrorHandler(app)

const port = Number(process.env.PORT ?? 3000)

;(async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('mongoose connected')
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (error) {
        console.error('MongoDB connection error:', error)
        // Optional: capture startup errors too
        Sentry.captureException(error)
    }
})()
