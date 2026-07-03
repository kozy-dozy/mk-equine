import {
    HiCheckCircle,
    HiOutlineInformationCircle,
    HiOutlineExclamation,
    HiOutlineExclamationCircle,
} from 'react-icons/hi'
import styled from 'styled-components'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

import type { DialogProps } from '@/components/ui/Dialog'
import type { ReactNode } from 'react'

type StatusType = 'info' | 'success' | 'warning' | 'danger'

interface ConfirmDialogProps extends DialogProps {
    cancelText?: ReactNode | string
    confirmText?: ReactNode | string
    confirmButtonColor?: string
    type?: StatusType
    title?: ReactNode | string
    onCancel?: () => void
    onConfirm?: () => void
}

const StatusAvatar = styled(Avatar)<{ $bg: string; $color: string }>`
    background: ${({ $bg }) => $bg};
    color: ${({ $color }) => $color};
`

const StatusIconSpan = styled.span`
    font-size: ${({ theme }) => theme.fontSize['2xl']};
`

const DialogBody = styled.div`
    display: flex;
    padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.md} ${theme.spacing.lg}`};
    padding-top: ${({ theme }) => theme.spacing.sm};
`

const DialogTextWrap = styled.div`
    margin-left: ${({ theme }) => theme.spacing.lg};
    margin-right: 0;
    direction: ltr;
`

const DialogTitle = styled.h5`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const DialogFooter = styled.div`
    text-align: right;
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    background: ${({ theme }) => theme.colors.bg.hover};
    border-bottom-left-radius: ${({ theme }) => theme.radius.lg || '0.5rem'};
    border-bottom-right-radius: ${({ theme }) => theme.radius.lg || '0.5rem'};
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
`

const StyledButton = styled(Button)`
    margin-right: ${({ theme }) => theme.spacing.sm};
    margin-left: 0;
`

const StatusIcon = ({ status }: { status: StatusType }) => {
    const statusMap = {
        info: { bg: 'infoBg', color: 'info' },
        success: { bg: 'successBg', color: 'success' },
        warning: { bg: 'warningBg', color: 'warning' },
        danger: { bg: 'errorBg', color: 'error' },
    }
    const iconMap = {
        info: <HiOutlineInformationCircle />,
        success: <HiCheckCircle />,
        warning: <HiOutlineExclamationCircle />,
        danger: <HiOutlineExclamation />,
    }
    const { bg, color } = statusMap[status] || statusMap.info
    return (
        <StatusAvatar $bg={bg} $color={color} shape="circle">
            <StatusIconSpan>{iconMap[status]}</StatusIconSpan>
        </StatusAvatar>
    )
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const {
        type = 'info',
        title,
        children,
        onCancel,
        onConfirm,
        cancelText = 'Cancel',
        confirmText = 'Confirm',
        confirmButtonColor,
        ...rest
    } = props

    const handleCancel = () => {
        onCancel?.()
    }

    const handleConfirm = () => {
        onConfirm?.()
    }

    return (
        <Dialog {...rest}>
            <DialogBody>
                <div>
                    <StatusIcon status={type} />
                </div>
                <DialogTextWrap>
                    <DialogTitle>{title}</DialogTitle>
                    {children}
                </DialogTextWrap>
            </DialogBody>
            <DialogFooter>
                <StyledButton size="sm" onClick={handleCancel}>
                    {cancelText}
                </StyledButton>
                <StyledButton
                    size="sm"
                    variant="solid"
                    color={confirmButtonColor}
                    onClick={handleConfirm}
                >
                    {confirmText}
                </StyledButton>
            </DialogFooter>
        </Dialog>
    )
}

export default ConfirmDialog
