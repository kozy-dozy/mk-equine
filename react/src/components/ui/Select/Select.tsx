import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { forwardRef, JSX, Ref } from 'react'
import { HiCheck, HiChevronDown, HiX } from 'react-icons/hi'
import ReactSelect from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable'
import styled, { useTheme } from 'styled-components'

import { useForm } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import Spinner from '../Spinner/Spinner'

import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ForwardedRef } from 'react'
import type {
    ControlProps,
    Props as ReactSelectProps,
    GroupBase,
} from 'react-select'
import type { AsyncProps } from 'react-select/async'
import type { CreatableProps } from 'react-select/creatable'
const SelectOption = styled.div<{
    $isSelected: boolean
    $isDisabled: boolean
    $isFocused: boolean
}>`
    display: flex;
    align-items: center;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    background: ${({ $isFocused, theme }) =>
        $isFocused ? theme.colors.bg.hover : 'transparent'};
    color: ${({ $isDisabled, theme }) =>
        $isDisabled ? theme.colors.text.disabled : theme.colors.text.primary};
    font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
    cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
`

const OptionLabel = styled.span`
    margin-left: ${({ theme }) => theme.spacing.sm};
`

const StyledHiCheck = styled(HiCheck)`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSize.xl};
    margin-left: ${({ theme }) => theme.spacing.sm};
`

const DropdownIndicatorWrap = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    color: inherit;
`

const ClearIndicatorWrap = styled.div`
    display: flex;
    align-items: center;
    padding: 0 ${({ theme }) => theme.spacing.xs};
    color: inherit;
    cursor: pointer;
`


interface DefaultOptionProps {
    innerProps: Omit<JSX.IntrinsicElements['div'], 'ref'>
    label: string
    selectProps: { themeColor?: string }
    isSelected: boolean
    isDisabled: boolean
    isFocused: boolean
}

const DefaultOption = ({
    innerProps,
    label,
    isSelected,
    isDisabled,
    isFocused,
}: DefaultOptionProps) => {
    return (
        <SelectOption
            $isSelected={isSelected}
            $isDisabled={isDisabled}
            $isFocused={isFocused}
            {...innerProps}
        >
            <OptionLabel>{label}</OptionLabel>
            {isSelected && <StyledHiCheck />}
        </SelectOption>
    )
}

const DefaultDropdownIndicator = () => (
    <DropdownIndicatorWrap>
        <HiChevronDown />
    </DropdownIndicatorWrap>
)

interface DefaultClearIndicatorProps {
    innerProps: JSX.IntrinsicElements['div']
    ref: Ref<HTMLElement>
}

const DefaultClearIndicator = ({
    innerProps: { ref, ...restInnerProps },
}: DefaultClearIndicatorProps) => (
    <div {...restInnerProps} ref={ref}>
        <ClearIndicatorWrap>
            <HiX />
        </ClearIndicatorWrap>
    </div>
)

const DefaultLoadingIndicator = () => <Spinner />


export interface SelectProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>
    extends CommonProps,
        ReactSelectProps<Option, IsMulti, Group>,
        AsyncProps<Option, IsMulti, Group>,
        CreatableProps<Option, IsMulti, Group> {
    size?: TypeAttributes.ControlSize
    field?: any
    form?: any
    componentAs?: ReactSelect | CreatableSelect | AsyncSelect
}

function _Select<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: SelectProps<Option, IsMulti, Group>,
    ref: ForwardedRef<ReactSelect | CreatableSelect | AsyncSelect>,
) {
    const {
        size,
        style,
        form,
        field,
        components,
        componentAs: Component = ReactSelect,
        ...rest
    } = props

    const formControlSize = useForm()?.size
    const inputGroupSize = useInputGroup()?.size
    // size prop kept for API compatibility but height is not forced — react-select sizes naturally
    void (size || inputGroupSize || formControlSize)

    // Colors come directly from the SC theme — no Tailwind CSS vars needed
    const theme = useTheme()
    const isDark = theme.isDark

    let isInvalid = false
    if (!isEmpty(form)) {
        const { touched, errors } = form
        const touchedField = get(touched, field.name)
        const errorField = get(errors, field.name)
        isInvalid = touchedField && errorField
    }

    const getBoxShadow = (state: ControlProps<Option, IsMulti, Group>) => {
        const base = '0 0 0 1px '
        if (isInvalid) return base + theme.colors.status.error
        if (state.isFocused) return base + theme.colors.primary
        return 'none'
    }

    return (
        <Component<Option, IsMulti, Group>
            ref={ref}
            className={undefined}
            classNamePrefix="select"
            styles={{
                control: (provided, state) => ({
                    ...provided,
                    '&:hover': {
                        boxShadow: getBoxShadow(state),
                        cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                    },
                    boxShadow: getBoxShadow(state),
                    borderRadius: theme.radius.md,
                    ...(isInvalid
                        ? { borderColor: theme.colors.status.error }
                        : {}),
                    ...(state.isDisabled
                        ? {
                              backgroundColor: theme.colors.bg.hover,
                              borderColor: theme.colors.border.default,
                              opacity: 1,
                          }
                        : {}),
                }),
                singleValue: (provided, state) => ({
                    ...provided,
                    color: state.isDisabled
                        ? theme.colors.text.disabled
                        : theme.colors.text.primary,
                }),
                input: (css) => ({
                    ...css,
                    input: {
                        outline: 'none',
                        outlineOffset: 0,
                        boxShadow: 'none !important',
                    },
                }),
                menu: (provided) => ({ ...provided, zIndex: 50 }),
                ...style,
            }}
            theme={(rsTheme) => ({
                ...rsTheme,
                colors: {
                    ...rsTheme.colors,
                    // control + menu background
                    neutral0: theme.colors.bg.card,
                    // border (default + hover)
                    neutral20: theme.colors.border.default,
                    neutral30: theme.colors.border.strong,
                    // text
                    neutral80: theme.colors.text.primary,
                    // multi-value tag background
                    neutral10: isDark
                        ? theme.colors.border.strong
                        : theme.colors.border.default,
                    // option hover / selected tints
                    primary25: theme.colors.bg.hover,
                    primary50: theme.colors.primaryLight,
                    primary: theme.colors.primary,
                },
            })}
            components={{
                IndicatorSeparator: () => null,
                Option: DefaultOption,
                LoadingIndicator: DefaultLoadingIndicator,
                DropdownIndicator: DefaultDropdownIndicator,
                ClearIndicator: DefaultClearIndicator,
                ...components,
            }}
            {...field}
            {...rest}
        />
    )
}

const Select = forwardRef(_Select) as <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: SelectProps<Option, IsMulti, Group> & {
        ref?: ForwardedRef<ReactSelect | CreatableSelect | AsyncSelect>
    },
) => ReturnType<typeof _Select>

export default Select
