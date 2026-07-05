import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Card } from '@kozydozy/ui'
import Button from '@kozydozy/ui/Button'
import Input from '@kozydozy/ui/Input'
import Notification from '@kozydozy/ui/Notification'
import toast from '@kozydozy/ui/toast'
import Upload from '@kozydozy/ui/Upload'
import { apiGetSiteAssetUploadUrl } from '@/services/shared/S3Service'
import {
    apiGetSiteContentAdmin,
    apiUpdateHomeCategories,
    type HomeCategoryContent,
} from '@/services/shared/SiteContentService'
import {
    getExtensionFromFile,
    getFirstFileFromUploadArg,
} from '@/utils/fileUpload'

function normalizeCategories(cats: any[] | undefined): HomeCategoryContent[] {
    const safe = Array.isArray(cats) ? cats : []
    const sliced = safe.slice(0, 4).map((c) => ({
        imageUrl: String(c?.imageUrl ?? ''),
        label: String(c?.label ?? ''),
        href: String(c?.href ?? ''),
    }))
    while (sliced.length < 4) sliced.push({ imageUrl: '', label: '', href: '' })
    return sliced
}

async function uploadCategoryImage(slotIndex: number, file: File) {
    const ext = getExtensionFromFile(file)
    const desiredFileName = `site/home/categories/cat-${slotIndex + 1}-${crypto.randomUUID()}.${ext}`

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

const TileCard = styled(Card)`
    padding: ${({ theme }) => theme.spacing.md};
`
const TileHeader = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
`
const TileTitle = styled.div`
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.dark};
`
const TileSubtitle = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`
const TileGrid = styled.div`
    margin-top: ${({ theme }) => theme.spacing.md};
    display: grid;
    gap: ${({ theme }) => theme.spacing.md};
    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
    }
`
const TilePreview = styled.div`
    grid-column: span 2;
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radius.xl};
    background: ${({ theme }) => theme.colors.bg.hover};
`
const TileImage = styled.img`
    width: 100%;
    object-fit: cover;
    @media (min-width: 1024px) {
        height: 10rem;
    }
`
const TileNoImage = styled.div`
    display: flex;
    height: 10rem;
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.radius.xl};
    border: 1px dashed ${({ theme }) => theme.colors.border.strong};
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`
const TileFields = styled.div`
    grid-column: span 3;
    display: grid;
    gap: 0.75rem;
`
const TileFieldLabel = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
`
const TileFieldHint = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`
function CategoryTileEditor({
    index,
    value,
    disabled,
    onChange,
    onClearImage,
    onUpload,
}: {
    index: number
    value: HomeCategoryContent
    disabled?: boolean
    onChange: (next: HomeCategoryContent) => void
    onClearImage: () => void
    onUpload: (file: File) => Promise<void>
}) {
    return (
        <TileCard>
            <TileHeader>
                <div>
                    <TileTitle>Category Tile {index + 1}</TileTitle>
                    <TileSubtitle>
                        Image + label + link (optional).
                    </TileSubtitle>
                </div>
                <Button
                    size="sm"
                    variant="twoTone"
                    disabled={disabled}
                    onClick={onClearImage}
                >
                    Clear image
                </Button>
            </TileHeader>
            <TileGrid>
                {/* Preview */}
                <TilePreview>
                    {value.imageUrl ? (
                        <TileImage
                            src={value.imageUrl}
                            alt={`Category tile ${index + 1}`}
                        />
                    ) : (
                        <TileNoImage>No image yet</TileNoImage>
                    )}
                    <div style={{ marginTop: '0.75rem' }}>
                        <Upload
                            draggable
                            showList={false}
                            disabled={disabled}
                            onChange={async (arg: any) => {
                                const file = getFirstFileFromUploadArg(arg)
                                if (!file) return
                                await onUpload(file)
                            }}
                        />
                        <TileFieldHint>
                            Upload replaces the current image (not published
                            until Save).
                        </TileFieldHint>
                    </div>
                </TilePreview>
                {/* Fields */}
                <TileFields>
                    <div>
                        <TileFieldLabel>Label</TileFieldLabel>
                        <Input
                            value={value.label}
                            disabled={disabled}
                            placeholder="e.g. Shrubs"
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    label: (e.target as any).value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <TileFieldLabel>Link (href)</TileFieldLabel>
                        <Input
                            value={value.href}
                            disabled={disabled}
                            placeholder="e.g. /shop?category=Shrubs"
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    href: (e.target as any).value,
                                })
                            }
                        />
                        <TileFieldHint>
                            Optional. You can link to a collection page or a
                            filtered shop URL.
                        </TileFieldHint>
                    </div>
                </TileFields>
            </TileGrid>
        </TileCard>
    )
}

export default function HomeCategoriesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Persisted snapshot (for "Reset changes")
    const [initialCategories, setInitialCategories] = useState<
        HomeCategoryContent[]
    >([])
    // Local editable draft
    const [categories, setCategories] = useState<HomeCategoryContent[]>([])

    const dirty = useMemo(() => {
        return JSON.stringify(categories) !== JSON.stringify(initialCategories)
    }, [categories, initialCategories])

    useEffect(() => {
        let mounted = true
        ;(async () => {
            setLoading(true)
            try {
                const res = await apiGetSiteContentAdmin()
                if (!mounted) return
                const cats = normalizeCategories(res.home?.categories)
                setInitialCategories(cats)
                setCategories(cats)
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => {
            mounted = false
        }
    }, [])

    if (loading)
        return (
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Loading...
            </div>
        )

    const setCatAt = (idx: number, next: HomeCategoryContent) => {
        setCategories((prev) => prev.map((c, i) => (i === idx ? next : c)))
    }

    const clearImageAt = (idx: number) => {
        setCategories((prev) =>
            prev.map((c, i) => (i === idx ? { ...c, imageUrl: '' } : c)),
        )
    }

    const handleUploadAt = async (idx: number, file: File) => {
        const url = await uploadCategoryImage(idx, file)
        setCategories((prev) =>
            prev.map((c, i) => (i === idx ? { ...c, imageUrl: url } : c)),
        )

        toast.push(
            <Notification title="Uploaded" type="success" duration={2000}>
                Tile {idx + 1} uploaded. Click “Save” to publish.
            </Notification>,
            { placement: 'top-center' },
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {categories.map((cat, idx) => (
                    <CategoryTileEditor
                        key={idx}
                        index={idx}
                        value={cat}
                        disabled={saving}
                        onChange={(next) => setCatAt(idx, next)}
                        onClearImage={() => clearImageAt(idx)}
                        onUpload={(file) => handleUploadAt(idx, file)}
                    />
                ))}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                }}
            >
                <Button
                    variant="solid"
                    color="emerald-600"
                    loading={saving}
                    disabled={!dirty || saving}
                    onClick={async () => {
                        setSaving(true)
                        try {
                            const payload = normalizeCategories(categories)
                            const res = await apiUpdateHomeCategories({
                                categories: payload,
                            })
                            const saved = normalizeCategories(res.categories)
                            setInitialCategories(saved)
                            setCategories(saved)
                            toast.push(
                                <Notification
                                    title="Saved"
                                    type="success"
                                    duration={2200}
                                >
                                    Home categories updated.
                                </Notification>,
                                { placement: 'top-center' },
                            )
                        } catch (e: any) {
                            toast.push(
                                <Notification
                                    title="Save failed"
                                    type="danger"
                                    duration={3000}
                                >
                                    {e?.message || 'Please try again.'}
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
                    disabled={!dirty || saving}
                    onClick={() => setCategories(initialCategories)}
                >
                    Reset changes
                </Button>
            </div>
            <Card style={{ padding: '1rem' }}>
                <div
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#111827',
                    }}
                >
                    Notes
                </div>
                <ul
                    style={{
                        marginTop: '0.5rem',
                        listStyle: 'disc',
                        paddingLeft: '1.25rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                    }}
                >
                    <li>
                        Uploads go to S3 immediately, but the site won`t use
                        them until you click Save.
                    </li>
                    <li>
                        Keep images consistent (same aspect ratio) for the
                        cleanest grid.
                    </li>
                    <li>
                        Links can point to collections, e.g.{' '}
                        <span
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                            }}
                        >
                            /shop?category=Shrubs
                        </span>
                        .
                    </li>
                </ul>
            </Card>
        </div>
    )
}
