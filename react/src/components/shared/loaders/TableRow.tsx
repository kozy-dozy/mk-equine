import styled from 'styled-components'

import { Skeleton } from '@kozydozy/ui'
import Table from '@kozydozy/ui/Table'

import type { SkeletonProps } from '@kozydozy/ui'

type TableRowProps = {
    columns?: number
    rows?: number
    avatarInColumns?: number[]
    avatarProps?: SkeletonProps
}

const { Tr, Td, TBody } = Table

const SkeletonRow = styled.div`
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
                                <SkeletonRow>
                                    {avatarInColumns.includes(col) && (
                                        <div>
                                            <Skeleton
                                                variant="circle"
                                                {...avatarProps}
                                            />
                                        </div>
                                    )}
                                    <Skeleton />
                                </SkeletonRow>
                            </Td>
                        ),
                    )}
                </Tr>
            ))}
        </TBody>
    )
}

export default TableRow
