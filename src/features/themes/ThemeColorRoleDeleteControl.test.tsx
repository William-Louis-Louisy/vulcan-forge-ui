import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeColorRoleDeleteControl } from './ThemeColorRoleDeleteControl';

vi.mock('@/features/save-context/usePreserveSaveContext', () => ({
  usePreserveSaveContext: () => vi.fn(),
}));

vi.mock('./delete-theme-color-role.action', () => ({
  deleteThemeColorRoleAction: vi.fn(),
}));

const labels = {
  request: 'Delete role',
  confirmationTitle: 'Delete border-subtle?',
  confirmationDescription:
    'This removes the custom role from this theme only. The referenced token is kept.',
  cancel: 'Cancel',
  delete: 'Delete role',
  deleting: 'Deleting…',
  errors: {
    unauthorized: 'Unauthorized',
    invalidPayload: 'Invalid payload',
    themeNotFound: 'Theme not found',
    invalidRoleKey: 'Invalid role key',
    protectedRole: 'Built-in roles cannot be deleted',
    themeTokensMalformed: 'Malformed theme tokens',
    roleNotFound: 'Role not found',
    unexpected: 'Unexpected error',
  },
};

describe('ThemeColorRoleDeleteControl', () => {
  it('opens a scoped confirmation dialog and cancel leaves the role untouched', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <ThemeColorRoleDeleteControl
        locale="en"
        projectSlug="forge"
        themeId="light-theme"
        roleKey="border-subtle"
        labels={labels}
      />,
    );

    const requestButton = screen.getByRole('button', { name: 'Delete role' });
    expect(requestButton).toHaveAttribute(
      'data-theme-role-delete',
      'border-subtle',
    );

    await user.click(requestButton);

    expect(
      screen.getByRole('dialog', { name: 'Delete border-subtle?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(labels.confirmationDescription),
    ).toBeInTheDocument();
    expect(container.querySelector('input[name="themeId"]')).toHaveValue(
      'light-theme',
    );
    expect(container.querySelector('input[name="roleKey"]')).toHaveValue(
      'border-subtle',
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByRole('dialog', { name: 'Delete border-subtle?' }),
    ).not.toBeInTheDocument();
  });
});
