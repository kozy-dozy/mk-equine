import { useEffect, useState, useCallback } from 'react'
import {
    HiOutlineBell,
    HiOutlineCalendar,
    HiOutlineClipboardCheck,
    HiOutlineBan,
    HiOutlineMailOpen,
} from 'react-icons/hi'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Tooltip from '@/components/ui/Tooltip'
import { useAppSelector } from '@/store'
import acronym from '@/utils/formatting/acronym'
import isLastChild from '@/utils/formatting/isLastChild'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useResponsive from '@/utils/hooks/useResponsive'

const NotificationMenu = styled.div`
    overflow-y: auto;
    height: 48px;
`

const NotificationHeader = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const NotificationItem = styled.div<{ $isLast: boolean }>`
    position: relative;
    display: flex;
    padding: ${({ theme }) => theme.spacing.md};
    cursor: pointer;
    &:hover {
        background: ${({ theme }) => theme.colors.bg.muted};
    }
    &:active {
        background: ${({ theme }) => theme.colors.bg.hover};
    }
    border-bottom: ${({ $isLast, theme }) =>
        !$isLast ? `1px solid ${theme.colors.border || '#e5e7eb'}` : 'none'};
`

const NotificationText = styled.div`
    margin-left: ${({ theme }) => theme.spacing.sm};
    margin-right: ${({ theme }) => theme.spacing.sm};
`

const NotificationTarget = styled.span`
    font-weight: 600;
    font-family: inherit;
`

const NotificationDate = styled.span`
    font-size: ${({ theme }) => theme.fontSize.xs};
`

const NotificationBadge = styled.div`
    position: absolute;
    top: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    left: unset;
    margin-top: ${({ theme }) => theme.spacing.xs};
`

const NotificationFooter = styled.div`
    display: flex;
    justify-content: center;
    border-top: 1px solid ${({ theme }) => theme.colors.border || '#e5e7eb'};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`

type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

const NotificationHeight = '18rem'

const avatarColors = [
    '#4f46e5',
    '#10b981',
    '#06b6d4',
    '#2563eb',
    '#14b8a6',
    '#d946ef',
    '#ec4899',
    '#f43f5e',
    '#ef4444',
    '#f59e0b',
    '#8b5cf6',
    '#a855f7',
]

function colorByName(name: string): string {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash += name.charCodeAt(i)
    }
    return avatarColors[hash % avatarColors.length]
}

const imagePath = '/img/avatars/'

const GeneratedAvatar = ({ target }: { target: string }) => {
    return (
        <Avatar
            shape="circle"
            style={{ background: colorByName(target), color: '#fff' }}
        >
            {acronym(target)}
        </Avatar>
    )
}

const notificationTypeAvatar = (data: {
    type: number
    target: string
    image: string
    status: string
}) => {
    const { type, target, image, status } = data
    switch (type) {
        case 0:
            if (image) {
                return <Avatar shape="circle" src={`${imagePath}${image}`} />
            } else {
                return <GeneratedAvatar target={target} />
            }
        case 1:
            return (
                <Avatar
                    shape="circle"
                    style={{ background: '#dbeafe', color: '#2563eb' }}
                    icon={<HiOutlineCalendar />}
                />
            )
        case 2:
            return (
                <Avatar
                    shape="circle"
                    style={{
                        background:
                            status === 'succeed' ? '#d1fae5' : '#fee2e2',
                        color: status === 'succeed' ? '#059669' : '#dc2626',
                    }}
                    icon={
                        status === 'succeed' ? (
                            <HiOutlineClipboardCheck />
                        ) : (
                            <HiOutlineBan />
                        )
                    }
                />
            )
        default:
            return <Avatar />
    }
}

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div
            className={className}
            style={{
                fontSize: '2rem',
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
            }}
        >
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult] = useState(false)
    const [loading] = useState(false)

    const { larger } = useResponsive()

    const direction = useAppSelector((state) => state.theme.direction)

    const getNotificationCount = async () => {
        // Fetch Notification count
    }

    useEffect(() => {
        getNotificationCount()
    }, [])

    const onNotificationOpen = async () => {
        // Fetch NotificationList
    }

    const onMarkAllAsRead = useCallback(() => {
        const list = notificationList.map((item: NotificationList) => {
            if (!item.readed) {
                item.readed = true
            }
            return item
        })
        setNotificationList(list)
        setUnreadNotification(false)
    }, [notificationList])

    const onMarkAsRead = useCallback(
        (id: string) => {
            const list = notificationList.map((item) => {
                if (item.id === id) {
                    item.readed = true
                }
                return item
            })
            setNotificationList(list)
            const hasUnread = notificationList.some((item) => !item.readed)

            if (!hasUnread) {
                setUnreadNotification(false)
            }
        },
        [notificationList],
    )

    return (
        <Dropdown
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuStyle={{ padding: 0, minWidth: 280 }}
            placement={larger.md ? 'bottom-end' : 'bottom-center'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <NotificationHeader>
                    <h6>Notifications</h6>
                    <Tooltip title="Mark all as read">
                        <Button
                            variant="plain"
                            size="sm"
                            icon={
                                <HiOutlineMailOpen style={{ fontSize: 20 }} />
                            }
                            onClick={onMarkAllAsRead}
                        />
                    </Tooltip>
                </NotificationHeader>
            </Dropdown.Item>
            <NotificationMenu>
                <ScrollBar direction={direction}>
                    {notificationList.length > 0 &&
                        notificationList.map((item, index) => (
                            <NotificationItem
                                key={item.id}
                                $isLast={isLastChild(notificationList, index)}
                                onClick={() => onMarkAsRead(item.id)}
                            >
                                <div>{notificationTypeAvatar(item)}</div>
                                <NotificationText>
                                    <div>
                                        {item.target && (
                                            <NotificationTarget>
                                                {item.target}{' '}
                                            </NotificationTarget>
                                        )}
                                        <span>{item.description}</span>
                                    </div>
                                    <NotificationDate>
                                        {item.date}
                                    </NotificationDate>
                                </NotificationText>
                                <NotificationBadge>
                                    <Badge />
                                </NotificationBadge>
                            </NotificationItem>
                        ))}
                    {loading && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: NotificationHeight,
                            }}
                        >
                            <Spinner size={40} />
                        </div>
                    )}
                    {noResult && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: NotificationHeight,
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    style={{
                                        display: 'block',
                                        margin: '0 auto 0.5rem',
                                        maxWidth: 150,
                                    }}
                                    src="/img/others/no-notification.png"
                                    alt="no-notification"
                                />
                                <h6 style={{ fontWeight: 600 }}>
                                    No notifications!
                                </h6>
                                <p style={{ marginTop: 4 }}>
                                    Please Try again later
                                </p>
                            </div>
                        </div>
                    )}
                </ScrollBar>
            </NotificationMenu>
            <Dropdown.Item variant="header">
                <NotificationFooter>
                    <Link
                        to="/account/activity-log"
                        style={{
                            fontWeight: 600,
                            cursor: 'pointer',
                            padding: '0.5rem 0.75rem',
                            color: '#4b5563',
                        }}
                    >
                        View All Activity
                    </Link>
                </NotificationFooter>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
