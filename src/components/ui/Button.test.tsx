import { Button } from './Button';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

describe('Button', () => {
  it('renders an accessible button with its label', () => {
    render(<Button>Create a design system</Button>);

    expect(
      screen.getByRole('button', { name: /create a design system/i }),
    ).toBeInTheDocument();
  });

  it('uses type button by default', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: /save/i })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
