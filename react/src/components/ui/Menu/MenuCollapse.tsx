import { motion } from 'framer-motion'
import { useState, useEffect, useContext } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import styled from 'styled-components'

import { CollapseContextProvider } from './context/collapseContext'
import MenuContext from './context/menuContext'

import type { CommonProps } from '../@types/common'
import type { ReactNode, MouseEvent } from 'react'

export interface MenuCollapseProps extends CommonProps {
    eventKey?: string
    expanded?: boolean
    label?: string | ReactNode
    onToggle?: (expanded: boolean, e: MouseEvent<HTMLDivElement>) => void
}

const MenuCollapseWrap = styled.div`
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const MenuCollapseItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.bg.hover};
    transition: background 0.2s;
    &:hover {
        background: ${({ theme }) => theme.colors.border.default};
    }
`

const MenuCollapseLabel = styled.span`
    display: flex;
    align-items: center;
`

const MenuCollapseIcon = styled(motion.span)`
    font-size: ${({ theme }) => theme.fontSize.lg};
    margin-top: ${({ theme }) => theme.spacing.xs};
    margin-left: ${({ theme }) => theme.spacing.sm};
`

const MenuCollapse = (props: MenuCollapseProps) => {
    const {
        children,
        eventKey,
        expanded = false,
        label = null,
        onToggle,
    } = props

    const [isExpanded, setIsExpanded] = useState(expanded)

    const { sideCollapsed, defaultExpandedKeys } =
        useContext(MenuContext)

    useEffect(() => {
        if ((defaultExpandedKeys as string[]).includes(eventKey as string)) {
            setIsExpanded(true)
        }
        if (expanded !== isExpanded) {
            setIsExpanded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, onToggle, eventKey, defaultExpandedKeys])

    const toggleCollapse = (e: MouseEvent<HTMLDivElement>) => {
        if (typeof onToggle === 'function') {
            onToggle(!isExpanded, e)
        }
        setIsExpanded(!isExpanded)
    }

    return (
        <MenuCollapseWrap>
            <MenuCollapseItem role="presentation" onClick={toggleCollapse}>
                <MenuCollapseLabel>{label}</MenuCollapseLabel>
                <MenuCollapseIcon
                    initial={{ transform: 'rotate(0deg)' }}
                    animate={{
                        transform: isExpanded
                            ? 'rotate(-180deg)'
                            : 'rotate(0deg)',
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {sideCollapsed ? null : <HiChevronDown />}
                </MenuCollapseIcon>
            </MenuCollapseItem>
            <CollapseContextProvider value={isExpanded}>
                <motion.ul
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {children}
                </motion.ul>
            </CollapseContextProvider>
        </MenuCollapseWrap>
    )
}

MenuCollapse.displayName = 'MenuCollapse'

export default MenuCollapse
