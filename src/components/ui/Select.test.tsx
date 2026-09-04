import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Select } from './Select';

const options = [
  {
    value: 'color.semantic.background.app',
    label: 'color.semantic.background.app',
    description: '#f7f3eb',
    swatch: '#f7f3eb',
  },
  {
    value: 'color.primitive.neutral.0',
    label: 'color.primitive.neutral.0',
    description: '#ffffff',
    swatch: '#ffffff',
  },
] as const;

function SelectFixture({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState<(typeof options)[number]['value'] | ''>(
    'color.semantic.background.app',
  );

  return (
    <div className="overflow-hidden">
      <label htmlFor="theme-token">Choose token</label>
      <Select
        id="theme-token"
        name="tokenPath"
        value={value}
        options={options}
        placeholder="Select a token"
        disabled={disabled}
        onValueChange={setValue}
      />
    </div>
  );
}

describe('Select', () => {
  it('renders a labelled combobox, swatches and a form value', async () => {
    const user = userEvent.setup();
    const { container } = render(<SelectFixture />);
    const combobox = screen.getByRole('combobox', { name: 'Choose token' });

    expect(combobox).toHaveTextContent('color.semantic.background.app');
    expect(container.querySelector('input[name="tokenPath"]')).toHaveValue(
      'color.semantic.background.app',
    );

    await user.click(combobox);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: 'color.primitive.neutral.0 #ffffff',
      }),
    ).toBeInTheDocument();
  });

  it('renders the open listbox as a fixed top-layer surface', async () => {
    const user = userEvent.setup();
    render(<SelectFixture />);

    await user.click(screen.getByRole('combobox', { name: 'Choose token' }));

    const listbox = screen.getByRole('listbox');

    expect(listbox).toHaveStyle({ position: 'fixed' });
    expect(listbox).not.toHaveClass('absolute');
  });

  it('closes on surrounding scroll without closing while the listbox scrolls', async () => {
    const user = userEvent.setup();
    render(<SelectFixture />);
    const combobox = screen.getByRole('combobox', { name: 'Choose token' });

    await user.click(combobox);

    const listbox = screen.getByRole('listbox');
    fireEvent.scroll(listbox);

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.scroll(document);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard selection and closes after activation', async () => {
    const user = userEvent.setup();
    const { container } = render(<SelectFixture />);
    const combobox = screen.getByRole('combobox', { name: 'Choose token' });

    combobox.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(combobox).toHaveTextContent('color.primitive.neutral.0');
    expect(container.querySelector('input[name="tokenPath"]')).toHaveValue(
      'color.primitive.neutral.0',
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(combobox).toHaveFocus();
  });

  it('densifies both the xs trigger and its dropdown options', async () => {
    const user = userEvent.setup();

    render(
      <>
        <label htmlFor="compact-token">Compact token</label>
        <Select
          id="compact-token"
          value="color.semantic.background.app"
          options={options}
          placeholder="Select a token"
          size="xs"
          onValueChange={() => undefined}
        />
      </>,
    );

    const combobox = screen.getByRole('combobox', { name: 'Compact token' });
    expect(combobox).toHaveClass('min-h-7', 'px-2', 'py-1');

    await user.click(combobox);

    expect(screen.getByRole('listbox')).toHaveClass('p-0.5');
    expect(
      screen.getByRole('option', {
        name: 'color.primitive.neutral.0 #ffffff',
      }),
    ).toHaveClass('min-h-7', 'px-2', 'py-1');
  });

  it('supports a disabled state', () => {
    render(<SelectFixture disabled />);

    expect(
      screen.getByRole('combobox', { name: 'Choose token' }),
    ).toBeDisabled();
  });
});
