import { HiDownload } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Button from '@/components/ui/Button'

import MemberTableSearch from './MemberTableSearch'

const ToolsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    flex-wrap: wrap;
`

const MemberTableTools = () => {
    return (
        <ToolsWrapper>
            <MemberTableSearch />
            <Link download to="/data/member-list.csv" target="_blank">
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
        </ToolsWrapper>
    )
}

export default MemberTableTools
