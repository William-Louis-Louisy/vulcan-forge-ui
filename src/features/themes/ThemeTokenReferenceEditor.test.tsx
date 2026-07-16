import { fireEvent, render, screen } from '@testing-library/react';
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
  initialReferencePath = 'color.semantic.background.app',
  resolvedValue = '#f7f3eb',
  availableOptions = options,
  showNoOptionsMessage,
}: {
  initialReferencePath?: string | null;
  resolvedValue?: string | null;
  availableOptions?: typeof options;
  showNoOptionsMessage?: boolean;
} = {}) {
  return render(
    <ThemeTokenReferenceEditor
      locale="en"
      projectSlug="forge"
      themeId="light-theme"
      colorKey="background"
      initialReferencePath={initialReferencePath}
      legacyDirectValue={null}
      resolvedValue={resolvedValue}
      options={availableOptions}
      showNoOptionsMessage={showNoOptionsMessage}
      labels={labels}
    />,
  );
}

describe('ThemeTokenReferenceEditor', () => {
  it('shows the slot, current source, resolved value and saved state together', () => {
    const { container } = renderEditor();

    expect(
      container.querySelector('[data-theme-mapping-row="background"]'),
    ).toBeInTheDocument();
    expect(screen.getByText('background')).toBeInTheDocument();
    expect(
      screen.getByText('Current reference: {color.semantic.background.app}'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Resolved value: #f7f3eb' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save mapping' })).toBeDisabled();
  });

  it('updates the preview value and save state when another token is selected', () => {
    renderEditor();

    fireEvent.change(screen.getByLabelText('Choose token for Background'), {
      target: { value: 'color.primitive.neutral.0' },
    });

    expect(
      screen.getByText('Current reference: {color.primitive.neutral.0}'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Resolved value: #ffffff' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Unsaved')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save mapping' })).toBeEnabled();
  });

  it('disables mapping controls when no resolved color token is available', () => {
    renderEditor({
      initialReferencePath: null,
      resolvedValue: null,
      availableOptions: [],
    });

    expect(screen.getByLabelText('Choose token for Background')).toBeDisabled();
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

    expect(screen.getByLabelText('Choose token for Background')).toBeDisabled();
    expect(
      screen.queryByText('No color tokens available'),
    ).not.toBeInTheDocument();
  });
});
