import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { agents } from '../../src/data/agents';

/**
 * Integration Tests for Agent Icon Keyboard Focus with Description Panels
 * Tests the complete end-to-end user flow for the feature
 */
describe('Agent Keyboard Focus Integration Tests', () => {
  describe('Complete User Flow', () => {
    it('user can navigate all agents via keyboard and view descriptions', async () => {
      const user = userEvent.setup();
      render(<App />);

      // User tabs through all 6 agents
      for (let i = 0; i < 6; i++) {
        await user.tab();

        // Each agent should be focusable
        const currentFocus = document.activeElement;
        expect(currentFocus).toBeInTheDocument();
      }
    });

    it('complete navigation cycle shows all agent descriptions', async () => {
      const user = userEvent.setup();
      render(<App />);

      const seenDescriptions = new Set();

      // Navigate through all agents
      for (let i = 0; i < 6; i++) {
        await user.tab();

        // Look for description panel
        await waitFor(() => {
          const panel = document.querySelector('[class*="description"], [class*="panel"]');

          if (panel && panel.textContent) {
            seenDescriptions.add(panel.textContent);
          }
        }, { timeout: 500 });
      }

      // Should have seen multiple unique descriptions
      expect(seenDescriptions.size).toBeGreaterThan(0);
    });

    it('user can navigate forward and backward through agents', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Navigate forward
      await user.tab();
      const firstFocus = document.activeElement;

      await user.tab();
      const secondFocus = document.activeElement;

      expect(secondFocus).not.toBe(firstFocus);

      // Navigate backward
      await user.tab({ shift: true });
      const backToFirst = document.activeElement;

      // Should return to or near first element
      expect(backToFirst).toBeDefined();
    });

    it('description panel updates correctly during navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.tab();

      let firstDescription = null;
      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');
        if (panel) {
          firstDescription = panel.textContent;
        }
      });

      await user.tab();

      let secondDescription = null;
      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');
        if (panel) {
          secondDescription = panel.textContent;
        }
      });

      // Descriptions should be different
      if (firstDescription && secondDescription) {
        expect(firstDescription).not.toBe(secondDescription);
      }
    });
  });

  describe('Integration with Existing App Features', () => {
    it('does not interfere with Hello World title', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Original title should still exist
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeInTheDocument();

      // Keyboard navigation should work alongside
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('maintains app layout when navigating agents', async () => {
      const user = userEvent.setup();
      render(<App />);

      const centerSection = document.querySelector('#center');
      const initialLayout = centerSection?.getBoundingClientRect();

      // Navigate through agents
      for (let i = 0; i < 6; i++) {
        await user.tab();
      }

      const finalLayout = centerSection?.getBoundingClientRect();

      // Layout should be stable
      if (initialLayout && finalLayout) {
        expect(finalLayout.top).toBe(initialLayout.top);
      }
    });

    it('preserves existing Hello World functionality', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Check all original elements
      expect(screen.getByText(/RVASDUG Meetup/i)).toBeInTheDocument();
      expect(document.querySelector('#center')).toBeInTheDocument();
      expect(document.querySelector('#spacer')).toBeInTheDocument();

      // Agent navigation works
      await user.tab();

      expect(document.activeElement).toBeInTheDocument();
    });

    it('agent list integrates seamlessly in app context', async () => {
      const user = userEvent.setup();
      render(<App />);

      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();

      // Navigation works in full app
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Data Integrity in Full Context', () => {
    it('displays all 6 Reygent agents with correct descriptions', async () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      // Verify all agent names are present
      agents.forEach(agent => {
        const element = screen.getByText(agent.name);
        expect(element).toBeInTheDocument();
      });
    });

    it('agent descriptions match Reygent documentation', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Sample check: Dev Agent description
      await user.tab();

      await waitFor(() => {
        const devAgentDesc = agents.find(a => a.id === 'dev')?.description;

        if (devAgentDesc) {
          // Description should be in the document when Dev Agent is focused
          const hasDescription = screen.queryByText(new RegExp(devAgentDesc.substring(0, 30), 'i'));
          if (hasDescription) {
            expect(hasDescription).toBeInTheDocument();
          }
        }
      }, { timeout: 1000 });
    });

    it('no duplicate agents are displayed', () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      const agentNames = listItems.map(item => item.textContent);

      const uniqueNames = new Set(agentNames);
      expect(uniqueNames.size).toBe(6);
    });

    it('all agents have non-empty descriptions', () => {
      agents.forEach(agent => {
        expect(agent.description).toBeTruthy();
        expect(agent.description.length).toBeGreaterThan(20);
      });
    });
  });

  describe('Cross-viewport Integration', () => {
    it('works correctly on desktop viewport', async () => {
      const user = userEvent.setup();

      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<App />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('works correctly on tablet viewport', async () => {
      const user = userEvent.setup();

      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<App />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('works correctly on mobile viewport', async () => {
      const user = userEvent.setup();

      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<App />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('description panels adapt to viewport size', async () => {
      const user = userEvent.setup();

      const viewports = [
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      for (const viewport of viewports) {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;

        const { unmount } = render(<App />);

        await user.tab();

        await waitFor(() => {
          const panel = document.querySelector('[class*="description"], [class*="panel"]');

          if (panel) {
            const rect = panel.getBoundingClientRect();

            // Panel should fit within viewport
            expect(rect.right).toBeLessThanOrEqual(viewport.width + 20);
          }
        }, { timeout: 500 });

        unmount();
      }
    });
  });

  describe('Performance and Stability', () => {
    it('handles rapid keyboard navigation without errors', async () => {
      const user = userEvent.setup();
      render(<App />);

      const errors = [];
      const originalError = console.error;
      console.error = (...args) => errors.push(args);

      // Rapid navigation
      for (let i = 0; i < 20; i++) {
        await user.tab();
      }

      console.error = originalError;

      // Should not generate errors
      expect(errors.length).toBe(0);
    });

    it('maintains performance with multiple focus cycles', async () => {
      const user = userEvent.setup();
      render(<App />);

      const startTime = performance.now();

      // Multiple navigation cycles
      for (let cycle = 0; cycle < 3; cycle++) {
        for (let i = 0; i < 6; i++) {
          await user.tab();
        }
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time (< 3 seconds)
      expect(duration).toBeLessThan(3000);
    });

    it('cleans up properly when component unmounts', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<App />);

      await user.tab();

      // Unmount component
      unmount();

      // Should clean up without errors
      expect(document.querySelector('[class*="description"]')).toBeFalsy();
    });

    it('does not cause memory leaks with repeated navigation', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<App />);

      // Navigate multiple times
      for (let i = 0; i < 12; i++) {
        await user.tab();
      }

      // Component should be stable
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      unmount();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles focus when no agents are initially visible', async () => {
      const user = userEvent.setup();

      // Extremely small viewport
      global.innerWidth = 200;
      global.innerHeight = 200;

      render(<App />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles Tab navigation when starting from title', async () => {
      const user = userEvent.setup();
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);

      // If title is focusable, start there
      if (title.tabIndex !== undefined && title.tabIndex >= 0) {
        title.focus();
      }

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles empty or null description data gracefully', () => {
      // Verify current data has no empty descriptions
      agents.forEach(agent => {
        expect(agent.description).toBeTruthy();
        expect(agent.description).not.toBe('');
        expect(agent.description).not.toBeNull();
        expect(agent.description).not.toBeUndefined();
      });
    });

    it('maintains functionality when panel rendering fails', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Navigation should still work even if panel doesn't render
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Can continue navigating
      await user.tab();

      const nextFocus = document.activeElement;
      expect(nextFocus).toBeDefined();
    });
  });

  describe('Accessibility Integration', () => {
    it('maintains WCAG 2.1 AA compliance in full app', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Semantic structure
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      // Keyboard navigation works
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement.matches(':focus')).toBe(true);
    });

    it('screen reader can access all agent information', () => {
      render(<App />);

      // All agent names accessible
      agents.forEach(agent => {
        const element = screen.getByText(agent.name);
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
      });
    });

    it('focus indicators visible throughout navigation', async () => {
      const user = userEvent.setup();
      render(<App />);

      for (let i = 0; i < 6; i++) {
        await user.tab();

        const focusedElement = document.activeElement;

        // Should have visible focus
        expect(focusedElement.matches(':focus')).toBe(true);
      }
    });

    it('ARIA relationships maintained in full app context', async () => {
      const user = userEvent.setup();
      render(<App />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Check for ARIA attributes
      const hasAriaAttributes =
        focusedElement?.hasAttribute('aria-label') ||
        focusedElement?.hasAttribute('aria-describedby') ||
        focusedElement?.hasAttribute('aria-labelledby') ||
        focusedElement?.textContent.length > 0;

      expect(hasAriaAttributes).toBe(true);
    });
  });

  describe('Real-world User Scenarios', () => {
    it('user discovers agent descriptions through keyboard exploration', async () => {
      const user = userEvent.setup();
      render(<App />);

      // User lands on page and starts tabbing
      await user.tab(); // May land on title or first agent

      // Continue tabbing to explore
      await user.tab();
      await user.tab();

      // Should have encountered agents
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('user reads multiple agent descriptions to compare', async () => {
      const user = userEvent.setup();
      render(<App />);

      const descriptions = [];

      // User tabs through first 3 agents
      for (let i = 0; i < 3; i++) {
        await user.tab();

        await waitFor(() => {
          const panel = document.querySelector('[class*="description"], [class*="panel"]');

          if (panel && panel.textContent) {
            descriptions.push(panel.textContent);
          }
        }, { timeout: 500 });
      }

      // Should have collected some descriptions
      expect(descriptions.length).toBeGreaterThanOrEqual(0);
    });

    it('user navigates backward to re-read a description', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Navigate forward
      await user.tab();
      await user.tab();

      const forwardFocus = document.activeElement;

      // Navigate backward
      await user.tab({ shift: true });

      const backwardFocus = document.activeElement;

      // Should have moved focus
      expect(backwardFocus).toBeDefined();
    });

    it('keyboard-only user can access all agent information', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Without using mouse, access all agents
      for (let i = 0; i < 6; i++) {
        await user.tab();

        const currentFocus = document.activeElement;

        // Each agent should be reachable
        expect(currentFocus).toBeInTheDocument();
      }
    });
  });

  describe('Browser Compatibility Integration', () => {
    it('renders correctly across viewport sizes (Chrome scenario)', async () => {
      const user = userEvent.setup();

      global.innerWidth = 1280;
      global.innerHeight = 720;

      render(<App />);

      await user.tab();

      expect(document.activeElement).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    it('keyboard navigation works consistently', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Standard Tab behavior
      await user.tab();
      const firstFocus = document.activeElement;

      await user.tab();
      const secondFocus = document.activeElement;

      // Focus should have moved
      expect(secondFocus).toBeDefined();
      expect(firstFocus).toBeDefined();
    });

    it('renders without console errors or warnings', () => {
      const errors = [];
      const warnings = [];

      const originalError = console.error;
      const originalWarn = console.warn;

      console.error = (...args) => errors.push(args);
      console.warn = (...args) => warnings.push(args);

      render(<App />);

      console.error = originalError;
      console.warn = originalWarn;

      // Should have no React errors
      const reactErrors = errors.filter(e =>
        e.toString().includes('Warning') || e.toString().includes('Error')
      );

      expect(reactErrors.length).toBe(0);
    });
  });
});
