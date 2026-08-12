import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import enMessages from '@/messages/en.json';
import { mergeMessages } from '@/messages/merge-messages';
import { journeyPolishMessages } from '@/messages/journey-polish-messages';
import {
  EmailVerificationBanner,
  EmailVerificationNoticeProvider,
  EmailVerificationTopbarTrigger,
} from './EmailVerificationBanner';

vi.mock('./resend-email-verification.action', () => ({
  resendEmailVerificationAction: vi.fn(),
}));

const messages = mergeMessages(enMessages, journeyPolishMessages.en);

function renderVerificationNotice() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <EmailVerificationNoticeProvider>
        <EmailVerificationTopbarTrigger />
        <EmailVerificationBanner locale="en" />
        <p>Workspace content remains available.</p>
      </EmailVerificationNoticeProvider>
    </NextIntlClientProvider>,
  );
}

describe('EmailVerificationBanner', () => {
  it('floats verification without taking workspace layout space', () => {
    renderVerificationNotice();

    const reminder = screen.getByRole('region', {
      name: /verify your email address/i,
    });

    expect(reminder).toHaveClass('fixed', 'bottom-4');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByText(/you can keep using your workspace/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend email/i })).toBeEnabled();
    expect(
      screen.getByText('Workspace content remains available.'),
    ).toBeInTheDocument();
  });

  it('can be dismissed and restored from the topbar trigger', async () => {
    const user = userEvent.setup();
    renderVerificationNotice();

    await user.click(
      screen.getByRole('button', {
        name: 'Dismiss email verification reminder',
      }),
    );

    expect(
      screen.queryByRole('region', { name: /verify your email address/i }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Show email verification reminder',
      }),
    );

    expect(
      screen.getByRole('region', { name: /verify your email address/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Hide email verification reminder',
      }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
