import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'

import { COMPANY_CONFIG } from '@/config/company.config'
import { getLogoDarkUrl, getLogoLightUrl } from '@/config/integrations.config'
import { SITE_IMAGES } from '@/config/site-images'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 100vh;
`

const Grid = styled.div`
    display: grid;
    min-height: 100vh;
    grid-template-columns: 1fr;

    @media (min-width: 1024px) {
        grid-template-columns: 1fr 1.25fr;
    }
`

const LeftPanel = styled.div`
    display: none;
    position: relative;
    isolation: isolate;
    flex-direction: column;
    justify-content: space-between;
    padding: ${({ theme }) =>
        `${theme.spacing['2xl']} ${theme.spacing['3xl']}`};
    color: ${({ theme }) => theme.colors.text.inverse};
    background-image: url(${SITE_IMAGES.about.secondary});
    background-size: cover;
    background-position: center;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(
            160deg,
            rgba(40, 28, 18, 0.82) 0%,
            rgba(40, 28, 18, 0.62) 60%,
            rgba(40, 28, 18, 0.78) 100%
        );
    }

    @media (min-width: 1024px) {
        display: flex;
    }
`

const Brand = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.inverse};

    svg {
        color: ${({ theme }) => theme.colors.accentGold};
    }

    strong {
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-size: 1.5rem;
        font-weight: 600;
    }
`

const Quote = styled.blockquote`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: clamp(1.6rem, 1.2rem + 1.5vw, 2.1rem);
    font-weight: 500;
    line-height: 1.3;
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
    max-width: 30ch;
`

const Eyebrow = styled.p`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
    margin: 0 0 ${({ theme }) => theme.spacing.md};
`

const SubText = styled.p`
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    font-size: ${({ theme }) => theme.fontSize.md};
    line-height: 1.6;
    margin: 0;
    max-width: 40ch;
`

const Copyright = styled.span`
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    font-size: ${({ theme }) => theme.fontSize.sm};
`

const RightPanel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.bg.page};
    padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.lg}`};
`

const FormWrapper = styled.div`
    width: 100%;
    max-width: 400px;

    @media (min-width: 1280px) {
        max-width: 440px;
    }
`

const MobileBrand = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    justify-content: center;
    color: ${({ theme }) => theme.colors.text.dark};
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};

    svg {
        color: ${({ theme }) => theme.colors.accentGold};
    }

    strong {
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-size: 1.4rem;
        font-weight: 600;
    }

    @media (min-width: 1024px) {
        display: none;
    }
`

const BrandLogo = styled.img`
    height: 72px;
    width: auto;
    display: block;
`

const MobileLogo = styled.img`
    height: 64px;
    width: auto;
    display: block;
    margin: 0 auto;
`

export default function AuthLayout() {
    return (
        <Wrapper>
            <Grid>
                {/* Left panel — brand sidebar */}
                <LeftPanel>
                    <Brand to="/" aria-label={`${COMPANY_CONFIG.name} home`}>
                        <BrandLogo
                            src={getLogoLightUrl()}
                            alt={COMPANY_CONFIG.name}
                        />
                    </Brand>

                    <div>
                        <Eyebrow>Confidence Starts In The Saddle</Eyebrow>
                        <Quote>
                            &ldquo;Helping riders of every age build confidence,
                            learn horsemanship, and fall in love with
                            horses.&rdquo;
                        </Quote>
                        <SubText>
                            Create an account to book lessons and keep your
                            details handy for next time.
                        </SubText>
                    </div>

                    <Copyright>
                        &copy; {new Date().getFullYear()} {COMPANY_CONFIG.name}
                    </Copyright>
                </LeftPanel>

                {/* Right panel — form */}
                <RightPanel>
                    <FormWrapper>
                        <MobileBrand to="/">
                            <MobileLogo
                                src={getLogoDarkUrl()}
                                alt={COMPANY_CONFIG.name}
                            />
                        </MobileBrand>
                        <Outlet />
                    </FormWrapper>
                </RightPanel>
            </Grid>
        </Wrapper>
    )
}
