import { GiHorseshoe } from 'react-icons/gi'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`

const IconWrap = styled.div<{ $size: number }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.accentGold};
    font-size: ${({ $size }) => $size}px;
    animation: ${rotate} 0.9s linear infinite;
    flex-shrink: 0;
`

export interface SpinnerProps {
    size?: number | string
    className?: string
    style?: React.CSSProperties
}

export function Spinner({ size = 30, className, style }: SpinnerProps) {
    const px = typeof size === 'number' ? size : parseInt(size, 10) || 30

    return (
        <IconWrap $size={px} className={className} style={style}>
            <GiHorseshoe />
        </IconWrap>
    )
}

Spinner.displayName = 'Spinner'

export default Spinner
