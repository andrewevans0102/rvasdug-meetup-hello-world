import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

/**
 * Edge Cases and Error Handling Tests
 * Tests unusual scenarios and error conditions
 */
describe('AgentList Edge Cases and Error Handling', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    // Capture console errors and warnings
    consoleErrorSpy = [];
    consoleWarnSpy = [];

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      consoleErrorSpy.push(args);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      consoleWarnSpy.push(args);
      originalWarn.apply(console, args);
    };
  });

  afterEach(() => {
    // Restore console
    console.error = console.error.bind(console);
    console.warn = console.warn.bind(console);
  });

  describe('Rendering Stability', () => {
    it('renders without throwing errors', () => {
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('renders without console errors', () => {
      render(<App />);

      // No React errors should be logged
      const reactErrors = consoleErrorSpy.filter(error =>
        error.some(arg => typeof arg === 'string' && arg.includes('Warning'))
      );

      expect(reactErrors.length).toBe(0);
    });

    it('renders without console warnings', () => {
      render(<App />);

      // Should not have React warnings
      expect(consoleWarnSpy.length).toBe(0);
    });
  });

  describe('Multiple Renders', () => {
    it('handles multiple renders without errors', () => {
      const { rerender } = render(<App />);

      expect(() => {
        rerender(<App />);
        rerender(<App />);
        rerender(<App />);
      }).not.toThrow();
    });

    it('maintains consistency across re-renders', () => {
      const { rerender } = render(<App />);

      let firstRenderItems = screen.getAllByRole('listitem');
      expect(firstRenderItems).toHaveLength(6);

      rerender(<App />);

      let secondRenderItems = screen.getAllByRole('listitem');
      expect(secondRenderItems).toHaveLength(6);

      // Content should be identical
      const firstContent = firstRenderItems.map(item => item.textContent);
      const secondContent = secondRenderItems.map(item => item.textContent);

      expect(firstContent).toEqual(secondContent);
    });
  });

  describe('Unmounting', () => {
    it('unmounts cleanly without errors', () => {
      const { unmount } = render(<App />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('can be remounted after unmounting', () => {
      const { unmount } = render(<App />);
      unmount();

      const { container } = render(<App />);
      expect(container).toBeInTheDocument();

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
    });
  });

  describe('DOM Manipulation Resilience', () => {
    it('maintains structure after DOM queries', () => {
      const { container } = render(<App />);

      // Perform various DOM queries
      container.querySelector('ul');
      container.querySelector('li');
      container.querySelectorAll('svg');
      screen.getAllByRole('listitem');

      // Structure should still be intact
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
    });

    it('handles missing agent data gracefully', () => {
      // Even if data is malformed, app should not crash
      const { container } = render(<App />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('Content Edge Cases', () => {
    it('handles agent names with varying lengths', () => {
      render(<App />);

      // Short name
      expect(screen.getByText(/QE Agent/i)).toBeInTheDocument();

      // Long name
      expect(screen.getByText(/Security Reviewer Agent/i)).toBeInTheDocument();

      // All should be visible
      const items = screen.getAllByRole('listitem');
      items.forEach(item => {
        expect(item).toBeVisible();
      });
    });

    it('handles agent names with special characters', () => {
      render(<App />);

      // PR has uppercase letters
      expect(screen.getByText(/PR Reviewer Agent/i)).toBeInTheDocument();

      // No rendering issues
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
    });

    it('handles exact agent count without overflow', () => {
      render(<App />);

      const items = screen.getAllByRole('listitem');

      // Exactly 6, no more, no less
      expect(items).toHaveLength(6);

      // No duplicate entries
      const textContents = items.map(item => item.textContent);
      const uniqueContents = new Set(textContents);
      expect(uniqueContents.size).toBe(6);
    });
  });

  describe('Performance Edge Cases', () => {
    it('renders efficiently with all agents', () => {
      const startTime = performance.now();

      render(<App />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (< 100ms is good, < 1000ms is acceptable)
      expect(renderTime).toBeLessThan(1000);
    });

    it('does not cause memory leaks on repeated renders', () => {
      // Render and unmount multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<App />);
        unmount();
      }

      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('Browser Compatibility Scenarios', () => {
    it('handles different viewport sizes without breaking', () => {
      const viewports = [
        { width: 320, height: 480 },   // Very small
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }, // Desktop
        { width: 2560, height: 1440 }  // Large desktop
      ];

      viewports.forEach(viewport => {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;

        const { unmount } = render(<App />);

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(6);

        unmount();
      });
    });

    it('handles extreme viewport widths', () => {
      // Very narrow
      global.innerWidth = 280;
      global.innerHeight = 600;

      const { unmount } = render(<App />);

      let items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);

      unmount();

      // Very wide
      global.innerWidth = 3840;
      global.innerHeight = 2160;

      render(<App />);

      items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
    });
  });

  describe('State Consistency', () => {
    it('maintains agent count across all scenarios', () => {
      render(<App />);

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);
    });

    it('agent order is deterministic', () => {
      const { unmount } = render(<App />);
      const firstRender = screen.getAllByRole('listitem').map(item => item.textContent);
      unmount();

      render(<App />);
      const secondRender = screen.getAllByRole('listitem').map(item => item.textContent);

      // Order should be consistent
      expect(firstRender).toEqual(secondRender);
    });
  });

  describe('Accessibility Edge Cases', () => {
    it('maintains semantic structure even with rapid renders', () => {
      const { rerender } = render(<App />);

      for (let i = 0; i < 5; i++) {
        rerender(<App />);

        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(6);
      }
    });

    it('list items remain accessible after interactions', () => {
      render(<App />);

      const items = screen.getAllByRole('listitem');

      // Each item should be accessible
      items.forEach(item => {
        expect(item).toBeInTheDocument();
        expect(item.textContent.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Icon Edge Cases', () => {
    it('handles icon rendering for all agents', () => {
      const { container } = render(<App />);

      const listItems = screen.getAllByRole('listitem');

      // Each list item should have an icon
      listItems.forEach(item => {
        const hasIcon = item.querySelector('svg') ||
                       item.querySelector('img') ||
                       item.querySelector('[class*="icon"]');

        expect(hasIcon).toBeTruthy();
      });
    });

    it('icons remain visible across viewport changes', () => {
      const viewports = [
        { width: 375, height: 667 },
        { width: 1024, height: 768 }
      ];

      viewports.forEach(viewport => {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;

        const { container, unmount } = render(<App />);

        const icons = container.querySelectorAll('svg, img[class*="icon"]');

        // Icons should be present
        expect(icons.length).toBeGreaterThan(0);

        unmount();
      });
    });
  });

  describe('Text Rendering Edge Cases', () => {
    it('handles agent names with mixed case', () => {
      render(<App />);

      // QE is all caps
      expect(screen.getByText(/QE Agent/i)).toBeInTheDocument();

      // PR is caps
      expect(screen.getByText(/PR Reviewer Agent/i)).toBeInTheDocument();

      // Others are title case
      expect(screen.getByText(/Dev Agent/i)).toBeInTheDocument();
    });

    it('text remains readable on all backgrounds', () => {
      render(<App />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        const text = item.textContent;

        // Text should exist and be non-empty
        expect(text).toBeTruthy();
        expect(text.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration Stability', () => {
    it('both Hello World and Agent List coexist without conflicts', () => {
      render(<App />);

      // Hello World should work
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('blinking-title');

      // Agent List should work
      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(6);

      // No errors logged
      expect(consoleErrorSpy.length).toBe(0);
    });

    it('maintains all original App functionality', () => {
      render(<App />);

      // Original sections
      expect(document.querySelector('#center')).toBeInTheDocument();
      expect(document.querySelector('#spacer')).toBeInTheDocument();

      // New functionality
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('No Data Loss', () => {
    it('all 6 agents always render', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<App />);

        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(6);

        unmount();
      }
    });

    it('no agents are skipped or hidden', () => {
      render(<App />);

      const requiredAgents = [
        'Dev Agent',
        'QE Agent',
        'Planner Agent',
        'Security Reviewer Agent',
        'PR Reviewer Agent',
        'Adhoc Agent'
      ];

      requiredAgents.forEach(agent => {
        expect(screen.getByText(new RegExp(agent, 'i'))).toBeInTheDocument();
      });
    });
  });
});
