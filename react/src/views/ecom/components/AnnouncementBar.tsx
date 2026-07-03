import styled from 'styled-components'

import { CONTENT_CONFIG } from '@/config/content.config'

const Bar = styled.div`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
`

const Inner = styled.div`
    max-width: 1152px;
    margin: 0 auto;
    padding: 6px ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    letter-spacing: 0.03em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const Badge = styled.span`
    display: inline-flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.radius.full};
    background: rgba(255, 255, 255, 0.15);
    padding: ${({ theme }) => theme.spacing.xxs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: 600;
`

const Message = styled.span`
    opacity: 0.85;
`

export default function AnnouncementBar() {
    if (!CONTENT_CONFIG.announcement.enabled) return null

    return (
        <Bar>
            <Inner>
                <Badge>{CONTENT_CONFIG.announcement.badge}</Badge>
                <Message>{CONTENT_CONFIG.announcement.message}</Message>
            </Inner>
        </Bar>
    )
}
