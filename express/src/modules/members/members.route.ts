import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'

import {
    getMembers,
    getMemberById,
    updateMemberById,
    deleteMemberById,
    getMe,
    updateMe,
    updateMyPassword,
} from './members.controller'

const router = express.Router()

/**
 * Self-service (any logged-in user)
 */
router.get('/me', requireAuth, asyncHandler(getMe))
router.patch('/me', requireAuth, asyncHandler(updateMe))
router.put('/me', requireAuth, asyncHandler(updateMe))
router.put('/me/password', requireAuth, asyncHandler(updateMyPassword))

/**
 * Admin-only (manage users)
 */
router.post('/', requireAuth, requireAdmin, asyncHandler(getMembers))
router.get('/:id', requireAuth, requireAdmin, asyncHandler(getMemberById))
router.put('/:id', requireAuth, requireAdmin, asyncHandler(updateMemberById))
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(deleteMemberById))

export default router
