import { forwardRef, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'

import CloseButton from '../CloseButton'
import useTimeout from '../hooks/useTimeout'
import StatusIcon from '../StatusIcon'

import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, MouseEvent } from 'react'

export interface NotificationProps extends CommonProps {
    closable?: boolean
    customIcon?: ReactNode | string
    duration?: number
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    title?: string
    triggerByToast?: boolean
    type?: TypeAttributes.Status
    width?: number | string
}

const NotificationWrap = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: ${({ theme }) => theme.shadow.md};
    padding: 14px ${({ theme }) => theme.spacing.md};
    position: relative;
    overflow: hidden;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
`

const NotificationContent = styled.div<{ $noChild: boolean }>`
    display: flex;
    align-items: ${({ $noChild }) => ($noChild ? 'center' : 'flex-start')};
`

const IconWrap = styled.div`
    flex-shrink: 0;
    margin-right: 10px;
    display: flex;
    align-items: center;
`

const Body = styled.div`
    flex: 1;
    min-width: 0;
    margin-right: ${({ theme }) => theme.spacing.md};
`

const NotificationTitle = styled.div<{ $hasChildren: boolean }>`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    ${({ $hasChildren }) =>
        $hasChildren &&
        css`
            margin-bottom: ${({ theme }) => theme.spacing.xs};
        `}
`

const NotificationDescription = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    line-height: 1.5;
`

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
    (props, ref) => {
        const {
            children,
            closable = false,
            customIcon,
            duration = 3000,
            onClose,
            style,
            title,
            triggerByToast,
            type,
            width = 350,
            ...rest
        } = props

        const [display, setDisplay] = useState('show')

        const { clear } = useTimeout(
            onClose as () => void,
            duration,
            duration > 0,
        )

        const handleClose = useCallback(
            (e: MouseEvent<HTMLSpanElement>) => {
                setDisplay('hiding')
                onClose?.(e)
                clear()
                if (!triggerByToast) {
                    setTimeout(() => {
                        setDisplay('hide')
                    }, 400)
                }
            },
            [onClose, clear, triggerByToast],
        )

        if (display === 'hide') {
            return null
        }

        const icon = customIcon ?? (type ? <StatusIcon type={type} /> : null)

        return (
            <NotificationWrap
                ref={ref}
                {...rest}
                style={{ width, ...style }}
            >
                <NotificationContent $noChild={!children}>
                    {icon && <IconWrap>{icon}</IconWrap>}
                    <Body>
                        {title && (
                            <NotificationTitle $hasChildren={Boolean(children)}>
                                {title}
                            </NotificationTitle>
                        )}
                        {children && (
                            <NotificationDescription>
                                {children}
                            </NotificationDescription>
                        )}
                    </Body>
                </NotificationContent>
                {closable && (
                    <CloseButton
                        className="notification-close"
                        defaultStyle={false}
                        absolute={true}
                        onClick={handleClose}
                    />
                )}
            </NotificationWrap>
        )
    },
)

Notification.displayName = 'Notification'

export default Notification
