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
            <MarketingNav forceSolid={!isHome} />
            <Main $offset={!isHome}>
                <Outlet />
            </Main>
            <MarketingFooter />
        </Shell>
    )
}
