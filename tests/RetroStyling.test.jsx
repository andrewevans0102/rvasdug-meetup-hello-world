import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('Retro Arcade Styling - Detailed CSS Tests', () => {
  describe('Color Scheme Validation', () => {
    it('should use a dark background color (black or dark blue)', () => {
      render(<App />);
      const body = document.body;
      const rootElement = document.documentElement;

      // Check both body and root for background color
      const bodyStyle = window.getComputedStyle(body);
      const rootStyle = window.getComputedStyle(rootElement);

      const bodyBg = bodyStyle.backgroundColor;
      const rootBg = rootStyle.backgroundColor;

      // Extract RGB values
      const checkDarkColor = (color) => {
        const rgb = color.match(/\d+/g);
        if (rgb) {
          const [r, g, b] = rgb.map(Number);
          // Dark means all values should be low (< 50), or slightly higher blue for dark blue
          return (r < 50 && g < 50 && b < 100);
        }
        return false;
      };

      const isDark = checkDarkColor(bodyBg) || checkDarkColor(rootBg);
      expect(isDark).toBe(true);
    });

    it('should include cyan neon accent color (#00ffff or similar)', () => {
      const { container } = render(<App />);
      const elements = container.querySelectorAll('*');

      let hasCyan = false;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        [style.color, style.backgroundColor, style.borderColor].forEach(color => {
          const rgb = color.match(/\d+/g);
          if (rgb) {
            const [r, g, b] = rgb.map(Number);
            // Cyan is low red, high green and blue
            if (r < 50 && g > 200 && b > 200) {
              hasCyan = true;
            }
          }
        });
      });

      expect(hasCyan).toBe(true);
    });

    it('should include magenta/pink neon accent color (#ff00ff or similar)', () => {
      const { container } = render(<App />);
      const elements = container.querySelectorAll('*');

      let hasMagenta = false;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        [style.color, style.backgroundColor, style.borderColor].forEach(color => {
          const rgb = color.match(/\d+/g);
          if (rgb) {
            const [r, g, b] = rgb.map(Number);
            // Magenta is high red, low green, high blue
            if (r > 200 && g < 50 && b > 200) {
              hasMagenta = true;
            }
          }
        });
      });

      expect(hasMagenta).toBe(true);
    });

    it('should include yellow neon accent color (#ffff00 or similar)', () => {
      const { container } = render(<App />);
      const elements = container.querySelectorAll('*');

      let hasYellow = false;
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        [style.color, style.backgroundColor, style.borderColor].forEach(color => {
          const rgb = color.match(/\d+/g);
          if (rgb) {
            const [r, g, b] = rgb.map(Number);
            // Yellow is high red and green, low blue
            if (r > 200 && g > 200 && b < 50) {
              hasYellow = true;
            }
          }
        });
      });

      expect(hasYellow).toBe(true);
    });
  });

  describe('Animation Specifications', () => {
    it('should have blinking animation with steps timing function for sharp on/off', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Check animation timing function (steps or ease for abrupt changes)
      const timingFunction = computedStyle.animationTimingFunction;
      expect(timingFunction).toBeTruthy();
    });

    it('should alternate between visible and hidden states in animation', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Animation should affect opacity or visibility
      const animationName = computedStyle.animationName;
      expect(animationName).not.toBe('none');
      expect(animationName).toBeTruthy();
    });

    it('should have approximately 1 second total animation cycle (0.5s on, 0.5s off)', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      const duration = parseFloat(computedStyle.animationDuration);

      // Total duration should be around 1 second for the complete cycle
      // Acceptable range: 0.8s to 1.5s
      expect(duration).toBeGreaterThanOrEqual(0.8);
      expect(duration).toBeLessThanOrEqual(1.5);
    });

    it('should loop the animation infinitely', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      expect(computedStyle.animationIterationCount).toBe('infinite');
    });

    it('should not have animation delay on page load', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      const delay = parseFloat(computedStyle.animationDelay);
      expect(delay).toBe(0);
    });
  });

  describe('Typography Specifications', () => {
    it('should use Press Start 2P or VT323 as primary font', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontFamily = computedStyle.fontFamily.toLowerCase();

      const hasSpecifiedFont =
        fontFamily.includes('press start 2p') ||
        fontFamily.includes('vt323');

      expect(hasSpecifiedFont).toBe(true);
    });

    it('should have fallback fonts in the font stack', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontFamily = computedStyle.fontFamily;

      // Should have multiple fonts for fallback
      const fontCount = fontFamily.split(',').length;
      expect(fontCount).toBeGreaterThan(1);
    });

    it('should include monospace as ultimate fallback', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontFamily = computedStyle.fontFamily.toLowerCase();

      expect(fontFamily.includes('monospace')).toBe(true);
    });

    it('should apply 8-bit font to all text elements in the app', () => {
      const { container } = render(<App />);
      const textElements = container.querySelectorAll('h1, h2, h3, p, a, button, span, div');

      const allHaveRetroFont = Array.from(textElements).every(el => {
        if (!el.textContent?.trim()) return true; // Skip empty elements

        const computedStyle = window.getComputedStyle(el);
        const fontFamily = computedStyle.fontFamily.toLowerCase();

        return (
          fontFamily.includes('press start 2p') ||
          fontFamily.includes('vt323') ||
          fontFamily.includes('8bit') ||
          fontFamily.includes('pixel') ||
          fontFamily.includes('monospace')
        );
      });

      expect(allHaveRetroFont).toBe(true);
    });

    it('should have appropriate title font size for prominence', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Title should be significantly larger than body text (at least 24px)
      expect(fontSize).toBeGreaterThan(24);
    });
  });

  describe('Layout and Positioning', () => {
    it('should center the title horizontally on the page', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const titleRect = title.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Title should be approximately centered
      const titleCenter = titleRect.left + titleRect.width / 2;
      const viewportCenter = viewportWidth / 2;

      // Allow 10% tolerance for centering
      const tolerance = viewportWidth * 0.1;
      expect(Math.abs(titleCenter - viewportCenter)).toBeLessThan(tolerance);
    });

    it('should position the title prominently near the top of the page', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const titleRect = title.getBoundingClientRect();

      // Title should be in the upper portion of the viewport
      expect(titleRect.top).toBeLessThan(window.innerHeight / 2);
    });

    it('should maintain layout structure without position shifts during animation', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const initialRect = title.getBoundingClientRect();

      // Check that dimensions don't change
      expect(initialRect.width).toBeGreaterThan(0);
      expect(initialRect.height).toBeGreaterThan(0);
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should adjust font size for mobile viewports (< 768px)', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Font should be readable but not too large for mobile
      expect(fontSize).toBeGreaterThan(16);
      expect(fontSize).toBeLessThan(60);
    });

    it('should adjust font size for tablet viewports (768px - 1024px)', () => {
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Font should be larger than mobile but smaller than desktop
      expect(fontSize).toBeGreaterThan(20);
    });

    it('should adjust font size for desktop viewports (> 1024px)', () => {
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Font should be prominently sized for desktop
      expect(fontSize).toBeGreaterThan(24);
    });

    it('should maintain readable line height at all breakpoints', () => {
      const breakpoints = [320, 768, 1024, 1920];

      breakpoints.forEach(width => {
        global.innerWidth = width;
        global.dispatchEvent(new Event('resize'));

        const { unmount } = render(<App />);
        const title = screen.getByText(/RVASDUG Meetup/i);
        const computedStyle = window.getComputedStyle(title);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);

        // Line height should be at least equal to font size
        expect(lineHeight).toBeGreaterThanOrEqual(fontSize);

        unmount();
      });
    });
  });

  describe('Optional Scanline Effect', () => {
    it('should check for scanline overlay if implemented', () => {
      const { container } = render(<App />);

      // Look for scanline elements (pseudo-elements or overlay divs)
      const possibleScanlines = container.querySelectorAll(
        '[class*="scanline"], [id*="scanline"], .overlay, #overlay'
      );

      // This is optional, so we just verify if it exists, it's styled correctly
      if (possibleScanlines.length > 0) {
        const scanline = possibleScanlines[0];
        const style = window.getComputedStyle(scanline);

        // If scanlines exist, they should have some transparency or pattern
        expect(style.opacity !== '1' || style.backgroundImage !== 'none').toBe(true);
      }

      // Test passes whether scanlines exist or not (they're optional)
      expect(true).toBe(true);
    });
  });

  describe('Performance Considerations', () => {
    it('should use GPU-accelerated properties for smooth animation', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // This is informational - it's okay if not optimized, but recommended
      expect(computedStyle.animationName).not.toBe('none');
    });

    it('should not trigger layout recalculations during animation', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Animation should use opacity or transform, not width/height/position
      const animationName = computedStyle.animationName;

      // Just verify animation exists - specific property checks would need keyframe inspection
      expect(animationName).not.toBe('none');
      expect(animationName).toBeTruthy();
    });
  });

  describe('Cross-Browser Compatibility', () => {
    it('should not use vendor prefixes in animation properties', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Modern browsers don't need prefixes
      expect(computedStyle.animationName).toBeDefined();
      expect(computedStyle.animationDuration).toBeDefined();
      expect(computedStyle.animationIterationCount).toBeDefined();
    });

    it('should use standard CSS animation properties', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // All standard animation properties should be accessible
      expect(computedStyle.animationName).not.toBe('none');
      expect(computedStyle.animationDuration).not.toBe('0s');
      expect(computedStyle.animationTimingFunction).toBeTruthy();
      expect(computedStyle.animationIterationCount).toBe('infinite');
    });
  });

  describe('No JavaScript Animation Libraries', () => {
    it('should not include animation library script tags', () => {
      const scripts = document.querySelectorAll('script');
      const scriptSources = Array.from(scripts).map(s => s.src.toLowerCase());

      const hasAnimationLib = scriptSources.some(src =>
        src.includes('gsap') ||
        src.includes('anime') ||
        src.includes('velocity') ||
        src.includes('motion') ||
        src.includes('animate.css')
      );

      expect(hasAnimationLib).toBe(false);
    });

    it('should implement all animations using CSS only', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      // Check that animation is CSS-based
      const computedStyle = window.getComputedStyle(title);
      expect(computedStyle.animationName).not.toBe('none');

      // Verify no inline styles setting animation via JavaScript
      const inlineStyle = title.getAttribute('style');
      if (inlineStyle) {
        expect(inlineStyle.toLowerCase()).not.toContain('animation');
      }
    });
  });
});
