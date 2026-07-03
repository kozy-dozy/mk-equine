import styled from 'styled-components'

import Table from '@/components/ui/Table'
import MkEquine from '@/components/ui/MkEquine'

import type { MkEquineProps } from '@/components/ui/MkEquine'

type TableRowProps = {
    columns?: number
    rows?: number
    avatarInColumns?: number[]
    avatarProps?: MkEquineProps
}

const { Tr, Td, TBody } = Table

const MkEquineRow = styled.div`
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const TableRow = (props: TableRowProps) => {
    const { columns = 1, rows = 10, avatarInColumns = [], avatarProps } = props

    return (
        <TBody>
            {Array.from(new Array(rows), (_, i) => i + 0).map((row) => (
                <Tr key={`row-${row}`}>
                    {Array.from(new Array(columns), (_, i) => i + 0).map(
                        (col) => (
                            <Td key={`col-${col}`}>
                                <MkEquineRow>
                                    {avatarInColumns.includes(col) && (
                                        <div>
                                            <MkEquine
                                                variant="circle"
                                                {...avatarProps}
                                            />
                                        </div>
                                    )}
                                    <MkEquine />
                                </MkEquineRow>
                            </Td>
                        ),
                    )}
                </Tr>
            ))}
        </TBody>
    )
}

export default TableRow
