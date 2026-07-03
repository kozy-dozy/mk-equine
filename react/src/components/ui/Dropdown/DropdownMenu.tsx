import { forwardRef, useContext } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'

import MenuContext from './context/menuContext'
import DropdownItem from './DropdownItem'

import type { DropdownInnerMenuProps } from './DropdownInnerMenu'
import type { ReactNode } from 'react'

export interface DropdownMenuProps extends DropdownInnerMenuProps {
    eventKey?: string
    title?: string | ReactNode
    id?: string
}

const StyledDropdownMenu = styled.ul`
    min-width: 160px;
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: ${({ theme }) => theme.shadow.md};
    padding: ${({ theme }) => `${theme.spacing.sm} 0`};
    margin: 0;
    list-style: none;
    z-index: 1000;
`
const StyledDropdownSubmenu = styled(StyledDropdownMenu)`
    left: 100%;
    top: 0;
    position: absolute;
    min-width: 160px;
`

const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
    (props, ref) => {
        const {
            eventKey,
            title,
            className,
            placement,
            activeKey,
            onSelect,
            hidden,
            menuClass,
            ...rest
        } = props
        const parentMenu = useContext(MenuContext)

        const dropdownSubmenu = (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <StyledDropdownSubmenu ref={ref as any} {...rest} />
        )

        if (parentMenu) {
            return (
                <DropdownItem
                    className={className}
                    submenu={dropdownSubmenu}
                    eventKey={eventKey}
                >
                    {title}
                </DropdownItem>
            )
        }

        return (
            <AnimatePresence mode="wait">
                {!hidden && (
                    <motion.div
                        initial={{ opacity: 0, transform: 'rotateX(40deg)' }}
                        animate={{ opacity: 1, transform: 'rotateX(0deg)' }}
                        exit={{ opacity: 0, transform: 'rotateX(40deg)' }}
                        transition={{ duration: 0.15, type: 'tween' }}
                        style={{ position: 'absolute', zIndex: 1000 }}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <StyledDropdownMenu
                            ref={ref as any}
                            className={className}
                            {...rest}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        )
    },
)

DropdownMenu.displayName = 'DropdownMenu'

export default DropdownMenu
