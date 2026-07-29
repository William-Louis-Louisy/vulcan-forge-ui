import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { ColorPickerField } from './ColorPickerField';

function ColorPickerHarness({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);

  return (
    <ColorPickerField
      id="token-color"
      name="value"
      label="Token value"
      locale="en"
      value={value}
      onValueChange={setValue}
    />
  );
}

describe('ColorPickerField', () => {
  it('keeps manual hexadecimal editing available', () => {
    render(<ColorPickerHarness initialValue="#336699" />);

    const input = screen.getByLabelText('Token value');
    fireEvent.change(input, { target: { value: '#FF8731' } });

    expect(input).toHaveValue('#FF8731');
  });

  it('synchronizes the native visual picker with the hexadecimal value', () => {
    render(<ColorPickerHarness initialValue="#336699" />);

    fireEvent.change(screen.getByLabelText('Choose color'), {
      target: { value: '#ff8731' },
    });

    expect(screen.getByLabelText('Token value')).toHaveValue('#FF8731');
  });

  it('adds an alpha channel from the opacity control', () => {
    render(<ColorPickerHarness initialValue="#336699" />);

    fireEvent.change(screen.getByRole('slider', { name: 'Opacity' }), {
      target: { value: '50' },
    });

    expect(screen.getByLabelText('Token value')).toHaveValue('#33669980');
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('uses French labels when the editor locale is French', () => {
    const ControlledPicker = () => {
      const [value, setValue] = useState('#336699');

      return (
        <ColorPickerField
          id="token-color-fr"
          label="Valeur"
          locale="fr"
          value={value}
          onValueChange={setValue}
        />
      );
    };

    render(<ControlledPicker />);

    expect(screen.getByLabelText('Choisir la couleur')).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Opacité' })).toBeInTheDocument();
  });
});
