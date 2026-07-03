import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

/**
 * Shared marketing primitives.
 *
 * These are the building blocks for every section of the public site.
 * Keep visual styling here so sections stay small and never duplicate styles.
 *
 * Breakpoints (mobile-first): tablet 768px, desktop 1024px, large 1440px.
 */

export const bp = {
    tablet: '768px',
    desktop: '1024px',
    large: '1440px',
}

/* ---------------------------------------------------------------- Layout */

export const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${bp.tablet}) {
        padding: 0 ${({ theme }) => theme.spacing.xl};
    }

    @media (min-width: ${bp.large}) {
        max-width: 1280px;
    }
`

export const Section = styled.section<{ $alt?: boolean; $tight?: boolean }>`
    width: 100%;
    scroll-margin-top: 88px;
    background: ${({ theme, $alt }) =>
        $alt ? theme.colors.bg.muted : theme.colors.bg.page};
    padding-block: ${({ $tight }) => ($tight ? '48px' : '64px')};

    @media (min-width: ${bp.tablet}) {
        padding-block: ${({ $tight }) => ($tight ? '64px' : '88px')};
    }

    @media (min-width: ${bp.desktop}) {
        padding-block: ${({ $tight }) => ($tight ? '80px' : '112px')};
    }
`

/* ------------------------------------------------------------ Typography */

export const Eyebrow = styled.p`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.accentGold};
    margin: 0;
`

const SectionHeaderWrap = styled.div<{ $center?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    max-width: 640px;
    margin-bottom: ${({ theme }) => theme.spacing['2xl']};
    text-align: ${({ $center }) => ($center ? 'center' : 'left')};
    ${({ $center }) =>
        $center &&
        css`
            margin-inline: auto;
            align-items: center;
        `}
`

const SectionTitle = styled.h2`
    font-size: clamp(1.75rem, 1.1rem + 2.6vw, 2.75rem);
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const SectionLead = styled.p`
    font-size: 1.05rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

export function SectionHeader({
    eyebrow,
    title,
    lead,
    center = false,
}: {
    eyebrow?: string
    title: string
    lead?: string
    center?: boolean
}) {
    return (
        <SectionHeaderWrap $center={center}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <SectionTitle>{title}</SectionTitle>
            {lead && <SectionLead>{lead}</SectionLead>}
        </SectionHeaderWrap>
    )
}

/* --------------------------------------------------------------- Buttons */

const buttonBase = css`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    padding: 14px 28px;
    border-radius: ${({ theme }) => theme.radius.full};
    cursor: pointer;
    border: 1.5px solid transparent;
    transition:
        transform 0.18s ease,
        background-color 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;
    white-space: nowrap;

    &:hover {
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }
`

export const Button = styled(Link)`
    ${buttonBase};
    background: ${({ theme }) => theme.colors.accentGold};
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow: 0 8px 20px rgba(165, 91, 58, 0.25);

    &:hover {
        background: ${({ theme }) => theme.colors.primaryHover};
        box-shadow: 0 12px 26px rgba(165, 91, 58, 0.32);
    }
`

export const OutlineButton = styled(Link)<{ $onDark?: boolean }>`
    ${buttonBase};
    background: transparent;
    color: ${({ theme, $onDark }) =>
        $onDark ? theme.colors.text.inverse : theme.colors.primary};
    border-color: ${({ theme, $onDark }) =>
        $onDark ? 'rgba(255,255,255,0.6)' : theme.colors.border.strong};

    &:hover {
        background: ${({ theme, $onDark }) =>
            $onDark ? 'rgba(255,255,255,0.12)' : theme.colors.bg.muted};
        border-color: ${({ theme, $onDark }) =>
            $onDark ? '#fff' : theme.colors.primary};
    }
`

/* -------------------------------------------------------------- PageHero */

const PageHeroBand = styled.section<{ $image?: string }>`
    position: relative;
    isolation: isolate;
    color: ${({ theme }) => theme.colors.text.inverse};
    background: ${({ theme, $image }) =>
        $image ? `url(${$image})` : theme.colors.primary};
    background-size: cover;
    background-position: center;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: linear-gradient(
            180deg,
            rgba(40, 28, 18, 0.7) 0%,
            rgba(40, 28, 18, 0.62) 100%
        );
    }
`

const PageHeroInner = styled.div`
    max-width: 760px;
    margin: 0 auto;
    padding: 72px ${({ theme }) => theme.spacing.lg};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.md};

    @media (min-width: ${bp.tablet}) {
        padding: 104px ${({ theme }) => theme.spacing.xl};
    }
`

const PageHeroTitle = styled.h1`
    font-size: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);
    line-height: 1.08;
    letter-spacing: -0.01em;
    margin: 0;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.22);
`

const PageHeroLead = styled.p`
    font-size: 1.1rem;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.text.inverseMuted};
    margin: 0;
    max-width: 540px;
`

export function PageHero({
    eyebrow,
    title,
    lead,
    image,
}: {
    eyebrow?: string
    title: string
    lead?: string
    image?: string
}) {
    return (
        <PageHeroBand $image={image}>
            <PageHeroInner>
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <PageHeroTitle>{title}</PageHeroTitle>
                <Divider center />
                {lead && <PageHeroLead>{lead}</PageHeroLead>}
            </PageHeroInner>
        </PageHeroBand>
    )
}

/* -------------------------------------------------------------- Ornament */

const DividerWrap = styled.div<{ $center?: boolean }>`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};
    color: ${({ theme }) => theme.colors.border.dark};

    span {
        height: 1px;
        width: 64px;
        background: ${({ theme }) => theme.colors.border.dark};
        opacity: 0.7;
    }

    svg {
        color: ${({ theme }) => theme.colors.accentGold};
        flex-shrink: 0;
    }
`

/** A small ornamental horseshoe divider, echoing the mockup. */
export function Divider({ center = false }: { center?: boolean }) {
    return (
        <DividerWrap $center={center} aria-hidden="true">
            <span />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                    d="M7 3.5C4.6 5.1 3 7.9 3 11c0 3.6 2.6 6.5 6 6.9V15a3 3 0 1 1 6 0v2.9c3.4-.4 6-3.3 6-6.9 0-3.1-1.6-5.9-4-7.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
                <circle cx="7" cy="3.5" r="1.1" fill="currentColor" />
                <circle cx="17" cy="3.5" r="1.1" fill="currentColor" />
            </svg>
            <span />
        </DividerWrap>
    )
}
