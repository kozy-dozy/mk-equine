import styled from 'styled-components'

const PagerItem = styled.li`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: 600;
    margin: 0 ${({ theme }) => theme.spacing.xxs};
    list-style: none;
    user-select: none;
    transition:
        background ${({ theme }) => theme.transition.fast},
        color ${({ theme }) => theme.transition.fast};
`

export default PagerItem
