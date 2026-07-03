import styled from 'styled-components'
import { HiOutlineMenuAlt2, HiOutlineMenu } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'

export interface NavToggleProps extends CommonProps {
    toggled?: boolean
}

const ToggleWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const NavToggle = ({ toggled, ...rest }: NavToggleProps) => {
    return (
        <ToggleWrap {...rest}>
            {toggled ? <HiOutlineMenu /> : <HiOutlineMenuAlt2 />}
        </ToggleWrap>
    )
}

export default NavToggle
