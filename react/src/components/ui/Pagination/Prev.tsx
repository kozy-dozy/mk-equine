import { HiChevronLeft } from 'react-icons/hi'

import { PagerBtn } from './Pagination'

import type { MouseEvent } from 'react'

interface PrevProps {
    currentPage: number
    onPrev: (e: MouseEvent<HTMLSpanElement>) => void
}

const Prev = ({ currentPage, onPrev }: PrevProps) => {
    const disabled = currentPage <= 1

    return (
        <PagerBtn
            role="presentation"
            data-disabled={disabled ? 'true' : 'false'}
            onClick={disabled ? undefined : onPrev}
        >
            <HiChevronLeft />
        </PagerBtn>
    )
}

export default Prev
