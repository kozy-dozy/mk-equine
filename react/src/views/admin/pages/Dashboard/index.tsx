import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import DataTable from '@/components/shared/DataTable'
import Badge from '@kozydozy/ui/Badge'
import Button from '@kozydozy/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store'
import { getDashboard, getOverview } from '@/store/slices/admin/dashboardSlice'

import DashboardCharts from './Dashboard'
import {
    DashboardWrapper,
    DashboardHeader,
    StatCard,
    QuickActionsCard,
    NewestMembersCard,
} from './Dashboard.styled'

import type { ColumnDef } from '@/components/shared/DataTable'
import type { MemberRow } from '@/store/slices/admin/dashboardSlice'

const DashboardTitle = styled.div`
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`

const DashboardSubtitle = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.7;
    margin-top: ${({ theme }) => theme.spacing.xs};
`

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const StatLabel = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.7;
    font-size: ${({ theme }) => theme.fontSize.base};
`

const StatValue = styled.div`
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: 2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`

const StatSub = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const ChartsWrap = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const VerifiedCell = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const VerifiedLabel = styled.span`
    font-weight: 600;
`

export default function Dashboard() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { loading, stats, newestMembers, overview } = useAppSelector(
        (s) => s.adminDashboard,
    )

    useEffect(() => {
        dispatch(getDashboard())
        dispatch(getOverview())
    }, [dispatch])

    const memberColumns: ColumnDef<MemberRow>[] = useMemo(
        () => [
            { header: 'Name', accessorKey: 'name' },
            { header: 'Email', accessorKey: 'email' },
            {
                header: 'Verified',
                accessorKey: 'emailVerified',
                cell: (p) => (
                    <VerifiedCell>
                        <Badge />
                        <VerifiedLabel>
                            {p.row.original.emailVerified ? 'Yes' : 'No'}
                        </VerifiedLabel>
                    </VerifiedCell>
                ),
            },
            { header: 'Joined', accessorKey: 'createdAt' },
        ],
        [],
    )

    return (
        <DashboardWrapper>
            {/* Header */}
            <DashboardHeader>
                <DashboardTitle>Admin Dashboard</DashboardTitle>
                <DashboardSubtitle>Platform overview</DashboardSubtitle>
            </DashboardHeader>

            {/* Stats */}
            <StatsGrid>
                {stats.map((stat) => (
                    <StatCard key={stat.label}>
                        <StatLabel>{stat.label}</StatLabel>
                        <StatValue>{stat.value}</StatValue>
                        {stat.sub && <StatSub>{stat.sub}</StatSub>}
                    </StatCard>
                ))}
            </StatsGrid>

            {/* Charts */}
            <ChartsWrap>
                <DashboardCharts overview={overview} />
            </ChartsWrap>

            {/* Quick Actions */}
            <QuickActionsCard>
                <div className="label">Quick actions</div>
                <div className="actions">
                    <Button onClick={() => navigate('/admin/members')}>
                        View Members
                    </Button>
                    <Button onClick={() => navigate('/admin/players')}>
                        View Players
                    </Button>
                    <Button
                        variant="solid"
                        onClick={() => navigate('/admin/players/add')}
                    >
                        Add Player
                    </Button>
                </div>
            </QuickActionsCard>

            {/* Newest Members */}
            <NewestMembersCard>
                <div className="header">
                    <span>Newest members</span>
                    <Button
                        size="sm"
                        variant="plain"
                        onClick={() => navigate('/admin/members')}
                    >
                        View all
                    </Button>
                </div>
                <DataTable
                    columns={memberColumns}
                    data={newestMembers}
                    loading={loading}
                />
            </NewestMembersCard>
        </DashboardWrapper>
    )
}
