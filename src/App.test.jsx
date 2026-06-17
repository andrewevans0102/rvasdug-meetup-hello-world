import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('maintains the counter button functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole('button', { name: /count is 0/i });
    expect(button).toBeInTheDocument();

    await user.click(button);

    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    const { container } = render(<App />);

    expect(container.querySelector('#center')).toBeInTheDocument();
    expect(container.querySelector('#next-steps')).toBeInTheDocument();
    expect(container.querySelector('#docs')).toBeInTheDocument();
    expect(container.querySelector('#social')).toBeInTheDocument();
  });

  it('preserves documentation and social sections', () => {
    render(<App />);

    expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect with us/i)).toBeInTheDocument();
  });
});
