// routes/siteContent.ts
import { Router } from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'

import {
    getHomeContentPublic,
    getSiteContentAdmin,
    updateHomeHero,
    updateHomeCategories,
} from './siteContent.controller'

const router = Router()

// Public storefront
router.get('/home', asyncHandler(getHomeContentPublic))

// Admin
router.get(
    '/admin',
    requireAuth,
    requireAdmin,
    asyncHandler(getSiteContentAdmin),
)
router.put(
    '/admin/home-hero',
    requireAuth,
    requireAdmin,
    asyncHandler(updateHomeHero),
)
router.put(
    '/admin/home-categories',
    requireAuth,
    requireAdmin,
    asyncHandler(updateHomeCategories),
)

export default router
