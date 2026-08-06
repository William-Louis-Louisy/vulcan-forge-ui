import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import { LocaleSwitcher } from './LocaleSwitcher';

const navigationMocks = vi.hoisted(() => ({
  replace: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/login',
  useRouter: () => ({
    replace: navigationMocks.replace,
  }),
}));

beforeEach(() => {
  navigationMocks.replace.mockReset();
  window.history.replaceState(
    {},
    '',
    '/en/login?reason=authentication-required&returnTo=%2Fen%2Fapp%2Fprojects%2Fproject-1%2Ftokens%3Fset%3Dcolor',
  );
});

describe('LocaleSwitcher', () => {
  it('localizes the validated return target and preserves other query values', async () => {
    const user = userEvent.setup();

    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <LocaleSwitcher />
      </NextIntlClientProvider>,
    );

    await user.click(
      screen.getByRole('button', {
        name: /switch to french/i,
      }),
    );

    expect(navigationMocks.replace).toHaveBeenCalledWith(
      '/login?reason=authentication-required&returnTo=%2Ffr%2Fapp%2Fprojects%2Fproject-1%2Ftokens%3Fset%3Dcolor',
      { locale: 'fr' },
    );
  });
});
