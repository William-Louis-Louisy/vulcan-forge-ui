import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

const options = [{ value: 'ready', label: 'Ready' }] as const;

describe('shared control density', () => {
  it('aligns small inputs, selects and buttons to the compact editor density', () => {
    render(
      <>
        <label htmlFor="compact-input">Compact input</label>
        <Input id="compact-input" size="sm" />
        <label htmlFor="compact-select">Compact select</label>
        <Select
          id="compact-select"
          value="ready"
          options={options}
          onValueChange={() => undefined}
          placeholder="Choose"
          size="sm"
        />
        <Button size="sm">Compact action</Button>
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Compact input' })).toHaveClass(
      'min-h-9',
    );
    expect(
      screen.getByRole('combobox', { name: 'Compact select' }),
    ).toHaveClass('min-h-9');
    expect(screen.getByRole('button', { name: 'Compact action' })).toHaveClass(
      'min-h-9',
    );
  });

  it('aligns standard inputs, selects and buttons to the default editor density', () => {
    render(
      <>
        <label htmlFor="standard-input">Standard input</label>
        <Input id="standard-input" size="md" />
        <label htmlFor="standard-select">Standard select</label>
        <Select
          id="standard-select"
          value="ready"
          options={options}
          onValueChange={() => undefined}
          placeholder="Choose"
          size="md"
        />
        <Button size="md">Standard action</Button>
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Standard input' })).toHaveClass(
      'min-h-10',
    );
    expect(
      screen.getByRole('combobox', { name: 'Standard select' }),
    ).toHaveClass('min-h-10');
    expect(screen.getByRole('button', { name: 'Standard action' })).toHaveClass(
      'min-h-10',
    );
  });
});
