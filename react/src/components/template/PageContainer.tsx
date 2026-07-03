import styled from 'styled-components'
import { Suspense } from 'react'

import Container from '@/components/shared/Container'
import Footer from '@/components/template/Footer'

import type { CommonProps } from '@/@types/common'
import type { Meta } from '@/@types/routes'
import type { ElementType, ComponentPropsWithRef } from 'react'

export interface PageContainerProps extends CommonProps, Meta {
    contained?: boolean
}

const StyledPageContainer = styled.div`
    height: 100%;
    display: flex;
    flex: auto;
    flex-direction: column;
    justify-content: space-between;
    animation: slide-fade-in 0.3s;
`

const PageContainerMain = styled.main`
    height: 100%;
`

const PageContainerInner = styled.div`
    position: relative;
    height: 100%;
    display: flex;
    flex: auto;
    flex-direction: column;
`

const PageContainerHeader = styled.div<{ $contained?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    ${({ $contained }) =>
        $contained &&
        'max-width: 1200px; margin-left: auto; margin-right: auto;'}
`

const ContainerFull = styled(Container)`
    height: 100%;
`

const CustomHeader = <T extends ElementType>({
    header,
    ...props
}: {
    header: T
} & ComponentPropsWithRef<T>) => {
    const Header = header
    return <Header {...props} />
}

export default function PageContainer(props: PageContainerProps) {
    const {
        pageContainerType = 'default',
        children,
        header,
        contained = false,
        extraHeader,
        footer = true,
    } = props

    return (
        <StyledPageContainer>
            <PageContainerMain>
                <PageContainerInner>
                    {(header || extraHeader) && (
                        <PageContainerHeader $contained={contained}>
                            <div>
                                {header && typeof header === 'string' && (
                                    <h3>{header}</h3>
                                )}
                                <Suspense fallback={<div></div>}>
                                    {header && typeof header !== 'string' && (
                                        <CustomHeader header={header} />
                                    )}
                                </Suspense>
                            </div>
                            <Suspense fallback={<div></div>}>
                                {extraHeader &&
                                    typeof extraHeader !== 'string' && (
                                        <CustomHeader header={extraHeader} />
                                    )}
                            </Suspense>
                        </PageContainerHeader>
                    )}
                    {pageContainerType === 'contained' ? (
                        <ContainerFull>
                            <>{children}</>
                        </ContainerFull>
                    ) : (
                        <>{children}</>
                    )}
                </PageContainerInner>
            </PageContainerMain>
            {footer && <Footer />}
        </StyledPageContainer>
    )
}
