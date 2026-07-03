import styled from 'styled-components'

import type { ReactNode } from 'react'

interface HeaderProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
}

const HeaderEl = styled.header`
    background: #000;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`

const HeaderWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${({ theme }) => theme.spacing.md};
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    height: 90px;

    @media (min-width: 640px) {
        padding: 0 ${({ theme }) => theme.spacing.lg};
    }
`

const HeaderAction = styled.div`
    display: flex;
    align-items: center;
`

export default function Header({
    headerStart,
    headerEnd,
    headerMiddle,
}: HeaderProps) {
    return (
        <HeaderEl>
            <HeaderWrapper>
                <HeaderAction>{headerStart}</HeaderAction>
                {headerMiddle && <HeaderAction>{headerMiddle}</HeaderAction>}
                <HeaderAction>{headerEnd}</HeaderAction>
            </HeaderWrapper>
        </HeaderEl>
    )
}
