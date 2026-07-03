import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { fromEnv } from '@aws-sdk/credential-provider-env'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import express from 'express'

import asyncHandler from '../../../src/utils/asyncHandler'

const router = express.Router()

const s3 = new S3Client({
    // TODO: why aren't these credentials working like in the nextjs app
    // credentials: {
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    // },
    credentials: fromEnv(),
    region: process.env.AWS_REGION!,
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
})

router.post(
    '/upload-url',
    asyncHandler(async (req, res) => {
        const { fileType, desiredFileName } = req.body

        if (!fileType || !desiredFileName) {
            res.status(400).json({
                error: 'Missing fileType or desiredFileName',
            })
            return
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `players/${desiredFileName}`,
            ContentType: fileType,
        }

        const command = new PutObjectCommand(params)
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
        const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`

        res.json({ uploadUrl, fileUrl })
    }),
)

router.post(
    '/member-avatar-upload-url',
    asyncHandler(async (req, res) => {
        const { fileType, desiredFileName } = req.body as {
            fileType?: string
            desiredFileName?: string
        }

        if (!fileType || !desiredFileName) {
            res.status(400).json({
                error: 'Missing fileType or desiredFileName',
            })
            return
        }

        // Optional (recommended): restrict uploads to images only
        const allowed = new Set(['image/jpeg', 'image/png'])
        if (!allowed.has(fileType)) {
            res.status(400).json({ error: 'Invalid file type' })
            return
        }

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `members/${desiredFileName}`, // ✅ "folder" prefix
            ContentType: fileType,
        }

        const command = new PutObjectCommand(params)
        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
        const fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`

        res.json({ uploadUrl, fileUrl })
    }),
)

export default router
