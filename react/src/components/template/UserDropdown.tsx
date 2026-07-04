import { HiOutlineUser } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import styled from 'styled-components'


import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { useMember } from '@/store/domainHooks'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'

import type { JSX } from 'react'


type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    { label: 'Profile', path: '/profile', icon: <HiOutlineUser /> },
]

const UserAvatarWrap = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    cursor: pointer;
`

const UserInfo = styled.div`
    display: none;
    @media (min-width: 768px) {
        display: block;
    }
`

const UserRole = styled.div`
    font-size: ${({ theme }) => theme.fontSize.xs};
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
`

const UserName = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.inverse};
`

const DropdownHeader = styled.div`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const DropdownHeaderName = styled.div`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: ${({ theme }) => theme.fontSize.base};
`

const DropdownHeaderEmail = styled.div`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const DropdownLink = styled(Link)`
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const _UserDropdown = ({ className }: { className?: string }) => {
    const { member } = useMember()
    const { firstName, lastName, email, avatar, authority } = member || {}
    const { signOut } = useAuth()

    const UserAvatar = (
        <UserAvatarWrap className={className}>
            <Avatar size={32} shape="circle" src={avatar} />
            <UserInfo>
                <UserRole>{authority?.[0] || 'guest'}</UserRole>
                <UserName>{firstName}</UserName>
            </UserInfo>
        </UserAvatarWrap>
    )

    return (
        <Dropdown
            menuStyle={{ minWidth: 240 }}
            renderTitle={UserAvatar}
            placement="bottom-end"
            trigger="hover"
        >
            <Dropdown.Item variant="header">
                <DropdownHeader>
                    <Avatar shape="circle" src={avatar} />
                    <div>
                        <DropdownHeaderName>{firstName} {lastName}</DropdownHeaderName>
                        <DropdownHeaderEmail>{email}</DropdownHeaderEmail>
                    </div>
                </DropdownHeader>
            </Dropdown.Item>

            {authority?.[0] === 'admin' && (
                <Dropdown.Item>
                    <DropdownLink to="/admin/dashboard">
                        <span>Admin Dashboard</span>
                    </DropdownLink>
                </Dropdown.Item>
            )}

            {dropdownItemList.map((item) => (
                <Dropdown.Item key={item.label} eventKey={item.label}>
                    <DropdownLink
                        to={item.path}
                        onClick={() =>
                            trackEvent('account_menu_click', { item: item.label })
                        }
                    >
                        <span>{item.label}</span>
                    </DropdownLink>
                </Dropdown.Item>
            ))}

            <Dropdown.Item
                eventKey="Sign Out"
                onClick={() => {
                    trackEvent('logout_click', { location: 'user_dropdown' })
                    signOut()
                }}
            >
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
