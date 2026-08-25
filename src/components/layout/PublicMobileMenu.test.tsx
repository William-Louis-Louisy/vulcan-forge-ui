import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublicMobileMenu } from './PublicMobileMenu';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

vi.mock('@/components/i18n/LocaleSwitcher', () => ({
  LocaleSwitcher: ({ onLocaleChange }: { onLocaleChange?: () => void }) => (
    <button type="button" onClick={onLocaleChange}>
      Switch language
    </button>
  ),
}));

vi.mock('./PublicButtonLink', () => ({
  PublicButtonLink: ({
    href,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...props} />,
}));

const labels = {
  close: 'Close navigation menu',
  dashboard: 'Dashboard',
  example: 'Example',
  getStarted: 'Start for free',
  learn: 'Learn',
  navigation: 'Public navigation',
  open: 'Open navigation menu',
  pricing: 'Pricing',
  product: 'Product',
  signIn: 'Sign in',
};

let mobileVisualViewport: EventTarget;

beforeEach(() => {
  document.body.style.overflow = '';
  mobileVisualViewport = new EventTarget();
  vi.stubGlobal('visualViewport', mobileVisualViewport);
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList),
  );
});

describe('PublicMobileMenu', () => {
  it('opens the shared fullscreen body-level navigation and only closes through explicit menu actions', async () => {
    const user = userEvent.setup();

    render(<PublicMobileMenu isAuthenticated={false} labels={labels} />);

    await user.click(screen.getByRole('button', { name: labels.open }));

    const panel = document.getElementById('public-mobile-menu');

    expect(panel).not.toBeNull();
    expect(panel?.parentElement).toBe(document.body);
    expect(panel).toHaveClass(
      'bg-background-app',
      'inset-x-0',
      'top-14',
      'bottom-0',
    );
    expect(
      screen.getByRole('navigation', { name: labels.navigation }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: labels.product })).toHaveAttribute(
      'href',
      '/#product',
    );
    expect(screen.getByRole('link', { name: labels.pricing })).toHaveAttribute(
      'href',
      '/pricing',
    );
    expect(screen.getByRole('link', { name: labels.example })).toHaveAttribute(
      'href',
      '/examples',
    );
    expect(screen.getByRole('link', { name: labels.learn })).toHaveAttribute(
      'href',
      '/learn',
    );
    expect(document.body.style.overflow).toBe('hidden');

    mobileVisualViewport.dispatchEvent(new Event('scroll'));
    fireEvent.pointerDown(document.body);
    fireEvent.scroll(document);

    expect(
      screen.getByRole('navigation', { name: labels.navigation }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: labels.learn }));

    expect(
      screen.queryByRole('navigation', { name: labels.navigation }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('supports legacy MediaQueryList listeners used by some mobile browsers', async () => {
    const user = userEvent.setup();
    const addListener = vi.fn();
    const removeListener = vi.fn();

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        addListener,
        removeListener,
      } as unknown as MediaQueryList),
    );

    render(<PublicMobileMenu isAuthenticated={false} labels={labels} />);

    expect(addListener).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: labels.open }));

    expect(document.getElementById('public-mobile-menu')).not.toBeNull();
  });

  it('closes after switching locale', async () => {
    const user = userEvent.setup();

    render(<PublicMobileMenu isAuthenticated={false} labels={labels} />);

    await user.click(screen.getByRole('button', { name: labels.open }));
    await user.click(screen.getByRole('button', { name: 'Switch language' }));

    expect(
      screen.queryByRole('navigation', { name: labels.navigation }),
    ).not.toBeInTheDocument();
  });

  it('shows only the dashboard account action when authenticated', async () => {
    const user = userEvent.setup();

    render(<PublicMobileMenu isAuthenticated labels={labels} />);

    await user.click(screen.getByRole('button', { name: labels.open }));

    expect(
      screen.getByRole('link', { name: labels.dashboard }),
    ).toHaveAttribute('href', '/app');
    expect(screen.queryByRole('link', { name: labels.signIn })).toBeNull();
    expect(screen.queryByRole('link', { name: labels.getStarted })).toBeNull();
  });
});
