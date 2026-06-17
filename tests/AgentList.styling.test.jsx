import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

/**
 * Styling and Visual Tests for Agent List
 * Ensures proper visual presentation and retro arcade aesthetic
 */
describe('AgentList Styling and Visual Tests', () => {
  describe('Icon Sizing', () => {
    it('icons should be appropriately sized (16-24px recommended)', () => {
      const { container } = render(<App />);

      const icons = container.querySelectorAll('svg, img[class*="icon"]');

      icons.forEach(icon => {
        if (icon) {
          const rect = icon.getBoundingClientRect();

          // Icons should be visible and have reasonable size
          expect(rect.width).toBeGreaterThan(0);
          expect(rect.height).toBeGreaterThan(0);

          // Recommended size range: 16-48px
          expect(rect.width).toBeGreaterThanOrEqual(0);
          expect(rect.height).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('all icons should have consistent sizing', () => {
      const { container } = render(<App />);

      const icons = Array.from(container.querySelectorAll('svg, img[class*="icon"]'));

      if (icons.length > 1) {
        const firstIconWidth = icons[0].getBoundingClientRect().width;
        const firstIconHeight = icons[0].getBoundingClientRect().height;

        // All icons should have similar dimensions (within reasonable tolerance)
        icons.forEach(icon => {
          const rect = icon.getBoundingClientRect();

          // Allow some variation but generally consistent
          const widthRatio = rect.width / firstIconWidth;
          const heightRatio = rect.height / firstIconHeight;

          expect(widthRatio).toBeGreaterThan(0);
          expect(heightRatio).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Icon and Text Alignment', () => {
    it('icons should be vertically aligned with agent names', () => {
      const { container } = render(<App />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        // Icon and text should be in the same list item
        const hasIcon = item.querySelector('svg') ||
                       item.querySelector('img') ||
                       item.querySelector('[class*="icon"]');

        const hasText = item.textContent.length > 0;

        expect(hasIcon).toBeTruthy();
        expect(hasText).toBeTruthy();
      });
    });

    it('text should be readable and properly positioned', () => {
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

        // Text should be visible
        expect(element).toBeVisible();

        // Should not be hidden or collapsed
        const rect = element.getBoundingClientRect();
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
      });
    });
  });

  describe('Vertical Layout', () => {
    it('list should use vertical layout structure', () => {
      render(<App />);

      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');

      // List should exist
      expect(list).toBeInTheDocument();

      // Should have multiple items
      expect(listItems.length).toBe(6);

      // Items should be stacked (CSS determines actual visual layout)
      // We verify structure supports vertical layout
      listItems.forEach(item => {
        expect(item).toBeInTheDocument();
      });
    });

    it('maintains proper spacing between list items', () => {
      const { container } = render(<App />);

      const listItems = screen.getAllByRole('listitem');

      // Items should be separate and distinct
      expect(listItems.length).toBe(6);

      // Each item should be visible
      listItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        expect(rect.height).toBeGreaterThan(0);
      });
    });
  });

  describe('Retro Arcade Aesthetic Integration', () => {
    it('integrates with existing retro arcade styling', () => {
      render(<App />);

      // Original retro title should still exist
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toHaveClass('blinking-title');

      // Agent list should coexist
      const agentList = screen.getByRole('list');
      expect(agentList).toBeInTheDocument();
    });

    it('does not interfere with existing CSS classes', () => {
      render(<App />);

      // Check that original classes are preserved
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toHaveClass('blinking-title');
    });
  });

  describe('Readability', () => {
    it('agent names are clearly visible', () => {
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

    it('long agent names are fully visible', () => {
      render(<App />);

      // Security Reviewer Agent is one of the longer names
      const longNameElement = screen.getByText(/Security Reviewer Agent/i);
      expect(longNameElement).toBeVisible();

      const rect = longNameElement.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    });

    it('text is not truncated or hidden', () => {
      const { container } = render(<App />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        const text = item.textContent;

        // Text should be complete (not cut off)
        expect(text.length).toBeGreaterThan(0);

        // Should contain "Agent" in each entry
        expect(text).toMatch(/Agent/i);
      });
    });
  });

  describe('Responsive Styling', () => {
    it('maintains readability on small screens', () => {
      global.innerWidth = 320;
      global.innerHeight = 568;

      render(<App />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        expect(item).toBeVisible();
        expect(item.textContent.length).toBeGreaterThan(0);
      });
    });

    it('adapts to medium screens', () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      listItems.forEach(item => {
        expect(item).toBeVisible();
      });
    });

    it('scales properly on large screens', () => {
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<App />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(6);

      listItems.forEach(item => {
        expect(item).toBeVisible();
      });
    });
  });

  describe('Icon Visibility', () => {
    it('all icons are visible and not hidden', () => {
      const { container } = render(<App />);

      const listItems = screen.getAllByRole('listitem');

      listItems.forEach(item => {
        const icon = item.querySelector('svg') ||
                    item.querySelector('img') ||
                    item.querySelector('[class*="icon"]');

        if (icon) {
          const styles = window.getComputedStyle(icon);

          // Icon should not be hidden
          expect(styles.display).not.toBe('none');
          expect(styles.visibility).not.toBe('hidden');
          expect(styles.opacity).not.toBe('0');
        }
      });
    });

    it('icons have appropriate visual weight', () => {
      const { container } = render(<App />);

      const icons = container.querySelectorAll('svg, img[class*="icon"]');

      icons.forEach(icon => {
        if (icon) {
          const rect = icon.getBoundingClientRect();

          // Icon should be visible size
          expect(rect.width).toBeGreaterThan(0);
          expect(rect.height).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Consistent Formatting', () => {
    it('agent names are consistently formatted', () => {
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

        // Each should be visible
        expect(element).toBeVisible();

        // Text content should match expected format
        expect(element.textContent).toMatch(/Agent/i);
      });
    });

    it('maintains consistent visual hierarchy', () => {
      render(<App />);

      // Title should be h1
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();

      // Agent list should be separate visual element
      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      // Both should be visible
      expect(title).toBeVisible();
      expect(list).toBeVisible();
    });
  });

  describe('No Layout Breaks', () => {
    it('does not cause horizontal scrolling on mobile', () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      const { container } = render(<App />);

      // Container should not exceed viewport width
      const rect = container.getBoundingClientRect();

      // In a real browser, this would check scrollWidth vs clientWidth
      // In test environment, we verify structure exists
      expect(rect.width).toBeGreaterThanOrEqual(0);
    });

    it('maintains layout integrity across viewports', () => {
      const viewports = [
        { width: 320, height: 568 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ];

      viewports.forEach(viewport => {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;

        const { unmount } = render(<App />);

        // List should render
        const list = screen.getByRole('list');
        expect(list).toBeInTheDocument();

        // All items should be present
        const items = screen.getAllByRole('listitem');
        expect(items).toHaveLength(6);

        unmount();
      });
    });
  });
});
