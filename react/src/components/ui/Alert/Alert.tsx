import { motion } from 'framer-motion'
import { useState, forwardRef } from 'react'
import {
    HiCheckCircle,
    HiInformationCircle,
    HiExclamation,
    HiXCircle,
} from 'react-icons/hi'
import styled, { css } from 'styled-components'

import CloseButton from '../CloseButton'
import useTimeout from '../hooks/useTimeout'
import StatusIcon from '../StatusIcon'

import type { TypeAttributes, CommonProps } from '../@types/common'
import type { ReactNode, MouseEvent } from 'react'

export interface AlertProps extends CommonProps {
    closable?: boolean
    customClose?: ReactNode | string
    customIcon?: ReactNode | string
    duration?: number
    title?: ReactNode | string
    onClose?: (e?: MouseEvent<HTMLDivElement>) => void
    rounded?: boolean
    showIcon?: boolean
    triggerByToast?: boolean
    type?: TypeAttributes.Status
}

const TYPE_MAP = {
    success: {
        bg: '#ecfdf5',
        bgDark: 'rgba(52,211,153,0.12)',
        titleColor: '#065f46',
        textColor: '#059669',
        iconColor: '#34d399',
        icon: <HiCheckCircle />,
    },
    info: {
        bg: '#eff6ff',
        bgDark: 'rgba(96,165,250,0.12)',
        titleColor: '#1e40af',
        textColor: '#3b82f6',
        iconColor: '#60a5fa',
        icon: <HiInformationCircle />,
    },
    warning: {
        bg: '#fffbeb',
        bgDark: 'rgba(250,204,21,0.12)',
        titleColor: '#92400e',
        textColor: '#d97706',
        iconColor: '#facc15',
        icon: <HiExclamation />,
    },
    danger: {
        bg: '#fef2f2',
        bgDark: 'rgba(248,113,113,0.12)',
        titleColor: '#991b1b',
        textColor: '#ef4444',
        iconColor: '#f87171',
        icon: <HiXCircle />,
    },
}

const TYPE_ARRAY: TypeAttributes.Status[] = ['success', 'danger', 'info', 'warning']
const DEFAULT_TYPE = 'warning'

const AlertWrap = styled(motion.div)<{
    $bg: string
    $bgDark: string
    $textColor: string
    $closable: boolean
    $hasTitle: boolean
    $rounded: boolean
}>`
    padding: ${({ theme }) => theme.spacing.lg};
    position: relative;
    display: flex;
    background: ${({ $bg, theme }) => (theme.isDark ? 'transparent' : $bg)};
    ${({ $bgDark, theme }) =>
        theme.isDark &&
        css`
            border: 1px solid ${$bgDark};
        `}
    color: ${({ $textColor }) => $textColor};
    font-weight: 600;
    ${({ $closable }) =>
        $closable &&
        css`
            justify-content: space-between;
        `}
    ${({ $closable, $hasTitle }) =>
        $closable &&
        !$hasTitle &&
        css`
            align-items: center;
        `}
    ${({ $rounded, theme }) =>
        $rounded &&
        css`
            border-radius: ${theme.radius.lg};
        `}
`

const AlertBody = styled.div<{ $hasTitle: boolean }>`
    display: flex;
    ${({ $hasTitle }) => !$hasTitle && css`align-items: center;`}
`

const AlertContent = styled.div<{ $hasIcon: boolean }>`
    ${({ $hasIcon, theme }) =>
        $hasIcon &&
        css`
            margin-left: ${theme.spacing.sm};
        `}
`

const AlertTitle = styled.div<{ $titleColor: string }>`
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
    color: ${({ $titleColor }) => $titleColor};
`

const CloseWrap = styled.div`
    cursor: pointer;
`

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
    const {
        children,
        className,
        closable = false,
        customClose,
        customIcon,
        duration = 3000,
        title = null,
        onClose,
        rounded = true,
        showIcon = false,
        triggerByToast = false,
        ...rest
    } = props

    const getType = (): TypeAttributes.Status => {
        const { type = DEFAULT_TYPE } = props
        return TYPE_ARRAY.includes(type as TypeAttributes.Status)
            ? (type as TypeAttributes.Status)
            : DEFAULT_TYPE
    }

    const type = getType()
    const typeMap = TYPE_MAP[type]

    const [display, setDisplay] = useState('show')

    const { clear } = useTimeout(
        onClose as () => void,
        duration,
        (duration as number) > 0,
    )

    const handleClose = (e: MouseEvent<HTMLDivElement>) => {
        setDisplay('hiding')
        onClose?.(e)
        clear()
        if (!triggerByToast) {
            setTimeout(() => setDisplay('hide'), 400)
        }
    }

    if (display === 'hide') return null

    return (
        <AlertWrap
            ref={ref}
            className={className}
            $bg={typeMap.bg}
            $bgDark={typeMap.bgDark}
            $textColor={typeMap.textColor}
            $closable={closable}
            $hasTitle={!!title}
            $rounded={rounded}
            initial={{ opacity: 1 }}
            animate={display === 'hiding' ? 'exit' : 'animate'}
            transition={{ duration: 0.25, type: 'tween' }}
            variants={{ animate: { opacity: 1 }, exit: { opacity: 0 } }}
            {...rest}
        >
            <AlertBody $hasTitle={!!title}>
                {showIcon && (
                    <StatusIcon
                        iconColor={typeMap.iconColor}
                        custom={customIcon}
                        type={type}
                    />
                )}
                <AlertContent $hasIcon={showIcon}>
                    {title ? (
                        <AlertTitle $titleColor={typeMap.titleColor}>
                            {title}
                        </AlertTitle>
                    ) : null}
                    {children}
                </AlertContent>
            </AlertBody>
            {closable && (
                <CloseWrap role="presentation" onClick={handleClose}>
                    {customClose || <CloseButton defaultStyle={false} />}
                </CloseWrap>
            )}
        </AlertWrap>
    )
})

Alert.displayName = 'Alert'

export default Alert
