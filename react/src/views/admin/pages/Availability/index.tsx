import { Form, Formik, type FormikHelpers } from 'formik'
import { useEffect, useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import styled from 'styled-components'
import * as Yup from 'yup'

import { TextField } from '@/components/FormElements'
import Button from '@/components/ui/Button'
import {
    apiAdminCreateAvailabilityBlock,
    apiAdminDeleteAvailabilityBlock,
    apiAdminGetAvailabilityBlocks,
    apiAdminGetAvailabilityRules,
    apiAdminSetAvailabilityRules,
} from '@/services/ecom/BookingService'

import type { AvailabilityBlockDto, AvailabilityRuleDto, DayOfWeek } from '@shared/dtos'

type BlockFormValues = {
    startDateTime: string
    endDateTime: string
    reason: string
}

const blockValidationSchema = Yup.object().shape({
    startDateTime: Yup.string().required('Start date/time is required'),
    endDateTime: Yup.string()
        .required('End date/time is required')
        .test(
            'after-start',
            'End must be after start',
            function (val) {
                const start = this.parent.startDateTime
                if (!start || !val) return true
                return new Date(val).getTime() > new Date(start).getTime()
            },
        ),
    reason: Yup.string()
        .trim()
        .max(120, 'Reason must be 120 characters or less')
        .default(''),
})

const blockInitial: BlockFormValues = {
    startDateTime: '',
    endDateTime: '',
    reason: '',
}

const BUSINESS_TZ = 'America/Denver'
const TZ_LABEL = 'Mountain Time'

const PageWrap = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    display: grid;
    gap: ${({ theme }) => theme.spacing.xl};
`

const Title = styled.h1`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
`

const SubTitle = styled.h2`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
`

const Panel = styled.section`
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.lg};
`

const Lede = styled.p`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.muted};
    margin: 0 0 ${({ theme }) => theme.spacing.md};
`

const DayRow = styled.div`
    display: grid;
    grid-template-columns: 100px auto 1fr 1fr 1fr auto;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }

    &:last-child {
        border-bottom: none;
    }
`

const DayLabel = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`

const TimeInput = styled.input`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.base};
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    width: 100%;

    &:disabled {
        opacity: 0.5;
        background: ${({ theme }) => theme.colors.bg.muted};
    }
`

const NumberInput = styled(TimeInput).attrs({ type: 'number' })``

const SmallLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSize.xs};
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
`

const CheckboxRow = styled.label`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    user-select: none;
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.primary};
`

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.lg};
`

const Status = styled.div<{ $kind: 'ok' | 'err' }>`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    background: ${({ $kind, theme }) =>
        $kind === 'ok' ? theme.colors.status.successBg : theme.colors.status.errorBg};
    color: ${({ $kind, theme }) =>
        $kind === 'ok' ? theme.colors.status.success : theme.colors.status.error};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const BlockFormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr auto;
    gap: ${({ theme }) => theme.spacing.sm};
    align-items: end;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
    }
`

const BlockList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`

const BlockItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.bg.muted};
    border-radius: ${({ theme }) => theme.radius.md};
`

const IconBtn = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: ${({ theme }) => theme.colors.status.error};
    display: inline-flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.radius.sm};

    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
    }

    svg {
        font-size: 18px;
    }
`

const EmptyText = styled.p`
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin: 0;
`

const DAY_NAMES: Record<DayOfWeek, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
}

type DayRowState = {
    enabled: boolean
    startTime: string
    endTime: string
    slotDurationMinutes: number
}

const defaultRow = (): DayRowState => ({
    enabled: false,
    startTime: '09:00',
    endTime: '17:00',
    slotDurationMinutes: 60,
})

function rulesToRows(rules: AvailabilityRuleDto[]): Record<DayOfWeek, DayRowState> {
    const state: Record<DayOfWeek, DayRowState> = {
        0: defaultRow(),
        1: defaultRow(),
        2: defaultRow(),
        3: defaultRow(),
        4: defaultRow(),
        5: defaultRow(),
        6: defaultRow(),
    }
    for (const r of rules) {
        state[r.dayOfWeek] = {
            enabled: r.active,
            startTime: r.startTime,
            endTime: r.endTime,
            slotDurationMinutes: r.slotDurationMinutes,
        }
    }
    return state
}

function fmtBlock(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
        timeZone: BUSINESS_TZ,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })
}

export default function Availability() {
    const [rows, setRows] = useState<Record<DayOfWeek, DayRowState>>({
        0: defaultRow(),
        1: defaultRow(),
        2: defaultRow(),
        3: defaultRow(),
        4: defaultRow(),
        5: defaultRow(),
        6: defaultRow(),
    })
    const [blocks, setBlocks] = useState<AvailabilityBlockDto[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<{
        kind: 'ok' | 'err'
        msg: string
    } | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                const [rules, blks] = await Promise.all([
                    apiAdminGetAvailabilityRules(),
                    apiAdminGetAvailabilityBlocks(),
                ])
                setRows(rulesToRows(rules))
                setBlocks(blks)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateRow = (day: DayOfWeek, patch: Partial<DayRowState>) => {
        setRows((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }))
    }

    const saveRules = async () => {
        setSaving(true)
        setStatus(null)
        try {
            const payload: Partial<AvailabilityRuleDto>[] = (
                Object.entries(rows) as [string, DayRowState][]
            )
                .filter(([, r]) => r.enabled)
                .map(([day, r]) => ({
                    dayOfWeek: Number(day) as DayOfWeek,
                    startTime: r.startTime,
                    endTime: r.endTime,
                    slotDurationMinutes: r.slotDurationMinutes,
                    active: true,
                }))
            await apiAdminSetAvailabilityRules(payload)
            setStatus({ kind: 'ok', msg: 'Weekly availability saved.' })
        } catch (err: any) {
            setStatus({
                kind: 'err',
                msg: err?.error || err?.message || 'Save failed',
            })
        } finally {
            setSaving(false)
        }
    }

    const addBlock = async (
        values: BlockFormValues,
        helpers: FormikHelpers<BlockFormValues>,
    ) => {
        try {
            const created = await apiAdminCreateAvailabilityBlock({
                startDateTime: new Date(values.startDateTime).toISOString(),
                endDateTime: new Date(values.endDateTime).toISOString(),
                reason: values.reason.trim(),
            })
            setBlocks((prev) =>
                [...prev, created].sort(
                    (a, b) => +new Date(a.startDateTime) - +new Date(b.startDateTime),
                ),
            )
            helpers.resetForm()
        } catch (err: any) {
            setStatus({
                kind: 'err',
                msg: err?.error || err?.message || 'Failed to add block',
            })
        } finally {
            helpers.setSubmitting(false)
        }
    }

    const removeBlock = async (id: string) => {
        await apiAdminDeleteAvailabilityBlock(id)
        setBlocks((prev) => prev.filter((b) => b.id !== id))
    }

    if (loading) {
        return (
            <PageWrap>
                <Title>Availability</Title>
                <Panel>Loading…</Panel>
            </PageWrap>
        )
    }

    return (
        <PageWrap>
            <Title>Availability</Title>

            <Panel>
                <SubTitle>Weekly Schedule</SubTitle>
                <Lede>
                    Set the recurring hours you're available for lessons. Times
                    are in {TZ_LABEL}.
                </Lede>

                {status && <Status $kind={status.kind}>{status.msg}</Status>}

                {([0, 1, 2, 3, 4, 5, 6] as DayOfWeek[]).map((day) => (
                    <DayRow key={day}>
                        <DayLabel>{DAY_NAMES[day]}</DayLabel>
                        <CheckboxRow>
                            <input
                                type="checkbox"
                                checked={rows[day].enabled}
                                onChange={(e) =>
                                    updateRow(day, { enabled: e.target.checked })
                                }
                            />
                            Available
                        </CheckboxRow>
                        <div>
                            <SmallLabel>Start</SmallLabel>
                            <TimeInput
                                type="time"
                                value={rows[day].startTime}
                                disabled={!rows[day].enabled}
                                onChange={(e) =>
                                    updateRow(day, { startTime: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <SmallLabel>End</SmallLabel>
                            <TimeInput
                                type="time"
                                value={rows[day].endTime}
                                disabled={!rows[day].enabled}
                                onChange={(e) =>
                                    updateRow(day, { endTime: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <SmallLabel>Slot (min)</SmallLabel>
                            <NumberInput
                                min={15}
                                max={240}
                                step={15}
                                value={rows[day].slotDurationMinutes}
                                disabled={!rows[day].enabled}
                                onChange={(e) =>
                                    updateRow(day, {
                                        slotDurationMinutes:
                                            Number(e.target.value) || 60,
                                    })
                                }
                            />
                        </div>
                        <div />
                    </DayRow>
                ))}

                <Actions>
                    <Button variant="solid" disabled={saving} onClick={saveRules}>
                        {saving ? 'Saving…' : 'Save Schedule'}
                    </Button>
                </Actions>
            </Panel>

            <Panel>
                <SubTitle>Blocked Time</SubTitle>
                <Lede>
                    Block specific dates or time ranges when you can't teach
                    (shows, travel, appointments, etc.). Use your local timezone
                    in the date picker — it will be interpreted in {TZ_LABEL}.
                </Lede>

                <Formik<BlockFormValues>
                    validateOnMount
                    initialValues={blockInitial}
                    validationSchema={blockValidationSchema}
                    onSubmit={addBlock}
                >
                    {({ isSubmitting, isValid }) => (
                        <Form>
                            <BlockFormGrid>
                                <TextField
                                    name="startDateTime"
                                    label="Start"
                                    type="datetime-local"
                                />
                                <TextField
                                    name="endDateTime"
                                    label="End"
                                    type="datetime-local"
                                />
                                <TextField
                                    name="reason"
                                    label="Reason (optional)"
                                    placeholder="Vacation"
                                />
                                <Button
                                    type="submit"
                                    variant="solid"
                                    disabled={isSubmitting || !isValid}
                                    loading={isSubmitting as any}
                                >
                                    Add Block
                                </Button>
                            </BlockFormGrid>
                        </Form>
                    )}
                </Formik>

                {blocks.length === 0 ? (
                    <EmptyText>No blocked time on the schedule.</EmptyText>
                ) : (
                    <BlockList>
                        {blocks.map((b) => (
                            <BlockItem key={b.id}>
                                <div>
                                    <strong>{fmtBlock(b.startDateTime)}</strong>
                                    {' → '}
                                    {fmtBlock(b.endDateTime)}
                                    {b.reason && (
                                        <span style={{ marginLeft: 12, opacity: 0.7 }}>
                                            ({b.reason})
                                        </span>
                                    )}
                                </div>
                                <IconBtn
                                    title="Remove block"
                                    onClick={() => removeBlock(b.id)}
                                >
                                    <HiOutlineTrash />
                                </IconBtn>
                            </BlockItem>
                        ))}
                    </BlockList>
                )}
            </Panel>
        </PageWrap>
    )
}
