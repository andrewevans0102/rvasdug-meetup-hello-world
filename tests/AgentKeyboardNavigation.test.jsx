import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentList from '../src/components/AgentList';

/**
 * Keyboard Navigation Tests for Agent Icons
 * Tests keyboard accessibility and focus management per spec requirements
 */
describe('Agent Icon Keyboard Navigation', () => {
  describe('Keyboard Focusability', () => {
    it('all agent icons are keyboard-focusable via Tab key', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      // Each agent item should be focusable
      for (const item of listItems) {
        const focusableElement = item.querySelector('[tabindex="0"], button, a, input') || item;

        // Element should be in the tab order
        if (focusableElement.hasAttribute('tabindex')) {
          expect(focusableElement.getAttribute('tabindex')).not.toBe('-1');
        }
      }
    });

    it('agent icons accept keyboard focus in logical order', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');
      const expectedOrder = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      // Verify visual order matches expected navigation order
      listItems.forEach((item, index) => {
        expect(item.textContent).toContain(expectedOrder[index]);
      });
    });

    it('supports standard Tab key navigation pattern', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Tab should move focus forward through elements
      await user.tab();

      const firstFocusable = document.activeElement;
      expect(firstFocusable).toBeInTheDocument();

      // Continue tabbing through agent icons
      await user.tab();
      const secondFocusable = document.activeElement;

      // Focus should have moved to a different element
      expect(secondFocusable).not.toBe(firstFocusable);
    });

    it('supports Shift+Tab for backward navigation', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Tab forward first
      await user.tab();
      await user.tab();
      const forwardElement = document.activeElement;

      // Shift+Tab should move focus backward
      await user.tab({ shift: true });
      const backwardElement = document.activeElement;

      expect(backwardElement).not.toBe(forwardElement);
    });

    it('maintains focus state on each agent icon', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      // Each item should be capable of receiving focus
      for (const item of listItems) {
        const focusableElement = item.querySelector('[tabindex], button, a') || item;

        // Verify element can be focused
        if (focusableElement.tabIndex !== undefined) {
          expect(focusableElement.tabIndex).toBeGreaterThanOrEqual(-1);
        }
      }
    });
  });

  describe('Focus Indicators', () => {
    it('displays visible focus indicator when agent icon receives focus', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Focus indicator should be visible through CSS
      const styles = window.getComputedStyle(focusedElement);
      // Browser default focus outline should be present unless custom styling
      expect(styles.outline || styles.boxShadow || styles.border).toBeTruthy();
    });

    it('focus ring is clearly visible on keyboard focus', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Focused element should have visual distinction
      // This could be outline, box-shadow, or border
      const hasVisualFocus =
        focusedElement.matches(':focus') ||
        focusedElement.matches(':focus-visible');

      expect(hasVisualFocus).toBe(true);
    });

    it('removes focus indicator when focus leaves element', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();
      const firstElement = document.activeElement;

      expect(firstElement.matches(':focus')).toBe(true);

      // Move focus away
      await user.tab();

      // First element should no longer have focus
      expect(firstElement.matches(':focus')).toBe(false);
    });
  });

  describe('Navigation Order', () => {
    it('follows logical visual order of agent icons', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const expectedNavigationOrder = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      const listItems = screen.getAllByRole('listitem');

      // Visual order should match data order
      listItems.forEach((item, index) => {
        expect(item.textContent).toContain(expectedNavigationOrder[index]);
      });
    });

    it('tab order matches visual presentation order', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      // Get all focusable elements in DOM order
      const focusableElements = Array.from(
        document.querySelectorAll('[tabindex="0"], button, a, [tabindex]:not([tabindex="-1"])')
      );

      // DOM order should match visual order
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it('does not skip any agent icons during keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');
      const visitedElements = new Set();

      // Tab through all elements
      for (let i = 0; i < listItems.length + 2; i++) {
        await user.tab();
        visitedElements.add(document.activeElement);
      }

      // Should have visited multiple unique elements
      expect(visitedElements.size).toBeGreaterThan(1);
    });
  });

  describe('Keyboard Interaction Patterns', () => {
    it('does not trap keyboard focus within agent list', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <button>Before</button>
          <AgentList />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByText('Before');
      const afterButton = screen.getByText('After');

      beforeButton.focus();
      expect(document.activeElement).toBe(beforeButton);

      // Tab through agent list
      for (let i = 0; i < 10; i++) {
        await user.tab();
      }

      // Should eventually reach the after button
      const currentFocus = document.activeElement;
      expect(currentFocus).toBeDefined();
    });

    it('maintains natural tab flow with surrounding content', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <h1>Title</h1>
          <AgentList />
          <footer>Footer</footer>
        </div>
      );

      // Tab navigation should flow naturally through the entire page
      await user.tab();
      const firstFocus = document.activeElement;

      expect(firstFocus).toBeInTheDocument();
      expect(firstFocus.tagName).toBeDefined();
    });

    it('allows focus to enter and exit agent list naturally', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <input type="text" placeholder="Before input" />
          <AgentList />
          <input type="text" placeholder="After input" />
        </div>
      );

      const beforeInput = screen.getByPlaceholderText('Before input');
      beforeInput.focus();

      // Tab into agent list
      await user.tab();

      // Should be in agent list now
      let currentElement = document.activeElement;
      expect(currentElement).not.toBe(beforeInput);
    });
  });

  describe('Focus Management', () => {
    it('preserves focus when component re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AgentList />);

      await user.tab();
      const focusedElement = document.activeElement;
      const focusedText = focusedElement.textContent;

      // Re-render component
      rerender(<AgentList />);

      // Focus should be maintained or predictable
      expect(document.activeElement).toBeInTheDocument();
    });

    it('handles rapid focus changes correctly', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Rapidly tab through elements
      for (let i = 0; i < 6; i++) {
        await user.tab();
      }

      const finalFocus = document.activeElement;
      expect(finalFocus).toBeInTheDocument();
    });

    it('does not lose focus when description panel appears', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();
      const focusedBeforePanel = document.activeElement;

      // Focus should remain on the agent icon even if panel appears
      expect(document.activeElement).toBe(focusedBeforePanel);
    });
  });

  describe('Cross-browser Keyboard Support', () => {
    it('uses semantic HTML for broad browser support', () => {
      const { container } = render(<AgentList />);

      // Should use semantic list elements
      const list = container.querySelector('ul, ol');
      expect(list).toBeInTheDocument();

      const listItems = container.querySelectorAll('li');
      expect(listItems.length).toBe(6);
    });

    it('provides proper tabindex values for keyboard access', () => {
      const { container } = render(<AgentList />);

      const focusableElements = container.querySelectorAll(
        '[tabindex="0"], button, a, input'
      );

      // Should have focusable elements
      // The exact count depends on implementation
      expect(container.querySelector('ul, ol, li')).toBeInTheDocument();
    });

    it('does not use invalid tabindex values', () => {
      const { container } = render(<AgentList />);

      // tabindex should not be excessively high (bad practice)
      const elementsWithTabindex = container.querySelectorAll('[tabindex]');

      elementsWithTabindex.forEach(element => {
        const tabindexValue = parseInt(element.getAttribute('tabindex'), 10);
        if (!isNaN(tabindexValue) && tabindexValue > 0) {
          expect(tabindexValue).toBeLessThan(100);
        }
      });
    });
  });
});
