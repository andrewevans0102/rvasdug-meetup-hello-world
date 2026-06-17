import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component - Retro Arcade Implementation', () => {
  describe('Hello World Functionality', () => {
    it('renders the RVASDUG Meetup title', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeInTheDocument();
    });

    it('renders the title as an h1 element', () => {
      render(<App />);
      const title = screen.getByRole('heading', { level: 1, name: /RVASDUG Meetup/i });
      expect(title).toBeInTheDocument();
    });

    it('applies the blinking-title class to the h1', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toHaveClass('blinking-title');
    });

    it('renders the center section', () => {
      render(<App />);
      const centerSection = document.querySelector('#center');
      expect(centerSection).toBeInTheDocument();
    });

    it('renders the spacer section', () => {
      render(<App />);
      const spacerSection = document.querySelector('#spacer');
      expect(spacerSection).toBeInTheDocument();
    });
  });

  describe('Agent List Integration', () => {
    it('renders the agent list component', () => {
      render(<App />);
      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();
    });

    it('includes all Reygent agents', () => {
      render(<App />);

      // Verify all 6 agents are present
      expect(screen.getByText(/Dev Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/QE Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Planner Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Security Reviewer Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/PR Reviewer Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Adhoc Agent/i)).toBeInTheDocument();
    });

    it('maintains both Hello World and Agent List content', () => {
      render(<App />);

      // Both should coexist
      const title = screen.getByText(/RVASDUG Meetup/i);
      const agentList = screen.getByRole('list');

      expect(title).toBeInTheDocument();
      expect(agentList).toBeInTheDocument();
    });

    it('does not break when both components are rendered', () => {
      const consoleError = console.error;
      const errors = [];

      console.error = (...args) => {
        errors.push(args);
      };

      render(<App />);

      console.error = consoleError;

      expect(errors.length).toBe(0);
    });
  });

  describe('Application Structure', () => {
    it('renders without crashing', () => {
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });

    it('has proper semantic HTML structure', () => {
      render(<App />);

      // Should have heading
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      // Should have list
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });
  });
});
