import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import enMessages from '@/messages/en.json';
import { EmailVerificationBanner } from './EmailVerificationBanner';

vi.mock('./resend-email-verification.action', () => ({
  resendEmailVerificationAction: vi.fn(),
}));

describe('EmailVerificationBanner', () => {
  it('keeps verification visible without blocking workspace content', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <div>
          <EmailVerificationBanner locale="en" />
          <p>Workspace content remains available.</p>
        </div>
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole('region', { name: /verify your email address/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.getByText(/you can keep using your workspace/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resend email/i })).toBeEnabled();
    expect(
      screen.getByText('Workspace content remains available.'),
    ).toBeInTheDocument();
  });
});
