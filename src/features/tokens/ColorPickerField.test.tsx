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

  it('opens a custom picker and synchronizes hue changes', () => {
    render(<ColorPickerHarness initialValue="#FF0000" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open color picker' }));

    expect(
      screen.getByRole('dialog', { name: 'Color picker' }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole('slider', { name: 'Hue' }), {
      target: { value: '120' },
    });

    expect(screen.getByLabelText('Token value')).toHaveValue('#00FF00');
  });

  it('switches between Picker, HSB, HSL and RGB input modes', () => {
    render(<ColorPickerHarness initialValue="#336699" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open color picker' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Select color input mode' }),
    );

    expect(
      screen.getByRole('menuitemradio', { name: 'Picker', checked: true }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('menuitemradio', { name: 'RGB' }));
    fireEvent.change(screen.getByLabelText('Red'), {
      target: { value: '255' },
    });

    expect(screen.getByLabelText('Token value')).toHaveValue('#FF6699');
  });

  it('preserves HSB position while brightness is zero', () => {
    render(<ColorPickerHarness initialValue="#000000" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open color picker' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Select color input mode' }),
    );
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'HSB' }));

    const hueInput = screen.getByRole('spinbutton', { name: 'Hue' });
    const saturationInput = screen.getByRole('spinbutton', {
      name: 'Saturation',
    });
    const brightnessInput = screen.getByRole('spinbutton', {
      name: 'Brightness',
    });

    fireEvent.change(hueInput, { target: { value: '240' } });
    fireEvent.change(saturationInput, { target: { value: '100' } });

    expect(screen.getByLabelText('Token value')).toHaveValue('#000000');
    expect(hueInput).toHaveValue(240);
    expect(saturationInput).toHaveValue(100);
    expect(brightnessInput).toHaveValue(0);
    expect(
      screen.getByRole('slider', { name: 'Saturation and brightness' }),
    ).toHaveAttribute('aria-valuetext', '100% Saturation, 0% Brightness');
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

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ouvrir le sélecteur de couleur',
      }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Sélecteur de couleur' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Teinte' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Opacité' })).toBeInTheDocument();
  });
});
