import { forwardRef, ElementType } from 'react'
import styled from 'styled-components'

import { CommonProps } from '@/@types/common'

interface ContainerProps extends CommonProps {
    asElement?: ElementType
}

const StyledContainer = styled.div`
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    padding-left: ${({ theme }) => theme.spacing.md};
    padding-right: ${({ theme }) => theme.spacing.md};
`

const Container = forwardRef<HTMLElement, ContainerProps>((props, ref) => {
    const { children, asElement: Component = StyledContainer, ...rest } = props
    return (
        <Component ref={ref} {...rest}>
            {children}
        </Component>
    )
})

Container.displayName = 'Container'

export default Container
