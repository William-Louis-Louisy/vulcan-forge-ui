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
  it('links all published chapters and marks the final chapter as current', () => {
    render(
      <NextIntlClientProvider locale="en" messages={learnMessages.en}>
        <LearnCurriculumNav variant="compact" currentChapterKey="aiReady" />
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
    ).toHaveAttribute('href', '/learn/documentation-and-delivery');
    expect(
      screen.getByRole('link', { name: /AI-ready Design Systems/ }),
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByText('Available')).toBeNull();
    expect(screen.queryByText('Up next')).toBeNull();
  });

  it('does not render published-status labels on curriculum cards', () => {
    render(
      <NextIntlClientProvider locale="en" messages={learnMessages.en}>
        <LearnCurriculumNav />
      </NextIntlClientProvider>,
    );

    expect(screen.getAllByRole('link')).toHaveLength(7);
    expect(screen.queryByText('Available')).toBeNull();
  });
});
