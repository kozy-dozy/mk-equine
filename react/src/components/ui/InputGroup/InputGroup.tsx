import { forwardRef } from 'react'
import styled from 'styled-components'

import { useConfig } from '../ConfigProvider'
import { useForm } from '../Form/context'

import { InputGroupContextProvider, InputGroupContextConsumer } from './context'

import type { CommonProps, TypeAttributes } from '../@types/common'

export interface InputGroupProps extends CommonProps {
    size?: TypeAttributes.ControlSize
}

const StyledInputGroup = styled.div`
    display: flex;
    align-items: stretch;
    width: 100%;
    gap: ${({ theme }) => theme.spacing.sm};
`

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>((props, ref) => {
    const { children, size } = props
    const { controlSize } = useConfig()
    const formControlSize = useForm()?.size
    const inputGroupSize = size || formControlSize || controlSize
    const contextValue = {
        size: inputGroupSize,
    }
    return (
        <InputGroupContextProvider value={contextValue}>
            <InputGroupContextConsumer>
                {() => (
                    <StyledInputGroup ref={ref}>{children}</StyledInputGroup>
                )}
            </InputGroupContextConsumer>
        </InputGroupContextProvider>
    )
})

InputGroup.displayName = 'InputGroup'

export default InputGroup
