import React, { Suspense, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'

import { Loading } from '@kozydozy/shared'
import { Card } from '@kozydozy/ui'
import Tabs from '@kozydozy/ui/Tabs'
import SEO from '@/views/ecom/components/SEO'

const { TabNav, TabList, TabContent } = Tabs
const SettingsTab = React.lazy(() => import('./SettingsTab'))

const PageWrap = styled.div`
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing['2xl']}`};
`

const TabBody = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
`
const TabLoaderWrap = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
`

function TabLoader() {
    return (
        <TabLoaderWrap>
            <Loading loading={true} type="cover" />
        </TabLoaderWrap>
    )
}

type TabKey = 'settings'

export default function AccountPage() {
    const navigate = useNavigate()
    const [params] = useSearchParams()

    const tabs = useMemo(
        () => [{ key: 'settings' as const, label: 'Settings', Comp: SettingsTab }],
        [],
    )

    const currentTab = (params.get('tab') as TabKey) || 'settings'

    const setTab = (next: TabKey) => {
        const nextParams = new URLSearchParams(params)
        nextParams.set('tab', next)
        navigate(`/profile?${nextParams.toString()}`, { replace: true })
    }

    return (
        <>
            <SEO noindex title="My Profile" canonicalPath="/profile" />
            <PageWrap>
                <Card>
                    <Tabs
                        value={currentTab}
                        onChange={(v) => setTab(v as TabKey)}
                    >
                        <TabList>
                            {tabs.map((t) => (
                                <TabNav key={t.key} value={t.key}>
                                    {t.label}
                                </TabNav>
                            ))}
                        </TabList>

                        <TabBody>
                            {tabs.map((tab) => (
                                <TabContent key={tab.key} value={tab.key}>
                                    <Suspense fallback={<TabLoader />}>
                                        <tab.Comp />
                                    </Suspense>
                                </TabContent>
                            ))}
                        </TabBody>
                    </Tabs>
                </Card>
            </PageWrap>
        </>
    )
}
