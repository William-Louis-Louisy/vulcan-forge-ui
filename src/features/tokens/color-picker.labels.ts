import type { Locale } from '@/i18n/routing';

export type ColorPickerLabels = {
  alpha: string;
  chooseColor: string;
};

const colorPickerLabels = {
  en: {
    alpha: 'Opacity',
    chooseColor: 'Choose color',
  },
  fr: {
    alpha: 'Opacité',
    chooseColor: 'Choisir la couleur',
  },
} satisfies Record<Locale, ColorPickerLabels>;

export function getColorPickerLabels(locale: Locale): ColorPickerLabels {
  return colorPickerLabels[locale];
}
