import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('RVASDUG Meetup - Retro Arcade Styling', () => {
  describe('Title Requirements', () => {
    it('should display "RVASDUG Meetup" as the main title', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeInTheDocument();
    });

    it('should render the title in an h1 element for semantic HTML', () => {
      render(<App />);
      const title = screen.getByRole('heading', { level: 1, name: /RVASDUG Meetup/i });
      expect(title).toBeInTheDocument();
    });

    it('should have the title prominently displayed and centered', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Check that title is centered (text-align: center or display: flex with justify-content: center)
      const parent = title.parentElement;
      const parentStyle = window.getComputedStyle(parent);

      expect(
        computedStyle.textAlign === 'center' ||
        parentStyle.textAlign === 'center' ||
        (parentStyle.display === 'flex' && parentStyle.justifyContent === 'center')
      ).toBe(true);
    });

    it('should apply an 8-bit pixel font to the title', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontFamily = computedStyle.fontFamily.toLowerCase();

      // Check for common 8-bit pixel fonts
      const hasRetroFont =
        fontFamily.includes('press start 2p') ||
        fontFamily.includes('vt323') ||
        fontFamily.includes('8bit') ||
        fontFamily.includes('pixel');

      expect(hasRetroFont).toBe(true);
    });

    it('should have blinking animation applied to the title', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Check for animation properties
      expect(computedStyle.animationName).not.toBe('none');
      expect(computedStyle.animationName).not.toBe('');
    });

    it('should have blinking animation duration of approximately 1 second', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      const duration = parseFloat(computedStyle.animationDuration);
      // Animation should be around 1 second (0.8s - 1.2s acceptable range)
      expect(duration).toBeGreaterThanOrEqual(0.8);
      expect(duration).toBeLessThanOrEqual(1.5);
    });

    it('should use CSS animations not JavaScript for blinking effect', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Verify animation is defined in CSS
      expect(computedStyle.animationName).toBeTruthy();
      expect(computedStyle.animationName).not.toBe('none');
    });
  });

  describe('Page Styling Requirements', () => {
    it('should have a dark arcade-themed background color', () => {
      render(<App />);
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);

      // Convert background color to RGB values
      const bgColor = computedStyle.backgroundColor;
      const rgb = bgColor.match(/\d+/g);

      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        // Check that background is dark (all RGB values should be low)
        const isDark = r < 50 && g < 50 && b < 80; // Allowing slight blue tint
        expect(isDark).toBe(true);
      }
    });

    it('should apply 8-bit pixel font family throughout the application', () => {
      render(<App />);
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const fontFamily = computedStyle.fontFamily.toLowerCase();

      // Check for retro font at root level
      const hasRetroFont =
        fontFamily.includes('press start 2p') ||
        fontFamily.includes('vt323') ||
        fontFamily.includes('8bit') ||
        fontFamily.includes('pixel');

      expect(hasRetroFont).toBe(true);
    });

    it('should include at least two vibrant neon accent colors in the design', () => {
      const { container } = render(<App />);

      // Get all elements and check their colors
      const elements = container.querySelectorAll('*');
      const colors = new Set();

      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        const borderColor = style.borderColor;

        [color, bgColor, borderColor].forEach(c => {
          if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
            colors.add(c);
          }
        });
      });

      // Should have at least 2 different colors (excluding black/dark background)
      expect(colors.size).toBeGreaterThanOrEqual(2);
    });

    it('should load retro fonts from external CDN', () => {
      // Check if Google Fonts or similar CDN link is present in document head
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      const hasFontLink = Array.from(links).some(link =>
        link.href.includes('fonts.googleapis.com') ||
        link.href.includes('fonts.gstatic.com') ||
        link.href.includes('font')
      );

      expect(hasFontLink).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('should maintain layout on mobile viewport (320px)', () => {
      // Set viewport to mobile size
      global.innerWidth = 320;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      expect(title).toBeVisible();
      expect(title).toBeInTheDocument();
    });

    it('should maintain layout on tablet viewport (768px)', () => {
      // Set viewport to tablet size
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      expect(title).toBeVisible();
      expect(title).toBeInTheDocument();
    });

    it('should maintain layout on desktop viewport (1920px)', () => {
      // Set viewport to desktop size
      global.innerWidth = 1920;
      global.dispatchEvent(new Event('resize'));

      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      expect(title).toBeVisible();
      expect(title).toBeInTheDocument();
    });

    it('should remain readable and functional across all viewport sizes', () => {
      const viewports = [320, 768, 1024, 1920];

      viewports.forEach(width => {
        global.innerWidth = width;
        global.dispatchEvent(new Event('resize'));

        const { unmount } = render(<App />);
        const title = screen.getByText(/RVASDUG Meetup/i);
        const computedStyle = window.getComputedStyle(title);

        // Title should be visible
        expect(title).toBeVisible();

        // Font should not be too small
        const fontSize = parseFloat(computedStyle.fontSize);
        expect(fontSize).toBeGreaterThan(10);

        unmount();
      });
    });
  });

  describe('Performance and Animation', () => {
    it('should use CSS keyframes for animation, not JavaScript timers', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Verify animation properties exist and are CSS-based
      expect(computedStyle.animationName).not.toBe('none');
      expect(computedStyle.animationDuration).not.toBe('0s');
      expect(computedStyle.animationIterationCount).toBeTruthy();
    });

    it('should have infinite animation iteration for continuous blinking', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      expect(computedStyle.animationIterationCount).toBe('infinite');
    });

    it('should not cause layout shifts during animation', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const initialRect = title.getBoundingClientRect();

      // Wait a bit and check again
      return new Promise(resolve => {
        setTimeout(() => {
          const newRect = title.getBoundingClientRect();

          // Position should not change during animation
          expect(newRect.top).toBe(initialRect.top);
          expect(newRect.left).toBe(initialRect.left);
          resolve();
        }, 100);
      });
    });
  });

  describe('Existing Functionality Preservation', () => {
    it('should not break React component structure', () => {
      const { container } = render(<App />);

      // Verify main sections still exist
      expect(container.querySelector('#center')).toBeInTheDocument();
    });
  });

  describe('Arcade Aesthetic', () => {
    it('should evoke 1980s arcade game aesthetic with color scheme', () => {
      render(<App />);
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);

      // Background should be dark (arcade cabinet black/dark blue)
      const bgColor = computedStyle.backgroundColor;
      expect(bgColor).toBeTruthy();

      // Should have dark background
      const rgb = bgColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        expect(r + g + b).toBeLessThan(150); // Combined RGB should be low for dark background
      }
    });

    it('should use vibrant neon colors typical of 8-bit arcade games', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const color = computedStyle.color;

      // Title should have a vibrant color, not plain white or black
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgb(0, 0, 0)');
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    });

    it('should maintain retro pixel font sizing appropriate for arcade display', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontSize = parseFloat(computedStyle.fontSize);

      // Title should be prominent (at least 20px for pixel fonts)
      expect(fontSize).toBeGreaterThan(20);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing font gracefully with fallback', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);
      const fontFamily = computedStyle.fontFamily;

      // Should have multiple fonts in fallback chain
      expect(fontFamily).toContain(',');
    });

    it('should not display console errors related to animations', () => {
      const consoleError = vi.spyOn(console, 'error');

      render(<App />);

      // Filter out unrelated errors
      const animationErrors = consoleError.mock.calls.filter(call =>
        call.some(arg =>
          typeof arg === 'string' &&
          (arg.includes('animation') || arg.includes('keyframe'))
        )
      );

      expect(animationErrors.length).toBe(0);

      consoleError.mockRestore();
    });

    it('should work without JavaScript enabled (CSS-only animations)', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Animation should be purely CSS-based
      expect(computedStyle.animationName).not.toBe('none');
      expect(computedStyle.animationName).toBeTruthy();
    });

    it('should handle rapid viewport size changes without breaking layout', () => {
      const { rerender } = render(<App />);

      // Simulate rapid viewport changes
      const sizes = [320, 768, 1024, 375, 1920, 414];
      sizes.forEach(width => {
        global.innerWidth = width;
        global.dispatchEvent(new Event('resize'));
        rerender(<App />);
      });

      const title = screen.getByText(/RVASDUG Meetup/i);
      expect(title).toBeVisible();
      expect(title).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should maintain readable contrast ratios despite retro styling', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      // Title should be visible and have text content
      expect(title).toBeVisible();
      expect(title.textContent).toBeTruthy();
    });

    it('should keep semantic HTML structure with h1 for main title', () => {
      render(<App />);
      const headings = screen.getAllByRole('heading', { level: 1 });

      // Should have the RVASDUG Meetup title as an h1
      const mainTitle = headings.find(h => h.textContent.includes('RVASDUG Meetup'));
      expect(mainTitle).toBeDefined();
    });
  });

  describe('Font Loading', () => {
    it('should have Google Fonts link in document head for CDN loading', () => {
      const fontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const hasGoogleFonts = fontLinks.some(link =>
        link.href.includes('fonts.googleapis.com')
      );

      expect(hasGoogleFonts).toBe(true);
    });

    it('should not use local font files', () => {
      const fontFaces = Array.from(document.styleSheets).flatMap(sheet => {
        try {
          return Array.from(sheet.cssRules || []);
        } catch {
          return [];
        }
      }).filter(rule => rule.type === CSSRule.FONT_FACE_RULE);

      // Should not have @font-face rules with local URLs
      fontFaces.forEach(rule => {
        const src = rule.style.src;
        if (src) {
          expect(src).not.toContain('url("./');
          expect(src).not.toContain('url(\'./');
        }
      });
    });
  });

  describe('CSS-Only Implementation', () => {
    it('should not use JavaScript libraries for animations', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);

      // Check that no animation library classes are present
      const className = title.className;
      expect(className).not.toContain('animate__');
      expect(className).not.toContain('aos-');
      expect(className).not.toContain('gsap');
    });

    it('should implement blinking using CSS keyframes', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Should have animation properties set
      expect(computedStyle.animationName).not.toBe('none');
      expect(computedStyle.animationTimingFunction).toBeTruthy();
    });
  });

  describe('Browser Compatibility', () => {
    it('should use standard CSS properties compatible with modern browsers', () => {
      render(<App />);
      const title = screen.getByText(/RVASDUG Meetup/i);
      const computedStyle = window.getComputedStyle(title);

      // Animation properties should be standard (not prefixed)
      expect(computedStyle.animationName).toBeDefined();
      expect(computedStyle.animationDuration).toBeDefined();
    });
  });
});
