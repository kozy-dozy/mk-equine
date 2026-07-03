import ApiService from '../shared/ApiService'

export type AdminDashboardResponse = {
    stats: {
        membersTotal: number
        membersNewThisWeek: number
        playersTotal: number
        playersActive: number
    }
    newestMembers: Array<{
        id: string
        firstName: string
        lastName: string
        email: string
        emailVerified: boolean
        authority: string[]
        createdAt: string
        avatar?: string
    }>
}

type ChartSeries = { labels: string[]; data: number[] }

export type AdminOverviewResponse = {
    chart: { daily: ChartSeries; weekly: ChartSeries; monthly: ChartSeries }
    playerChart: { daily: ChartSeries; weekly: ChartSeries; monthly: ChartSeries }
    bySport: { labels: string[]; data: number[] }
}

export function apiGetAdminDashboard() {
    return ApiService.fetchData<AdminDashboardResponse>({
        url: '/admin/dashboard',
        method: 'GET',
    })
}

export function apiGetAdminOverview() {
    return ApiService.fetchData<AdminOverviewResponse>({
        url: '/admin/dashboard/overview',
        method: 'GET',
    })
}
