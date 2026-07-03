import styled, { css } from 'styled-components'

import Card from '@/components/ui/Card'
import { LAYOUT_TYPE_MODERN } from '@/constants/theme.constant'
import { useAppSelector } from '@/store'

import type { CardProps } from '@/components/ui/Card'

interface AdaptableCardProps extends CardProps {
    leftSideBorder?: boolean
    rightSideBorder?: boolean
    divider?: boolean
    shadow?: boolean
    isLastChild?: boolean
}

const StyledCard = styled(Card)<{
    $type: string
    $leftSideBorder?: boolean
    $rightSideBorder?: boolean
    $divider?: boolean
    $shadow?: boolean
    $isLastChild?: boolean
}>`
    ${({
        $type,
        $rightSideBorder,
        $leftSideBorder,
        $divider,
        $isLastChild,
        theme,
    }) =>
        $type === LAYOUT_TYPE_MODERN &&
        css`
            border: none;
            border-radius: ${theme.radius.md};
            ${$rightSideBorder &&
            css`
                border-right: 1px solid ${theme.colors.border.default};
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            `}
            ${$leftSideBorder &&
            css`
                border-left: 1px solid ${theme.colors.border.default};
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            `}
            ${$divider &&
            css`
                ${!$isLastChild &&
                css`
                    border-bottom: 1px solid ${theme.colors.border.default};
                    padding-bottom: ${theme.spacing.xl};
                `}
                padding-top: ${theme.spacing.lg};
                padding-bottom: ${theme.spacing.lg};
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
            `}
        `}
    ${({ $type, $shadow }) =>
        $type !== LAYOUT_TYPE_MODERN &&
        $shadow &&
        css`
            border-radius: 0;
            box-shadow: none;
            border: none;
        `}
`

const AdaptableCard = (props: AdaptableCardProps) => {
    const {
        children,
        leftSideBorder,
        rightSideBorder,
        divider,
        shadow,
        isLastChild,
        ...rest
    } = props

    const type = useAppSelector((state) => state.theme.layout.type)

    return (
        <StyledCard
            $type={type}
            $leftSideBorder={leftSideBorder}
            $rightSideBorder={rightSideBorder}
            $divider={divider}
            $shadow={shadow}
            $isLastChild={isLastChild}
            {...rest}
        >
            {children}
        </StyledCard>
    )
}

export default AdaptableCard
