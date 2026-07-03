import {
    useFloating,
    useInteractions,
    useDismiss,
    useRole,
    useFocus,
    useClick,
    useId,
    autoUpdate,
    offset,
    flip,
    shift,
} from '@floating-ui/react'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { forwardRef } from 'react'
import { HiOutlineCalendar } from 'react-icons/hi'
import styled from 'styled-components'

import CloseButton from '../CloseButton'
import useMergedRef from '../hooks/useMergeRef'
import { Input } from '../Input'

import type { CommonProps, TypeAttributes } from '../@types/common'
import type {
    ReactNode,
    FocusEvent,
    HTMLInputTypeAttribute,
    KeyboardEvent,
    MouseEvent,
    ChangeEvent,
} from 'react'

const StyledCalendarIcon = styled(HiOutlineCalendar)`
    font-size: ${({ theme }) => theme.fontSize.lg};
`

const StyledCloseButton = styled(CloseButton)`
    font-size: ${({ theme }) => theme.fontSize.md};
`

const PickerDropdown = styled.div`
    z-index: 1050;
`

const PickerPanel = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: ${({ theme }) => theme.shadow.md};
    padding: ${({ theme }) => theme.spacing.sm};
`

dayjs.extend(localizedFormat)

export interface BasePickerSharedProps {
    clearable?: boolean
    clearButton?: string | ReactNode
    disabled?: boolean
    inputtable?: boolean
    inputPrefix?: string | ReactNode
    inputSuffix?: string | ReactNode
    name?: string
    onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void
    onDropdownOpen?: () => void
    onDropdownClose?: () => void
    onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void
    placeholder?: string
    size?: TypeAttributes.ControlSize
    type?: HTMLInputTypeAttribute
    form?: unknown
    field?: unknown
}

interface BasePickerProps extends CommonProps, BasePickerSharedProps {
    dropdownOpened: boolean
    inputtableBlurClose?: boolean
    inputLabel?: string
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onClear?: (event: MouseEvent<HTMLElement>) => void
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
    setDropdownOpened: (opened: boolean) => void
}

const BasePicker = forwardRef<HTMLInputElement, BasePickerProps>(
    (props, ref) => {
        const {
            clearable = true,
            clearButton,
            children,
            disabled,
            dropdownOpened,
            inputtable,
            inputtableBlurClose = true,
            inputLabel,
            inputPrefix,
            inputSuffix = <StyledCalendarIcon />,
            name,
            onDropdownOpen,
            onDropdownClose,
            onBlur,
            onFocus,
            onChange,
            onKeyDown,
            onClear,
            placeholder,
            setDropdownOpened,
            size,
            type,
            form,
            field,
        } = props

        const closeDropdown = () => {
            setDropdownOpened(false)
            onDropdownClose?.()
        }

        const openDropdown = () => {
            setDropdownOpened(true)
            onDropdownOpen?.()
        }

        const toggleDropdown = (open: boolean) => {
            setDropdownOpened(open)
            open ? onDropdownOpen?.() : onDropdownClose?.()
        }

        const handleInputClick = () => {
            inputtable ? openDropdown() : toggleDropdown(!dropdownOpened)
        }

        const suffixIconSlot = clearable ? (
            clearButton ? (
                <div role="presentation" onClick={onClear}>
                    {clearButton}
                </div>
            ) : (
                <StyledCloseButton onClick={onClear} />
            )
        ) : inputSuffix ? (
            <>{inputSuffix}</>
        ) : null

        const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            typeof onKeyDown === 'function' && onKeyDown(event)
            if (
                (event.key === 'Space' || event.key === 'Enter') &&
                !inputtable
            ) {
                toggleDropdown(!dropdownOpened)
            }
        }

        const handleInputBlur = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            typeof onBlur === 'function' && onBlur(event)
            if (inputtableBlurClose) {
                closeDropdown()
            }
        }

        const handleInputFocus = (
            event: FocusEvent<HTMLInputElement, Element>,
        ) => {
            typeof onFocus === 'function' && onFocus(event)
        }

        const { refs, floatingStyles, context } = useFloating({
            open: dropdownOpened,
            onOpenChange: toggleDropdown,
            placement: 'bottom-start',
            middleware: [
                offset(10),
                flip({
                    fallbackAxisSideDirection: 'start',
                }),
                shift(),
            ],
            whileElementsMounted: autoUpdate,
        })

        const focus = useFocus(context)
        const click = useClick(context)
        const dismiss = useDismiss(context)
        const role = useRole(context)

        const { getReferenceProps, getFloatingProps } = useInteractions([
            inputtable ? focus : click,
            dismiss,
            role,
        ])

        const headingId = useId()

        return (
            <>
                <Input
                    ref={useMergedRef(ref, refs.setReference)}
                    form={form}
                    field={field}
                    placeholder={placeholder}
                    size={size}
                    name={name}
                    value={inputLabel}
                    readOnly={!inputtable}
                    suffix={suffixIconSlot}
                    prefix={inputPrefix}
                    autoComplete="off"
                    type={type}
                    disabled={disabled}
                    asElement={'input'}
                    onKeyDown={handleKeyDown}
                    onClick={handleInputClick}
                    onChange={onChange}
                    {...getReferenceProps({
                        onBlur: handleInputBlur,
                        onFocus: handleInputFocus,
                    })}
                />
                {dropdownOpened && (
                    <PickerDropdown
                        ref={refs.setFloating}
                        style={floatingStyles}
                        aria-labelledby={headingId}
                        {...getFloatingProps()}
                    >
                        <PickerPanel>{children}</PickerPanel>
                    </PickerDropdown>
                )}
            </>
        )
    },
)

BasePicker.displayName = 'BasePicker'

export default BasePicker
