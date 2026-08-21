import type { AnchorHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileAppMenu } from './MobileAppMenu';

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

vi.mock('@/features/auth/logout/LogoutButton', () => ({
  LogoutButton: () => <button type="button">Log out</button>,
}));

vi.mock('./AppShellNavigation', () => ({
  AppShellNavigation: ({
    onNavigate,
    variant,
  }: {
    onNavigate?: () => void;
    variant?: string;
  }) => (
    <button type="button" data-variant={variant} onClick={onNavigate}>
      Dashboard navigation
    </button>
  ),
}));

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

describe('MobileAppMenu', () => {
  it('renders the same fullscreen body-level navigation pattern as the public menu', async () => {
    const user = userEvent.setup();

    render(
      <MobileAppMenu
        userEmail="user@example.com"
        ariaLabel="Application navigation"
        accountLabel="Account"
        settingsLabel="Settings"
        navigationLabel="Application navigation"
        navigationItems={{ dashboard: 'Dashboard' }}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Application navigation' }),
    );

    const panel = document.getElementById('mobile-app-menu');

    expect(panel).not.toBeNull();
    expect(panel?.parentElement).toBe(document.body);
    expect(panel).toHaveClass(
      'bg-background-app',
      'inset-x-0',
      'top-12',
      'bottom-0',
    );
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Dashboard navigation' }),
    ).toHaveAttribute('data-variant', 'fullscreen');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/settings',
    );

    await act(async () => {
      mobileVisualViewport.dispatchEvent(new Event('scroll'));
    });

    expect(document.getElementById('mobile-app-menu')).not.toBeNull();

    if (panel) {
      fireEvent.pointerDown(panel);
    }

    expect(screen.getByText('user@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Settings' }));

    expect(document.getElementById('mobile-app-menu')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes after switching locale', async () => {
    const user = userEvent.setup();

    render(
      <MobileAppMenu
        userEmail="user@example.com"
        ariaLabel="Application navigation"
        accountLabel="Account"
        settingsLabel="Settings"
        navigationLabel="Application navigation"
        navigationItems={{ dashboard: 'Dashboard' }}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Application navigation' }),
    );
    await user.click(screen.getByRole('button', { name: 'Switch language' }));

    expect(document.getElementById('mobile-app-menu')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
});
