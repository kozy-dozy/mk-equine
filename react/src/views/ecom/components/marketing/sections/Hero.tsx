import styled, { keyframes } from 'styled-components'

import { CONTENT_CONFIG } from '@/config/content.config'
import { SITE_IMAGES } from '@/config/site-images'

import { bp, Button, Divider, OutlineButton } from '../primitives'

const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
`

const Wrap = styled.section`
    position: relative;
    min-height: 92vh;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.inverse};
    background-image: url(${SITE_IMAGES.hero});
    background-size: cover;
    background-position: center;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            rgba(40, 28, 18, 0.78) 0%,
            rgba(40, 28, 18, 0.5) 42%,
            rgba(40, 28, 18, 0.15) 78%,
            rgba(40, 28, 18, 0.05) 100%
        );
    }

    @media (min-width: ${bp.tablet}) {
        min-height: 100vh;
    }
`

const Inner = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 120px ${({ theme }) => theme.spacing.lg} 88px;

    @media (min-width: ${bp.tablet}) {
        padding-inline: ${({ theme }) => theme.spacing.xl};
    }
`

const Content = styled.div`
    max-width: 640px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    animation: ${fadeUp} 0.9s ease both;
`

const Title = styled.h1`
    font-size: clamp(2.75rem, 1.6rem + 5vw, 5rem);
    line-height: 1.04;
    letter-spacing: -0.015em;
    font-weight: 600;
    margin: ${({ theme }) => theme.spacing.lg} 0 0;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.25);
`

const Sub = styled.p`
    font-size: clamp(1.05rem, 0.95rem + 0.5vw, 1.3rem);
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    margin: ${({ theme }) => theme.spacing.lg} 0
        ${({ theme }) => theme.spacing.xl};
    max-width: 520px;
`

const Actions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
`

export default function Hero() {
    return (
        <Wrap>
            <Inner>
                <Content>
                    <Divider />
                    <Title>{CONTENT_CONFIG.home.heroTitle}</Title>
                    <Sub>{CONTENT_CONFIG.home.heroSubtitle}</Sub>
                    <Actions>
                        <Button to="/book-lesson">Book a Lesson</Button>
                        <OutlineButton to="/lessons" $onDark>
                            Explore Lessons
                        </OutlineButton>
                    </Actions>
                </Content>
            </Inner>
        </Wrap>
    )
}
