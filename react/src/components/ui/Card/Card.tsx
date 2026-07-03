import { forwardRef } from 'react'
import styled from 'styled-components'

import type { ReactNode, ComponentPropsWithRef, MouseEvent } from 'react'

export interface CardProps extends Omit<ComponentPropsWithRef<'div'>, 'onClick'> {
    clickable?: boolean
    bodyClass?: string
    bordered?: boolean
    header?: string | ReactNode
    headerClass?: string
    headerBorder?: boolean
    headerExtra?: string | ReactNode
    footer?: string | ReactNode
    footerClass?: string
    footerBorder?: boolean
    onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

const CardWrap = styled.div<{ $clickable: boolean; $bordered: boolean }>`
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.lg};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    box-shadow: ${({ $bordered, theme }) => $bordered ? 'none' : theme.shadow.sm};
    cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
    overflow: hidden;
`

const CardHeader = styled.div<{ $hasBorder: boolean; $hasExtra: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    border-bottom: ${({ $hasBorder, theme }) =>
        $hasBorder ? `1px solid ${theme.colors.border.default}` : 'none'};
    display: ${({ $hasExtra }) => ($hasExtra ? 'flex' : 'block')};
    align-items: ${({ $hasExtra }) => ($hasExtra ? 'center' : 'auto')};
    justify-content: ${({ $hasExtra }) =>
        $hasExtra ? 'space-between' : 'auto'};

    h4 {
        font-size: 15px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.primary};
        margin: 0;
    }
`

const CardBody = styled.div`
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
`

const CardFooter = styled.div<{ $hasBorder: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    border-top: ${({ $hasBorder, theme }) =>
        $hasBorder ? `1px solid ${theme.colors.border.default}` : 'none'};
    border-radius: 0 0 ${({ theme }) => theme.radius.lg}
        ${({ theme }) => theme.radius.lg};
`

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const {
        children,
        className,
        clickable = false,
        bordered = false,
        header,
        headerBorder = true,
        headerExtra,
        footer,
        footerBorder = true,
        onClick,
        ...rest
    } = props

    return (
        <CardWrap
            ref={ref}
            className={className}
            $clickable={clickable}
            $bordered={bordered}
            role="presentation"
            onClick={onClick}
            {...rest}
        >
            {header && (
                <CardHeader $hasBorder={headerBorder} $hasExtra={!!headerExtra}>
                    {typeof header === 'string' ? <h4>{header}</h4> : <>{header}</>}
                    {headerExtra && <span>{headerExtra}</span>}
                </CardHeader>
            )}
            <CardBody>{children}</CardBody>
            {footer && (
                <CardFooter $hasBorder={footerBorder}>{footer}</CardFooter>
            )}
        </CardWrap>
    )
})

Card.displayName = 'Card'

export default Card
