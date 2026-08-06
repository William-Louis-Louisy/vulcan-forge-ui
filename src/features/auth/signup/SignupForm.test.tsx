import { SignupForm } from './SignupForm';
import enMessages from '@/messages/en.json';
import { describe, expect, it, vi } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

vi.mock('./signup.action', () => ({
  signupAction: vi.fn(),
}));

function renderSignupForm() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <SignupForm locale="en" returnTo="/en/app/projects/project-1" />
    </NextIntlClientProvider>,
  );
}

describe('SignupForm', () => {
  it('can toggle password visibility without losing value or focus', async () => {
    const user = userEvent.setup();

    renderSignupForm();

    const passwordInput = screen.getByLabelText(/^password$/i);

    await user.type(passwordInput, 'a sufficiently long password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const showPasswordButtons = screen.getAllByRole('button', {
      name: /show/i,
    });

    expect(showPasswordButtons).toHaveLength(2);

    await user.click(showPasswordButtons[0]!);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveValue('a sufficiently long password');
    expect(passwordInput).toHaveFocus();
  });

  it('renders shared native constraints and credential autocomplete values', () => {
    renderSignupForm();

    expect(screen.getByLabelText(/name/i)).toHaveAttribute('minlength', '2');
    expect(screen.getByLabelText(/name/i)).toHaveAttribute('maxlength', '80');
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      'autocomplete',
      'username',
    );
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
      'autocomplete',
      'new-password',
    );
    expect(screen.getByLabelText(/confirm password/i)).toBeRequired();
  });

  it('provides deterministic feedback before submission', async () => {
    const user = userEvent.setup();

    renderSignupForm();

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

  it('preserves the validated return target in the submitted form', () => {
    const { container } = renderSignupForm();

    expect(
      container.querySelector<HTMLInputElement>('input[name="returnTo"]'),
    ).toHaveValue('/en/app/projects/project-1');
  });
});
