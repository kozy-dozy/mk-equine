import classNames from 'classnames'
import { forwardRef } from 'react'

import type { CommonProps } from '../@types/common'
import type { ElementType } from 'react'

export interface MkEquineProps extends CommonProps {
    animation?: boolean
    asElement?: ElementType
    height?: string | number
    variant?: 'block' | 'circle'
    width?: string | number
}

const MkEquine = forwardRef<ElementType, MkEquineProps>((props, ref) => {
    const {
        animation = true,
        asElement: Component = 'span',
        className,
        height,
        style,
        variant = 'block',
        width,
    } = props

    return (
        <Component
            ref={ref}
            className={classNames(
                'mk-equine',
                variant === 'circle' && 'mk-equine-circle',
                variant === 'block' && 'mk-equine-block',
                animation && 'animate-pulse',
                className,
            )}
            style={{
                width,
                height,
                ...style,
            }}
        />
    )
})

MkEquine.displayName = 'MkEquine'

export default MkEquine
