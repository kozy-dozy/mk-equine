import { forwardRef, useState, useEffect } from 'react'
import styled from 'styled-components'

import { Spinner } from '../Spinner'

import type { ReactNode, ChangeEvent, Ref } from 'react'

export interface SwitcherProps {
    checked?: boolean
    checkedContent?: string | ReactNode
    color?: string
    defaultChecked?: boolean
    disabled?: boolean
    isLoading?: boolean
    labelRef?: Ref<HTMLLabelElement>
    name?: string
    onChange?: (checked: boolean, e: ChangeEvent<HTMLInputElement>) => void
    readOnly?: boolean
    unCheckedContent?: string | ReactNode
    field?: any
    className?: string
}

const SwitcherLabel = styled.label<{ $checked: boolean; $disabled: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
    position: relative;
    user-select: none;

    input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
    }
`

const Track = styled.span<{ $checked: boolean }>`
    display: inline-flex;
    align-items: center;
    width: 40px;
    height: 22px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ $checked, theme }) =>
        $checked ? theme.colors.primary : theme.colors.border.strong};
    transition: background ${({ theme }) => theme.transition.fast};
    position: relative;
    flex-shrink: 0;
`

const Thumb = styled.span<{ $checked: boolean }>`
    position: absolute;
    top: ${({ theme }) => theme.spacing.xxs};
    left: ${({ $checked, theme }) => ($checked ? '20px' : theme.spacing.xxs)};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.bg.card};
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: left ${({ theme }) => theme.transition.fast};
    display: flex;
    align-items: center;
    justify-content: center;
`

const Switcher = forwardRef<HTMLInputElement, SwitcherProps>((props, ref) => {
    const {
        checked,
        checkedContent,
        className,
        defaultChecked,
        disabled,
        isLoading = false,
        labelRef,
        name,
        onChange,
        readOnly,
        unCheckedContent,
        field,
        ...rest
    } = props

    const [isChecked, setIsChecked] = useState(defaultChecked || checked || false)

    useEffect(() => {
        if (typeof checked !== 'undefined') {
            setIsChecked(checked)
        }
    }, [checked])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disabled || readOnly || isLoading) return
        const next = !isChecked
        if (typeof checked === 'undefined') {
            setIsChecked(next)
        }
        onChange?.(next, e)
    }

    return (
        <SwitcherLabel
            ref={labelRef as any}
            className={className}
            $checked={isChecked}
            $disabled={!!disabled}
        >
            <input
                ref={ref}
                type="checkbox"
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                checked={isChecked}
                onChange={handleChange}
                {...field}
                {...rest}
            />
            <Track $checked={isChecked}>
                <Thumb $checked={isChecked}>
                    {isLoading && <Spinner size={12} />}
                </Thumb>
            </Track>
            {isChecked ? checkedContent : unCheckedContent}
        </SwitcherLabel>
    )
})

Switcher.displayName = 'Switcher'

export default Switcher
