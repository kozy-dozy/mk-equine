import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    FloatingPortal,
} from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import styled from 'styled-components'

import Arrow from './Arrow'

import type { ArrowPlacement } from './Arrow'
import type { CommonProps } from '../@types/common'
import type { ReactNode } from 'react'

export interface TooltipProps extends CommonProps {
    isOpen?: boolean
    placement?: ArrowPlacement
    title: string | ReactNode
    wrapperClass?: string
}

const TooltipWrapper = styled.span`
    display: inline-block;
    position: relative;
`

const StyledTooltip = styled(motion.div)`
    background: ${({ theme }) => theme.colors.bg.card || '#1f2937'};
    color: ${({ theme }) => theme.colors.text.inverse || '#fff'};
    border-radius: ${({ theme }) => theme.radius.sm};
    font-size: ${({ theme }) => theme.fontSize.base};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    box-shadow: ${({ theme }) => theme.shadow.md};
    z-index: 1000;
    pointer-events: none;
    position: absolute;
    white-space: pre-line;
`

const Tooltip = (props: TooltipProps) => {
    const {
        children,
        isOpen = false,
        placement = 'top',
        title,
        wrapperClass,
    } = props

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(isOpen)

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setTooltipOpen,
        placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(7),
            flip({
                fallbackAxisSideDirection: 'start',
            }),
            shift(),
        ],
    })

    const hover = useHover(context, { move: false })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ])

    return (
        <>
            <TooltipWrapper
                ref={refs.setReference}
                {...getReferenceProps()}
                className={wrapperClass}
            >
                {children}
            </TooltipWrapper>
            <FloatingPortal>
                {tooltipOpen && (
                    <AnimatePresence>
                        <StyledTooltip
                            ref={refs.setFloating}
                            initial={{
                                opacity: 0,
                                visibility: 'hidden',
                            }}
                            animate={
                                tooltipOpen
                                    ? {
                                          opacity: 1,
                                          visibility: 'visible',
                                      }
                                    : {
                                          opacity: 0,
                                          visibility: 'hidden',
                                      }
                            }
                            transition={{
                                duration: 0.15,
                                type: 'tween',
                            }}
                            style={floatingStyles}
                            {...getFloatingProps()}
                        >
                            <span>{title}</span>
                            <Arrow
                                placement={context.placement}
                                color="#1f2937"
                                colorDark="#000"
                            />
                        </StyledTooltip>
                    </AnimatePresence>
                )}
            </FloatingPortal>
        </>
    )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
