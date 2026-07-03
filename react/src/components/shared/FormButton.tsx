import styled from 'styled-components'

/**
 * Shared pill submit button that matches the marketing CTA style
 * (terracotta, rounded-full, soft shadow). Use for primary form actions
 * on public/auth pages. Pass `$block` to fill the container width.
 */
const FormButton = styled.button<{ $block?: boolean }>`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    width: ${({ $block }) => ($block ? '100%' : 'auto')};
    font-size: 0.95rem;
    font-weight: 600;
    padding: 14px 28px;
    border: none;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.colors.accentGold};
    color: ${({ theme }) => theme.colors.text.inverse};
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(165, 91, 58, 0.25);
    transition:
        background-color 0.2s ease,
        transform 0.18s ease,
        opacity 0.2s ease;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.primaryHover};
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

export default FormButton
