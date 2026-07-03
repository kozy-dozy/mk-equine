import {
    Direction,
    Mode,
    ColorLevel,
    NavMode,
    ControlSize,
    LayoutType,
} from '@/@types/theme'
import { THEME_TOKENS } from '@/config/theme.tokens'
import { THEME_ENUM } from '@/constants/theme.constant'

export type ThemeConfig = {
    themeColor: string
    direction: Direction
    mode: Mode
    primaryColorLevel: ColorLevel
    panelExpand: boolean
    navMode: NavMode
    controlSize: ControlSize
    cardBordered: boolean
    layout: {
        type: LayoutType
        sideNavCollapse: boolean
    }
}

/**
 * Since some configurations need to be match with specific themes,
 * we recommend to use the configuration that generated from demo.
 */
export const themeConfig: ThemeConfig = {
    themeColor: THEME_TOKENS.primaryColor,
    primaryColorLevel: THEME_TOKENS.primaryColorLevel,
    // keep as is
    direction: THEME_ENUM.DIR_LTR,
    mode:
        THEME_TOKENS.defaultMode === 'light'
            ? THEME_ENUM.MODE_LIGHT
            : THEME_ENUM.MODE_DARK,
    cardBordered: true,
    panelExpand: false,
    controlSize: 'md',
    navMode: THEME_ENUM.NAV_MODE_LIGHT,
    layout: {
        type: THEME_ENUM.LAYOUT_TYPE_MODERN,
        sideNavCollapse: false,
    },
}
