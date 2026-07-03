import _DatePicker, { DatePickerProps } from './DatePicker'
import DatePickerRange from './DatePickerRange'

import type { ForwardRefExoticComponent, RefAttributes } from 'react'

export type { DatePickerProps } from './DatePicker'
export type { DatePickerRangeProps } from './DatePickerRange'

type CompoundedComponent = ForwardRefExoticComponent<
    DatePickerProps & RefAttributes<HTMLSpanElement>
> & {
    DatePickerRange: typeof DatePickerRange
}

const DatePicker = _DatePicker as CompoundedComponent

DatePicker.DatePickerRange = DatePickerRange

export { DatePicker }

export default DatePicker
