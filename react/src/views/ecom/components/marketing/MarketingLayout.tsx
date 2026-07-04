import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import MarketingFooter from './MarketingFooter'
import MarketingNav, { NAV_HEIGHT } from './MarketingNav'

const Shell = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg.page};
`

const SkipLink = styled.a`
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 1000;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    border-radius: ${({ theme }) => theme.radius.md};
    text-decoration: none;

    &:focus {
        left: ${({ theme }) => theme.spacing.sm};
        top: ${({ theme }) => theme.spacing.sm};
    }
`

const Main = styled.main<{ $offset: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: ${({ $offset }) => ($offset ? `${NAV_HEIGHT}px` : '0')};
`

export default function MarketingLayout() {
    const { pathname } = useLocation()
    // The home page has a full-bleed hero that sits *under* the transparent
    // nav. Every other page needs to start below the fixed bar.
    const isHome = pathname === '/'

    return (
        <Shell>
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <MarketingNav forceSolid={!isHome} />
            <Main $offset={!isHome} id="main-content">
                <Outlet />
            </Main>
            <MarketingFooter />
        </Shell>
    )
}
