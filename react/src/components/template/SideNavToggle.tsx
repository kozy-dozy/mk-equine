import styled from 'styled-components'

import NavToggle from '@/components/shared/NavToggle'
import { useAppSelector, useAppDispatch, setSideNavCollapse } from '@/store'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useResponsive from '@/utils/hooks/useResponsive'

import type { CommonProps } from '@/@types/common'

const ToggleDiv = styled.button`
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
`

const StyledNavToggle = styled(NavToggle)`
    font-size: ${({ theme }) => theme.fontSize['2xl']};
`

const _SideNavToggle = ({ className }: CommonProps) => {
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )
    const dispatch = useAppDispatch()

    const { larger } = useResponsive()

    const onCollapse = () => {
        dispatch(setSideNavCollapse(!sideNavCollapse))
    }

    return (
        <>
            {larger.md && (
                <ToggleDiv
                    type="button"
                    aria-label="Toggle sidebar navigation"
                    aria-expanded={!sideNavCollapse}
                    className={className}
                    onClick={onCollapse}
                >
                    <StyledNavToggle toggled={sideNavCollapse} />
                </ToggleDiv>
            )}
        </>
    )
}

const SideNavToggle = withHeaderItem(_SideNavToggle)

export default SideNavToggle
