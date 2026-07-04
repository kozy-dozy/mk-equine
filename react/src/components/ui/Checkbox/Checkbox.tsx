import { forwardRef, useContext, useCallback, useState } from 'react'
import styled from 'styled-components'

import CheckboxGroupContext from './context'

import type { CheckboxValue } from './context'
import type { CommonProps } from '../@types/common'
import type { ChangeEvent, Ref } from 'react'

export interface CheckboxProps extends CommonProps {
    checked?: boolean
    color?: string
    defaultChecked?: boolean
    disabled?: boolean
    labelRef?: Ref<HTMLLabelElement>
    name?: string
    onChange?: (values: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    value?: CheckboxValue
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    field?: any
}

const CheckboxLabel = styled.label<{ $disabled?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    user-select: none;
`

const HiddenCheckbox = styled.input`
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    margin: 0;
`

const Box = styled.span`
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: ${({ theme }) => theme.radius.sm};
    border: 1.5px solid ${({ theme }) => theme.colors.border.strong};
    background: ${({ theme }) => theme.colors.bg.card};
    color: ${({ theme }) => theme.colors.text.inverse};
    transition:
        background 0.15s ease,
        border-color 0.15s ease;

    svg {
        width: 12px;
        height: 12px;
        opacity: 0;
        transition: opacity 0.15s ease;
    }

    ${HiddenCheckbox}:checked + & {
        background: ${({ theme }) => theme.colors.primary};
        border-color: ${({ theme }) => theme.colors.primary};

        svg {
            opacity: 1;
        }
    }

    ${HiddenCheckbox}:focus-visible + & {
        outline: 2px solid ${({ theme }) => theme.colors.primary};
        outline-offset: 2px;
    }
`

const LabelText = styled.span<{ $disabled?: boolean }>`
    opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
    const {
        name: nameContext,
        value: groupValue,
        onChange: onGroupChange,
    } = useContext(CheckboxGroupContext)

    const {
        onChange,
        children,
        disabled,
        readOnly,
        name = nameContext,
        defaultChecked,
        value,
        checked: controlledChecked,
        labelRef,
        field,
        className,
        // `color` was a legacy Tailwind accent prop; the styled control uses the theme
        color: _color,
        ...rest
    } = props

    const isChecked = useCallback(() => {
        if (typeof groupValue !== 'undefined' && typeof value !== 'undefined') {
            return groupValue.some((i) => i === value)
        }
        return controlledChecked || defaultChecked
    }, [controlledChecked, groupValue, value, defaultChecked])

    const [checkboxChecked, setCheckboxChecked] = useState(isChecked())

    const getControlProps = () => {
        let checkedValue = checkboxChecked

        let groupChecked = { checked: checkedValue }
        let singleChecked: {
            value: boolean
            defaultChecked?: boolean
            checked?: boolean
        } = {
            value: checkedValue as boolean,
        }

        if (typeof controlledChecked !== 'undefined') {
            singleChecked.checked = controlledChecked
        }

        if (field) {
            checkedValue =
                typeof field.value === 'boolean' ? field.value : defaultChecked
            singleChecked = {
                value: checkedValue as boolean,
                checked: checkedValue,
            }
        }

        if (typeof groupValue !== 'undefined') {
            groupChecked = { checked: groupValue.includes(value as never) }
        }

        if (defaultChecked) {
            singleChecked.defaultChecked = defaultChecked
        }
        return typeof groupValue !== 'undefined' ? groupChecked : singleChecked
    }

    const controlProps = getControlProps()

    const onCheckboxChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            let nextChecked = !checkboxChecked

            if (typeof groupValue !== 'undefined') {
                nextChecked = !groupValue.includes(value as never)
            }

            if (disabled || readOnly) {
                return
            }

            setCheckboxChecked(nextChecked)
            onChange?.(nextChecked, e)
            onGroupChange?.(value as CheckboxValue, nextChecked, e)
        },
        [
            checkboxChecked,
            disabled,
            readOnly,
            setCheckboxChecked,
            onChange,
            value,
            onGroupChange,
            groupValue,
        ],
    )

    return (
        <CheckboxLabel
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ref={labelRef as any}
            className={className}
            $disabled={disabled}
        >
            <HiddenCheckbox
                ref={ref}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                onChange={onCheckboxChange}
                {...controlProps}
                {...field}
                {...rest}
            />
            <Box aria-hidden="true">
                <svg viewBox="0 0 12 10" fill="none">
                    <path
                        d="M1 5.2 4.3 8.5 11 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Box>
            {children ? (
                <LabelText $disabled={disabled}>{children}</LabelText>
            ) : null}
        </CheckboxLabel>
    )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
