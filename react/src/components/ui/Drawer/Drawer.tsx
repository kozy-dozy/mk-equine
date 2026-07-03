import styled from 'styled-components'
import { motion } from 'framer-motion'
import Modal from 'react-modal'
import CloseButton from '../CloseButton'
import type { MouseEvent, ReactNode } from 'react'
import type ReactModal from 'react-modal'

export interface DrawerProps extends ReactModal.Props {
    bodyClass?: string
    closable?: boolean
    footer?: string | ReactNode
    footerClass?: string
    headerClass?: string
    height?: string | number
    lockScroll?: boolean
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    placement?: 'top' | 'right' | 'bottom' | 'left'
    showBackdrop?: boolean
    title?: string | ReactNode
    width?: string | number
}

const StyledDrawerOverlay = styled.div<{ showBackdrop: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: ${({ showBackdrop, theme }) =>
        showBackdrop ? theme.colors.bg.overlay : 'transparent'};
    z-index: 1000;
`

const StyledDrawerContent = styled(motion.div)<{
    placement: string
    width: string | number
    height: string | number
}>`
    background: ${({ theme }) => theme.colors.bg.card};
    box-shadow: ${({ theme }) => theme.shadow.lg};
    position: absolute;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    ${({ placement, width, height }) => {
        const w = typeof width === 'number' ? `${width}px` : width
        const h = typeof height === 'number' ? `${height}px` : height
        if (placement === 'left') return `top: 0; left: 0; bottom: 0; width: ${w};`
        if (placement === 'right') return `top: 0; right: 0; bottom: 0; width: ${w};`
        if (placement === 'top') return `top: 0; left: 0; right: 0; height: ${h};`
        return `bottom: 0; left: 0; right: 0; height: ${h};`
    }}
`

const StyledDrawerHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg} 0 ${theme.spacing.lg}`};
    min-height: 56px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
    h4,
    span {
        font-size: ${({ theme }) => theme.fontSize.xl};
        font-weight: 600;
    }
`

const StyledDrawerBody = styled.div`
    flex: 1 1 auto;
    padding: ${({ theme }) => theme.spacing.lg};
    overflow-y: auto;
`

const StyledDrawerFooter = styled.div`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.bg.hover};
`

function getSlideVariants(placement: string) {
    if (placement === 'left') return { hidden: { x: '-100%' }, visible: { x: 0 } }
    if (placement === 'right') return { hidden: { x: '100%' }, visible: { x: 0 } }
    if (placement === 'top') return { hidden: { y: '-100%' }, visible: { y: 0 } }
    return { hidden: { y: '100%' }, visible: { y: 0 } }
}

const Drawer = (props: DrawerProps) => {
    const {
        children,
        closable = true,
        closeTimeoutMS = 300,
        footer,
        height = 400,
        isOpen,
        onClose,
        placement = 'right',
        showBackdrop = true,
        title,
        width = 400,
        ...rest
    } = props

    const onCloseClick = (e: MouseEvent<HTMLSpanElement>) => {
        onClose?.(e)
    }

    const variants = getSlideVariants(placement)

    return (
        <Modal
            ariaHideApp={false}
            isOpen={isOpen}
            closeTimeoutMS={closeTimeoutMS}
            style={{
                overlay: { background: 'none', zIndex: 1000 },
                content: {
                    inset: 0,
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    overflow: 'visible',
                },
            }}
            {...rest}
        >
            <StyledDrawerOverlay showBackdrop={showBackdrop}>
                <StyledDrawerContent
                    placement={placement}
                    width={width}
                    height={height}
                    variants={variants}
                    initial="hidden"
                    animate={isOpen ? 'visible' : 'hidden'}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {(title || closable) && (
                        <StyledDrawerHeader>
                            {typeof title === 'string' ? (
                                <h4>{title}</h4>
                            ) : (
                                <span>{title}</span>
                            )}
                            {closable && <CloseButton onClick={onCloseClick} />}
                        </StyledDrawerHeader>
                    )}
                    <StyledDrawerBody>{children}</StyledDrawerBody>
                    {footer && (
                        <StyledDrawerFooter>{footer}</StyledDrawerFooter>
                    )}
                </StyledDrawerContent>
            </StyledDrawerOverlay>
        </Modal>
    )
}

Drawer.displayName = 'Drawer'

export default Drawer
