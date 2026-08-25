import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import { publicSurfaceMessages } from '@/messages/public-surface-messages';
import { learnMessages } from '@/messages/learn-messages';
import { PublicFooter } from './PublicFooter';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

const messages = {
  ...publicSurfaceMessages.en,
  PublicFooter: {
    ...publicSurfaceMessages.en.PublicFooter,
    ...learnMessages.en.PublicFooter,
  },
};

describe('PublicFooter', () => {
  it('keeps core public destinations reachable from footer navigation', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <PublicFooter />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole('link', { name: 'Product example' }),
    ).toHaveAttribute('href', '/examples');
    expect(screen.getByRole('link', { name: 'Learn' })).toHaveAttribute(
      'href',
      '/learn',
    );
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute(
      'href',
      '/terms',
    );
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy',
    );
  });
});
