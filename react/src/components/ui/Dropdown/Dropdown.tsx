import { forwardRef, useRef, useCallback, useEffect } from 'react'

import useRootClose from '../hooks/useRootClose'
import useUniqueId from '../hooks/useUniqueId'
import arrayIndexOf from '../utils/arrayIndexOf'
import chainedFunction from '../utils/chainedFunction'
import { PLACEMENT } from '../utils/constants'

import DropdownContext from './context/dropdownContext'
import DropdownMenuContext, {
    useDropdownMenuContext,
} from './context/dropdownMenuContext'
import DropdownMenu from './DropdownMenu'
import DropdownToggle from './DropdownToggle'

import type { DropdownToggleSharedProps } from './DropdownToggle'
import type { CommonProps } from '../@types/common'
import type { DropdownPlacement } from '../@types/placement'
import type { SyntheticEvent, CSSProperties } from 'react'

export interface DropdownProps extends CommonProps, DropdownToggleSharedProps {
    title?: string | React.ReactNode
    menuClass?: string
    menuStyle?: CSSProperties
    disabled?: boolean
    activeKey?: string
    forceOpen?: boolean
    trigger?: 'click' | 'hover' | 'context'
    onClick?: (event: SyntheticEvent) => void
    onMouseEnter?: (event: SyntheticEvent) => void
    onMouseLeave?: (event: SyntheticEvent) => void
    onContextMenu?: (event: SyntheticEvent) => void
    onSelect?: (eventKey: string, event: SyntheticEvent) => void
    onOpen?: () => void
    onClose?: () => void
    onToggle?: (open?: boolean) => void
    showArrow?: boolean
}

const { BOTTOM_START } = PLACEMENT as Record<string, DropdownPlacement>

const CLICK = 'click'
const HOVER = 'hover'
const CONTEXT = 'context'

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>((props, ref) => {
    const {
        title,
        children,
        menuClass,
        menuStyle,
        disabled,
        renderTitle,
        placement = BOTTOM_START,
        activeKey,
        toggleClassName,
        trigger = 'click',
        style,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onContextMenu,
        onSelect,
        onOpen,
        onClose,
        onToggle,
        showArrow = true,
        forceOpen,
        ...rest
    } = props

    const overlayTarget = useRef<HTMLDivElement | null>(null)
    const triggerTarget = useRef<HTMLButtonElement | null>(null)
    const menuControl = useDropdownMenuContext(
        overlayTarget as React.RefObject<HTMLDivElement>,
    )
    const open = menuControl.open
    const isForced = typeof forceOpen === 'boolean'
    const computedOpen = isForced ? forceOpen : open

    const buttonId = useUniqueId('dropdown-toggle-')
    const menuId = useUniqueId('base-menu-')

    const handleToggle = useCallback(
        (isOpen?: boolean) => {
            const nextOpen = typeof isOpen === 'undefined' ? !open : isOpen
            const fn = nextOpen ? onOpen : onClose

            fn?.()
            onToggle?.(nextOpen)
            if (!isForced) {
                if (nextOpen) {
                    menuControl.openMenu()
                } else {
                    menuControl.closeMenu()
                }
            }
        },
        [onClose, onOpen, onToggle, open, menuControl, isForced],
    )

    const handleClick = useCallback(
        (e: SyntheticEvent) => {
            e.preventDefault()
            if (disabled) {
                return
            }
            handleToggle()
        },
        [disabled, handleToggle],
    )

    const handleMouseEnter = useCallback(() => {
        if (!disabled) {
            handleToggle(true)
        }
    }, [disabled, handleToggle])

    const handleMouseLeave = useCallback(() => {
        if (!disabled) {
            handleToggle(false)
        }
    }, [disabled, handleToggle])

    const handleSelect = (eventKey: string, event: SyntheticEvent) => {
        onSelect?.(eventKey, event)
        handleToggle(false)
    }

    useRootClose(() => handleToggle(false), {
        triggerTarget,
        overlayTarget,
        disabled: !computedOpen,
        listenEscape: false,
    })

    useEffect(() => {
        if (!isForced) return
        if (forceOpen) {
            menuControl.openMenu()
        } else {
            menuControl.closeMenu()
        }
    }, [forceOpen, isForced, menuControl])

    const dropdownProps = {
        onMouseEnter,
        onMouseLeave,
    }

    const toggleEventHandlers = {
        onClick: onClick,
        onContextMenu,
    }

    if (arrayIndexOf(CLICK, trigger)) {
        toggleEventHandlers.onClick = chainedFunction(
            handleClick,
            toggleEventHandlers.onClick,
        )
    }

    if (arrayIndexOf(CONTEXT, trigger)) {
        toggleEventHandlers.onContextMenu = chainedFunction(
            handleClick,
            onContextMenu,
        )
    }

    if (arrayIndexOf(HOVER, trigger)) {
        dropdownProps.onMouseEnter = chainedFunction(
            handleMouseEnter,
            onMouseEnter,
        )
        dropdownProps.onMouseLeave = chainedFunction(
            handleMouseLeave,
            onMouseLeave,
        )
    }

    const toggleElement = (
        <DropdownToggle
            {...rest}
            {...toggleEventHandlers}
            ref={triggerTarget}
            id={buttonId}
            className={toggleClassName}
            renderTitle={renderTitle}
            disabled={disabled}
            placement={placement}
            showArrow={showArrow}
        >
            {title}
        </DropdownToggle>
    )

    const menuElement = (
        <DropdownMenu
            ref={overlayTarget}
            className={menuClass}
            style={menuStyle}
            activeKey={activeKey}
            hidden={!computedOpen}
            placement={placement}
            id={menuId}
            onSelect={handleSelect}
        >
            {children}
        </DropdownMenu>
    )

    return (
        <DropdownContext.Provider value={{ activeKey }}>
            <div
                {...dropdownProps}
                ref={ref}
                style={style}
                className="dropdown"
            >
                {toggleElement}
                <DropdownMenuContext.Provider value={menuControl}>
                    {menuElement}
                </DropdownMenuContext.Provider>
            </div>
        </DropdownContext.Provider>
    )
})

Dropdown.displayName = 'Dropdown'

export default Dropdown
