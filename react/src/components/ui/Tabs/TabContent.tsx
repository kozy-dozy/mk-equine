import { forwardRef } from 'react'

import { useTabs } from './context'

import type { TabsValue } from './context'

export interface TabContentProps {
    value: TabsValue
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
    const { value, children, className, ...rest } = props
    const context = useTabs()
    const isSelected = value === context.value

    if (!isSelected) return null

    return (
        <div ref={ref} role="tabpanel" tabIndex={0} className={className} {...rest}>
            {children}
        </div>
    )
})

TabContent.displayName = 'TabContent'

export default TabContent
