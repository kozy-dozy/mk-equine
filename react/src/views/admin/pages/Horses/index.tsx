import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Button from '@kozydozy/ui/Button'
import Dialog from '@kozydozy/ui/Dialog'
import Notification from '@kozydozy/ui/Notification'
import toast from '@kozydozy/ui/toast'
import Upload from '@kozydozy/ui/Upload'
import {
    apiCreateHorse,
    apiDeleteHorse,
    apiListAdminHorses,
    apiUpdateHorse,
} from '@/services/shared/HorseService'
import { apiGetSiteAssetUploadUrl } from '@/services/shared/S3Service'
import { getExtensionFromFile, getFirstFileFromUploadArg } from '@/utils/fileUpload'

import type { HorseDto, HorseStatus, HorseUpsertInput } from '@shared/dtos'

/* ---------------------------------------------------------------- styles */

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
    flex-wrap: wrap;
`

const Title = styled.h1`
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
`

const Count = styled.span`
    font-size: ${({ theme }) => theme.fontSize.base};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const ListGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
    }
`

const Row = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => theme.spacing.md};
`

const Thumb = styled.div<{ $src?: string }>`
    flex-shrink: 0;
    width: 84px;
    height: 84px;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme, $src }) =>
        $src ? `center / cover no-repeat url(${$src})` : theme.colors.bg.muted};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
`

const RowBody = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const RowName = styled.div`
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
`

const RowMeta = styled.div`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
`

const StatusPill = styled.span<{ $status: HorseStatus }>`
    align-self: flex-start;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 3px 10px;
    border-radius: ${({ theme }) => theme.radius.full};
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme, $status }) =>
        $status === 'available'
            ? theme.colors.secondary
            : $status === 'pending'
              ? theme.colors.text.muted
              : theme.colors.border.dark};
`

const RowActions = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.xs};
`

const EmptyState = styled.div`
    border: 1px dashed ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => theme.spacing['2xl']};
    text-align: center;
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.bg.card};
`

/* ── form ── */

const Form = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.sm};
`

const Field = styled.label<{ $full?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.secondary};
    grid-column: ${({ $full }) => ($full ? '1 / -1' : 'auto')};
`

const inputStyles = `
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
`

const Input = styled.input`
    ${inputStyles};
    border: 1px solid ${({ theme }) => theme.colors.border.strong};
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
`

const Select = styled.select`
    ${inputStyles};
    border: 1px solid ${({ theme }) => theme.colors.border.strong};
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
`

const Textarea = styled.textarea`
    ${inputStyles};
    border: 1px solid ${({ theme }) => theme.colors.border.strong};
    background: ${({ theme }) => theme.colors.bg.input};
    color: ${({ theme }) => theme.colors.text.primary};
    resize: vertical;
    min-height: 90px;
`

const Preview = styled.div<{ $src?: string }>`
    width: 100%;
    height: 160px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme, $src }) =>
        $src ? `center / cover no-repeat url(${$src})` : theme.colors.bg.muted};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: ${({ theme }) => theme.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const DialogActions = styled.div`
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-top: ${({ theme }) => theme.spacing.sm};
`

/* ---------------------------------------------------------------- helpers */

const EMPTY: HorseUpsertInput = {
    name: '',
    breed: '',
    age: 0,
    sex: '',
    discipline: '',
    price: 0,
    status: 'available',
    description: '',
    imageUrl: '',
    sortOrder: 0,
}

function notify(title: string, msg: string, type: 'success' | 'danger') {
    toast.push(
        <Notification title={title} type={type} duration={2500}>
            {msg}
        </Notification>,
        { placement: 'top-center' },
    )
}

export default function AdminHorsesPage() {
    const [horses, setHorses] = useState<HorseDto[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<HorseUpsertInput>(EMPTY)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    async function load() {
        setLoading(true)
        try {
            const res = await apiListAdminHorses()
            setHorses(res.horses)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    function openAdd() {
        setEditingId(null)
        setForm(EMPTY)
        setOpen(true)
    }

    function openEdit(h: HorseDto) {
        setEditingId(h.id)
        setForm({
            name: h.name,
            breed: h.breed,
            age: h.age,
            sex: h.sex,
            discipline: h.discipline,
            price: h.price,
            status: h.status,
            description: h.description,
            imageUrl: h.imageUrl,
            sortOrder: h.sortOrder,
        })
        setOpen(true)
    }

    function set<K extends keyof HorseUpsertInput>(
        key: K,
        value: HorseUpsertInput[K],
    ) {
        setForm((f) => ({ ...f, [key]: value }))
    }

    async function onUpload(arg: any) {
        const file = getFirstFileFromUploadArg(arg)
        if (!file) return
        setUploading(true)
        try {
            const ext = getExtensionFromFile(file)
            const desiredFileName = `horses/horse-${crypto.randomUUID()}.${ext}`
            const presign = await apiGetSiteAssetUploadUrl({
                fileType: file.type,
                desiredFileName,
            })
            await fetch(presign.uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            })
            set('imageUrl', presign.fileUrl)
            notify('Uploaded', 'Photo uploaded. Save to apply.', 'success')
        } catch {
            notify('Upload failed', 'Could not upload the photo.', 'danger')
        } finally {
            setUploading(false)
        }
    }

    async function save() {
        if (!form.name.trim()) {
            notify('Name required', 'Please enter a name.', 'danger')
            return
        }
        setSaving(true)
        try {
            if (editingId) {
                await apiUpdateHorse(editingId, form)
            } else {
                await apiCreateHorse(form)
            }
            notify('Saved', `${form.name} saved.`, 'success')
            setOpen(false)
            await load()
        } catch {
            notify('Save failed', 'Could not save the listing.', 'danger')
        } finally {
            setSaving(false)
        }
    }

    async function remove(h: HorseDto) {
        if (!window.confirm(`Delete ${h.name}? This cannot be undone.`)) return
        try {
            await apiDeleteHorse(h.id)
            notify('Deleted', `${h.name} removed.`, 'success')
            await load()
        } catch {
            notify('Delete failed', 'Could not delete the listing.', 'danger')
        }
    }

    return (
        <Wrap>
            <HeaderRow>
                <div>
                    <Title>Horses For Sale</Title>
                    <Count>
                        {loading ? 'Loading…' : `${horses.length} listing(s)`}
                    </Count>
                </div>
                <Button variant="solid" onClick={openAdd}>
                    + Add Horse
                </Button>
            </HeaderRow>

            {!loading && horses.length === 0 ? (
                <EmptyState>
                    No horses yet. Click “Add Horse” to create your first
                    listing.
                </EmptyState>
            ) : (
                <ListGrid>
                    {horses.map((h) => (
                        <Row key={h.id}>
                            <Thumb $src={h.imageUrl || undefined} />
                            <RowBody>
                                <RowName>{h.name}</RowName>
                                <RowMeta>
                                    {[h.breed, h.sex, h.age ? `${h.age} yrs` : '']
                                        .filter(Boolean)
                                        .join(' · ')}
                                </RowMeta>
                                <RowMeta>
                                    {h.discipline}
                                    {h.price ? ` · $${h.price.toLocaleString()}` : ''}
                                </RowMeta>
                                <StatusPill $status={h.status}>
                                    {h.status}
                                </StatusPill>
                                <RowActions>
                                    <Button
                                        size="sm"
                                        onClick={() => openEdit(h)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="plain"
                                        onClick={() => remove(h)}
                                    >
                                        Delete
                                    </Button>
                                </RowActions>
                            </RowBody>
                        </Row>
                    ))}
                </ListGrid>
            )}

            <Dialog
                isOpen={open}
                width={640}
                onClose={() => setOpen(false)}
                onRequestClose={() => setOpen(false)}
            >
                <Form>
                    <Field $full>
                        Photo
                        <Preview $src={form.imageUrl || undefined}>
                            {form.imageUrl ? '' : 'No photo yet'}
                        </Preview>
                        <Upload
                            draggable
                            showList={false}
                            disabled={uploading}
                            onChange={onUpload}
                        />
                    </Field>

                    <Field>
                        Name
                        <Input
                            value={form.name}
                            placeholder="e.g. Cisco"
                            onChange={(e) => set('name', e.target.value)}
                        />
                    </Field>
                    <Field>
                        Discipline
                        <Input
                            value={form.discipline}
                            placeholder="e.g. Ranch & Trail"
                            onChange={(e) => set('discipline', e.target.value)}
                        />
                    </Field>

                    <Field>
                        Breed
                        <Input
                            value={form.breed}
                            placeholder="e.g. Quarter Horse"
                            onChange={(e) => set('breed', e.target.value)}
                        />
                    </Field>
                    <Field>
                        Sex
                        <Input
                            value={form.sex}
                            placeholder="e.g. Gelding"
                            onChange={(e) => set('sex', e.target.value)}
                        />
                    </Field>

                    <Field>
                        Age (years)
                        <Input
                            type="number"
                            value={form.age}
                            onChange={(e) =>
                                set('age', Number(e.target.value) || 0)
                            }
                        />
                    </Field>
                    <Field>
                        Price (USD)
                        <Input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                set('price', Number(e.target.value) || 0)
                            }
                        />
                    </Field>

                    <Field>
                        Status
                        <Select
                            value={form.status}
                            onChange={(e) =>
                                set('status', e.target.value as HorseStatus)
                            }
                        >
                            <option value="available">Available</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                        </Select>
                    </Field>
                    <Field>
                        Sort order
                        <Input
                            type="number"
                            value={form.sortOrder}
                            onChange={(e) =>
                                set('sortOrder', Number(e.target.value) || 0)
                            }
                        />
                    </Field>

                    <Field $full>
                        Description
                        <Textarea
                            value={form.description}
                            placeholder="A short, friendly description of this horse."
                            onChange={(e) =>
                                set('description', e.target.value)
                            }
                        />
                    </Field>

                    <DialogActions>
                        <Button disabled={saving} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={saving}
                            disabled={uploading}
                            onClick={save}
                        >
                            {editingId ? 'Save Changes' : 'Create Listing'}
                        </Button>
                    </DialogActions>
                </Form>
            </Dialog>
        </Wrap>
    )
}
