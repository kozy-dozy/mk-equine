import { forwardRef } from 'react'
import styled from 'styled-components'

import useControllableState from '../hooks/useControllableState'

import { TabsContextProvider } from './context'

import type { TabsVariant, TabsValue } from './context'

export interface TabsProps {
    className?: string
    style?: React.CSSProperties
    defaultValue?: TabsValue
    onChange?: (tabValue: TabsValue) => void
    value?: TabsValue
    variant?: TabsVariant
    children?: React.ReactNode
}

const TabsWrap = styled.div`
    display: flex;
    flex-direction: column;
`

const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
    const {
        className,
        defaultValue,
        onChange,
        value: valueProp,
        variant = 'underline',
        ...rest
    } = props

    const [value, setValue] = useControllableState({
        prop: valueProp,
        onChange,
        defaultProp: defaultValue,
    })

    return (
        <TabsContextProvider value={{ value, onValueChange: setValue, variant }}>
            <TabsWrap className={className} {...rest} ref={ref} />
        </TabsContextProvider>
    )
})

Tabs.displayName = 'Tabs'

export default Tabs
