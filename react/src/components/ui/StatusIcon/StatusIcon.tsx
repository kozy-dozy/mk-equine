import styled from 'styled-components'
import {
    HiCheckCircle,
    HiInformationCircle,
    HiExclamation,
    HiXCircle,
} from 'react-icons/hi'
import type { TypeAttributes, CommonProps } from '../@types/common'
import type { ReactNode, JSX } from 'react'

export interface StatusIconProps extends CommonProps {
    type: TypeAttributes.Status
    custom?: ReactNode | JSX.Element
    iconColor?: string
    size?: string | number
}

const ICONS: Record<
    TypeAttributes.Status,
    {
        color: string
        icon: JSX.Element
    }
> = {
    success: {
        color: '#34d399', // emerald-400
        icon: <HiCheckCircle />,
    },
    info: {
        color: '#60a5fa', // blue-400
        icon: <HiInformationCircle />,
    },
    warning: {
        color: '#facc15', // yellow-400
        icon: <HiExclamation />,
    },
    danger: {
        color: '#f87171', // red-400
        icon: <HiXCircle />,
    },
}

const StyledStatusIcon = styled.span<{
    $color: string
    $size?: string | number
}>`
    color: ${({ $color }) => $color};
    font-size: ${({ $size }) => $size || '1.5rem'};
    display: inline-flex;
    align-items: center;
`

const StatusIcon = (props: StatusIconProps) => {
    const { type = 'info', custom, iconColor, size } = props
    const icon = ICONS[type]
    return (
        <StyledStatusIcon $color={iconColor || icon.color} $size={size}>
            {custom || icon.icon}
        </StyledStatusIcon>
    )
}

export default StatusIcon
