import { ThemeSwitcher } from './ThemeSwitcher';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

describe('ThemeSwitcher', () => {
  it('renders accessible theme mode controls', () => {
    render(
      <ThemeSwitcher
        modes={['light', 'dark']}
        activeMode="light"
        labels={{
          groupLabel: 'Preview theme mode',
          modes: {
            light: 'Light theme',
            dark: 'Dark theme',
          },
        }}
        onModeChange={() => undefined}
      />,
    );

    expect(
      screen.getByRole('group', { name: 'Preview theme mode' }),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Light theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    expect(screen.getByRole('button', { name: 'Dark theme' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onModeChange when another mode is selected', () => {
    const onModeChange = vi.fn();

    render(
      <ThemeSwitcher
        modes={['light', 'dark']}
        activeMode="light"
        labels={{
          groupLabel: 'Preview theme mode',
          modes: {
            light: 'Light theme',
            dark: 'Dark theme',
          },
        }}
        onModeChange={onModeChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dark theme' }));

    expect(onModeChange).toHaveBeenCalledWith('dark');
  });
});
