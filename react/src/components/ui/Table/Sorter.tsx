import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'
import styled from 'styled-components'
import { useTheme } from 'styled-components'

import type { SportsTheme } from '@/styles/theme'

export type SorterProps = { sort?: boolean | 'asc' | 'desc' }

const SorterWrap = styled.div`
    display: inline-flex;
`

const ColoredIcon = styled.span<{ $color: string }>`
    color: ${({ $color }) => $color};
    display: inline-flex;
`

const Sorter = ({ sort }: SorterProps) => {
    const theme = useTheme() as SportsTheme
    const activeColor = theme.colors.primary

    const renderSort = () => {
        if (typeof sort === 'boolean') {
            return <FaSort />
        }

        if (sort === 'asc') {
            return <ColoredIcon $color={activeColor}><FaSortUp /></ColoredIcon>
        }

        if (sort === 'desc') {
            return <ColoredIcon $color={activeColor}><FaSortDown /></ColoredIcon>
        }

        return null
    }

    return <SorterWrap>{renderSort()}</SorterWrap>
}

export default Sorter
