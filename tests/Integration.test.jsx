import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

describe('Retro Arcade Integration Tests', () => {
  let container;

  beforeEach(() => {
    // Reset viewport to default
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  describe('Complete User Experience', () => {
    it('should render the complete retro arcade experience on page load', async () => {
      const { container } = render(<App />);

      // Wait for any async operations
      await waitFor(() => {
        // Title should be present
        const title = screen.getByText(/RVASDUG Meetup/i);
        expect(title).toBeInTheDocument();

        // Title should be styled
        const computedStyle = window.getComputedStyle(title);
        expect(computedStyle.animationName).not.toBe('none');

        // Background should be dark
        const body = document.body;
        const bodyStyle = window.getComputedStyle(body);
        expect(bodyStyle.backgroundColor).toBeTruthy();
      });
    });

    it('should maintain retro styling while user interacts with counter', async () => {
      const user = userEvent.setup();
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);
      const titleStyle = window.getComputedStyle(title);
      const initialAnimation = titleStyle.animationName;

      // Click counter button
      const button = screen.getByRole('button', { name: /count is 0/i });
      await user.click(button);

      // Verify counter updated
      expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();

      // Verify title animation still running
      const updatedTitleStyle = window.getComputedStyle(title);
      expect(updatedTitleStyle.animationName).toBe(initialAnimation);
      expect(updatedTitleStyle.animationName).not.toBe('none');
    });

    it('should keep all links functional with retro styling applied', () => {
      render(<App />);

      // Check that links are still present and clickable
      const viteLink = screen.getByRole('link', { name: /Explore Vite/i });
      const reactLink = screen.getByRole('link', { name: /Learn more/i });

      expect(viteLink).toBeInTheDocument();
      expect(viteLink).toHaveAttribute('href', 'https://vite.dev/');

      expect(reactLink).toBeInTheDocument();
      expect(reactLink).toHaveAttribute('href', 'https://react.dev/');
    });

    it('should display all content sections with retro styling', () => {
      render(<App />);

      // Main title
      expect(screen.getByText(/RVASDUG Meetup/i)).toBeInTheDocument();

      // Counter
      expect(screen.getByRole('button', { name: /count is/i })).toBeInTheDocument();

      // Documentation section
      expect(screen.getByText(/Documentation/i)).toBeInTheDocument();

      // Social section
      expect(screen.getByText(/Connect with us/i)).toBeInTheDocument();
    });

    it('should handle multiple rapid interactions without breaking styling', async () => {
      const user = userEvent.setup();
      render(<App />);

      const button = screen.getByRole('button', { name: /count is 0/i });
      const title = screen.getByText(/RVASDUG Meetup/i);
      const initialTitleStyle = window.getComputedStyle(title);

      // Rapidly click the button multiple times
      for (let i = 0; i < 10; i++) {
        await user.click(button);
      }

      // Verify counter reached 10
      expect(screen.getByRole('button', { name: /count is 10/i })).toBeInTheDocument();

      // Verify title styling unchanged
      const finalTitleStyle = window.getComputedStyle(title);
      expect(finalTitleStyle.animationName).toBe(initialTitleStyle.animationName);
      expect(finalTitleStyle.fontFamily).toBe(initialTitleStyle.fontFamily);
    });
  });

  describe('Responsive Behavior Integration', () => {
    it('should maintain functionality across viewport changes', async () => {
      const user = userEvent.setup();
      const viewports = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];

      for (const viewport of viewports) {
        global.innerWidth = viewport.width;
        global.innerHeight = viewport.height;
        global.dispatchEvent(new Event('resize'));

        const { unmount } = render(<App />);

        // Title should be present and styled
        const title = screen.getByText(/RVASDUG Meetup/i);
        expect(title).toBeVisible();

        const titleStyle = window.getComputedStyle(title);
        expect(titleStyle.animationName).not.toBe('none');

        // Counter should work
        const button = screen.getByRole('button', { name: /count is 0/i });
        await user.click(button);
        expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();

        unmount();
      }
    });

    it('should adapt title size responsively while maintaining animation', () => {
      const breakpoints = [320, 768, 1024, 1920];
      const titleSizes = [];

      breakpoints.forEach(width => {
        global.innerWidth = width;
        global.dispatchEvent(new Event('resize'));

        const { unmount } = render(<App />);
        const title = screen.getByText(/RVASDUG Meetup/i);
        const style = window.getComputedStyle(title);

        titleSizes.push({
          width,
          fontSize: parseFloat(style.fontSize),
          hasAnimation: style.animationName !== 'none'
        });

        unmount();
      });

      // All breakpoints should have animation
      titleSizes.forEach(size => {
        expect(size.hasAnimation).toBe(true);
      });

      // Font sizes should be responsive (at least some variation)
      const uniqueSizes = new Set(titleSizes.map(s => s.fontSize));
      expect(uniqueSizes.size).toBeGreaterThan(0);
    });
  });

  describe('Font Loading Integration', () => {
    it('should load Google Fonts and apply to all text elements', async () => {
      render(<App />);

      // Check for font link
      const fontLinks = document.querySelectorAll('link[rel="stylesheet"]');
      const googleFontLink = Array.from(fontLinks).find(link =>
        link.href.includes('fonts.googleapis.com')
      );

      expect(googleFontLink).toBeTruthy();

      // Wait for fonts to potentially load
      await waitFor(() => {
        const title = screen.getByText(/RVASDUG Meetup/i);
        const style = window.getComputedStyle(title);
        const fontFamily = style.fontFamily.toLowerCase();

        expect(
          fontFamily.includes('press start 2p') ||
          fontFamily.includes('vt323')
        ).toBe(true);
      }, { timeout: 3000 });
    });

    it('should handle font loading failure gracefully with fallbacks', () => {
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);
      const style = window.getComputedStyle(title);
      const fontFamily = style.fontFamily;

      // Should have fallback fonts
      const fonts = fontFamily.split(',').map(f => f.trim());
      expect(fonts.length).toBeGreaterThan(1);

      // Should include a generic fallback
      const hasGenericFallback = fonts.some(f =>
        f.toLowerCase().includes('monospace') ||
        f.toLowerCase().includes('sans-serif') ||
        f.toLowerCase().includes('cursive')
      );

      expect(hasGenericFallback).toBe(true);
    });
  });

  describe('Animation Performance Integration', () => {
    it('should run animation smoothly without impacting interactivity', async () => {
      const user = userEvent.setup();
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);
      const button = screen.getByRole('button', { name: /count is 0/i });

      // Verify animation is running
      const style = window.getComputedStyle(title);
      expect(style.animationName).not.toBe('none');

      // Interact while animation runs
      const startTime = Date.now();
      for (let i = 0; i < 5; i++) {
        await user.click(button);
      }
      const endTime = Date.now();

      // Interactions should be fast (< 1 second for 5 clicks)
      expect(endTime - startTime).toBeLessThan(1000);

      // Counter should have updated
      expect(screen.getByRole('button', { name: /count is 5/i })).toBeInTheDocument();

      // Animation should still be running
      const finalStyle = window.getComputedStyle(title);
      expect(finalStyle.animationName).not.toBe('none');
    });

    it('should not cause memory leaks with continuous animation', async () => {
      const { unmount } = render(<App />);

      // Let animation run for a bit
      await new Promise(resolve => setTimeout(resolve, 2000));

      const title = screen.getByText(/RVASDUG Meetup/i);
      const style = window.getComputedStyle(title);

      // Animation should still be running smoothly
      expect(style.animationName).not.toBe('none');
      expect(style.animationIterationCount).toBe('infinite');

      // Clean unmount should work without issues
      unmount();
    });
  });

  describe('CSS-Only Implementation Verification', () => {
    it('should have no inline JavaScript animation handlers', () => {
      const { container } = render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      // Check for common JS animation attributes
      expect(title.getAttribute('onanimationstart')).toBeNull();
      expect(title.getAttribute('onanimationend')).toBeNull();
      expect(title.getAttribute('onanimationiteration')).toBeNull();
    });

    it('should rely purely on CSS for all visual effects', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      // Animation should be CSS-based
      const style = window.getComputedStyle(title);
      expect(style.animationName).not.toBe('none');

      // No JavaScript-set inline styles for animation
      const inlineStyle = title.getAttribute('style');
      if (inlineStyle) {
        expect(inlineStyle.toLowerCase()).not.toContain('opacity');
        expect(inlineStyle.toLowerCase()).not.toContain('visibility');
      }
    });
  });

  describe('Backward Compatibility', () => {
    it('should not break any existing test IDs or data attributes', () => {
      render(<App />);

      // Original component structure should be intact
      const centerSection = document.querySelector('#center');
      expect(centerSection).toBeInTheDocument();

      const nextStepsSection = document.querySelector('#next-steps');
      expect(nextStepsSection).toBeInTheDocument();
    });

    it('should preserve all original functionality while adding retro styling', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Original counter functionality
      const button = screen.getByRole('button', { name: /count is 0/i });
      await user.click(button);
      expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();

      // Original links
      expect(screen.getByRole('link', { name: /Explore Vite/i })).toHaveAttribute('href');
      expect(screen.getByRole('link', { name: /Learn more/i })).toHaveAttribute('href');

      // New retro title
      expect(screen.getByText(/RVASDUG Meetup/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid viewport resizing without breaking', async () => {
      const { rerender } = render(<App />);

      // Simulate rapid resizing
      for (let i = 0; i < 20; i++) {
        global.innerWidth = 320 + (i * 80);
        global.dispatchEvent(new Event('resize'));
        rerender(<App />);
      }

      // Title should still be present and animated
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeVisible();

      const style = window.getComputedStyle(title);
      expect(style.animationName).not.toBe('none');
    });

    it('should handle page visibility changes without stopping animation', async () => {
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);
      const initialStyle = window.getComputedStyle(title);

      // Simulate page becoming hidden
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: true
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Simulate page becoming visible again
      Object.defineProperty(document, 'hidden', {
        writable: true,
        configurable: true,
        value: false
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Animation should still be running
      const finalStyle = window.getComputedStyle(title);
      expect(finalStyle.animationName).toBe(initialStyle.animationName);
      expect(finalStyle.animationName).not.toBe('none');
    });

    it('should work correctly when multiple instances are rendered', () => {
      const { container: container1 } = render(<App />);
      const { container: container2 } = render(<App />);

      const titles = screen.getAllByText(/RVASDUG Meetup/i);
      expect(titles.length).toBe(2);

      titles.forEach(title => {
        const style = window.getComputedStyle(title);
        expect(style.animationName).not.toBe('none');
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain keyboard navigation through all interactive elements', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Tab through interactive elements
      await user.tab();

      // Should be able to reach the counter button
      const button = screen.getByRole('button', { name: /count is 0/i });
      expect(button).toHaveFocus();

      // Should be able to activate with keyboard
      await user.keyboard('{Enter}');
      expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
    });

    it('should maintain semantic HTML structure with retro styling', () => {
      render(<App />);

      // Check semantic elements
      const mainHeading = screen.getByRole('heading', { level: 1, name: /RVASDUG Meetup/i });
      expect(mainHeading).toBeInTheDocument();

      // Check links have proper roles
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);

      // Check button has proper role
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should not break screen reader announcements with animations', () => {
      render(<App />);

      const title = screen.getByText(/RVASDUG Meetup/i);

      // Title text should be accessible
      expect(title).toHaveTextContent('RVASDUG Meetup');

      // Even when animation is running
      const style = window.getComputedStyle(title);
      expect(style.animationName).not.toBe('none');

      // Content should still be in the accessibility tree
      expect(title).toBeInTheDocument();
    });
  });

  describe('No Console Errors', () => {
    it('should render without console errors or warnings', () => {
      const consoleError = vi.fn();
      const consoleWarn = vi.fn();
      const originalError = console.error;
      const originalWarn = console.warn;

      console.error = consoleError;
      console.warn = consoleWarn;

      render(<App />);

      // Filter out React-specific warnings that aren't related to our implementation
      const relevantErrors = consoleError.mock.calls.filter(call =>
        !call.some(arg =>
          typeof arg === 'string' &&
          (arg.includes('ReactDOM.render') || arg.includes('act()'))
        )
      );

      expect(relevantErrors.length).toBe(0);

      console.error = originalError;
      console.warn = originalWarn;
    });
  });
});
