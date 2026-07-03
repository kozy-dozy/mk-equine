import styled from 'styled-components'

export const MemberListWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    padding: ${({ theme }) => theme.spacing.lg};
    @media (max-width: 600px) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`

export const MemberListHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    h3 {
        margin: 0;
        font-size: ${({ theme }) => theme.fontSize.lg};
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text.primary};
        white-space: nowrap;
    }
`
