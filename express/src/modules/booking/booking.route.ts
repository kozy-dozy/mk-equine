import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'
import { requireAdmin } from '../../middleware/requireAdmin'
import { requireAuth } from '../../middleware/requireAuth'

import {
    getAvailableSlots,
    createBooking,
    getAvailabilityRules,
    setAvailabilityRules,
    getAvailabilityBlocks,
    createAvailabilityBlock,
    deleteAvailabilityBlock,
    getBookings,
    updateBookingStatus,
    deleteBooking,
} from './booking.controller'

const router = express.Router()

// Public
router.post('/available-slots', asyncHandler(getAvailableSlots))
router.post('/create', asyncHandler(createBooking))

// Admin: availability rules (weekly schedule)
router.get('/availability/rules', requireAuth, requireAdmin, asyncHandler(getAvailabilityRules))
router.put('/availability/rules', requireAuth, requireAdmin, asyncHandler(setAvailabilityRules))

// Admin: availability blocks (ad-hoc blocked time)
router.get('/availability/blocks', requireAuth, requireAdmin, asyncHandler(getAvailabilityBlocks))
router.post('/availability/blocks', requireAuth, requireAdmin, asyncHandler(createAvailabilityBlock))
router.delete('/availability/blocks/:id', requireAuth, requireAdmin, asyncHandler(deleteAvailabilityBlock))

// Admin: bookings
router.get('/', requireAuth, requireAdmin, asyncHandler(getBookings))
router.patch('/:id/status', requireAuth, requireAdmin, asyncHandler(updateBookingStatus))
router.delete('/:id', requireAuth, requireAdmin, asyncHandler(deleteBooking))

export default router
