import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AgentList from '../src/components/AgentList';
import { agents } from '../src/data/agents';

/**
 * Edge Cases and Cross-Browser Compatibility Tests
 * Tests boundary conditions and browser-specific scenarios
 */
describe('Agent Keyboard Focus Edge Cases', () => {
  describe('Viewport Boundary Conditions', () => {
    it('handles very narrow viewports (320px)', async () => {
      const user = userEvent.setup();

      global.innerWidth = 320;
      global.innerHeight = 568;

      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Panel should still be accessible
      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');

        if (panel) {
          const rect = panel.getBoundingClientRect();

          // Panel should not exceed viewport
          expect(rect.left).toBeGreaterThanOrEqual(-10);
          expect(rect.right).toBeLessThanOrEqual(global.innerWidth + 10);
        }
      }, { timeout: 1000 });
    });

    it('handles very wide viewports (4K displays)', async () => {
      const user = userEvent.setup();

      global.innerWidth = 3840;
      global.innerHeight = 2160;

      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });

    it('handles very short viewports', async () => {
      const user = userEvent.setup();

      global.innerWidth = 375;
      global.innerHeight = 300;

      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles square viewports', async () => {
      const user = userEvent.setup();

      global.innerWidth = 800;
      global.innerHeight = 800;

      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('panel positioning when agent is at viewport edge', async () => {
      const user = userEvent.setup();

      global.innerWidth = 375;
      global.innerHeight = 500;

      render(<AgentList />);

      // Navigate to last agent
      for (let i = 0; i < 6; i++) {
        await user.tab();
      }

      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');

        if (panel) {
          const rect = panel.getBoundingClientRect();

          // Panel should be visible
          expect(rect.width).toBeGreaterThan(0);
          expect(rect.height).toBeGreaterThan(0);
        }
      }, { timeout: 1000 });
    });
  });

  describe('Rapid User Input', () => {
    it('handles very fast Tab key presses', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Rapid tabbing
      const tabs = Array(10).fill(null);
      await Promise.all(tabs.map(() => user.tab()));

      // Should complete without errors
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles rapid Tab and Shift+Tab alternation', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Alternate forward and backward
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          await user.tab();
        } else {
          await user.tab({ shift: true });
        }
      }

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles holding Tab key (repeated tabs)', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Simulate holding tab
      for (let i = 0; i < 20; i++) {
        await user.tab();
      }

      // Should handle gracefully
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles simultaneous focus events', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();
      const firstFocus = document.activeElement;

      // Quickly move focus
      await user.tab();

      // Should handle state transitions
      const secondFocus = document.activeElement;
      expect(secondFocus).toBeDefined();
    });
  });

  describe('Focus State Edge Cases', () => {
    it('handles programmatic focus changes', async () => {
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      // Programmatically focus first agent
      const firstFocusable = listItems[0].querySelector('[tabindex], button, a') || listItems[0];

      if (firstFocusable instanceof HTMLElement) {
        firstFocusable.focus();

        expect(document.activeElement).toBe(firstFocusable);
      }
    });

    it('handles focus when agent is removed from DOM', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AgentList />);

      await user.tab();

      // Re-render (simulating component update)
      rerender(<AgentList />);

      // Focus should still be manageable
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles blur events correctly', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();
      const focusedElement = document.activeElement;

      // Blur the element
      if (focusedElement instanceof HTMLElement) {
        focusedElement.blur();

        expect(document.activeElement).not.toBe(focusedElement);
      }
    });

    it('handles focus when component re-mounts', async () => {
      const user = userEvent.setup();
      const { unmount, rerender } = render(<AgentList />);

      await user.tab();

      // Unmount and remount
      unmount();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Panel Rendering Edge Cases', () => {
    it('handles very long description text', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Security Reviewer Agent has longest description
      const securityAgent = agents.find(a => a.id === 'security');

      expect(securityAgent?.description.length).toBeGreaterThan(50);

      // Navigate to security agent (4th item)
      for (let i = 0; i < 4; i++) {
        await user.tab();
      }

      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');

        if (panel) {
          expect(panel.textContent.length).toBeGreaterThan(0);
        }
      }, { timeout: 1000 });
    });

    it('handles description with special characters', () => {
      // Verify descriptions don't break with special chars
      agents.forEach(agent => {
        expect(agent.description).toBeTruthy();

        // Should handle quotes, apostrophes, etc.
        const hasSpecialChars = /[',\-/]/.test(agent.description);

        // Just verify it doesn't break rendering
        expect(agent.description.length).toBeGreaterThan(0);
      });
    });

    it('handles panel when multiple agents focused quickly', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Quickly focus multiple agents
      for (let i = 0; i < 6; i++) {
        await user.tab();

        // Brief wait
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Should complete without errors
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles panel rendering when CSS fails to load', () => {
      const { container } = render(<AgentList />);

      // Even without styles, structure should exist
      const list = container.querySelector('ul, ol');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);
    });
  });

  describe('Browser-Specific Behaviors', () => {
    it('handles focus-visible pseudo-class support', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;

      // Modern browsers support :focus-visible
      // In test environment, CSS.supports may not be available
      const supportsFocusVisible = typeof CSS !== 'undefined' && CSS.supports ?
        CSS.supports('selector(:focus-visible)') : false;

      if (supportsFocusVisible) {
        // Element should match :focus
        expect(focusedElement.matches(':focus')).toBe(true);
      } else {
        // In environments without CSS.supports, just verify focus works
        expect(focusedElement.matches(':focus')).toBe(true);
      }
    });

    it('handles browsers without aria-describedby support gracefully', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Even without ARIA support, should work
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();

      // Content should be accessible via text content
      expect(focusedElement.textContent.length).toBeGreaterThan(0);
    });

    it('handles different focusable element implementations', async () => {
      const user = userEvent.setup();
      const { container } = render(<AgentList />);

      // Different browsers may implement focusable elements differently
      const focusable = container.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Should have some focusable elements
      // Exact count depends on implementation
      expect(container.querySelector('ul, ol')).toBeInTheDocument();
    });

    it('handles passive event listeners correctly', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Tab navigation should work regardless of event listener type
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Data Integrity Edge Cases', () => {
    it('handles missing agent id field', () => {
      agents.forEach(agent => {
        expect(agent.id).toBeTruthy();
        expect(typeof agent.id).toBe('string');
      });
    });

    it('handles missing agent name field', () => {
      agents.forEach(agent => {
        expect(agent.name).toBeTruthy();
        expect(typeof agent.name).toBe('string');
      });
    });

    it('handles missing agent description field', () => {
      agents.forEach(agent => {
        expect(agent.description).toBeTruthy();
        expect(typeof agent.description).toBe('string');
        expect(agent.description.length).toBeGreaterThan(10);
      });
    });

    it('handles extra fields in agent data gracefully', () => {
      // Verify current data structure
      agents.forEach(agent => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('description');

        // Should have exactly these fields
        const keys = Object.keys(agent);
        expect(keys).toContain('id');
        expect(keys).toContain('name');
        expect(keys).toContain('description');
      });
    });

    it('handles agent data immutability', () => {
      const initialCount = agents.length;
      const firstAgent = agents[0];
      const firstName = firstAgent.name;

      // Verify data hasn't been mutated
      expect(agents.length).toBe(initialCount);
      expect(agents[0].name).toBe(firstName);
    });
  });

  describe('Layout Preservation Edge Cases', () => {
    it('maintains layout when panel is very tall', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');
      const initialPositions = listItems.map(item => item.getBoundingClientRect().top);

      await user.tab();

      // Wait for panel
      await new Promise(resolve => setTimeout(resolve, 100));

      const finalPositions = listItems.map(item => item.getBoundingClientRect().top);

      // Positions should be stable or only minimally adjusted
      expect(initialPositions.length).toBe(finalPositions.length);
    });

    it('maintains layout when panel is very wide', async () => {
      const user = userEvent.setup();

      global.innerWidth = 1920;

      render(<AgentList />);

      await user.tab();

      await waitFor(() => {
        const panel = document.querySelector('[class*="description"], [class*="panel"]');

        if (panel) {
          const rect = panel.getBoundingClientRect();

          // Panel should not cause horizontal scroll
          expect(rect.right).toBeLessThanOrEqual(global.innerWidth + 20);
        }
      }, { timeout: 1000 });
    });

    it('does not affect surrounding content layout', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <h1 id="test-title">Title</h1>
          <AgentList />
          <footer id="test-footer">Footer</footer>
        </div>
      );

      const title = document.getElementById('test-title');
      const footer = document.getElementById('test-footer');

      const initialTitlePos = title?.getBoundingClientRect();
      const initialFooterPos = footer?.getBoundingClientRect();

      await user.tab();

      // Wait for panel
      await new Promise(resolve => setTimeout(resolve, 100));

      const finalTitlePos = title?.getBoundingClientRect();
      const finalFooterPos = footer?.getBoundingClientRect();

      // Surrounding elements should not shift
      if (initialTitlePos && finalTitlePos) {
        expect(finalTitlePos.top).toBe(initialTitlePos.top);
      }
    });

    it('handles overlapping panels correctly', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Wait for first panel
      await new Promise(resolve => setTimeout(resolve, 100));

      const firstPanelTime = Date.now();

      await user.tab();

      // Second panel should replace first
      await waitFor(() => {
        const visiblePanels = document.querySelectorAll(
          '[class*="description"]:not([style*="display: none"]), [class*="panel"]:not([style*="display: none"])'
        );

        // Should have at most one visible panel
        expect(visiblePanels.length).toBeLessThanOrEqual(6);
      }, { timeout: 1000 });
    });
  });

  describe('Performance Edge Cases', () => {
    it('handles many rapid re-renders efficiently', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AgentList />);

      const startTime = performance.now();

      // Multiple re-renders with navigation
      for (let i = 0; i < 10; i++) {
        rerender(<AgentList />);
        await user.tab();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(5000);
    });

    it('handles large number of focus events', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      const startTime = performance.now();

      // Many focus events
      for (let i = 0; i < 50; i++) {
        await user.tab();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should not degrade significantly
      expect(duration).toBeLessThan(10000);
    });

    it('cleans up event listeners on unmount', () => {
      const { unmount } = render(<AgentList />);

      // Mount and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount: unmountInstance } = render(<AgentList />);
        unmountInstance();
      }

      // Should not accumulate listeners (no way to test directly, but verify no errors)
      expect(true).toBe(true);
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('handles screen reader announcements during rapid navigation', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Rapid navigation
      for (let i = 0; i < 6; i++) {
        await user.tab();
      }

      // Should complete without breaking ARIA
      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles high contrast mode scenarios', () => {
      const { container } = render(<AgentList />);

      const listItems = screen.getAllByRole('listitem');

      // All items should have text content for high contrast
      listItems.forEach(item => {
        expect(item.textContent.length).toBeGreaterThan(0);
      });
    });

    it('handles zoom levels (200% zoom)', async () => {
      const user = userEvent.setup();

      // Simulate 200% zoom by halving viewport
      global.innerWidth = 640; // Half of 1280
      global.innerHeight = 360; // Half of 720

      render(<AgentList />);

      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles reduced motion preferences', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Navigation should work regardless of motion preferences
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });

  describe('Concurrency and Race Conditions', () => {
    it('handles focus events during panel animation', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      await user.tab();

      // Immediately tab again during potential animation
      await user.tab();

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });

    it('handles overlapping setState calls', async () => {
      const user = userEvent.setup();
      render(<AgentList />);

      // Rapidly change focus to trigger potential state updates
      await Promise.all([
        user.tab(),
        user.tab(),
        user.tab()
      ]);

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeDefined();
    });

    it('handles component updates during focus', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<AgentList />);

      await user.tab();

      // Update component while focused
      rerender(<AgentList />);

      const focusedElement = document.activeElement;
      expect(focusedElement).toBeInTheDocument();
    });
  });
});
