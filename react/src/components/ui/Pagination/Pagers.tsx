import { useState, useEffect, useCallback, useMemo } from 'react'
import {
    HiOutlineChevronDoubleLeft,
    HiOutlineDotsHorizontal,
    HiChevronDoubleRight,
} from 'react-icons/hi'
import styled from 'styled-components'

import PagerItem from './PagerItem'

const PAGER_COUNT = 7

const ActivePagerItem = styled(PagerItem)`
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
`

const InactivePagerItem = styled(PagerItem)`
    color: ${({ theme }) => theme.colors.text.secondary};
    &:hover {
        background: ${({ theme }) => theme.colors.bg.hover};
        color: ${({ theme }) => theme.colors.text.primary};
    }
`

const MoreItem = styled(InactivePagerItem)`
    font-size: ${({ theme }) => theme.fontSize.base};
`

type More = 'nextMore' | 'prevMore'

const NextMore = ({ onArrow }: { onArrow: (m: More) => void }) => {
    const [hover, setHover] = useState(false)
    return (
        <MoreItem
            role="presentation"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => onArrow('nextMore')}
        >
            {hover ? <HiChevronDoubleRight /> : <HiOutlineDotsHorizontal />}
        </MoreItem>
    )
}

const PrevMore = ({ onArrow }: { onArrow: (m: More) => void }) => {
    const [hover, setHover] = useState(false)
    return (
        <MoreItem
            role="presentation"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => onArrow('prevMore')}
        >
            {hover ? (
                <HiOutlineChevronDoubleLeft />
            ) : (
                <HiOutlineDotsHorizontal />
            )}
        </MoreItem>
    )
}

type PagersProps = {
    pageCount: number
    currentPage: number
    onChange: (page: number) => void
}

const Pagers = ({ pageCount, currentPage, onChange }: PagersProps) => {
    const [showPrevMore, setShowPrevMore] = useState(false)
    const [showNextMore, setShowNextMore] = useState(false)

    useEffect(() => {
        if (pageCount > PAGER_COUNT) {
            setShowPrevMore(currentPage > PAGER_COUNT - 2)
            setShowNextMore(currentPage < pageCount - 2)
            if (currentPage >= pageCount - 3) setShowNextMore(false)
            if (currentPage <= 4) setShowPrevMore(false)
        } else {
            setShowPrevMore(false)
            setShowNextMore(false)
        }
    }, [currentPage, pageCount])

    const onPagerClick = (
        value: number,
        e: React.MouseEvent<HTMLLIElement>,
    ) => {
        e.preventDefault()
        const p = Math.max(1, Math.min(pageCount, value))
        if (p !== currentPage) onChange(p)
    }

    const onArrowClick = useCallback(
        (dir: More) => {
            const p = dir === 'nextMore' ? currentPage + 5 : currentPage - 5
            onChange(p)
        },
        [currentPage, onChange],
    )

    const pages = useMemo(() => {
        const arr: number[] = []
        if (showPrevMore && !showNextMore) {
            const start = pageCount - (PAGER_COUNT - 2)
            for (let i = start; i < pageCount; i++) arr.push(i)
        } else if (!showPrevMore && showNextMore) {
            for (let i = 2; i < PAGER_COUNT; i++) arr.push(i)
        } else if (showPrevMore && showNextMore) {
            const offset = Math.floor(PAGER_COUNT / 2) - 1
            for (let i = currentPage - offset; i <= currentPage + offset; i++)
                arr.push(i)
        } else {
            for (let i = 2; i < pageCount; i++) arr.push(i)
        }
        return arr.length > PAGER_COUNT ? [] : arr
    }, [showPrevMore, showNextMore, currentPage, pageCount])

    const renderPage = (n: number) => {
        const Li = n === currentPage ? ActivePagerItem : InactivePagerItem
        return (
            <Li key={n} role="presentation" onClick={(e) => onPagerClick(n, e)}>
                {n}
            </Li>
        )
    }

    return (
        <ul style={{ display: 'contents' }}>
            {pageCount > 0 && renderPage(1)}
            {showPrevMore && <PrevMore onArrow={onArrowClick} />}
            {pages.map(renderPage)}
            {showNextMore && <NextMore onArrow={onArrowClick} />}
            {pageCount > 1 && renderPage(pageCount)}
        </ul>
    )
}

export default Pagers
