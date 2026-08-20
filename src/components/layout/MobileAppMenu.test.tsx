import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileAppMenu } from './MobileAppMenu';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

vi.mock('@/components/i18n/LocaleSwitcher', () => ({
  LocaleSwitcher: () => <div>Language switcher</div>,
}));

vi.mock('@/features/auth/logout/LogoutButton', () => ({
  LogoutButton: () => <button type="button">Log out</button>,
}));

vi.mock('./AppShellNavigation', () => ({
  AppShellNavigation: ({ onNavigate }: { onNavigate?: () => void }) => (
    <button type="button" onClick={onNavigate}>
      Dashboard navigation
    </button>
  ),
}));

describe('MobileAppMenu', () => {
  it('renders its menu through the document body and keeps portal content interactive', async () => {
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
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/settings',
    );

    if (panel) {
      fireEvent.pointerDown(panel);
    }

    expect(screen.getByText('user@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Settings' }));

    expect(document.getElementById('mobile-app-menu')).toBeNull();
  });
});
