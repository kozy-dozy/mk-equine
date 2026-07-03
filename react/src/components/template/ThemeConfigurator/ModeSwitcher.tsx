import { useCallback } from 'react'
import { HiMoon, HiSun } from 'react-icons/hi'
import styled from 'styled-components'

import Switcher from '@/components/ui/Switcher'
import { THEME_ENUM } from '@/constants/theme.constant'
import { trackEvent } from '@/utils/analytics/googleAnalytics'
import useDarkMode from '@/utils/hooks/useDarkmode'

import type { Mode } from '@/@types/theme'

const Wrap = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`

const SunIcon = styled(HiSun)<{ $active: boolean }>`
    color: ${({ $active }) => ($active ? '#f59e0b' : 'inherit')};
    opacity: ${({ $active }) => ($active ? 1 : 0.4)};
    font-size: ${({ theme }) => theme.fontSize.lg};
`

const MoonIcon = styled(HiMoon)<{ $active: boolean }>`
    color: ${({ $active }) => ($active ? '#818cf8' : 'inherit')};
    opacity: ${({ $active }) => ($active ? 1 : 0.4)};
    font-size: ${({ theme }) => theme.fontSize.lg};
`

export default function ModeSwitcher() {
    const [isDark, setMode] = useDarkMode()
    const { MODE_DARK, MODE_LIGHT } = THEME_ENUM

    const onChange = useCallback(
        (checked: boolean) => {
            const nextMode: Mode = checked ? MODE_DARK : MODE_LIGHT
            trackEvent('toggle_theme', {
                to: checked ? 'dark' : 'light',
                location: 'header',
            })
            setMode(nextMode)
        },
        [setMode, MODE_DARK, MODE_LIGHT],
    )

    return (
        <Wrap>
            <SunIcon $active={!isDark} />
            <Switcher checked={isDark} onChange={onChange} />
            <MoonIcon $active={isDark} />
        </Wrap>
    )
}
