import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Card } from '@kozydozy/ui'
import Button from '@kozydozy/ui/Button'
import Tag from '@kozydozy/ui/Tag'
import {
    apiGetSiteContentAdmin,
    type SiteContentHome,
} from '@/services/shared/SiteContentService'

const SectionCardWrap = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: 20px 20px ${({ theme }) => theme.spacing.md} 20px;
`

const SectionCardRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
`

const SectionCardText = styled.div`
    flex: 1 1 0%;
`
const Title = styled.div`
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
`
const Desc = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`
const TagWrap = styled.div`
    margin-top: 12px;
`

const SectionCardPreview = styled.div`
    height: 64px;
    width: 96px;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.bg.card};
    display: flex;
    align-items: center;
    justify-content: center;
`

function SectionCard({
    title,
    description,
    href,
    configured,
    previewUrl,
}: {
    title: string
    description: string
    href: string
    configured: boolean
    previewUrl?: string
}) {
    return (
        <SectionCardWrap>
            <SectionCardRow>
                <SectionCardText>
                    <Title>{title}</Title>
                    <Desc>{description}</Desc>
                    <TagWrap>
                        <Tag
                            style={{
                                color: configured ? '#059669' : '#6b7280',
                            }}
                        >
                            {configured ? 'Configured' : 'Not set'}
                        </Tag>
                    </TagWrap>
                </SectionCardText>
                {previewUrl ? (
                    <SectionCardPreview>
                        <img
                            src={previewUrl}
                            alt={title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </SectionCardPreview>
                ) : null}
            </SectionCardRow>
            <div style={{ marginTop: 16 }}>
                <Link to={href}>
                    <Button variant="twoTone">Manage</Button>
                </Link>
            </div>
        </SectionCardWrap>
    )
}

function normalizeCategories(cats: any[] | undefined) {
    const safe = Array.isArray(cats) ? cats : []
    const sliced = safe.slice(0, 4).map((c) => ({
        imageUrl: c?.imageUrl ?? '',
        label: c?.label ?? '',
        href: c?.href ?? '',
    }))
    while (sliced.length < 4) sliced.push({ imageUrl: '', label: '', href: '' })
    return sliced
}
const PageWrap = styled.div`
    padding: ${({ theme }) => theme.spacing.xl} 0 0 0;
`

const SectionGrid = styled.div`
    display: grid;
    gap: ${({ theme }) => theme.spacing.lg};
    grid-template-columns: 1fr;
    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1fr;
    }
`

const LoadingWrap = styled.div`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 15px;
    padding: ${({ theme }) => theme.spacing.xl} 0;
    text-align: center;
`

export default function HomeContentIndex() {
    const [home, setHome] = useState<SiteContentHome | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true)
            try {
                const res = await apiGetSiteContentAdmin()
                if (!mounted) return
                setHome({
                    heroImageUrl: res.home?.heroImageUrl ?? '',
                    categories: normalizeCategories(res.home?.categories),
                })
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    if (loading) return <LoadingWrap>Loading...</LoadingWrap>

    const heroConfigured = !!home?.heroImageUrl
    const catConfigured = (home?.categories ?? []).some((c) => !!c.imageUrl)

    return (
        <PageWrap>
            <SectionGrid>
                <SectionCard
                    title="Home Page Hero"
                    description="Hero banner image on the home page."
                    href="/admin/site-content/home/hero"
                    configured={heroConfigured}
                    previewUrl={home?.heroImageUrl || undefined}
                />
                <SectionCard
                    title="Home Page Categories"
                    description="Four category tiles shown on the home page."
                    href="/admin/site-content/home/categories"
                    configured={catConfigured}
                    previewUrl={
                        home?.categories?.find((c) => c.imageUrl)?.imageUrl
                    }
                />
            </SectionGrid>
        </PageWrap>
    )
}
