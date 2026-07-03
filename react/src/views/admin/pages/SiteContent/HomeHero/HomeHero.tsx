import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Upload from '@/components/ui/Upload'
import { apiGetSiteAssetUploadUrl } from '@/services/shared/S3Service'
import {
    apiGetSiteContentAdmin,
    apiUpdateHomeHero,
} from '@/services/shared/SiteContentService'
import { getFirstFileFromUploadArg } from '@/utils/fileUpload'

const LoadingText = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`
const SpaceY = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`
const HeroImageWrapper = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.bg.card};
`
const HeroImage = styled.img`
    height: 224px;
    width: 100%;
    object-fit: cover;
    display: block;
`
const EmptyState = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.border.default};
    padding: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.bg.card};
    text-align: center;
`
const ButtonRow = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
`

async function uploadHero(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const desiredFileName = `site/home/hero-${crypto.randomUUID()}.${ext}`

    const presign = await apiGetSiteAssetUploadUrl({
        fileType: file.type,
        desiredFileName,
    })

    await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    })

    return presign.fileUrl
}

export default function HomeHeroPage() {
    const [loading, setLoading] = useState(true)
    const [heroUrl, setHeroUrl] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true)
            try {
                const res = await apiGetSiteContentAdmin()
                if (!mounted) return
                setHeroUrl(res.home?.heroImageUrl ?? '')
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    if (loading) return <LoadingText>Loading...</LoadingText>

    return (
        <SpaceY>
            <Card>
                {heroUrl ? (
                    <HeroImageWrapper>
                        <HeroImage src={heroUrl} alt="Hero" />
                    </HeroImageWrapper>
                ) : (
                    <EmptyState>No hero image set yet.</EmptyState>
                )}

                <Upload
                    draggable
                    showList={false}
                    onChange={async (arg: any) => {
                        const file = getFirstFileFromUploadArg(arg)
                        if (!file) return

                        const url = await uploadHero(file)
                        setHeroUrl(url)

                        toast.push(
                            <Notification
                                title="Uploaded"
                                type="success"
                                duration={2000}
                            >
                                Image uploaded. Click &quot;Save&quot; to
                                publish.
                            </Notification>,
                            { placement: 'top-center' },
                        )
                    }}
                />

                <ButtonRow>
                    <Button
                        variant="solid"
                        color="emerald-600"
                        loading={saving}
                        onClick={async () => {
                            setSaving(true)
                            try {
                                await apiUpdateHomeHero({
                                    heroImageUrl: heroUrl,
                                })
                                toast.push(
                                    <Notification
                                        title="Saved"
                                        type="success"
                                        duration={2000}
                                    >
                                        Hero updated.
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                            } finally {
                                setSaving(false)
                            }
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="twoTone"
                        disabled={saving}
                        onClick={() => setHeroUrl('')}
                    >
                        Clear
                    </Button>
                </ButtonRow>
            </Card>
        </SpaceY>
    )
}
