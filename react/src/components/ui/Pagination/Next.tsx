import { HiChevronRight } from 'react-icons/hi'

import { PagerBtn } from './Pagination'

import type { MouseEvent } from 'react'

interface NextProps {
    currentPage: number
    pageCount: number
    onNext: (e: MouseEvent<HTMLSpanElement>) => void
}

const Next = ({ currentPage, pageCount, onNext }: NextProps) => {
    const disabled = currentPage === pageCount || pageCount === 0

    return (
        <PagerBtn
            role="presentation"
            data-disabled={disabled ? 'true' : 'false'}
            onClick={
                disabled
                    ? undefined
                    : (e) => {
                          e.preventDefault()
                          onNext(e)
                      }
            }
        >
            <HiChevronRight />
        </PagerBtn>
    )
}

export default Next
