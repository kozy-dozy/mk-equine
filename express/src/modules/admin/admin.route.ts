import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'
import {
    getAdminFeatureFlags,
    patchAdminFeatureFlags,
} from '../featureFlags/featureFlags.controller'

import {
    getAdminDashboard,
    getAdminOverview,
} from './admin.controller'

const router = express.Router()

router.get(
    '/dashboard',
    requireAuth,
    requireAdmin,
    asyncHandler(getAdminDashboard),
)
router.get(
    '/dashboard/overview',
    requireAuth,
    requireAdmin,
    asyncHandler(getAdminOverview),
)

router.get(
    '/feature-flags',
    requireAuth,
    requireAdmin,
    asyncHandler(getAdminFeatureFlags),
)

router.patch(
    '/feature-flags',
    requireAuth,
    requireAdmin,
    asyncHandler(patchAdminFeatureFlags),
)

export default router
