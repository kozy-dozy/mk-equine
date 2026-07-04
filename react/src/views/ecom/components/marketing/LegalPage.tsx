import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Container, PageHero, Section } from './primitives'

import type { ReactNode } from 'react'

const Prose = styled.div`
    max-width: 760px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing['2xl']};
`

const Updated = styled.p`
    font-family: ${({ theme }) => theme.typography.fontSecondary};
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.text.muted};
    margin: 0;
`

const Block = styled.section`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
`

const Heading = styled.h2`
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

export const LegalParagraph = styled.p`
    font-size: 1rem;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

export const LegalList = styled.ul`
    list-style: disc;
    padding-left: ${({ theme }) => theme.spacing.lg};
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: 1rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};

    strong {
        color: ${({ theme }) => theme.colors.text.dark};
    }
`

export const LegalNotice = styled.div`
    border-left: 3px solid ${({ theme }) => theme.colors.accentGold};
    background: ${({ theme }) => theme.colors.bg.muted};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
    font-size: 0.95rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};

    strong {
        color: ${({ theme }) => theme.colors.text.dark};
    }
`

export const LegalEmail = styled.a`
    color: ${({ theme }) => theme.colors.accentGold};
    font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
`

export const LegalLink = styled(Link)`
    color: ${({ theme }) => theme.colors.accentGold};
    font-weight: 600;

    &:hover {
        text-decoration: underline;
    }
`

export function LegalSection({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) {
    return (
        <Block>
            <Heading>{title}</Heading>
            {children}
        </Block>
    )
}

export function LegalPage({
    title,
    eyebrow = 'Legal',
    updated,
    children,
}: {
    title: string
    eyebrow?: string
    updated: string
    children: ReactNode
}) {
    return (
        <>
            <PageHero eyebrow={eyebrow} title={title} />
            <Section>
                <Container>
                    <Prose>
                        <Updated>Last updated: {updated}</Updated>
                        {children}
                    </Prose>
                </Container>
            </Section>
        </>
    )
}
