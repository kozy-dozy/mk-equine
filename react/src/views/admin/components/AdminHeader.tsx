import styled from 'styled-components'

import SideNavToggle from '@kozydozy/layout/SideNavToggle'
import ModeSwitcher from '@kozydozy/layout/ModeSwitcher'
import UserDropdown from '@/components/template/UserDropdown'
import AdminMobileNav from '@/views/admin/components/AdminMenuContent/AdminMobileNav'
import { trackEvent } from '@/utils/analytics/googleAnalytics'

const HeaderEl = styled.header`
    position: sticky;
    top: 0;
    z-index: ${({ theme }) => theme.zIndex.dropdown};
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: ${({ theme }) => theme.colors.bg.card};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

const HeaderSide = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`

export default function AdminHeader() {
    return (
        <HeaderEl>
            <HeaderSide>
                <AdminMobileNav />
                <SideNavToggle />
            </HeaderSide>
            <HeaderSide>
                <ModeSwitcher
                    onToggle={(mode) =>
                        trackEvent('toggle_theme', {
                            to: mode,
                            location: 'header',
                        })
                    }
                />
                <UserDropdown hoverable={false} />
            </HeaderSide>
        </HeaderEl>
    )
}
