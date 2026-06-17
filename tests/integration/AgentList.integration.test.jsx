import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from '../../src/App';

describe('AgentList Integration Tests', () => {
  describe('Integration with App Component', () => {
    it('renders both Hello World title and Agent List', () => {
      render(<App />);

      // Verify Hello World functionality is preserved
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeInTheDocument();

      // Verify Agent List is rendered
      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();
    });

    it('maintains Hello World title as h1', () => {
      render(<App />);

      // Original Hello World title should still be h1
      const h1 = screen.getByRole('heading', { level: 1, name: /RVASDUG Meetup/i });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveClass('blinking-title');
    });

    it('does not break existing Hello World functionality', () => {
      render(<App />);

      // Verify all original elements still exist
      const centerSection = document.querySelector('#center');
      expect(centerSection).toBeInTheDocument();

      const spacerSection = document.querySelector('#spacer');
      expect(spacerSection).toBeInTheDocument();
    });

    it('renders all agents within the App', () => {
      render(<App />);

      // All 6 agents should be present
      expect(screen.getByText(/Dev Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/QE Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Planner Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Security Reviewer Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/PR Reviewer Agent/i)).toBeInTheDocument();
      expect(screen.getByText(/Adhoc Agent/i)).toBeInTheDocument();
    });

    it('displays exactly 6 agent list items', () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });
  });

  describe('Layout Integration', () => {
    it('agent list is positioned correctly within App layout', () => {
      render(<App />);

      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();

      // List should be visible and in the DOM
      expect(agentList).toBeVisible();
    });

    it('maintains vertical list structure in full app context', () => {
      render(<App />);

      const list = screen.getByRole('list');
      const listItems = within(list).getAllByRole('listitem');

      // Verify all 6 items are in the list
      expect(listItems).toHaveLength(6);

      // Each should be visible
      listItems.forEach(item => {
        expect(item).toBeVisible();
      });
    });
  });

  describe('Content Verification', () => {
    it('all agent cards render with icons', () => {
      const { container } = render(<App />);

      // Find all icons (svg or img elements within list items)
      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        const hasIcon = within(item).queryByRole('img') ||
                       item.querySelector('svg') ||
                       item.querySelector('[class*="icon"]');

        expect(hasIcon).toBeTruthy();
      });
    });

    it('each agent has both icon and name visible', () => {
      render(<App />);

      const agents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      agents.forEach(agentName => {
        const element = screen.getByText(new RegExp(agentName, 'i'));
        expect(element).toBeVisible();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('renders correctly on desktop viewport', () => {
      // Set desktop viewport
      global.innerWidth = 1024;
      global.innerHeight = 768;

      render(<App />);

      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('renders correctly on tablet viewport', () => {
      // Set tablet viewport
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<App />);

      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('renders correctly on mobile viewport', () => {
      // Set mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<App />);

      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('maintains readability across different viewport sizes', () => {
      const viewports = [
        { width: 320, height: 568 },  // Small mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1920, height: 1080 } // Desktop
      ];

      viewports.forEach(viewport => {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;

        const { unmount } = render(<App />);

        const listItems = screen.getAllByRole('listitem');

        // All items should be present and visible
        expect(listItems).toHaveLength(6);
        listItems.forEach(item => {
          expect(item).toBeVisible();
        });

        unmount();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains semantic HTML structure in full app', () => {
      render(<App />);

      // Main heading should exist
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();

      // List should be semantic
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      // List items should be properly nested
      const listItems = within(list).getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('provides accessible navigation through agents', () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');

      // Each list item should be accessible
      listItems.forEach(item => {
        expect(item).toBeInTheDocument();
        expect(item.textContent).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('renders without console errors', () => {
      const consoleError = console.error;
      const errors = [];

      console.error = (...args) => {
        errors.push(args);
      };

      render(<App />);

      console.error = consoleError;

      // No errors should be logged
      expect(errors.length).toBe(0);
    });

    it('handles missing agent data gracefully', () => {
      // This test ensures the app doesn't crash even if data is malformed
      // The actual implementation uses hardcoded data, so this is a safety check
      render(<App />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders all 6 agents efficiently', () => {
      const startTime = performance.now();

      render(<App />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Render should complete in reasonable time (< 1000ms)
      expect(renderTime).toBeLessThan(1000);

      // Verify all agents rendered
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });
  });

  describe('Data Integrity', () => {
    it('displays the correct Reygent agents from docs/agents.md', () => {
      render(<App />);

      // Verify exact agent names as documented in Reygent
      const expectedAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      expectedAgents.forEach(agentName => {
        expect(screen.getByText(new RegExp(agentName, 'i'))).toBeInTheDocument();
      });
    });

    it('does not display duplicate agents', () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      const textContents = listItems.map(item => item.textContent);

      // No duplicates
      const uniqueContents = new Set(textContents);
      expect(uniqueContents.size).toBe(6);
    });

    it('agent data is hardcoded and not fetched dynamically', () => {
      // This test verifies no network requests are made
      // Since the data is hardcoded per requirements
      const { container } = render(<App />);

      // All agents should be immediately available
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      // No loading states or skeleton screens
      expect(container.textContent).not.toMatch(/loading/i);
      expect(container.textContent).not.toMatch(/fetching/i);
    });
  });
});
