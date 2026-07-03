import _Avatar, { AvatarProps } from './Avatar'
import AvatarGroup from './AvatarGroup'

import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type { AvatarProps } from './Avatar'
export type { AvatarGroupProps } from './AvatarGroup'

type CompoundedComponent = ForwardRefExoticComponent<
    AvatarProps & RefAttributes<HTMLSpanElement>
> & {
    Group: typeof AvatarGroup
}

const Avatar = _Avatar as CompoundedComponent

Avatar.Group = AvatarGroup

export { Avatar }

export default Avatar
