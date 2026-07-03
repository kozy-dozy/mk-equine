import styled from 'styled-components'

import { getLogoDarkUrl, getLogoLightUrl } from '@/config/integrations.config'
import { APP_NAME } from '@/constants/app.constant'

interface LogoProps {
    mode?: 'light' | 'dark'
    style?: React.CSSProperties
    logoWidth?: number | string
}

// `mode` describes the background the logo sits on:
//   'dark'  → use the gold logo (for dark backgrounds)
//   'light' → use the brown logo (for light backgrounds)
const LOGO_SRC: Record<'light' | 'dark', string> = {
    dark: getLogoLightUrl(),
    light: getLogoDarkUrl(),
}

const LogoWrap = styled.div<{ $width?: string | number }>`
    display: flex;
    align-items: center;
    width: ${({ $width }) =>
        typeof $width === 'number' ? `${$width}px` : ($width ?? 'auto')};
`

const LogoImg = styled.img`
    display: block;
    object-fit: contain;
    flex-shrink: 0;
    height: 56px;
    width: auto;

    @media (min-width: 768px) {
        height: 64px;
    }
`

export default function Logo({ mode = 'light', style, logoWidth }: LogoProps) {
    return (
        <LogoWrap style={style} $width={logoWidth}>
            <LogoImg
                src={LOGO_SRC[mode]}
                alt={`${APP_NAME} logo`}
                draggable={false}
            />
        </LogoWrap>
    )
}
