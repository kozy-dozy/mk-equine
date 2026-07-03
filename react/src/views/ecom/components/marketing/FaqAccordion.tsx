import { useId, useState } from 'react'
import styled from 'styled-components'

export type QA = { q: string; a: string }

const List = styled.div`
    border-top: 1px solid ${({ theme }) => theme.colors.border.default};
`

const Item = styled.div`
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
`

const Trigger = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.lg};
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    padding: ${({ theme }) => `${theme.spacing.lg} 0`};
    font-family: ${({ theme }) => theme.typography.fontPrimary};
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.text.dark};
    transition: color 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.accentGold};
    }
`

const Icon = styled.span<{ $open: boolean }>`
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1.5px solid ${({ theme }) => theme.colors.border.strong};
    color: ${({ theme }) => theme.colors.accentGold};
    transition:
        transform 0.3s ease,
        border-color 0.2s ease;
    transform: rotate(${({ $open }) => ($open ? '45deg' : '0deg')});

    &::before {
        content: '+';
        font-size: 1.2rem;
        line-height: 1;
    }
`

const Panel = styled.div<{ $open: boolean }>`
    display: grid;
    grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
    transition: grid-template-rows 0.3s ease;
`

const PanelInner = styled.div`
    overflow: hidden;
`

const Answer = styled.p`
    margin: 0;
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: 1rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.text.secondary};
    max-width: 680px;
`

function FaqItem({ qa }: { qa: QA }) {
    const [open, setOpen] = useState(false)
    const id = useId()
    const panelId = `${id}-panel`
    const btnId = `${id}-btn`

    return (
        <Item>
            <h3 style={{ margin: 0 }}>
                <Trigger
                    id={btnId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpen((o) => !o)}
                >
                    {qa.q}
                    <Icon $open={open} aria-hidden="true" />
                </Trigger>
            </h3>
            <Panel id={panelId} role="region" aria-labelledby={btnId} $open={open}>
                <PanelInner>
                    <Answer>{qa.a}</Answer>
                </PanelInner>
            </Panel>
        </Item>
    )
}

export default function FaqAccordion({ items }: { items: QA[] }) {
    return (
        <List>
            {items.map((qa) => (
                <FaqItem key={qa.q} qa={qa} />
            ))}
        </List>
    )
}
