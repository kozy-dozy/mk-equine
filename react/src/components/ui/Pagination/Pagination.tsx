import { useState, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import Next from './Next'
import Pager from './Pagers'
import Prev from './Prev'
import Total from './Total'

export interface PaginationProps {
    className?: string
    currentPage?: number
    displayTotal?: boolean
    onChange?: (pageNumber: number) => void
    pageSize?: number
    total?: number
}

export const PagerBtn = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: ${({ theme }) => theme.radius.md};
    margin: 0 ${({ theme }) => theme.spacing.xxs};
    transition:
        background ${({ theme }) => theme.transition.fast},
        color ${({ theme }) => theme.transition.fast};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.fontSize.md};
    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
        color: ${({ theme }) => theme.colors.text.primary};
    }
    &[data-disabled='true'] {
        cursor: not-allowed;
        opacity: 0.35;
        pointer-events: none;
    }
`

const PaginationWrap = styled.div`
    display: inline-flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.radius.md};
    gap: ${({ theme }) => theme.spacing.xxs};
`

const Pagination = (props: PaginationProps) => {
    const {
        className,
        currentPage = 1,
        displayTotal = false,
        onChange,
        pageSize = 1,
        total = 5,
    } = props

    const [paginationTotal, setPaginationTotal] = useState(total)
    const [internalPageSize, setInternalPageSize] = useState(pageSize)

    const getInternalPageCount = useMemo(() => {
        if (typeof paginationTotal === 'number') {
            return Math.ceil(paginationTotal / internalPageSize)
        }
        return null
    }, [paginationTotal, internalPageSize])

    const getValidCurrentPage = useCallback(
        (count: number | string) => {
            const value = parseInt(count as string, 10)
            const internalPageCount = getInternalPageCount
            let resetValue: number | undefined
            if (!internalPageCount) {
                if (isNaN(value) || value < 1) resetValue = 1
            } else {
                if (value < 1) resetValue = 1
                if (value > internalPageCount) resetValue = internalPageCount
            }
            if ((resetValue === undefined && isNaN(value)) || resetValue === 0) {
                resetValue = 1
            }
            return resetValue === undefined ? value : resetValue
        },
        [getInternalPageCount],
    )

    const [internalCurrentPage, setInternalCurrentPage] = useState(
        currentPage ? getValidCurrentPage(currentPage) : 1,
    )

    useEffect(() => {
        if (total !== paginationTotal) setPaginationTotal(total)
        if (pageSize !== internalPageSize) setInternalPageSize(pageSize)
        if (currentPage !== internalCurrentPage) setInternalCurrentPage(currentPage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, pageSize, currentPage])

    const onPaginationChange = (val: number) => {
        setInternalCurrentPage(getValidCurrentPage(val))
        onChange?.(getValidCurrentPage(val))
    }

    const onPrev = useCallback(() => {
        const newPage = internalCurrentPage - 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const onNext = useCallback(() => {
        const newPage = internalCurrentPage + 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    return (
        <PaginationWrap className={className}>
            {displayTotal && <Total total={total} />}
            <Prev currentPage={internalCurrentPage} onPrev={onPrev} />
            <Pager
                pageCount={getInternalPageCount as number}
                currentPage={internalCurrentPage}
                onChange={onPaginationChange}
            />
            <Next
                currentPage={internalCurrentPage}
                pageCount={getInternalPageCount as number}
                onNext={onNext}
            />
        </PaginationWrap>
    )
}

Pagination.displayName = 'Pagination'

export default Pagination
