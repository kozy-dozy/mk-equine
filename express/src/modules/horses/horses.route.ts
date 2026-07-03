import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'

import {
    listPublicHorses,
    listAdminHorses,
    createHorse,
    updateHorse,
    deleteHorse,
} from './horses.controller'

const router = express.Router()

// Public
router.get('/', asyncHandler(listPublicHorses))

// Admin
router.get('/admin', requireAuth, requireAdmin, asyncHandler(listAdminHorses))
router.post('/', requireAuth, requireAdmin, asyncHandler(createHorse))
router.patch('/:id', requireAuth, requireAdmin, asyncHandler(updateHorse))
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(deleteHorse))

export default router
