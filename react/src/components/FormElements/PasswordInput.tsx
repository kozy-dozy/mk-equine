import { useState } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import styled from 'styled-components'

import { Input, InputProps } from '@/components/ui/Input'

import type { MouseEvent } from 'react'

interface PasswordInputProps extends InputProps {
    onVisibleChange?: (visible: boolean) => void
}

const EyeToggle = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    pointer-events: auto;
    font-size: ${({ theme }) => theme.fontSize.xl};
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.secondary};
    transition: color ${({ theme }) => theme.transition.fast};

    &:hover {
        color: ${({ theme }) => theme.colors.primary};
    }
`

export default function PasswordInput(props: PasswordInputProps) {
    const { onVisibleChange, ...rest } = props
    const [pwInputType, setPwInputType] = useState('password')

    const onPasswordVisibleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const nextValue = pwInputType === 'password' ? 'text' : 'password'
        setPwInputType(nextValue)
        onVisibleChange?.(nextValue === 'text')
    }

    const isVisible = pwInputType === 'text'

    return (
        <Input
            {...rest}
            type={pwInputType}
            suffix={
                <EyeToggle
                    type="button"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    onClick={onPasswordVisibleClick}
                >
                    {isVisible ? (
                        <HiOutlineEye aria-hidden="true" />
                    ) : (
                        <HiOutlineEyeOff aria-hidden="true" />
                    )}
                </EyeToggle>
            }
        />
    )
}
