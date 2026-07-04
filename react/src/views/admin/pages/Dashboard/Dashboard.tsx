import { useState, useEffect } from 'react'
import styled from 'styled-components'

import Chart from '@/components/shared/Chart'
import Loading from '@/components/shared/Loading'
import Card from '@/components/ui/Card'
import Segment from '@/components/ui/Segment'
import { COLORS } from '@/constants/chart.constant'
import { useAppSelector } from '@/store'

import type { AdminOverviewResponse } from '@/services/admin/AdminService'

const ChartHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    @media (min-width: 640px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`

const ChartTitle = styled.h4`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const ChartLoadingSpace = styled.div`
    height: 300px;
`

const ChartsTopRow = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    @media (min-width: 1280px) {
        grid-template-columns: 2fr 1fr;
    }
`

type ChartSeries = { labels: string[]; data: number[] }

type MemberChartProps = {
    chart: Record<string, ChartSeries>
    title: string
    color: string
    className?: string
}

function TimeSeriesChart({ chart, title, color, className }: MemberChartProps) {
    const [range, setRange] = useState(['weekly'])
    const [repaint, setRepaint] = useState(false)

    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )

    useEffect(() => {
        setRepaint(true)
        const t = setTimeout(() => setRepaint(false), 300)
        return () => clearTimeout(t)
    }, [chart, sideNavCollapse])

    const current = chart?.[range[0]]

    return (
        <Card className={className}>
            <ChartHeader>
                <h4>{title}</h4>
                <Segment
                    value={range}
                    size="sm"
                    onChange={(val: string | string[]) =>
                        setRange(val as string[])
                    }
                >
                    <Segment.Item value="monthly">Monthly</Segment.Item>
                    <Segment.Item value="weekly">Weekly</Segment.Item>
                    <Segment.Item value="daily">Daily</Segment.Item>
                </Segment>
            </ChartHeader>
            {current && !repaint ? (
                <Chart
                    series={[{ name: title, data: current.data }]}
                    xAxis={current.labels}
                    type="bar"
                    customOptions={{
                        colors: [color],
                        legend: { show: false },
                    }}
                />
            ) : (
                <Loading loading={repaint} type="cover">
                    <ChartLoadingSpace />
                </Loading>
            )}
        </Card>
    )
}

type BySportChartProps = {
    bySport: { labels: string[]; data: number[] }
    className?: string
}

function BySportChart({ bySport, className }: BySportChartProps) {
    return (
        <Card className={className}>
            <ChartTitle>Players by Sport</ChartTitle>
            <Chart
                series={bySport.data}
                type="donut"
                customOptions={{
                    labels: bySport.labels,
                    colors: [COLORS[0], COLORS[1], COLORS[2], COLORS[3]],
                    legend: { position: 'bottom' as const },
                }}
            />
        </Card>
    )
}

type DashboardChartsProps = {
    overview: AdminOverviewResponse | null
    className?: string
}

export default function DashboardCharts({
    overview,
    className,
}: DashboardChartsProps) {
    if (!overview) return null

    return (
        <div className={className}>
            <ChartsTopRow>
                <TimeSeriesChart
                    chart={overview.chart}
                    title="New Members"
                    color={COLORS[0]}
                    className="xl-col-span-2"
                />
                <BySportChart bySport={overview.bySport} />
            </ChartsTopRow>
            <TimeSeriesChart
                chart={overview.playerChart}
                title="New Players"
                color={COLORS[2]}
            />
        </div>
    )
}
