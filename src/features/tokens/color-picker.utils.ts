export type ParsedHexColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

const defaultColor: ParsedHexColor = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 255,
};

function clampByte(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function toHexByte(value: number): string {
  return clampByte(value).toString(16).padStart(2, '0').toUpperCase();
}

export function parseHexColor(value: string): ParsedHexColor | null {
  const normalizedValue = value.trim();

  if (
    !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
      normalizedValue,
    )
  ) {
    return null;
  }

  if (normalizedValue.length === 4) {
    const [red, green, blue] = normalizedValue.slice(1).split('');

    return {
      red: Number.parseInt(`${red}${red}`, 16),
      green: Number.parseInt(`${green}${green}`, 16),
      blue: Number.parseInt(`${blue}${blue}`, 16),
      alpha: 255,
    };
  }

  return {
    red: Number.parseInt(normalizedValue.slice(1, 3), 16),
    green: Number.parseInt(normalizedValue.slice(3, 5), 16),
    blue: Number.parseInt(normalizedValue.slice(5, 7), 16),
    alpha:
      normalizedValue.length === 9
        ? Number.parseInt(normalizedValue.slice(7, 9), 16)
        : 255,
  };
}

export function formatHexColor(
  color: ParsedHexColor,
  includeAlpha = color.alpha < 255,
): string {
  const rgb = `${toHexByte(color.red)}${toHexByte(color.green)}${toHexByte(
    color.blue,
  )}`;

  return `#${rgb}${includeAlpha ? toHexByte(color.alpha) : ''}`;
}

function resolveColor(value: string, fallbackValue: string): ParsedHexColor {
  return parseHexColor(value) ?? parseHexColor(fallbackValue) ?? defaultColor;
}

export function getColorPickerRgbValue(
  value: string,
  fallbackValue = '#000000',
): string {
  return formatHexColor(resolveColor(value, fallbackValue), false);
}

export function getColorPickerAlphaPercent(
  value: string,
  fallbackValue = '#000000',
): number {
  const { alpha } = resolveColor(value, fallbackValue);

  return Math.round((alpha / 255) * 100);
}

export function updateHexColorRgb({
  currentValue,
  fallbackValue = '#000000',
  rgbValue,
}: {
  currentValue: string;
  fallbackValue?: string;
  rgbValue: string;
}): string {
  const currentColor = resolveColor(currentValue, fallbackValue);
  const nextRgb = parseHexColor(rgbValue);

  if (!nextRgb) {
    return currentValue;
  }

  return formatHexColor(
    {
      ...nextRgb,
      alpha: currentColor.alpha,
    },
    currentColor.alpha < 255,
  );
}

export function updateHexColorAlpha({
  alphaPercent,
  currentValue,
  fallbackValue = '#000000',
}: {
  alphaPercent: number;
  currentValue: string;
  fallbackValue?: string;
}): string {
  const currentColor = resolveColor(currentValue, fallbackValue);
  const normalizedPercent = Math.min(100, Math.max(0, alphaPercent));
  const alpha = Math.round((normalizedPercent / 100) * 255);

  return formatHexColor(
    {
      ...currentColor,
      alpha,
    },
    alpha < 255,
  );
}
