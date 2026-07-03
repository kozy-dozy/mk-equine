import { useEffect, useState, useMemo } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import styled from 'styled-components'

import {
    apiAdminDeleteBooking,
    apiAdminGetBookings,
    apiAdminUpdateBookingStatus,
} from '@/services/ecom/BookingService'

import type { BookingDto, BookingStatus } from '@shared/dtos'

const BUSINESS_TZ = 'America/Denver'

const STATUS_OPTIONS: BookingStatus[] = [
    'pending',
    'confirmed',
    'completed',
    'cancelled',
]

const PageWrap = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;
`

const Title = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
`

const FilterBar = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    flex-wrap: wrap;
`

const FilterChip = styled.button<{ $active: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.full};
    border: 1px solid
        ${({ theme, $active }) =>
            $active ? theme.colors.primary : theme.colors.border.default};
    background: ${({ theme, $active }) =>
        $active ? theme.colors.primary : 'transparent'};
    color: ${({ theme, $active }) =>
        $active ? theme.colors.text.inverse : theme.colors.text.primary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: capitalize;
`

const TableWrap = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: hidden;
`

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;

    th,
    td {
        text-align: left;
        padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
        border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
        font-size: ${({ theme }) => theme.fontSize.base};
        color: ${({ theme }) => theme.colors.text.primary};
        vertical-align: top;
    }

    th {
        background: ${({ theme }) => theme.colors.bg.muted};
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.secondary};
        text-transform: uppercase;
        font-size: ${({ theme }) => theme.fontSize.xs};
        letter-spacing: 0.06em;
    }

    tr:last-child td {
        border-bottom: none;
    }
`

const StatusPill = styled.span<{ $status: BookingStatus }>`
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: ${({ theme }) => theme.radius.full};
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: ${({ $status, theme }) =>
        $status === 'confirmed'
            ? theme.colors.status.successBg
            : $status === 'cancelled'
              ? theme.colors.status.errorBg
              : $status === 'completed'
                ? theme.colors.primaryLight
                : theme.colors.bg.muted};
    color: ${({ $status, theme }) =>
        $status === 'confirmed'
            ? theme.colors.status.success
            : $status === 'cancelled'
              ? theme.colors.status.error
              : $status === 'completed'
                ? theme.colors.primary
                : theme.colors.text.muted};
`

const Select = styled.select`
    padding: 4px 8px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
`

const NotesText = styled.div`
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-top: 4px;
    max-width: 320px;
    line-height: 1.5;
`

const EmptyState = styled.div`
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.text.muted};
`

const Actions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    justify-content: flex-end;
`

const IconBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: ${({ theme }) => theme.colors.status.error};
    border-radius: ${({ theme }) => theme.radius.sm};
    display: inline-flex;
    align-items: center;

    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
    }

    svg {
        font-size: 18px;
    }
`

function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
        timeZone: BUSINESS_TZ,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

const TYPE_LABELS: Record<string, string> = {
    'private-60': 'Private Lesson · 1 hr',
    'private-30': 'Private Lesson · 30 min',
    'first-visit': 'First Visit',
}

export default function Bookings() {
    const [rows, setRows] = useState<BookingDto[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>(
        'all',
    )

    useEffect(() => {
        ;(async () => {
            try {
                const docs = await apiAdminGetBookings()
                setRows(docs)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const filtered = useMemo(() => {
        if (statusFilter === 'all') return rows
        return rows.filter((r) => r.status === statusFilter)
    }, [rows, statusFilter])

    const onChangeStatus = async (id: string, status: BookingStatus) => {
        const updated = await apiAdminUpdateBookingStatus(id, status)
        setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
    }

    const onDelete = async (id: string) => {
        if (!confirm('Delete this booking? This cannot be undone.')) return
        await apiAdminDeleteBooking(id)
        setRows((prev) => prev.filter((r) => r.id !== id))
    }

    return (
        <PageWrap>
            <Header>
                <Title>Lesson Bookings</Title>
                <FilterBar>
                    {(['all', ...STATUS_OPTIONS] as const).map((s) => (
                        <FilterChip
                            key={s}
                            $active={statusFilter === s}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s}
                            {s !== 'all' &&
                                ` (${rows.filter((r) => r.status === s).length})`}
                        </FilterChip>
                    ))}
                </FilterBar>
            </Header>

            <TableWrap>
                {loading ? (
                    <EmptyState>Loading bookings…</EmptyState>
                ) : filtered.length === 0 ? (
                    <EmptyState>
                        {rows.length === 0
                            ? 'No bookings yet. They will appear here as students book lessons.'
                            : `No ${statusFilter} bookings.`}
                    </EmptyState>
                ) : (
                    <Table>
                        <thead>
                            <tr>
                                <th>When</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Notes</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b) => (
                                <tr key={b.id}>
                                    <td>
                                        <strong>{fmtDateTime(b.startDateTime)}</strong>
                                    </td>
                                    <td>
                                        <strong>{b.guestName}</strong>
                                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                                            <a href={`mailto:${b.guestEmail}`}>
                                                {b.guestEmail}
                                            </a>
                                            {b.guestPhone && ` · ${b.guestPhone}`}
                                        </div>
                                    </td>
                                    <td>
                                        {TYPE_LABELS[b.consultationType] ?? b.consultationType}
                                    </td>
                                    <td>
                                        {b.notes ? (
                                            <NotesText>{b.notes}</NotesText>
                                        ) : (
                                            <span style={{ color: '#9ca3af' }}>—</span>
                                        )}
                                    </td>
                                    <td>
                                        <Select
                                            value={b.status}
                                            onChange={(e) =>
                                                onChangeStatus(
                                                    b.id,
                                                    e.target.value as BookingStatus,
                                                )
                                            }
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </Select>
                                        <div style={{ marginTop: 4 }}>
                                            <StatusPill $status={b.status}>
                                                {b.status}
                                            </StatusPill>
                                        </div>
                                    </td>
                                    <td>
                                        <Actions>
                                            <IconBtn
                                                title="Delete"
                                                onClick={() => onDelete(b.id)}
                                            >
                                                <HiOutlineTrash />
                                            </IconBtn>
                                        </Actions>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </TableWrap>
        </PageWrap>
    )
}
