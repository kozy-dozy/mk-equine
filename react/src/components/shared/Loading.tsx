import styled from 'styled-components'

import Spinner from '@/components/ui/Spinner'

import type { ElementType, ReactNode } from 'react'

const CenterWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
`

// Removed unused CoverWrap styled-component

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.bg.overlay};
    z-index: 1;
`

const CenterAbsolute = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
`

const StyledDiv = styled.div`
    width: 100%;
    height: 100%;
`

interface BaseLoadingProps {
    asElement?: ElementType
    customLoader?: ReactNode
    loading: boolean
    spinnerClass?: string
    className?: string
    children?: ReactNode
}

interface LoadingProps extends BaseLoadingProps {
    type?: 'default' | 'cover'
}

const DefaultLoading = ({
    loading,
    children,
    spinnerClass,
    className,
    asElement: Component = 'div',
    customLoader,
}: BaseLoadingProps) => {
    if (!loading) return <>{children}</>

    return (
        <StyledDiv as={Component} className={className}>
            {customLoader ? (
                <>{customLoader}</>
            ) : (
                <CenterWrap>
                    <Spinner className={spinnerClass} size={40} />
                </CenterWrap>
            )}
        </StyledDiv>
    )
}

const CoveredLoading = ({
    loading,
    children,
    spinnerClass,
    className,
    asElement: Component = 'div',
    customLoader,
}: BaseLoadingProps) => {
    return (
        <Component
            className={className}
            style={loading ? { position: 'relative' } : undefined}
        >
            {children}
            {loading && <Overlay />}
            {loading && (
                <CenterAbsolute>
                    {customLoader ? (
                        <>{customLoader}</>
                    ) : (
                        <Spinner className={spinnerClass} size={40} />
                    )}
                </CenterAbsolute>
            )}
        </Component>
    )
}

const Loading = ({ type, ...rest }: LoadingProps) => {
    switch (type) {
        case 'cover':
            return <CoveredLoading {...rest} />
        default:
            return <DefaultLoading {...rest} />
    }
}
// No Tailwind or className usage. Already uses styled-components. No changes needed.

Loading.defaultProps = {
    loading: false,
    type: 'default',
    asElement: 'div',
}

export default Loading
