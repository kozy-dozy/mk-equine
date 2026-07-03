import { motion, AnimatePresence } from 'framer-motion'
import { forwardRef } from 'react'
import styled from 'styled-components'

import type { ReactNode } from 'react'

export interface FormItemProps {
    asterisk?: boolean
    className?: string
    style?: React.CSSProperties
    errorMessage?: string
    extra?: string | ReactNode
    htmlFor?: string
    invalid?: boolean | ''
    label?: string
    children?: ReactNode
}

const ItemWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`

const FormLabel = styled.label`
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xxs};
    display: block;
`

const Asterisk = styled.span`
    color: ${({ theme }) => theme.colors.status.error};
    margin-right: 3px;
`

const ErrorMsg = styled(motion.div)`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.status.error};
    margin-top: ${({ theme }) => theme.spacing.xxs};
`

const FormItem = forwardRef<HTMLDivElement, FormItemProps>((props, ref) => {
    const {
        asterisk,
        children,
        className,
        errorMessage,
        extra,
        htmlFor,
        invalid,
        label,
        style,
    } = props

    return (
        <ItemWrap ref={ref} className={className} style={style}>
            {label && (
                <FormLabel htmlFor={htmlFor}>
                    {asterisk && <Asterisk>*</Asterisk>}
                    {label}
                    {extra && <span> {extra}</span>}
                </FormLabel>
            )}
            <div>
                {children}
                <AnimatePresence mode="wait">
                    {invalid && errorMessage && (
                        <ErrorMsg
                            initial={{ opacity: 0, marginTop: -10 }}
                            animate={{ opacity: 1, marginTop: 3 }}
                            exit={{ opacity: 0, marginTop: -10 }}
                            transition={{ duration: 0.15, type: 'tween' }}
                        >
                            {errorMessage}
                        </ErrorMsg>
                    )}
                </AnimatePresence>
            </div>
        </ItemWrap>
    )
})

FormItem.displayName = 'FormItem'

export default FormItem
