import styled from 'styled-components'
import isNil from 'lodash/isNil'
import {
    useContext,
    useCallback,
    useEffect,
    useRef,
    forwardRef,
    isValidElement,
    cloneElement,
} from 'react'
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi'

import { useConfig } from '../ConfigProvider'
import useUncertainRef from '../hooks/useUncertainRef'
import useUniqueId from '../hooks/useUniqueId'
import MenuItem from '../MenuItem'
import chainedFunction from '../utils/chainedFunction'
import { DROPDOWN_ITEM_TYPE } from '../utils/constants'

import DropdownContext from './context/dropdownContext'
import DropdownMenuContext, {
    useDropdownMenuContext,
    DropdownMenuContextProvider,
} from './context/dropdownMenuContext'
import MenuContext from './context/menuContext'

import type { CommonProps } from '../@types/common'
import type {
    SyntheticEvent,
    RefObject,
    ElementType,
    ReactElement,
} from 'react'

const MenuItemDivider = styled.li`
    height: 1px;
    background: ${({ theme }) => theme.colors.border.default};
    margin: ${({ theme }) => `${theme.spacing.xs} 0`};
    list-style: none;
`

const MenuItemHeader = styled.li`
    font-weight: 600;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.text.secondary};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    list-style: none;
`

const MenuItemCustom = styled.li`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    list-style: none;
`

const SubmenuWrapper = styled.li`
    position: relative;
`

export interface DropdownItemProps extends CommonProps {
    asElement?: ElementType
    active?: boolean
    disabled?: boolean
    submenu?: ReactElement<{
        hidden?: boolean
        submenuRef?: React.Ref<HTMLDivElement>
    }>
    eventKey?: string
    onClick?: () => void
    onSelect?: (eventKey: string, e: SyntheticEvent) => void
    variant?: 'default' | 'header' | 'divider' | 'custom'
}

const { DEFAULT, DIVIDER, HEADER, CUSTOM } = DROPDOWN_ITEM_TYPE

const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
    (props, ref) => {
        const {
            asElement: Component = 'li',
            children,
            active: activeProp,
            disabled,
            className,
            submenu,
            style,
            eventKey,
            onClick,
            onSelect,
            variant = DEFAULT,
            ...rest
        } = props

        const { mode, direction } = useConfig()

        const menuitemRef = useUncertainRef<HTMLElement>(
            ref,
        ) as RefObject<HTMLElement>
        const menuitemId = useUniqueId('menu-item-')
        const submenuRef = useRef<HTMLDivElement | null>(null)

        const dropdown = useContext(DropdownContext)
        const menu = useContext(MenuContext)
        const menuControl = useContext(DropdownMenuContext)
        const submenuControl = useDropdownMenuContext(
            submenuRef as RefObject<HTMLDivElement>,
        )

        const open = submenuControl.open

        const active =
            activeProp ||
            (!isNil(menu?.activeKey) && menu?.activeKey === eventKey) ||
            (!isNil(dropdown?.activeKey) && dropdown?.activeKey === eventKey)

        const openSubmenuIfExists = useCallback(() => {
            if (!submenu) {
                return
            }
            submenuControl.openMenu()
            submenuControl.focusItemAt(0)
        }, [submenu, submenuControl])

        const activate = useCallback(
            (e: SyntheticEvent) => {
                onSelect?.(eventKey as string, e)
                menu?.onSelect?.(eventKey as string, e)
            },
            [eventKey, onSelect, menu],
        )

        const handleClick = useCallback(
            (e: SyntheticEvent) => {
                if (disabled) {
                    return
                }

                if (submenu) {
                    openSubmenuIfExists()
                } else {
                    activate(e)
                }
            },
            [disabled, submenu, openSubmenuIfExists, activate],
        )

        const handleMouseOver = useCallback(() => {
            if (submenu) {
                submenuControl.openMenu()
            }
        }, [submenu, submenuControl])

        const handleMouseOut = useCallback(() => {
            if (submenu) {
                submenuControl.closeMenu()
            }
        }, [submenu, submenuControl])

        const menuitemEventHandlers: {
            onClick: (e: SyntheticEvent) => void
            onMouseOver?: () => void
            onMouseOut?: () => void
        } = {
            onClick: chainedFunction(handleClick, onClick),
        }

        const { registerItem, unregisterItem } = menuControl ?? {}

        if (submenu) {
            menuitemEventHandlers.onMouseOver = handleMouseOver
            menuitemEventHandlers.onMouseOut = handleMouseOut
        }

        useEffect(() => {
            if (variant !== DIVIDER && variant !== HEADER) {
                registerItem?.(menuitemRef.current, { disabled })
            }
            return () => {
                unregisterItem?.(menuitemId)
            }
        }, [
            registerItem,
            unregisterItem,
            menuitemRef,
            menuitemId,
            disabled,
            variant,
        ])

        if (variant === DIVIDER) {
            return (
                <MenuItemDivider
                    ref={menuitemRef as RefObject<HTMLLIElement>}
                    id={menuitemId}
                    style={style}
                    {...rest}
                />
            )
        }
        if (variant === HEADER) {
            return (
                <MenuItemHeader
                    ref={menuitemRef as RefObject<HTMLLIElement>}
                    id={menuitemId}
                    style={style}
                    {...rest}
                >
                    {children}
                </MenuItemHeader>
            )
        }
        if (variant === CUSTOM) {
            return (
                <MenuItemCustom
                    ref={menuitemRef as RefObject<HTMLLIElement>}
                    id={menuitemId}
                    style={style}
                    {...menuitemEventHandlers}
                    {...rest}
                >
                    {children}
                </MenuItemCustom>
            )
        }

        function renderChildren() {
            if (!isValidElement(children)) {
                return children
            }
            return cloneElement(children)
        }

        function renderSubmenu() {
            if (!submenu) {
                return null
            }

            return (
                <DropdownMenuContextProvider value={submenuControl}>
                    {cloneElement(submenu, {
                        submenuRef: submenuRef,
                        hidden: !open,
                    })}
                </DropdownMenuContextProvider>
            )
        }

        if (submenu) {
            return (
                <SubmenuWrapper
                    {...rest}
                    style={style}
                    {...menuitemEventHandlers}
                >
                    <MenuItem
                        ref={menuitemRef}
                        asElement="div"
                        id={menuitemId}
                        isActive={active}
                        eventKey={eventKey}
                        variant={mode}
                        className={`dropdown-submenu-item${className ? ` ${className}` : ''}`}
                    >
                        <span>{children}</span>
                        {direction === 'rtl' ? (
                            <HiChevronLeft />
                        ) : (
                            <HiChevronRight />
                        )}
                    </MenuItem>
                    {renderSubmenu()}
                </SubmenuWrapper>
            )
        }

        return (
            <MenuItem
                ref={menuitemRef}
                asElement="li"
                style={style}
                isActive={active}
                disabled={disabled}
                eventKey={eventKey}
                variant={mode}
                className={className}
                {...menuitemEventHandlers}
                {...rest}
            >
                {renderChildren()}
                {renderSubmenu()}
            </MenuItem>
        )
    },
)

DropdownItem.displayName = 'DropdownItem'

export default DropdownItem
