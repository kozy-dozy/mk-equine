import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import Avatar from '@kozydozy/ui/Avatar'
import Badge from '@kozydozy/ui/Badge'
import Button from '@kozydozy/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store'
import { getMemberById } from '@/store/slices/admin/membersSlice'

const Root = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
`
const TopRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: 0;
`
const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xxs};
`
const UserName = styled.div`
    font-size: ${({ theme }) => theme.fontSize.xl};
    font-weight: 600;
`
const UserEmail = styled.div`
    opacity: 0.7;
`
const ContentGrid = styled.div`
    margin-top: ${({ theme }) => theme.spacing.lg};
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`
const Card = styled.div`
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    padding: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.bg.card};
`
const SectionTitle = styled.div`
    margin-bottom: 12px;
    font-weight: 600;
`
const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({ theme }) => `${theme.spacing.sm} 0`};
`
const Label = styled.span`
    opacity: 0.7;
`
const Value = styled.span`
    font-weight: 600;
    text-transform: capitalize;
`
const BadgeRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.sm};
`
const NoAuthority = styled.span`
    opacity: 0.7;
`
const LoadingWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
`
const NotFoundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};
`
const NotFoundText = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 600;
`
const PillRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`
const PillText = styled.span<{ ok: boolean }>`
    font-weight: 600;
    color: ${({ ok, theme }) =>
        ok ? theme.colors.status.success : theme.colors.text.secondary};
`

const Pill = ({
    ok,
    yes = 'Yes',
    no = 'No',
}: {
    ok: boolean
    yes?: string
    no?: string
}) => (
    <PillRow>
        <Badge style={{ background: ok ? '#10b981' : '#a1a1aa' }} />
        <PillText ok={ok}>{ok ? yes : no}</PillText>
    </PillRow>
)

export default function MemberDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { selectedMember, detailsLoading } = useAppSelector(
        (s) => s.memberList,
    )

    useEffect(() => {
        if (!id) return
        dispatch(getMemberById(id))
    }, [dispatch, id])

    const onBack = () => navigate(-1)
    const theme = useTheme()

    if (detailsLoading) return <LoadingWrapper>Loading...</LoadingWrapper>

    if (!selectedMember) {
        return (
            <NotFoundWrapper>
                <NotFoundText>Member not found</NotFoundText>
                <Button onClick={onBack}>Back</Button>
            </NotFoundWrapper>
        )
    }

    const isAdmin = selectedMember.authority?.includes('admin') ?? false

    return (
        <Root>
            <TopRow>
                <Avatar
                    size={56}
                    src={selectedMember.avatar || undefined}
                    style={{
                        height: 56,
                        width: 56,
                        borderRadius: '50%',
                        border: `1px solid ${theme.colors.border.default}`,
                    }}
                />
                <UserInfo>
                    <UserName>
                        {selectedMember.firstName} {selectedMember.lastName}
                    </UserName>
                    <UserEmail>{selectedMember.email}</UserEmail>
                </UserInfo>
                <Button variant="plain" onClick={onBack}>
                    Back
                </Button>
            </TopRow>
            <ContentGrid>
                <Card>
                    <SectionTitle>Account</SectionTitle>
                    <Row>
                        <Label>Email verified</Label>
                        <Pill ok={!!selectedMember.emailVerified} />
                    </Row>
                    <Row>
                        <Label>Admin</Label>
                        <Pill ok={isAdmin} yes="Admin" no="No" />
                    </Row>
                    <Row>
                        <Label>Created</Label>
                        <Value>
                            {selectedMember.createdAt
                                ? dayjs(selectedMember.createdAt).format(
                                      'MM/DD/YYYY',
                                  )
                                : '—'}
                        </Value>
                    </Row>
                </Card>
                <Card>
                    <SectionTitle>Authority</SectionTitle>
                    <BadgeRow>
                        {(selectedMember.authority || []).map((r) => (
                            <Badge
                                key={r}
                                style={{
                                    background: theme.colors.primaryLight,
                                    color: theme.colors.primary,
                                    padding: '2px 8px',
                                    fontSize: 12,
                                }}
                            >
                                {r}
                            </Badge>
                        ))}
                        {!selectedMember.authority?.length && (
                            <NoAuthority>—</NoAuthority>
                        )}
                    </BadgeRow>
                </Card>
            </ContentGrid>
            {/* TODO Phase 10: add member's created players list */}
        </Root>
    )
}
