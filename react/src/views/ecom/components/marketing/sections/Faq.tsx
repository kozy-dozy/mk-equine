import { Container, Section, SectionHeader } from '../primitives'
import FaqAccordion, { type QA } from '../FaqAccordion'

const FAQS: QA[] = [
    {
        q: 'Do I need any experience to start?',
        a: 'Not at all. Lessons welcome complete beginners of every age—many students meet a horse for the very first time here. We start with safety and the basics and build from there.',
    },
    {
        q: 'What should I wear to a lesson?',
        a: 'Long pants and closed-toe boots with a small heel are ideal. Avoid loose scarves or jewelry. A helmet is recommended for riding, and one can be provided if you don’t have your own.',
    },
    {
        q: 'How much do lessons cost?',
        a: 'Private lessons are $50 for one hour or $35 for thirty minutes. A limited number of work-for-lessons spots are also available, where students help around the barn in exchange for riding time.',
    },
    {
        q: 'How old does my child need to be?',
        a: 'I teach all ages and experience levels. Every child is different, so the best first step is to reach out—we’ll talk through your child’s comfort and find the right starting point.',
    },
    {
        q: 'Do you teach barrel racing and pole bending?',
        a: 'Yes. Along with foundational riding and horsemanship, I offer instruction in both barrel racing and pole bending for riders ready to take on speed and pattern work.',
    },
    {
        q: 'How do I book my first lesson?',
        a: 'Send a message through the contact page with a little about you or your rider. I’ll get back to you to answer questions and schedule a time that works.',
    },
]

export default function Faq() {
    return (
        <Section id="faq">
            <Container>
                <SectionHeader
                    center
                    eyebrow="Questions"
                    title="Frequently Asked"
                    lead="A few common questions before you saddle up. Don’t see yours? Just reach out."
                />
                <div style={{ maxWidth: 760, margin: '0 auto' }}>
                    <FaqAccordion items={FAQS} />
                </div>
            </Container>
        </Section>
    )
}
