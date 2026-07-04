import classNames from 'classnames'
import { forwardRef } from 'react'
import { HiX } from 'react-icons/hi'

import type { CommonProps } from '../@types/common'
import type { MouseEvent } from 'react'

export interface CloseButtonProps extends CommonProps {
    absolute?: boolean
    defaultStyle?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>((props, ref) => {
    const { absolute, className, defaultStyle, ...rest } = props
    const closeButtonAbsoluteClass = 'absolute z-10'

    const closeButtonClass = classNames(
        'close-btn',
        defaultStyle && 'close-btn-default',
        absolute && closeButtonAbsoluteClass,
        className,
    )

    return (
        <button
            type="button"
            aria-label="Close"
            className={closeButtonClass}
            {...rest}
            ref={ref}
        >
            <HiX aria-hidden="true" />
        </button>
    )
})

CloseButton.displayName = 'CloseButton'

export default CloseButton
