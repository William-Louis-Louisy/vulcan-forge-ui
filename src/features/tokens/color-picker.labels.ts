import type { Locale } from '@/i18n/routing';

export type ColorPickerLabels = {
  alpha: string;
  blue: string;
  brightness: string;
  closePicker: string;
  eyedropper: string;
  eyedropperUnavailable: string;
  green: string;
  hsb: string;
  hsl: string;
  hue: string;
  lightness: string;
  openPicker: string;
  picker: string;
  pickerDialog: string;
  red: string;
  rgb: string;
  saturation: string;
  saturationBrightness: string;
  selectMode: string;
};

const colorPickerLabels = {
  en: {
    alpha: 'Opacity',
    blue: 'Blue',
    brightness: 'Brightness',
    closePicker: 'Close color picker',
    eyedropper: 'Pick a color from the screen',
    eyedropperUnavailable: 'The eyedropper is not available in this browser.',
    green: 'Green',
    hsb: 'HSB',
    hsl: 'HSL',
    hue: 'Hue',
    lightness: 'Lightness',
    openPicker: 'Open color picker',
    picker: 'Picker',
    pickerDialog: 'Color picker',
    red: 'Red',
    rgb: 'RGB',
    saturation: 'Saturation',
    saturationBrightness: 'Saturation and brightness',
    selectMode: 'Select color input mode',
  },
  fr: {
    alpha: 'Opacité',
    blue: 'Bleu',
    brightness: 'Luminosité',
    closePicker: 'Fermer le sélecteur de couleur',
    eyedropper: "Prélever une couleur à l'écran",
    eyedropperUnavailable:
      "La pipette n'est pas disponible dans ce navigateur.",
    green: 'Vert',
    hsb: 'HSB',
    hsl: 'HSL',
    hue: 'Teinte',
    lightness: 'Clarté',
    openPicker: 'Ouvrir le sélecteur de couleur',
    picker: 'Sélecteur',
    pickerDialog: 'Sélecteur de couleur',
    red: 'Rouge',
    rgb: 'RGB',
    saturation: 'Saturation',
    saturationBrightness: 'Saturation et luminosité',
    selectMode: 'Choisir le mode de saisie de la couleur',
  },
} satisfies Record<Locale, ColorPickerLabels>;

export function getColorPickerLabels(locale: Locale): ColorPickerLabels {
  return colorPickerLabels[locale];
}
