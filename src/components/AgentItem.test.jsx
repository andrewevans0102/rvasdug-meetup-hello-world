import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentItem from './AgentItem';

describe('AgentItem Component', () => {
  const mockAgent = {
    id: 'dev',
    name: 'Dev Agent',
    description: 'Writes, edits, and refactors implementation code including unit tests.',
  };

  it('renders the agent name', () => {
    render(<AgentItem agent={mockAgent} />);
    const nameElement = screen.getByText('Dev Agent');
    expect(nameElement).toBeInTheDocument();
  });

  it('applies the agent-item class', () => {
    const { container } = render(<AgentItem agent={mockAgent} />);
    const agentItem = container.querySelector('.agent-item');
    expect(agentItem).toBeInTheDocument();
  });

  it('renders an icon for the agent', () => {
    const { container } = render(<AgentItem agent={mockAgent} />);
    const icon = container.querySelector('.agent-icon svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders the agent name in a div with class agent-name', () => {
    const { container } = render(<AgentItem agent={mockAgent} />);
    const nameDiv = container.querySelector('.agent-name');
    expect(nameDiv).toBeInTheDocument();
    expect(nameDiv.textContent).toBe('Dev Agent');
  });

  it('is keyboard focusable with tabIndex 0', () => {
    const { container } = render(<AgentItem agent={mockAgent} />);
    const agentItem = container.querySelector('.agent-item');
    expect(agentItem).toHaveAttribute('tabIndex', '0');
  });

  it('has proper ARIA attributes', () => {
    render(<AgentItem agent={mockAgent} />);
    const agentItem = screen.getByRole('listitem');
    expect(agentItem).toHaveAttribute('aria-label');
    expect(agentItem.getAttribute('aria-label')).toContain('Dev Agent');
    expect(agentItem.getAttribute('aria-label')).toContain('Writes, edits, and refactors implementation code including unit tests.');
  });

  it('does not display description panel initially', () => {
    const { container } = render(<AgentItem agent={mockAgent} />);
    const descriptionPanel = container.querySelector('.agent-description-panel');
    expect(descriptionPanel).not.toBeInTheDocument();
  });

  it('displays description panel on focus', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgentItem agent={mockAgent} />);
    const agentItem = container.querySelector('.agent-item');

    await user.tab();
    expect(agentItem).toHaveFocus();

    const descriptionPanel = container.querySelector('.agent-description-panel');
    expect(descriptionPanel).toBeInTheDocument();
    expect(descriptionPanel.textContent).toBe('Writes, edits, and refactors implementation code including unit tests.');
  });

  it('hides description panel on blur', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <AgentItem agent={mockAgent} />
        <button>Next element</button>
      </>
    );

    const agentItem = container.querySelector('.agent-item');

    await user.tab();
    expect(agentItem).toHaveFocus();

    let descriptionPanel = container.querySelector('.agent-description-panel');
    expect(descriptionPanel).toBeInTheDocument();

    await user.tab();
    expect(agentItem).not.toHaveFocus();

    descriptionPanel = container.querySelector('.agent-description-panel');
    expect(descriptionPanel).not.toBeInTheDocument();
  });

  it('description panel has proper ARIA attributes', async () => {
    const user = userEvent.setup();
    const { container } = render(<AgentItem agent={mockAgent} />);

    await user.tab();

    const descriptionPanel = container.querySelector('.agent-description-panel');
    expect(descriptionPanel).toHaveAttribute('role', 'tooltip');
    expect(descriptionPanel).toHaveAttribute('aria-live', 'polite');
  });
});
