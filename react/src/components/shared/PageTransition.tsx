import styled, { keyframes } from 'styled-components'

import Spinner from '@/components/ui/Spinner'

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.bg.overlay};
    backdrop-filter: blur(4px);
    z-index: 50;
    pointer-events: none;
    animation: ${fadeIn} 0.3s ease;
`

export default function PageTransition() {
    return (
        <Backdrop>
            <Spinner size={48} />
        </Backdrop>
    )
}
