import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeTokenReferenceEditor } from './ThemeTokenReferenceEditor';

vi.mock('@/features/save-context/usePreserveSaveContext', () => ({
  usePreserveSaveContext: () => vi.fn(),
}));

vi.mock('./update-theme-token-reference.action', () => ({
  updateThemeTokenReferenceAction: vi.fn(),
}));

const labels = {
  slotLabel: 'Theme slot',
  selectLabel: 'Choose token for Background',
  placeholder: 'Select a token',
  currentReference: 'Current reference',
  resolvedValue: 'Resolved value',
  legacyDirectValue: 'Legacy direct value',
  save: 'Save mapping',
  saving: 'Saving mapping',
  saved: 'Saved',
  unsaved: 'Unsaved',
  noOptions: 'No color tokens available',
  errors: {
    unauthorized: 'Unauthorized',
    invalidPayload: 'Invalid payload',
    themeNotFound: 'Theme not found',
    invalidTokenReference: 'Invalid token reference',
    invalidRoleKey: 'Invalid role key',
    invalidTokenPath: 'Invalid token path',
    themeTokensMalformed: 'Malformed theme tokens',
    unexpected: 'Unexpected error',
  },
};

const options = [
  {
    path: 'color.semantic.background.app',
    reference: '{color.semantic.background.app}',
    value: '#f7f3eb',
    label: 'color.semantic.background.app',
  },
  {
    path: 'color.primitive.neutral.0',
    reference: '{color.primitive.neutral.0}',
    value: '#ffffff',
    label: 'color.primitive.neutral.0',
  },
];

function renderEditor({
  roleKey = 'background',
  initialReferencePath = 'color.semantic.background.app',
  resolvedValue = '#f7f3eb',
  availableOptions = options,
  showNoOptionsMessage,
}: {
  roleKey?: string;
  initialReferencePath?: string | null;
  resolvedValue?: string | null;
  availableOptions?: typeof options;
  showNoOptionsMessage?: boolean;
} = {}) {
  const optionalProps =
    showNoOptionsMessage === undefined ? {} : { showNoOptionsMessage };

  return render(
    <ThemeTokenReferenceEditor
      locale="en"
      projectSlug="forge"
      themeId="light-theme"
      roleKey={roleKey}
      initialReferencePath={initialReferencePath}
      legacyDirectValue={null}
      resolvedValue={resolvedValue}
      options={availableOptions}
      labels={labels}
      {...optionalProps}
    />,
  );
}

describe('ThemeTokenReferenceEditor', () => {
  it('shows mapping data without redundant theme-role or reference previews', () => {
    const { container } = renderEditor();
    const layout = container.querySelector('[data-theme-mapping-layout]');
    const layoutClassNames = layout?.className.split(' ') ?? [];
    const themeRole = container.querySelector('[data-theme-role="background"]');
    const tokenSelect = screen.getByRole('combobox', {
      name: 'Choose token for Background',
    });

    expect(
      container.querySelector('[data-theme-mapping-row="background"]'),
    ).toBeInTheDocument();
    expect(layout).toHaveClass('sm:grid-cols-2');
    expect(
      layoutClassNames.some((className) =>
        className.startsWith('2xl:grid-cols-'),
      ),
    ).toBe(true);
    expect(
      layoutClassNames.some((className) =>
        className.startsWith('xl:grid-cols-'),
      ),
    ).toBe(false);
    expect(themeRole).toHaveTextContent('background');
    expect(themeRole?.querySelector('[aria-hidden="true"]')).toBeNull();
    expect(tokenSelect).toHaveTextContent('color.semantic.background.app');
    expect(tokenSelect).toHaveTextContent('#f7f3eb');
    expect(
      screen.queryByText('Current reference: {color.semantic.background.app}'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save mapping' })).toBeDisabled();
  });

  it('renders authored custom role keys through the same mapping control', () => {
    const { container } = renderEditor({
      roleKey: 'border-subtle',
      initialReferencePath: 'color.primitive.neutral.0',
      resolvedValue: '#ffffff',
    });

    expect(
      container.querySelector('[data-theme-mapping-row="border-subtle"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-theme-role="border-subtle"]'),
    ).toHaveTextContent('border-subtle');
    expect(
      container.querySelector('input[name="roleKey"]'),
    ).toHaveValue('border-subtle');
  });

  it('updates the selected token data and save state when another token is selected', async () => {
    const user = userEvent.setup();
    renderEditor();

    const tokenSelect = screen.getByRole('combobox', {
      name: 'Choose token for Background',
    });

    await user.click(tokenSelect);
    await user.click(
      screen.getByRole('option', {
        name: 'color.primitive.neutral.0 #ffffff',
      }),
    );

    expect(tokenSelect).toHaveTextContent('color.primitive.neutral.0');
    expect(tokenSelect).toHaveTextContent('#ffffff');
    expect(
      screen.queryByText('Current reference: {color.primitive.neutral.0}'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Unsaved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save mapping' })).toBeEnabled();
  });

  it('disables mapping controls when no resolved color token is available', () => {
    renderEditor({
      initialReferencePath: null,
      resolvedValue: null,
      availableOptions: [],
    });

    expect(
      screen.getByRole('combobox', { name: 'Choose token for Background' }),
    ).toBeDisabled();
    expect(screen.getByText('No color tokens available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save mapping' })).toBeDisabled();
  });

  it('can defer the no-options warning to the parent section', () => {
    renderEditor({
      initialReferencePath: null,
      resolvedValue: null,
      availableOptions: [],
      showNoOptionsMessage: false,
    });

    expect(
      screen.getByRole('combobox', { name: 'Choose token for Background' }),
    ).toBeDisabled();
    expect(
      screen.queryByText('No color tokens available'),
    ).not.toBeInTheDocument();
  });
});
