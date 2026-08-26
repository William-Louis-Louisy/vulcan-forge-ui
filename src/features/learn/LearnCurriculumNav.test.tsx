import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { render, screen } from '@testing-library/react';
import { learnMessages } from '@/messages/learn-messages';
import { LearnCurriculumNav } from './LearnCurriculumNav';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props} />
  ),
}));

describe('LearnCurriculumNav', () => {
  it('marks the current published chapter, links published chapters and keeps future chapters non-interactive', () => {
    render(
      <NextIntlClientProvider locale="en" messages={learnMessages.en}>
        <LearnCurriculumNav
          variant="compact"
          currentChapterKey="documentationDelivery"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole('link', { name: /What is a Design System\?/ }),
    ).toHaveAttribute('href', '/learn/design-systems');
    expect(screen.getByRole('link', { name: /Design Tokens/ })).toHaveAttribute(
      'href',
      '/learn/design-tokens',
    );
    expect(screen.getByRole('link', { name: /Themes/ })).toHaveAttribute(
      'href',
      '/learn/themes',
    );
    expect(screen.getByRole('link', { name: /Components/ })).toHaveAttribute(
      'href',
      '/learn/components',
    );
    expect(screen.getByRole('link', { name: /Accessibility/ })).toHaveAttribute(
      'href',
      '/learn/accessibility',
    );
    expect(
      screen.getByRole('link', { name: /Documentation & Delivery/ }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.queryByRole('link', { name: /AI-ready Design Systems/ }),
    ).toBeNull();
    expect(screen.getByText('Up next')).toBeInTheDocument();
  });
});
