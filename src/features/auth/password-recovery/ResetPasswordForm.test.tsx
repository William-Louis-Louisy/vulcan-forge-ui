import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import { ResetPasswordForm } from './ResetPasswordForm';

function renderResetPasswordForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <ResetPasswordForm />
    </NextIntlClientProvider>,
  );
}

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('provides password and confirmation feedback before submission', async () => {
    const user = userEvent.setup();

    renderResetPasswordForm();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmationInput = screen.getByLabelText(/confirm password/i);

    await user.type(passwordInput, 'short');

    expect(
      screen.getByText('Password must contain at least 15 characters.'),
    ).toBeInTheDocument();

    await user.clear(passwordInput);
    await user.type(passwordInput, 'a sufficiently long password');
    await user.type(confirmationInput, 'a different long password');

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
  });

  it('uses reusable new-password fields and preserves focus on reveal', async () => {
    const user = userEvent.setup();

    renderResetPasswordForm();

    const passwordInput = screen.getByLabelText(/^password$/i);

    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute(
      'autocomplete',
      'new-password',
    );

    await user.type(passwordInput, 'a sufficiently long password');
    await user.click(
      screen.getAllByRole('button', {
        name: /show/i,
      })[0]!,
    );

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveValue('a sufficiently long password');
    expect(passwordInput).toHaveFocus();
  });
});
