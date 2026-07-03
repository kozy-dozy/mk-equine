import { Router } from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'

import { getPublicFeatureFlags } from './featureFlags.controller'

const router = Router()

router.get('/', asyncHandler(getPublicFeatureFlags))

export default router
