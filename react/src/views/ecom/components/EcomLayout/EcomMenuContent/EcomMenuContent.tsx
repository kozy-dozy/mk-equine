import styled from 'styled-components'

import AuthorityCheck from '@/components/shared/AuthorityCheck'
import navigationConfig from '@/configs/navigation/ecom'
import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

import EcomMenuItem from './EcomMenuItem'

import type { NavMode } from '@/@types/theme'

type EcomMenuContentProps = {
    manuVariant: NavMode
    userAuthority?: string[]
    layout?: 'inline' | 'stack'
    darkBg?: boolean
    onMenuItemClick?: () => void
}

const InlineNav = styled.nav`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
`

const StackNav = styled.nav`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: ${({ theme }) => theme.spacing.xxs};
`

const ItemWrap = styled.div<{ $stack: boolean }>`
    width: ${({ $stack }) => ($stack ? '100%' : 'auto')};
`

export default function EcomMenuContent({
    manuVariant,
    userAuthority = [],
    layout = 'inline',
    darkBg = false,
    onMenuItemClick,
}: EcomMenuContentProps) {
    const isStack = layout === 'stack'
    const Nav = isStack ? StackNav : InlineNav

    return (
        <Nav>
            {navigationConfig.map((nav) => {
                if (nav.type === NAV_ITEM_TYPE_ITEM) {
                    return (
                        <AuthorityCheck
                            key={nav.key}
                            authority={nav.authority}
                            userAuthority={userAuthority}
                        >
                            <ItemWrap $stack={isStack}>
                                <EcomMenuItem
                                    isLink
                                    nav={nav}
                                    manuVariant={manuVariant}
                                    darkBg={darkBg}
                                    onLinkClick={onMenuItemClick}
                                />
                            </ItemWrap>
                        </AuthorityCheck>
                    )
                }
                return null
            })}
        </Nav>
    )
}
