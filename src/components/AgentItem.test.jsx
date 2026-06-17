import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
