import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { apiGetAvailableSlots } from '@/services/ecom/BookingService'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'
import SEO from '@/views/ecom/components/SEO'

import BookingForm from './BookingForm'

import type { AvailableSlot } from '@shared/dtos'

const BUSINESS_TZ = 'America/Denver'
const TZ_LABEL = 'Mountain Time'

function formatInTz(iso: string, opts: Intl.DateTimeFormatOptions) {
    return new Date(iso).toLocaleString('en-US', {
        timeZone: BUSINESS_TZ,
        ...opts,
    })
}

// YYYY-MM-DD as it appears in the business timezone
function tzDateKey(iso: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: BUSINESS_TZ,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date(iso))
    const p = parts.reduce<Record<string, string>>((acc, x) => {
        if (x.type !== 'literal') acc[x.type] = x.value
        return acc
    }, {})
    return `${p.year}-${p.month}-${p.day}`
}

const Page = styled.div`
    background: ${({ theme }) => theme.colors.bg.page};
`

const Hero = styled.section`
    background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary},
        ${({ theme }) => theme.colors.primaryHover}
    );
    color: ${({ theme }) => theme.colors.text.inverse};
    padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.md}`};
    text-align: center;
`

const HeroInner = styled.div`
    max-width: 760px;
    margin: 0 auto;
`

const HeroTitle = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: clamp(32px, 4.5vw, 48px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -1px;
    margin: 0 0 ${({ theme }) => theme.spacing.md};
`

const HeroSub = styled.p`
    font-size: ${({ theme }) => theme.fontSize.md};
    line-height: 1.65;
    margin: 0;
    opacity: 0.92;
`

const Body = styled.div`
    max-width: 1080px;
    margin: 0 auto;
    padding: ${({ theme }) => `${theme.spacing['2xl']} ${theme.spacing.md}`};
`

const Layout = styled.div`
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: ${({ theme }) => theme.spacing.xl};

    @media (max-width: 880px) {
        grid-template-columns: 1fr;
    }
`

const Panel = styled.div`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
`

const PanelTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
`

const TzNote = styled.p`
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.muted};
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
`

const MonthNav = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const NavBtn = styled.button`
    background: none;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.primary};
    transition: background 0.15s;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.bg.hover};
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`

const MonthLabel = styled.h3`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
`

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
`

const DowCell = styled.div`
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.text.muted};
    padding: ${({ theme }) => theme.spacing.xs} 0;
`

const DayCell = styled.button<{
    $inMonth: boolean
    $hasSlots: boolean
    $selected: boolean
    $disabled: boolean
}>`
    aspect-ratio: 1;
    border: 1px solid
        ${({ $selected, theme }) =>
            $selected ? theme.colors.primary : 'transparent'};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ $selected, $hasSlots, theme }) =>
        $selected
            ? theme.colors.primary
            : $hasSlots
              ? theme.colors.primaryLight
              : 'transparent'};
    color: ${({ $selected, $inMonth, $disabled, theme }) =>
        $selected
            ? theme.colors.text.inverse
            : !$inMonth || $disabled
              ? theme.colors.text.disabled
              : theme.colors.text.primary};
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: ${({ $hasSlots }) => ($hasSlots ? 600 : 400)};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, transform 0.1s;
    position: relative;

    &:hover:not(:disabled) {
        background: ${({ $selected, theme }) =>
            $selected ? theme.colors.primaryHover : theme.colors.primaryLightAlt};
    }

    &:disabled {
        opacity: ${({ $inMonth }) => ($inMonth ? 0.6 : 0.3)};
    }
`

const SlotsHeader = styled.div`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const SlotsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: ${({ theme }) => theme.spacing.sm};
`

const SlotChip = styled.button<{ $selected: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid
        ${({ $selected, theme }) =>
            $selected ? theme.colors.primary : theme.colors.border.default};
    background: ${({ $selected, theme }) =>
        $selected ? theme.colors.primary : 'transparent'};
    color: ${({ $selected, theme }) =>
        $selected ? theme.colors.text.inverse : theme.colors.text.primary};
    font-size: ${({ theme }) => theme.fontSize.base};
    cursor: pointer;
    font-weight: 500;
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    transition: all 0.15s;

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
    }
`

const Empty = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    text-align: center;
    color: ${({ theme }) => theme.colors.text.muted};
    border: 1px dashed ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
`

const Success = styled.div`
    text-align: center;
    padding: ${({ theme }) => theme.spacing['2xl']};
`

const SuccessIcon = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.status.successBg};
    color: ${({ theme }) => theme.colors.status.success};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin: 0 auto ${({ theme }) => theme.spacing.md};
`

const SuccessTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 24px;
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

const SuccessMsg = styled.p`
    color: ${({ theme }) => theme.colors.text.muted};
    line-height: 1.65;
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
`

const PackageList = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.xl};

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`

const PackageCard = styled.div`
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
`

const PackageTitle = styled.h4`
    margin: 0 0 ${({ theme }) => theme.spacing.xs};
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 16px;
    font-weight: 600;
`

const PackageMeta = styled.p`
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.sm};
    opacity: 0.85;
    line-height: 1.5;
`

function startOfMonth(d: dayjs.Dayjs) {
    return d.startOf('month')
}

function buildMonthGrid(monthStart: dayjs.Dayjs): dayjs.Dayjs[] {
    const firstDow = monthStart.day()
    const gridStart = monthStart.subtract(firstDow, 'day')
    const days: dayjs.Dayjs[] = []
    for (let i = 0; i < 42; i++) {
        days.push(gridStart.add(i, 'day'))
    }
    return days
}

const DOWS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookLessonPage() {
    const { isAuthenticated } = useAuth()
    const member = useAppSelector((s) => s.member.member)

    const today = dayjs()
    const [viewMonth, setViewMonth] = useState(startOfMonth(today))
    const [slots, setSlots] = useState<AvailableSlot[]>([])
    const [loadingSlots, setLoadingSlots] = useState(true)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
    const [confirmed, setConfirmed] = useState(false)

    const initialName = useMemo(() => {
        if (!isAuthenticated || !member) return ''
        return `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim()
    }, [isAuthenticated, member])

    const initialEmail = useMemo(() => {
        if (!isAuthenticated || !member) return ''
        return member.email ?? ''
    }, [isAuthenticated, member])

    // Load slots for the visible month + 1
    useEffect(() => {
        const from = viewMonth.startOf('month').toISOString()
        const to = viewMonth.add(2, 'month').startOf('month').toISOString()
        setLoadingSlots(true)
        apiGetAvailableSlots(from, to)
            .then(setSlots)
            .catch(() => setSlots([]))
            .finally(() => setLoadingSlots(false))
    }, [viewMonth])

    const slotsByDate = useMemo(() => {
        const map = new Map<string, AvailableSlot[]>()
        for (const s of slots) {
            const key = tzDateKey(s.startDateTime)
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(s)
        }
        return map
    }, [slots])

    const slotsForSelected = selectedDate
        ? slotsByDate.get(selectedDate) ?? []
        : []

    const gridDays = useMemo(() => buildMonthGrid(viewMonth), [viewMonth])

    const goPrevMonth = () => {
        const prev = viewMonth.subtract(1, 'month')
        // don't go before this month
        if (prev.isBefore(startOfMonth(today))) return
        setViewMonth(prev)
        setSelectedDate(null)
        setSelectedSlot(null)
    }

    const goNextMonth = () => {
        setViewMonth(viewMonth.add(1, 'month'))
        setSelectedDate(null)
        setSelectedSlot(null)
    }

    const canPrev = !viewMonth.subtract(1, 'month').isBefore(startOfMonth(today))

    const handleSelectDate = (key: string) => {
        setSelectedDate(key)
        setSelectedSlot(null)
    }

    return (
        <>
            <SEO
                title="Book a Lesson | MK Equine"
                description="Schedule a horseback riding lesson—pick a date and time that works for you."
                canonicalPath="/book-lesson"
            />
            <Page>
                <Hero>
                    <HeroInner>
                        <HeroTitle>Book a Lesson</HeroTitle>
                        <HeroSub>
                            Pick a date and time that works for you and I&apos;ll
                            confirm your spot. All times shown in {TZ_LABEL}.
                        </HeroSub>
                        <PackageList>
                            <PackageCard>
                                <PackageTitle>Private Lesson · 1 hr</PackageTitle>
                                <PackageMeta>
                                    $50 · One-on-one instruction at your pace.
                                </PackageMeta>
                            </PackageCard>
                            <PackageCard>
                                <PackageTitle>Private Lesson · 30 min</PackageTitle>
                                <PackageMeta>
                                    $35 · A shorter session—great for younger
                                    riders.
                                </PackageMeta>
                            </PackageCard>
                            <PackageCard>
                                <PackageTitle>First Visit</PackageTitle>
                                <PackageMeta>
                                    Meet the horses and see if the program is a
                                    good fit.
                                </PackageMeta>
                            </PackageCard>
                        </PackageList>
                    </HeroInner>
                </Hero>

                <Body>
                    {confirmed ? (
                        <Panel style={{ maxWidth: 560, margin: '0 auto' }}>
                            <Success>
                                <SuccessIcon>✓</SuccessIcon>
                                <SuccessTitle>
                                    You&apos;re booked!
                                </SuccessTitle>
                                <SuccessMsg>
                                    {selectedSlot && (
                                        <>
                                            Your lesson is scheduled for{' '}
                                            <strong>
                                                {formatInTz(
                                                    selectedSlot.startDateTime,
                                                    {
                                                        weekday: 'long',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                    },
                                                )}{' '}
                                                {TZ_LABEL}
                                            </strong>
                                            .
                                        </>
                                    )}
                                    <br />
                                    I&apos;ll be in touch shortly to confirm your
                                    lesson. Looking forward to seeing you at the
                                    barn!
                                </SuccessMsg>
                            </Success>
                        </Panel>
                    ) : (
                        <Layout>
                            <Panel>
                                <PanelTitle>Choose a Date</PanelTitle>
                                <TzNote>Times shown in {TZ_LABEL}</TzNote>
                                <MonthNav>
                                    <NavBtn
                                        aria-label="Previous month"
                                        disabled={!canPrev}
                                        onClick={goPrevMonth}
                                    >
                                        ‹ Prev
                                    </NavBtn>
                                    <MonthLabel>
                                        {viewMonth.format('MMMM YYYY')}
                                    </MonthLabel>
                                    <NavBtn aria-label="Next month" onClick={goNextMonth}>
                                        Next ›
                                    </NavBtn>
                                </MonthNav>
                                <CalendarGrid>
                                    {DOWS.map((d) => (
                                        <DowCell key={d}>{d}</DowCell>
                                    ))}
                                    {gridDays.map((d) => {
                                        const key = d.format('YYYY-MM-DD')
                                        const inMonth =
                                            d.month() === viewMonth.month()
                                        const isPast = d.isBefore(today, 'day')
                                        const slotCount =
                                            slotsByDate.get(key)?.length ?? 0
                                        const hasSlots = slotCount > 0
                                        const disabled = isPast || !hasSlots
                                        const fullDate = d.format('MMMM D, YYYY')
                                        const availabilityText = isPast
                                            ? 'unavailable'
                                            : hasSlots
                                              ? `${slotCount} slot${slotCount === 1 ? '' : 's'} available`
                                              : 'no availability'
                                        return (
                                            <DayCell
                                                key={key}
                                                $inMonth={inMonth}
                                                $hasSlots={hasSlots}
                                                $selected={selectedDate === key}
                                                $disabled={disabled}
                                                disabled={disabled}
                                                aria-label={`${fullDate}, ${availabilityText}`}
                                                aria-pressed={selectedDate === key}
                                                title={
                                                    hasSlots
                                                        ? `${slotCount} slots available`
                                                        : 'No availability'
                                                }
                                                onClick={() => handleSelectDate(key)}
                                            >
                                                {d.date()}
                                            </DayCell>
                                        )
                                    })}
                                </CalendarGrid>

                                <div style={{ marginTop: 24 }}>
                                    <PanelTitle>
                                        {selectedDate
                                            ? `Available Times — ${dayjs(selectedDate).format('dddd, MMM D')}`
                                            : 'Available Times'}
                                    </PanelTitle>
                                    {loadingSlots ? (
                                        <Empty>Loading availability…</Empty>
                                    ) : !selectedDate ? (
                                        <Empty>
                                            Pick a highlighted date to see open
                                            time slots.
                                        </Empty>
                                    ) : slotsForSelected.length === 0 ? (
                                        <Empty>No open slots on this day.</Empty>
                                    ) : (
                                        <>
                                            <SlotsHeader>
                                                {slotsForSelected.length} slot
                                                {slotsForSelected.length === 1
                                                    ? ''
                                                    : 's'}{' '}
                                                available
                                            </SlotsHeader>
                                            <SlotsGrid>
                                                {slotsForSelected.map((s) => {
                                                    const timeLabel = formatInTz(
                                                        s.startDateTime,
                                                        {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        },
                                                    )
                                                    const dateLabel = formatInTz(
                                                        s.startDateTime,
                                                        {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        },
                                                    )
                                                    return (
                                                        <SlotChip
                                                            key={s.startDateTime}
                                                            $selected={
                                                                selectedSlot?.startDateTime ===
                                                                s.startDateTime
                                                            }
                                                            aria-label={`Book ${timeLabel} on ${dateLabel}, ${TZ_LABEL}`}
                                                            aria-pressed={
                                                                selectedSlot?.startDateTime ===
                                                                s.startDateTime
                                                            }
                                                            onClick={() => setSelectedSlot(s)}
                                                        >
                                                            {timeLabel}
                                                        </SlotChip>
                                                    )
                                                })}
                                            </SlotsGrid>
                                        </>
                                    )}
                                </div>
                            </Panel>

                            <Panel>
                                <PanelTitle>Your Details</PanelTitle>
                                {!selectedSlot ? (
                                    <Empty>
                                        Pick a date and time on the left, then
                                        fill in your info to confirm.
                                    </Empty>
                                ) : (
                                    <BookingForm
                                        selectedSlot={selectedSlot}
                                        initialName={initialName}
                                        initialEmail={initialEmail}
                                        selectedSlotLabel={`${formatInTz(
                                            selectedSlot.startDateTime,
                                            {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                            },
                                        )} (${TZ_LABEL})`}
                                        onSuccess={() => setConfirmed(true)}
                                    />
                                )}
                            </Panel>
                        </Layout>
                    )}
                </Body>
            </Page>
        </>
    )
}
