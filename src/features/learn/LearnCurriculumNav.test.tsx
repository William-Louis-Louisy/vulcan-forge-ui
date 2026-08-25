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
  it('marks the published current chapter and keeps future chapters non-interactive', () => {
    render(
      <NextIntlClientProvider locale="en" messages={learnMessages.en}>
        <LearnCurriculumNav
          variant="compact"
          currentChapterKey="designSystems"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole('link', { name: /What is a Design System\?/ }),
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.queryByRole('link', { name: /Design Tokens/ })).toBeNull();
    expect(screen.getByText('Up next')).toBeInTheDocument();
  });
});
