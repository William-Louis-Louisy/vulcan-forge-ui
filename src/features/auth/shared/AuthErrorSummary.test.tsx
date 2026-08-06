import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthErrorSummary } from './AuthErrorSummary';

describe('AuthErrorSummary', () => {
  it('receives focus and links to invalid fields', async () => {
    const user = userEvent.setup();

    render(
      <>
        <AuthErrorSummary
          focusKey="submission-1"
          items={[
            {
              fieldId: 'email',
              message: 'Enter a valid email address.',
            },
          ]}
        />
        <label htmlFor="email">Email</label>
        <input id="email" />
      </>,
    );

    const summary = screen.getByRole('alert');

    expect(summary).toHaveFocus();

    await user.click(
      screen.getByRole('link', {
        name: 'Enter a valid email address.',
      }),
    );

    expect(screen.getByLabelText('Email')).toHaveFocus();
  });
});
