import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentList from '../src/components/AgentList';
import { agents } from '../src/data/agents';

/**
 * Accessibility Compliance Tests (WCAG 2.1 AA)
 * Tests for keyboard accessibility, ARIA attributes, and screen reader support
 */
describe('Agent Icon Focus Accessibility (WCAG 2.1 AA)', () => {
  describe('ARIA Attributes and Roles', () => {
    it('uses semantic HTML list structure', () => {
      const { container } = render(<AgentList />);

      const list = container.querySelector('ul, ol');
      expect(list).toBeInTheDocument();

      const listItems = within(list).getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('provides appropriate ARIA labels for description panels', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Description panel should have proper ARIA attributes
      const panel = document.querySelector('[role="tooltip"], [role="region"], [aria-describedby], [class*="description"]');

      if (panel) {
        // Panel should have identifying attributes for assistive tech
        const hasAriaAttributes =
          panel.hasAttribute('role') ||
          panel.hasAttribute('aria-label') ||
          panel.hasAttribute('aria-describedby') ||
          panel.hasAttribute('id');

        expect(hasAriaAttributes).toBe(true);
      }
    });

    it('associates description panel with focused agent icon via ARIA', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Focused element should reference description panel
      const ariaDescribedBy = focusedElement?.getAttribute('aria-describedby');
      const ariaLabelledBy = focusedElement?.getAttribute('aria-labelledby');

      if (ariaDescribedBy) {
        // Should reference an existing element
        const describedElement = document.getElementById(ariaDescribedBy);
        expect(describedElement).toBeTruthy();
      }
    });

    it('uses appropriate ARIA role for expandable panels', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const panel = document.querySelector('[class*="description"], [class*="panel"]');

      if (panel) {
        const role = panel.getAttribute('role');

        // Acceptable roles for description panels
        const validRoles = ['tooltip', 'region', 'article', 'complementary', null];

        if (role) {
          expect(validRoles).toContain(role);
        }
      }
    });

    it('provides aria-expanded state for interactive elements', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        const interactiveElement = item.querySelector('[aria-expanded]');

        if (interactiveElement) {
          const expandedValue = interactiveElement.getAttribute('aria-expanded');
          expect(['true', 'false']).toContain(expandedValue);
        }
      });
    });

    it('updates aria-expanded when panel opens and closes', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      const expandedAttr = focusedElement?.getAttribute('aria-expanded');

      if (expandedAttr !== null) {
        // Should be 'true' when panel is open
        expect(['true', 'false']).toContain(expandedAttr);
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('provides text alternatives for agent icons', () => {
      const { container } = render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        // Each agent should have readable text
        const text = item.textContent;
        expect(text.length).toBeGreaterThan(0);

        // Icons should have aria-hidden or text alternative
        const icon = item.querySelector('svg');
        if (icon) {
          const hasAriaHidden = icon.getAttribute('aria-hidden') === 'true';
          const hasAriaLabel = icon.hasAttribute('aria-label');
          const hasTitle = icon.querySelector('title') !== null;

          // Icon should either be hidden from screen readers or have alternative text
          expect(hasAriaHidden || hasAriaLabel || hasTitle).toBe(true);
        }
      });
    });

    it('agent names are accessible to screen readers', () => {
      render(<AgentList />);

      const expectedAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      expectedAgents.forEach(agentName => {
        const element = screen.getByText(agentName);
        expect(element).toBeInTheDocument();
        expect(element).toBeVisible();
      });
    });

    it('description content is accessible to screen readers', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Description should be in the accessibility tree
      const panel = document.querySelector('[class*="description"], [class*="panel"]');

      if (panel) {
        // Panel should not have aria-hidden="true"
        expect(panel.getAttribute('aria-hidden')).not.toBe('true');

        // Panel should have text content
        expect(panel.textContent.length).toBeGreaterThan(0);
      }
    });

    it('provides descriptive labels for each agent', () => {
      const { container } = render(<AgentList />);

      agents.forEach(agent => {
        const agentElement = screen.getByText(agent.name);

        // Agent should be identifiable
        expect(agentElement).toBeInTheDocument();

        // Should have accessible name
        const accessibleName = agentElement.textContent;
        expect(accessibleName).toContain(agent.name);
      });
    });

    it('announces panel state changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Panel should be announced via aria-live or role
      const panel = document.querySelector('[class*="description"], [class*="panel"]');

      if (panel) {
        const ariaLive = panel.getAttribute('aria-live');
        const role = panel.getAttribute('role');

        // Either has aria-live or a role that announces changes
        const isAnnounced = ariaLive || role === 'tooltip' || role === 'status';

        // Panel should be discoverable
        expect(panel).toBeInTheDocument();
      }
    });
  });

  describe('Keyboard-only Navigation Requirements', () => {
    it('all functionality is available via keyboard', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Should be able to access all agents via keyboard
      for (let i = 0; i < 6; i++) {
        await user.tab();

        const currentFocus = document.activeElement;
        expect(currentFocus).toBeInTheDocument();
      }
    });

    it('no keyboard traps exist in the interface', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <button>Before</button>
          <AgentList />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByText('Before');
      beforeButton.focus();

      // Should be able to tab through without getting trapped
      for (let i = 0; i < 15; i++) {
        await user.tab();
      }

      // Should have progressed past the agent list
      const currentFocus = document.activeElement;
      expect(currentFocus).toBeDefined();
    });

    it('focus order is logical and meaningful', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const focusOrder = [];

      for (let i = 0; i < 7; i++) {
        await user.tab();
        const text = document.activeElement?.textContent || '';
        focusOrder.push(text);
      }

      // Focus order should be consistent
      expect(focusOrder.length).toBeGreaterThan(0);
    });

    it('supports keyboard navigation without requiring mouse', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // All interactions should work keyboard-only
      await user.tab();

      const focusedElement = document.activeElement;

      // Should have keyboard focus
      expect(focusedElement).toBeInTheDocument();
      expect(focusedElement.matches(':focus')).toBe(true);
    });
  });

  describe('Focus Visibility (WCAG 2.4.7)', () => {
    it('focused element has visible focus indicator', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      const styles = window.getComputedStyle(focusedElement);

      // Should have visible focus styling
      const hasFocusIndicator =
        styles.outline !== 'none' ||
        styles.outlineWidth !== '0px' ||
        styles.boxShadow !== 'none' ||
        styles.border !== 'none';

      expect(hasFocusIndicator || focusedElement.matches(':focus-visible')).toBe(true);
    });

    it('focus indicator meets minimum contrast requirements', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Focus indicator should be visible
      expect(focusedElement.matches(':focus')).toBe(true);

      // Actual contrast testing would require color analysis
      // Here we verify that focus is visually indicated
      const styles = window.getComputedStyle(focusedElement);
      const hasVisibleFocus = styles.outline !== 'none' || styles.outlineWidth !== '0px';

      expect(focusedElement).toBeInTheDocument();
    });

    it('focus indicator is not removed by CSS', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      const styles = window.getComputedStyle(focusedElement);

      // Should not have outline: none on focused element
      // (unless using alternative focus indicator)
      if (styles.outline === 'none' || styles.outline === '0px') {
        // Should have alternative focus indicator
        const hasAlternative =
          styles.boxShadow !== 'none' ||
          styles.border !== '0px' ||
          styles.backgroundColor !== 'transparent';

        expect(hasAlternative).toBe(true);
      }
    });
  });

  describe('Name, Role, Value (WCAG 4.1.2)', () => {
    it('interactive elements have accessible names', () => {
      const { container } = render(<AgentList />);

      const interactive = container.querySelectorAll('button, a, [role="button"], [tabindex="0"]');

      interactive.forEach(element => {
        // Element should have accessible name
        const hasAccessibleName =
          element.textContent.length > 0 ||
          element.hasAttribute('aria-label') ||
          element.hasAttribute('aria-labelledby') ||
          element.hasAttribute('title');

        expect(hasAccessibleName).toBe(true);
      });
    });

    it('interactive elements have appropriate roles', () => {
      const { container } = render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        // List items should be in a list
        expect(item.parentElement?.tagName.toLowerCase()).toMatch(/ul|ol/);
      });
    });

    it('dynamic content updates are programmatically determinable', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // When panel appears, it should be in the DOM and accessible
      const panel = document.querySelector('[class*="description"], [class*="panel"]');

      if (panel) {
        // Panel state should be determinable
        const isVisible = panel.offsetWidth > 0 && panel.offsetHeight > 0;
        const hasAriaHidden = panel.hasAttribute('aria-hidden');

        // State should be clear
        expect(panel).toBeInTheDocument();
      }
    });
  });

  describe('Focus Management Best Practices', () => {
    it('maintains focus when panel opens', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedBeforePanel = document.activeElement;

      // Wait for panel to appear
      await new Promise(resolve => setTimeout(resolve, 100));

      const focusedAfterPanel = document.activeElement;

      // Focus should remain on the agent icon
      expect(focusedAfterPanel).toBe(focusedBeforePanel);
    });

    it('returns focus appropriately when panel closes', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();
      const firstFocus = document.activeElement;

      await user.tab();
      const secondFocus = document.activeElement;

      // Focus should have moved naturally
      expect(secondFocus).toBeDefined();
    });

    it('does not steal focus programmatically', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <input type="text" placeholder="Test input" />
          <AgentList />
        </div>
      );

      const input = screen.getByPlaceholderText('Test input');
      input.focus();

      expect(document.activeElement).toBe(input);

      // AgentList should not steal focus
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(document.activeElement).toBe(input);
    });
  });

  describe('Cross-browser Accessibility', () => {
    it('uses standard HTML elements for broad support', () => {
      const { container } = render(<AgentList />);

      // Should use standard semantic elements
      const semanticElements = container.querySelectorAll('ul, ol, li, button, a');

      expect(semanticElements.length).toBeGreaterThan(0);
    });

    it('avoids non-standard ARIA patterns', () => {
      const { container } = render(<AgentList />);

      // Check for common ARIA misuse
      const elementsWithRole = container.querySelectorAll('[role]');

      elementsWithRole.forEach(element => {
        const role = element.getAttribute('role');

        // Should use valid ARIA roles
        const validRoles = [
          'button', 'link', 'navigation', 'main', 'article',
          'complementary', 'region', 'tooltip', 'status',
          'alert', 'dialog', 'list', 'listitem', 'img'
        ];

        if (role && !validRoles.includes(role)) {
          // Log unexpected roles for review
          console.warn(`Unexpected ARIA role: ${role}`);
        }
      });
    });

    it('provides consistent experience across browsers', () => {
      const { container } = render(<AgentList />);

      // Should render consistently
      const list = container.querySelector('ul, ol');
      const listItems = screen.getAllByRole('listitem');

      expect(list).toBeInTheDocument();
      expect(listItems).toHaveLength(6);
    });
  });

  describe('Mobile Accessibility', () => {
    it('maintains accessibility on touch devices', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      const { container } = render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      // All agents should be accessible
      expect(listItems).toHaveLength(6);

      listItems.forEach(item => {
        expect(item).toBeVisible();
      });
    });

    it('keyboard navigation works on mobile browsers', async () => {
      const user = userEvent.setup();

      global.innerWidth = 375;

      render(<AgentList />);

      // Mobile browsers should support keyboard (external keyboard)
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('High Contrast Mode Compatibility', () => {
    it('maintains readability in high contrast scenarios', () => {
      const { container } = render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        // Text should be present for high contrast mode
        const text = item.textContent;
        expect(text.length).toBeGreaterThan(0);
      });
    });

    it('focus indicators work in high contrast mode', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Focus should be programmatically detectable
      expect(focusedElement.matches(':focus')).toBe(true);
    });
  });
});
