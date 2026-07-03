import styled from 'styled-components'

import { FormContextProvider } from './context'

import type { FormContextProps } from './context'
import type { TypeAttributes } from '../@types/common'

export interface FormContainerProps {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
    layout?: TypeAttributes.FormLayout
    labelWidth?: string | number
    size?: TypeAttributes.ControlSize
}

const ContainerWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    width: 100%;
`

const FormContainer = ({
    children,
    className,
    style,
    labelWidth = 100,
    layout = 'vertical',
    size = 'md',
}: FormContainerProps) => {
    const contextValue: FormContextProps = { labelWidth, layout, size }

    return (
        <FormContextProvider value={contextValue}>
            <ContainerWrap className={className} style={style}>
                {children}
            </ContainerWrap>
        </FormContextProvider>
    )
}

FormContainer.displayName = 'FormContainer'

export default FormContainer
