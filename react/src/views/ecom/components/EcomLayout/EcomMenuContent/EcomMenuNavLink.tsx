import classNames from 'classnames'
import { Link } from 'react-router-dom'

import type { PropsWithChildren } from 'react'

export type EcomMenuNavLinkProps = PropsWithChildren<{
    path: string
    isExternalLink?: boolean
    className?: string
    onLinkClick?: () => void
}>

export default function EcomMenuNavLink({
    path,
    children,
    isExternalLink,
    className,
    onLinkClick,
}: EcomMenuNavLinkProps) {
    return (
        <Link
            className={classNames('w-full flex', className)} // ✅ full width
            to={path}
            target={isExternalLink ? '_blank' : undefined}
            onClick={onLinkClick}
        >
            {children} {/* ✅ no wrapper span */}
        </Link>
    )
}
