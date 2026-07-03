import { useState } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import styled from 'styled-components'

import { Input, InputProps } from '@/components/ui/Input'

import type { MouseEvent } from 'react'

interface PasswordInputProps extends InputProps {
    onVisibleChange?: (visible: boolean) => void
}

const EyeToggle = styled.span`
    cursor: pointer;
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

    const onPasswordVisibleClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        const nextValue = pwInputType === 'password' ? 'text' : 'password'
        setPwInputType(nextValue)
        onVisibleChange?.(nextValue === 'text')
    }

    return (
        <Input
            {...rest}
            type={pwInputType}
            suffix={
                <EyeToggle onClick={onPasswordVisibleClick}>
                    {pwInputType === 'password' ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </EyeToggle>
            }
        />
    )
}
