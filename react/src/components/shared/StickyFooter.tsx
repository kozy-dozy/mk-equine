import { useRef, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

import type { CommonProps } from '@/@types/common'
import type { HTMLAttributes } from 'react'

interface StickyFooterProps
    extends CommonProps, HTMLAttributes<HTMLDivElement> {
    stickyClass?: string
}

const FooterWrap = styled.div<{ $isSticky: boolean; $stickyClass?: string }>`
    position: sticky;
    bottom: -${({ theme }) => theme.spacing.xxs};
    z-index: 10;
    ${({ $isSticky, $stickyClass }) =>
        $isSticky && $stickyClass
            ? css`
                  ${$stickyClass}
              `
            : ''}
`

const StickyFooter = (props: StickyFooterProps) => {
    const { children, stickyClass, ...rest } = props
    const [isSticky, setIsSticky] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cachedRef = ref.current
        const observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            {
                threshold: [1],
            },
        )
        observer.observe(cachedRef as Element)
        return function () {
            observer.unobserve(cachedRef as Element)
        }
    }, [])

    return (
        <FooterWrap
            ref={ref}
            $isSticky={isSticky}
            $stickyClass={stickyClass}
            {...rest}
        >
            {children}
        </FooterWrap>
    )
}

export default StickyFooter
