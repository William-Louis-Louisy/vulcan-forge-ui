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
      <SignupForm locale="en" />
    </NextIntlClientProvider>,
  );
}

describe('SignupForm', () => {
  it('can toggle password visibility', async () => {
    const user = userEvent.setup();

    renderSignupForm();

    const passwordInput = screen.getByLabelText(/^password$/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    const showPasswordButtons = screen.getAllByRole('button', {
      name: /show/i,
    });

    expect(showPasswordButtons).toHaveLength(2);

    await user.click(showPasswordButtons[0]!);

    expect(passwordInput).toHaveAttribute('type', 'text');

    const hidePasswordButtons = screen.getAllByRole('button', {
      name: /hide/i,
    });

    expect(hidePasswordButtons).toHaveLength(1);

    await user.click(hidePasswordButtons[0]!);

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders a password confirmation field', () => {
    renderSignupForm();

    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });
});
