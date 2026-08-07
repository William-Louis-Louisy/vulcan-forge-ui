import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import enMessages from '@/messages/en.json';
import { PublicFooter } from './PublicFooter';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

describe('PublicFooter', () => {
  it('keeps Terms and Privacy reachable from public navigation', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <PublicFooter />
      </NextIntlClientProvider>,
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
