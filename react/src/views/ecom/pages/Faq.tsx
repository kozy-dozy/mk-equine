import styled from 'styled-components'

import FaqAccordion, { type QA } from '@/views/ecom/components/marketing/FaqAccordion'
import {
    Button,
    Container,
    Eyebrow,
    PageHero,
    Section,
} from '@/views/ecom/components/marketing/primitives'
import SEO from '@/views/ecom/components/SEO'

type Group = { title: string; items: QA[] }

const GROUPS: Group[] = [
    {
        title: 'Getting Started',
        items: [
            {
                q: 'Do I need any experience to start?',
                a: 'Not at all. Lessons welcome complete beginners of every age—many students meet a horse for the very first time here. We start with safety and the basics and build from there.',
            },
            {
                q: 'How old does my child need to be?',
                a: 'I teach all ages and experience levels. Every child is different, so the best first step is to reach out—we’ll talk through your child’s comfort and find the right starting point.',
            },
            {
                q: 'How do I book my first lesson?',
                a: 'Send a message through the contact page with a little about you or your rider. I’ll get back to you to answer questions and schedule a time that works.',
            },
        ],
    },
    {
        title: 'Lessons & Pricing',
        items: [
            {
                q: 'How much do lessons cost?',
                a: 'Private lessons are $50 for one hour or $35 for thirty minutes. A limited number of work-for-lessons spots are also available, where students help around the barn in exchange for riding time.',
            },
            {
                q: 'What is the Work For Lessons program?',
                a: 'It’s a chance for kids to help around the barn—grooming, feeding, and general care—in exchange for free riding lessons. It teaches responsibility while earning saddle time. Spots are limited, so reach out early.',
            },
            {
                q: 'What will I actually learn?',
                a: 'Lessons go well beyond riding. You’ll learn horse safety, catching and handling, grooming and saddling, building confidence on the ground and in the saddle, and riding skills with a strong foundation. I also teach barrel racing and pole bending.',
            },
            {
                q: 'How long is each lesson?',
                a: 'Lessons are offered in one-hour and thirty-minute sessions. We’ll choose the right length together based on the rider’s age, focus, and comfort level.',
            },
        ],
    },
    {
        title: 'Safety & Logistics',
        items: [
            {
                q: 'What should I wear to a lesson?',
                a: 'Long pants and closed-toe boots with a small heel are ideal. Avoid loose scarves or jewelry. A helmet is strongly recommended for riding, and one can be provided if you don’t have your own.',
            },
            {
                q: 'Is riding safe for beginners?',
                a: 'Safety is the foundation of every lesson. We start on the ground, learn to read and handle horses calmly, and only progress as confidence builds. Helmets are encouraged and supervision is constant.',
            },
            {
                q: 'What happens if the weather is bad?',
                a: 'If conditions aren’t safe for riding, we’ll reschedule for the next available time. I’ll always reach out ahead of your lesson if there’s a concern.',
            },
        ],
    },
]

const GroupBlock = styled.div`
    & + & {
        margin-top: ${({ theme }) => theme.spacing['2xl']};
    }
`

const GroupTitle = styled.h2`
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.text.dark};
    margin: 0 0 ${({ theme }) => theme.spacing.sm};
`

const Wrap = styled.div`
    max-width: 800px;
    margin: 0 auto;
`

const Closing = styled.div`
    max-width: 800px;
    margin: ${({ theme }) => theme.spacing['3xl']} auto 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing['2xl']};
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

const ClosingText = styled.p`
    font-size: 1.05rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
`

export default function FaqPage() {
    return (
        <>
            <SEO
                title="FAQ"
                description="Common questions about horseback riding lessons—experience, pricing, safety, and booking."
                canonicalPath="/faq"
            />

            <PageHero
                eyebrow="Questions"
                title="Frequently Asked"
                lead="Everything you need to know before your first lesson. Don’t see your question? Just reach out."
            />

            <Section>
                <Container>
                    <Wrap>
                        {GROUPS.map((group) => (
                            <GroupBlock key={group.title}>
                                <GroupTitle>{group.title}</GroupTitle>
                                <FaqAccordion items={group.items} />
                            </GroupBlock>
                        ))}

                        <Closing>
                            <Eyebrow>Still Curious?</Eyebrow>
                            <ClosingText>
                                I’m happy to answer anything—reach out and we’ll
                                find the right fit for you or your rider.
                            </ClosingText>
                            <Button to="/contact">Get In Touch</Button>
                        </Closing>
                    </Wrap>
                </Container>
            </Section>
        </>
    )
}
