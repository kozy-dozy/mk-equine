import { useState, useEffect, Suspense, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Tabs from '@/components/ui/Tabs'

const Profile = lazy(() => import('./components/Profile'))
const Password = lazy(() => import('./components/Password'))

const { TabNav, TabList } = Tabs

const settingsMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    profile: { label: 'Profile', path: 'profile' },
    password: { label: 'Password', path: 'password' },
}
const ContainerStyled = styled(Container)`
    max-width: 800px;
    margin: 0 auto;
    padding: ${({ theme }) => `${theme.spacing.xl} 0 0 0`};
`

const TabContent = styled.div`
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg} ${theme.spacing.lg} ${theme.spacing.lg}`};
`

const Settings = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    const navigate = useNavigate()
    const location = useLocation()
    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1,
    )
    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/admin/settings/${val}`)
    }
    useEffect(() => {
        setCurrentTab(path)
    }, [path])
    return (
        <ContainerStyled>
            <AdaptableCard>
                <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                    <TabList>
                        {Object.keys(settingsMenu).map((key) => (
                            <TabNav key={key} value={key}>
                                {settingsMenu[key].label}
                            </TabNav>
                        ))}
                    </TabList>
                </Tabs>
                <TabContent>
                    <Suspense fallback={<></>}>
                        {currentTab === 'profile' && <Profile />}
                        {currentTab === 'password' && <Password />}
                    </Suspense>
                </TabContent>
            </AdaptableCard>
        </ContainerStyled>
    )
}

export default Settings
