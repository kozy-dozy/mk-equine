import styled from 'styled-components'

// Card for stat blocks
export const StatCard = styled.div`
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    background: ${({ theme }) => theme.colors.bg.card};
    padding: ${({ theme }) => theme.spacing.lg};
    transition:
        background ${({ theme }) => theme.transition.base},
        border-color ${({ theme }) => theme.transition.base};
    box-shadow: ${({ theme }) => theme.shadow.sm};
    display: flex;
    flex-direction: column;
    min-width: 0;
`

// Dashboard page wrapper
export const DashboardWrapper = styled.div`
    padding: ${({ theme }) => theme.spacing.xl};
    @media (max-width: 600px) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`

export const DashboardHeader = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    .title {
        font-size: ${({ theme }) => theme.fontSize['2xl']};
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.primary};
    }
    .subtitle {
        color: ${({ theme }) => theme.colors.text.secondary};
        opacity: 0.7;
        margin-top: ${({ theme }) => theme.spacing.xs};
    }
`

export const QuickActionsCard = styled(StatCard)`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: ${({ theme }) => theme.spacing.sm};
    }
    .label {
        font-weight: 600;
        margin-bottom: 0.75rem;
    }
`

export const NewestMembersCard = styled(StatCard)`
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
        font-weight: 600;
    }
`
