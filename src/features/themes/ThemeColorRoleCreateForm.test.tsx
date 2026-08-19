import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeColorRoleCreateForm } from './ThemeColorRoleCreateForm';

vi.mock('@/features/save-context/usePreserveSaveContext', () => ({
  usePreserveSaveContext: () => vi.fn(),
}));

vi.mock('./create-theme-color-role.action', () => ({
  createThemeColorRoleAction: vi.fn(async (state) => state),
}));

const labels = {
  title: 'Custom color roles',
  description: 'Add a role to this theme only.',
  open: 'Add role',
  cancel: 'Cancel',
  roleKeyLabel: 'Role key',
  roleKeyPlaceholder: 'e.g. border-subtle',
  roleKeyHint: 'Use lowercase letters, numbers and hyphens.',
  tokenLabel: 'Color token',
  tokenPlaceholder: 'Select a token',
  submit: 'Add role',
  submitting: 'Adding role',
  added: 'Role added.',
  errors: {
    unauthorized: 'Unauthorized',
    invalidPayload: 'Invalid payload',
    themeNotFound: 'Theme not found',
    invalidTokenReference: 'Invalid token reference',
    invalidRoleKey: 'Invalid role key',
    invalidTokenPath: 'Invalid token path',
    themeTokensMalformed: 'Malformed theme tokens',
    roleAlreadyExists: 'Role already exists',
    unexpected: 'Unexpected error',
  },
};

const options = [
  {
    path: 'color.semantic.border.subtle',
    reference: '{color.semantic.border.subtle}',
    value: '#64748B',
    label: 'color.semantic.border.subtle',
  },
];

function renderForm(availableOptions = options) {
  return render(
    <ThemeColorRoleCreateForm
      locale="en"
      projectSlug="forge"
      themeId="light-theme"
      options={availableOptions}
      labels={labels}
    />,
  );
}

describe('ThemeColorRoleCreateForm', () => {
  it('reveals a scoped role form and enables submission after both fields are set', async () => {
    const user = userEvent.setup();
    const { container } = renderForm();
    const toggle = screen.getByRole('button', { name: 'Add role' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Role key')).not.toBeInTheDocument();

    await user.click(toggle);

    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );

    await user.type(screen.getByLabelText('Role key'), 'border-subtle');
    const tokenSelect = screen.getByRole('combobox', { name: 'Color token' });
    await user.click(tokenSelect);
    await user.click(
      screen.getByRole('option', {
        name: 'color.semantic.border.subtle #64748B',
      }),
    );

    expect(screen.getByRole('button', { name: 'Add role' })).toBeEnabled();
    expect(container.querySelector('input[name="roleKey"]')).toHaveValue(
      'border-subtle',
    );
    expect(container.querySelector('input[name="tokenPath"]')).toHaveValue(
      'color.semantic.border.subtle',
    );
    expect(container.querySelector('input[name="themeId"]')).toHaveValue(
      'light-theme',
    );
  });

  it('disables role creation when no resolved color token is available', () => {
    renderForm([]);

    expect(screen.getByRole('button', { name: 'Add role' })).toBeDisabled();
    expect(screen.queryByLabelText('Role key')).not.toBeInTheDocument();
  });
});
