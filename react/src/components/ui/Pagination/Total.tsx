import styled from 'styled-components'

const TotalWrap = styled.div`
    font-weight: 600;
    margin-right: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSize.sm};
`

const Total = ({ total }: { total: number }) => (
    <TotalWrap>
        Total <span>{total}</span> Items
    </TotalWrap>
)

export default Total
