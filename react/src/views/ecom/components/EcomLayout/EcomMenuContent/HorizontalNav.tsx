import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'

import EcomMenuContent from './EcomMenuContent'

export default function HorizontalNav() {
    const mode = useAppSelector((state) => state.theme.mode)
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    const { larger } = useResponsive()

    return (
        <>
            {larger.md && (
                <EcomMenuContent
                    darkBg
                    manuVariant={mode}
                    userAuthority={userAuthority}
                />
            )}
        </>
    )
}
