import type { ReactNode } from 'react'
import styled from 'styled-components'

import { bp, Container, Section, SectionHeader } from '../primitives'

/* ----------------------------------------------------------- line icons */

const I = {
    safety: (
        <path
            d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3zM9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    handling: (
        <path
            d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11m0-1V5.5a1.5 1.5 0 0 1 3 0V11m0-.5V6.5a1.5 1.5 0 0 1 3 0V13c0 3.3-2.2 6-5.5 6S5 16.5 5 13.5c0-1 .4-1.7 1-2.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    grooming: (
        <path
            d="M14.5 3.5l6 6-3 3-6-6 3-3zM11 6.5l-7 7V18h4.5l7-7M5 19l2 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    confidence: (
        <path
            d="M12 20s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.7 12 20 12 20z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    riding: (
        <path
            d="M7 3.2C4.6 4.8 3 7.6 3 10.8c0 3.6 2.7 6.6 6.2 7V14a2.8 2.8 0 1 1 5.6 0v3.8c3.5-.4 6.2-3.4 6.2-7 0-3.2-1.6-6-4-7.6M7 3.2a1.1 1.1 0 1 0 0 .1M17 3.2a1.1 1.1 0 1 0 0 .1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    horsemanship: (
        <path
            d="M5 21c0-4 1.5-6.5 4-8L7.5 9 6 9.5 4.5 7l4-1.5L11 3l1.5 2.5c4 .8 6.5 4 6.5 8.5v7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
}

type Skill = { icon: ReactNode; title: string; detail: string }

const SKILLS: Skill[] = [
    {
        icon: I.safety,
        title: 'Horse Safety',
        detail: 'Staying safe and aware around horses—on the ground and mounted.',
    },
    {
        icon: I.handling,
        title: 'Handling',
        detail: 'Catching, leading, and working calmly and confidently with horses.',
    },
    {
        icon: I.grooming,
        title: 'Grooming & Saddling',
        detail: 'Brushing, hoof care, tacking up, and the quiet bond of daily care.',
    },
    {
        icon: I.confidence,
        title: 'Confidence',
        detail: 'Building trust and self-assurance one steady step at a time.',
    },
    {
        icon: I.riding,
        title: 'Riding Skills',
        detail: 'A balanced seat and clear cues, with a foundation that lasts.',
    },
    {
        icon: I.horsemanship,
        title: 'Horsemanship',
        detail: 'Reading horses and earning their trust—a true partnership.',
    },
]

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};

    @media (min-width: ${bp.tablet}) {
        grid-template-columns: repeat(2, 1fr);
        gap: ${({ theme }) => theme.spacing.xl};
    }

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: repeat(3, 1fr);
    }
`

const IconCard = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.bg.card};
    border: 1px solid ${({ theme }) => theme.colors.border.default};
    border-radius: ${({ theme }) => theme.radius.lg};
    padding: ${({ theme }) => theme.spacing.xl};
    transition:
        transform 0.25s ease,
        box-shadow 0.25s ease,
        border-color 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 18px 36px rgba(40, 28, 18, 0.1);
        border-color: ${({ theme }) => theme.colors.border.strong};
    }
`

const IconBadge = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.accentGold};

    svg {
        width: 28px;
        height: 28px;
    }
`

const CardTitle = styled.h3`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const Detail = styled.p`
    font-size: 0.95rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

export default function WhatStudentsLearn() {
    return (
        <Section $alt>
            <Container>
                <SectionHeader
                    center
                    eyebrow="What Students Learn"
                    title="More Than Just Riding"
                    lead="Every student leaves with real horsemanship—skills that build confidence in the saddle and a lifelong love of horses."
                />
                <Grid>
                    {SKILLS.map((s) => (
                        <IconCard key={s.title}>
                            <IconBadge aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none">
                                    {s.icon}
                                </svg>
                            </IconBadge>
                            <CardTitle>{s.title}</CardTitle>
                            <Detail>{s.detail}</Detail>
                        </IconCard>
                    ))}
                </Grid>
            </Container>
        </Section>
    )
}
