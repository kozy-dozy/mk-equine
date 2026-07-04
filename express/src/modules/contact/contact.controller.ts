import { Request, Response } from 'express'

import { sendEmailTemplate } from '../../services/mailer'

const norm = (s: unknown) => String(s ?? '').trim()

export async function submitContact(req: Request, res: Response) {
    const name = norm(req.body?.name)
    const email = norm(req.body?.email).toLowerCase()
    const message = norm(req.body?.message)

    // Basic validation
    if (!name) return res.status(400).json({ error: 'Name is required.' })
    if (!email) return res.status(400).json({ error: 'Email is required.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ error: 'Email is invalid.' })

    if (!message) return res.status(400).json({ error: 'Message is required.' })
    if (message.length < 10)
        return res.status(400).json({ error: 'Message is too short.' })
    if (message.length > 5000)
        return res.status(400).json({ error: 'Message is too long.' })

    const supportTo =
        process.env.CONTACT_TO_EMAIL || process.env.MAILERSEND_FROM_EMAIL
    if (!supportTo) {
        return res
            .status(500)
            .json({ error: 'Contact email is not configured.' })
    }

    const accountName = process.env.BRAND_NAME || 'MK Equine'
    const fromName = process.env.MAILERSEND_FROM_NAME || accountName

    // 1) Support notification (template)
    const subject = `[Contact] New message received`

    await sendEmailTemplate({
        to: supportTo,
        subject,
        templateId: process.env.MAILERSEND_TEMPLATE_CONTACT_SUPPORT!,
        data: {
            account_name: accountName,
            from_name: fromName,

            name,
            email,

            // IMPORTANT: with templates, MailerSend will HTML-escape in most cases,
            // but treat it as plain text in the template anyway (we used a plain div).
            message,

            // Optional URLs:
            admin_url: `${process.env.FRONTEND_BASE_URL}/admin`, // or wherever
            support_url: `${process.env.FRONTEND_BASE_URL}/support`,
        },
    })

    // 2) Customer auto-reply (template)
    if (process.env.CONTACT_AUTOREPLY === '1') {
        await sendEmailTemplate({
            to: email,
            subject: `We got your message — ${accountName}`,
            templateId: process.env.MAILERSEND_TEMPLATE_CONTACT_AUTOREPLY!,
            data: {
                account_name: accountName,
                from_name: fromName,

                name,
                message,

                support_url: `${process.env.FRONTEND_BASE_URL}/support`,
            },
        })
    }

    return res.json({ message: 'Message sent' })
}
