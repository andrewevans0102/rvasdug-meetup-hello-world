import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component - Retro Arcade Implementation', () => {
  it('renders the RVASDUG Meetup title', () => {
    render(<App />);
    const title = screen.getByText(/RVASDUG Meetup/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the title as an h1 element', () => {
    render(<App />);
    const title = screen.getByRole('heading', { level: 1, name: /RVASDUG Meetup/i });
    expect(title).toBeInTheDocument();
  });

  it('applies the blinking-title class to the h1', () => {
    render(<App />);
    const title = screen.getByText(/RVASDUG Meetup/i);
    expect(title).toHaveClass('blinking-title');
  });
});
