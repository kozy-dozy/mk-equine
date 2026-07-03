import { useState, useEffect, useRef, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import useMergedRef from '../hooks/useMergeRef'

import type { ReactNode } from 'react'

export interface AvatarProps {
    alt?: string
    className?: string
    icon?: ReactNode
    onClick?: () => void
    size?: 'lg' | 'md' | 'sm' | number
    shape?: 'circle' | 'rounded' | 'square' | 'rounded-sm'
    src?: string
    srcSet?: string
    style?: React.CSSProperties
    children?: ReactNode
}

const sizeMap = {
    sm: { dim: 32, font: 14, icon: 16 },
    md: { dim: 40, font: 14, icon: 18 },
    lg: { dim: 48, font: 16, icon: 20 },
}

const shapeStyles = {
    circle: css`
        border-radius: ${({ theme }) => theme.radius.full};
    `,
    rounded: css`
        border-radius: ${({ theme }) => theme.radius.md};
    `,
    'rounded-sm': css`
        border-radius: ${({ theme }) => theme.radius.sm};
    `,
    square: css`
        border-radius: 0;
    `,
}

const AvatarWrap = styled.span<{
    $size: number
    $shape: string
    $lineHeight: number
}>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.text.inverse};
    overflow: hidden;
    flex-shrink: 0;
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    font-size: ${({ $size }) => Math.round($size * 0.35)}px;
    ${({ $shape }) => shapeStyles[$shape as keyof typeof shapeStyles] ?? shapeStyles['rounded-sm']}
`

const AvatarImg = styled.img<{ $shape: string }>`
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${({ $shape }) => shapeStyles[$shape as keyof typeof shapeStyles] ?? shapeStyles['rounded-sm']}
`

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>((props, ref) => {
    const {
        alt,
        className,
        icon,
        shape = 'rounded-sm',
        size = 'md',
        src,
        srcSet,
        children,
        ...rest
    } = props

    const [scale, setScale] = useState(1)
    const avatarChildren = useRef<HTMLSpanElement>(null)
    const avatarNode = useRef<HTMLSpanElement>(null)
    const avatarMergeRef = useMergedRef(ref, avatarNode)

    const numericSize =
        typeof size === 'number'
            ? size
            : sizeMap[size as keyof typeof sizeMap]?.dim ?? 40

    useEffect(() => {
        if (!avatarChildren.current || !avatarNode.current) return
        const cw = avatarChildren.current.offsetWidth
        const nw = avatarNode.current.offsetWidth
        if (cw && nw) {
            setScale(nw - 8 < cw ? (nw - 8) / cw : 1)
        }
    }, [scale, children])

    let content: ReactNode = null

    if (src) {
        content = (
            <AvatarImg
                $shape={shape}
                src={src}
                srcSet={srcSet}
                alt={alt}
                loading="lazy"
            />
        )
    } else if (icon) {
        content = (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {icon}
            </span>
        )
    } else if (children) {
        content = (
            <span
                ref={avatarChildren}
                style={{
                    position: 'absolute',
                    left: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    transform: `translateX(-50%) scale(${scale})`,
                    whiteSpace: 'nowrap',
                }}
            >
                {children}
            </span>
        )
    }

    return (
        <AvatarWrap
            ref={avatarMergeRef}
            className={className}
            $size={numericSize}
            $shape={shape}
            $lineHeight={numericSize}
            {...rest}
        >
            {content}
        </AvatarWrap>
    )
})

Avatar.displayName = 'Avatar'

export default Avatar
