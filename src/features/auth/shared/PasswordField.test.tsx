import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from './PasswordField';

describe('PasswordField', () => {
  it('preserves value and returns focus to the input when visibility changes', async () => {
    const user = userEvent.setup();

    render(
      <PasswordField
        id="password"
        name="password"
        label="Password"
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
      />,
    );

    const input = screen.getByLabelText('Password');

    await user.type(input, 'a long password value');
    await user.click(
      screen.getByRole('button', {
        name: 'Show password',
      }),
    );

    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('a long password value');
    expect(input).toHaveFocus();

    await user.click(
      screen.getByRole('button', {
        name: 'Hide password',
      }),
    );

    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveFocus();
  });

  it('associates help and error text with the input', () => {
    render(
      <PasswordField
        id="password"
        name="password"
        label="Password"
        help="Use a long passphrase."
        error="Password is too short."
        showPasswordLabel="Show password"
        hidePasswordLabel="Hide password"
      />,
    );

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-describedby',
      'password-help password-error',
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-errormessage',
      'password-error',
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
