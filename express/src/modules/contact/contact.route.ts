import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'

import { submitContact } from './contact.controller'

const router = express.Router()

router.post('/', asyncHandler(submitContact))

export default router
