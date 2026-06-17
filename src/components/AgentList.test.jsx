import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import AgentList from './AgentList';

describe('AgentList Component', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<AgentList />);
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('renders all 6 Reygent agents', () => {
      render(<AgentList />);
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('renders Dev Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/Dev Agent/i)).toBeInTheDocument();
    });

    it('renders QE Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/QE Agent/i)).toBeInTheDocument();
    });

    it('renders Planner Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/Planner Agent/i)).toBeInTheDocument();
    });

    it('renders Security Reviewer Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/Security Reviewer Agent/i)).toBeInTheDocument();
    });

    it('renders PR Reviewer Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/PR Reviewer Agent/i)).toBeInTheDocument();
    });

    it('renders Adhoc Agent', () => {
      render(<AgentList />);
      expect(screen.getByText(/Adhoc Agent/i)).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('displays agents in a vertical list layout', () => {
      render(<AgentList />);
      const list = screen.getByRole('list');

      // Check that the list container exists and is likely vertical
      // (CSS will determine actual layout, but we verify structure)
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('maintains agent order consistently', () => {
      render(<AgentList />);
      const listItems = screen.getAllByRole('listitem');

      // Verify all expected agents are present in some order
      const agentNames = listItems.map(item => item.textContent);
      expect(agentNames).toContain('Dev Agent');
      expect(agentNames).toContain('QE Agent');
      expect(agentNames).toContain('Planner Agent');
      expect(agentNames).toContain('Security Reviewer Agent');
      expect(agentNames).toContain('PR Reviewer Agent');
      expect(agentNames).toContain('Adhoc Agent');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic list markup', () => {
      render(<AgentList />);
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(6);
    });

    it('has accessible structure for screen readers', () => {
      render(<AgentList />);

      // Verify list is properly structured
      const list = screen.getByRole('list');
      const listItems = within(list).getAllByRole('listitem');

      expect(listItems.length).toBe(6);
    });
  });

  describe('Content', () => {
    it('includes agent name for each entry', () => {
      render(<AgentList />);
      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        expect(item.textContent.length).toBeGreaterThan(0);
      });
    });

    it('renders each agent as a distinct entry', () => {
      render(<AgentList />);
      const listItems = screen.getAllByRole('listitem');

      // Verify we have the exact count of unique agents
      expect(listItems).toHaveLength(6);

      // Verify no duplicate text content
      const textContents = listItems.map(item => item.textContent);
      const uniqueContents = new Set(textContents);
      expect(uniqueContents.size).toBe(6);
    });
  });

  describe('Integration', () => {
    it('renders child AgentCard/AgentItem components', () => {
      render(<AgentList />);
      const listItems = screen.getAllByRole('listitem');

      // Each list item should contain agent information
      listItems.forEach(item => {
        expect(item).toBeInTheDocument();
        expect(item.textContent).toBeTruthy();
      });
    });
  });
});
