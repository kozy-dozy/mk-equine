import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

import AdminHeader from '@/views/admin/components/AdminHeader'
import SideNav from '@/views/admin/components/SideNav'

const LayoutRoot = styled.div`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg.page};
`

const LayoutMain = styled.div`
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
`

const LayoutContent = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 100vh;
    min-width: 0;
    position: relative;
    width: 100%;
    background: ${({ theme }) => theme.colors.bg.page};
    border-left: 1px solid ${({ theme }) => theme.colors.border.default};
`

export default function AdminLayout() {
    return (
        <LayoutRoot>
            <LayoutMain>
                <SideNav />
                <LayoutContent>
                    <AdminHeader />
                    <Outlet />
                </LayoutContent>
            </LayoutMain>
        </LayoutRoot>
    )
}
