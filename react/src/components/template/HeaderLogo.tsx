import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Logo from '@/components/template/Logo'

const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    flex-shrink: 0;
`

export default function HeaderLogo() {
    // The ecom header sits on a near-black bar, so always use the gold logo.
    return (
        <LogoLink to="/">
            <Logo mode="dark" />
        </LogoLink>
    )
}
