import classNames from 'classnames'

import Dropdown from '@kozydozy/ui/Dropdown'

import EcomMenuNavLink from './EcomMenuNavLink'

export type EcomMenuItemProps = {
    nav: {
        key: string
        title: string
        icon: string
        path: string
        isExternalLink?: boolean
    }
    onLinkClick?: () => void
}

export default function EcomMenuDropdownItem({
    nav,
    onLinkClick,
}: EcomMenuItemProps) {
    const { title, path, key, isExternalLink } = nav

    return (
        <Dropdown.Item eventKey={key} className={classNames(path && 'px-0')}>
            {path ? (
                <EcomMenuNavLink
                    path={path}
                    className={classNames(path && 'px-2')}
                    isExternalLink={isExternalLink}
                    onLinkClick={onLinkClick}
                >
                    {title}
                </EcomMenuNavLink>
            ) : (
                <span>{title}</span>
            )}
        </Dropdown.Item>
    )
}
