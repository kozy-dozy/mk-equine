import styled from 'styled-components'

import { SITE_IMAGES } from '@/config/site-images'

import { bp, Button, Container, Divider, Eyebrow, Section } from '../primitives'

type Milestone = { years: string; title: string; detail: string }

const TIMELINE: Milestone[] = [
    {
        years: '25 yrs',
        title: 'In the saddle',
        detail: 'A lifetime around horses, riding since childhood.',
    },
    {
        years: '10+ yrs',
        title: 'Training my own horses',
        detail: 'A patient, foundation-first approach built over years.',
    },
    {
        years: '5 yrs',
        title: 'Teaching lessons',
        detail: 'Helping riders of every age find confidence and joy.',
    },
]

const Layout = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['2xl']};
    align-items: center;

    @media (min-width: ${bp.desktop}) {
        grid-template-columns: 0.85fr 1fr;
        gap: 72px;
    }
`

const Figure = styled.div`
    position: relative;
    margin: 0;

    /* terracotta offset accent behind the portrait */
    &::before {
        content: '';
        position: absolute;
        inset: 18px -18px -18px 18px;
        border: 2px solid ${({ theme }) => theme.colors.accentGold};
        border-radius: ${({ theme }) => theme.radius.lg};
        z-index: 0;

        @media (min-width: ${bp.tablet}) {
            inset: 24px -24px -24px 24px;
        }
    }
`

const Portrait = styled.img`
    position: relative;
    z-index: 1;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.lg};
    box-shadow: 0 24px 48px rgba(40, 28, 18, 0.18);
    display: block;
`

const Badge = styled.div`
    position: absolute;
    z-index: 2;
    right: ${({ theme }) => theme.spacing.lg};
    bottom: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.bg.card};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
    box-shadow: 0 12px 28px rgba(40, 28, 18, 0.18);
    text-align: center;

    strong {
        display: block;
        font-family: ${({ theme }) => theme.typography.fontPrimary};
        font-size: 1.6rem;
        color: ${({ theme }) => theme.colors.accentGold};
        line-height: 1;
    }

    span {
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.text.muted};
    }
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
`

const Title = styled.h2`
    font-size: clamp(1.9rem, 1.2rem + 2.6vw, 2.9rem);
    line-height: 1.12;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0;
`

const Bio = styled.p`
    font-size: 1.05rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
    max-width: 540px;
`

const Timeline = styled.ul`
    list-style: none;
    margin: ${({ theme }) => theme.spacing.sm} 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
`

const Item = styled.li`
    display: grid;
    grid-template-columns: 84px 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md} 0;
    position: relative;
    border-left: 2px solid ${({ theme }) => theme.colors.border.default};
    padding-left: ${({ theme }) => theme.spacing.lg};

    &::before {
        content: '';
        position: absolute;
        left: -7px;
        top: 22px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.accentGold};
        border: 3px solid ${({ theme }) => theme.colors.bg.page};
    }
`

const Years = styled.span`
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.primary};
    line-height: 1.3;
`

const ItemBody = styled.div`
    strong {
        display: block;
        font-family: ${({ theme }) => theme.typography.fontSecondary};
        font-size: 1rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.dark};
    }

    span {
        font-size: 0.92rem;
        color: ${({ theme }) => theme.colors.text.secondary};
        line-height: 1.55;
    }
`

const Actions = styled.div`
    margin-top: ${({ theme }) => theme.spacing.sm};
`

export default function AboutInstructor() {
    return (
        <Section id="about">
            <Container>
                <Layout>
                    <Figure>
                        <Portrait
                            src={SITE_IMAGES.about.portrait}
                            alt="Your riding instructor with a horse"
                            loading="lazy"
                        />
                        <Badge>
                            <strong>5+</strong>
                            <span>Years Teaching</span>
                        </Badge>
                    </Figure>

                    <Content>
                        <Eyebrow>About Your Instructor</Eyebrow>
                        <Title>A Patient Guide, A Lifelong Horsewoman</Title>
                        <Divider />
                        <Bio>
                            Helping people build confidence, learn horsemanship,
                            and fall in love with horses is what I care about
                            most. Every lesson goes beyond riding—students learn
                            to catch, handle, groom, and saddle a horse, building
                            a foundation that sets them up for success in and out
                            of the saddle.
                        </Bio>

                        <Timeline>
                            {TIMELINE.map((m) => (
                                <Item key={m.title}>
                                    <Years>{m.years}</Years>
                                    <ItemBody>
                                        <strong>{m.title}</strong>
                                        <span>{m.detail}</span>
                                    </ItemBody>
                                </Item>
                            ))}
                        </Timeline>

                        <Actions>
                            <Button to="/contact">Book a Lesson</Button>
                        </Actions>
                    </Content>
                </Layout>
            </Container>
        </Section>
    )
}
