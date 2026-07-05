import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_TITLE,
} from '@/constants/navigation.constant'
import { ADMIN } from '@kozydozy/foundation/constants/roles.constant'

import type { NavigationTree } from '@/@types/navigation'

const adminNavigationConfig: NavigationTree[] = [
    {
        key: 'admin.dashboard',
        path: '/admin/dashboard',
        title: 'Dashboard',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.bookings',
        path: '/admin/bookings',
        title: 'Lesson Bookings',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.availability',
        path: '/admin/availability',
        title: 'Availability',
        icon: 'project',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.horses',
        path: '/admin/horses',
        title: 'Horses For Sale',
        icon: 'products',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.members',
        path: '/admin/members',
        title: 'Members',
        icon: 'users',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.siteContent',
        path: '/admin/site-content',
        title: 'Assets',
        icon: 'assets',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'admin.features',
        path: '/admin/features',
        title: 'Features',
        icon: 'project',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [ADMIN],
        subMenu: [],
    },
    {
        key: 'site.header',
        path: '',
        title: 'MK Equine Site',
        icon: 'store',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN],
        subMenu: [
            {
                key: 'site.header.home',
                path: '/',
                title: 'View Site',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN],
                subMenu: [],
            },
        ],
    },
]

export default adminNavigationConfig
