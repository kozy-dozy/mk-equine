import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher/Switcher'
import {
    apiGetAdminFeatureFlags,
    apiPatchAdminFeatureFlags,
} from '@/services/shared/FeatureFlagsService'

import type { FeatureFlagsDto } from '@shared/dtos'

const CardBody = styled.div`
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const ButtonRow = styled.div`
    padding-top: 12px;
`

const ErrorWrap = styled.div`
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.status.errorBg};
    background: ${({ theme }) => theme.colors.status.errorBg};
    padding: 12px ${({ theme }) => theme.spacing.md};
    font-size: 15px;
    color: ${({ theme }) => theme.colors.status.error};
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const LoadingWrap = styled.div`
    padding: ${({ theme }) => theme.spacing.xl} 0;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
`

const RowWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.lg};
`

const RowTitle = styled.div`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`

const RowDesc = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.7;
`

const RowText = styled.div`
    min-width: 0;
`

export default function Features() {
    const [loading, setLoading] = useState(true)
    const [savingKey, setSavingKey] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [flags, setFlags] = useState<FeatureFlagsDto>({
        compareEnabled: true,
        darkModeEnabled: true,
        cartEnabled: false,
    })

    const load = async () => {
        const res = await apiGetAdminFeatureFlags()
        const data = (res as any).data ?? res
        setFlags(data)
    }

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                setLoading(true)
                setError('')
                await load()
            } catch (e: any) {
                if (!mounted) return
                setError(e?.message || e?.error || 'Failed to load features.')
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    const toggle = async (key: keyof FeatureFlagsDto) => {
        try {
            setError('')
            setSavingKey(String(key))
            const next = !(flags as any)[key]

            setFlags((p) => ({ ...p, [key]: next }) as FeatureFlagsDto)

            const res = await apiPatchAdminFeatureFlags({ [key]: next } as any)
            const data = (res as any).data ?? res
            setFlags(data)
        } catch (e: any) {
            setError(e?.message || e?.error || 'Failed to update feature.')
            await load()
        } finally {
            setSavingKey(null)
        }
    }

    if (loading) return <LoadingWrap>Loading...</LoadingWrap>

    return (
        <>
            {error ? <ErrorWrap>{error}</ErrorWrap> : null}

            <Card>
                <CardBody>
                    <Row
                        title="Player compare"
                        desc="Show or hide the Compare button and player comparison."
                        checked={!!flags.compareEnabled}
                        busy={savingKey === 'compareEnabled'}
                        onChange={() => toggle('compareEnabled')}
                    />

                    <Row
                        title="Dark and light mode"
                        desc="Enable or disable dark and light mode UI."
                        checked={!!flags.darkModeEnabled}
                        busy={savingKey === 'darkModeEnabled'}
                        onChange={() => toggle('darkModeEnabled')}
                    />

                    <Row
                        title="Shopping cart"
                        desc="Show Add to Bag button on player profiles and enable cart, checkout, and orders."
                        checked={!!flags.cartEnabled}
                        busy={savingKey === 'cartEnabled'}
                        onChange={() => toggle('cartEnabled')}
                    />

                    <ButtonRow>
                        <Button variant="default" onClick={load}>
                            Refresh
                        </Button>
                    </ButtonRow>
                </CardBody>
            </Card>
        </>
    )
}

function Row({
    title,
    desc,
    checked,
    busy,
    onChange,
}: {
    title: string
    desc: string
    checked: boolean
    busy: boolean
    onChange: () => void
}) {
    return (
        <RowWrap>
            <RowText>
                <RowTitle>{title}</RowTitle>
                <RowDesc>{desc}</RowDesc>
            </RowText>
            <Switcher
                checked={checked}
                isLoading={busy}
                onChange={() => onChange()}
            />
        </RowWrap>
    )
}
