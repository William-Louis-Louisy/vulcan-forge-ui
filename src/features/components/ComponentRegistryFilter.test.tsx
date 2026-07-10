import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ComponentRegistryFilter } from './ComponentRegistryFilter';

const navigationMocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('component=button'),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/app/projects/demo/components',
  useRouter: () => ({
    replace: navigationMocks.replace,
  }),
}));

afterEach(() => {
  vi.useRealTimers();
  navigationMocks.replace.mockReset();
});

describe('ComponentRegistryFilter', () => {
  it('filters after a short debounce and exposes a submit button', () => {
    vi.useFakeTimers();

    render(
      <ComponentRegistryFilter
        value=""
        placeholder="Filter..."
        submitLabel="Filter components"
      />,
    );

    fireEvent.change(screen.getByRole('searchbox'), {
      target: {
        value: 'card',
      },
    });

    expect(navigationMocks.replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(navigationMocks.replace).toHaveBeenCalledWith(
      '/app/projects/demo/components?component=button&q=card',
      { scroll: false },
    );
    expect(
      screen.getByRole('button', { name: 'Filter components' }),
    ).toBeInTheDocument();
  });
});
