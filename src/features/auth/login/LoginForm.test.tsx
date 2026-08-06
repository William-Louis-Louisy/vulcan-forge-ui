import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import { LoginForm } from './LoginForm';

vi.mock('./login.action', () => ({
  loginAction: vi.fn(),
}));

function renderLoginForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <LoginForm
        locale="en"
        returnTo="/en/app/projects/project-1/tokens?set=color"
      />
    </NextIntlClientProvider>,
  );
}

describe('LoginForm', () => {
  it('identifies email as the account username', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'autocomplete',
      'username',
    );
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      'autocomplete',
      'current-password',
    );
  });

  it('reveals the password without losing value or focus', async () => {
    const user = userEvent.setup();

    renderLoginForm();

    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(passwordInput, 'a login password');
    await user.click(
      screen.getByRole('button', {
        name: /show/i,
      }),
    );

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveValue('a login password');
    expect(passwordInput).toHaveFocus();
  });

  it('preserves the validated return target in the submitted form', () => {
    const { container } = renderLoginForm();

    expect(
      container.querySelector<HTMLInputElement>('input[name="returnTo"]'),
    ).toHaveValue('/en/app/projects/project-1/tokens?set=color');
  });
});
