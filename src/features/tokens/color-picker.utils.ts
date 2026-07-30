export type ParsedHexColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type HsbColor = {
  hue: number;
  saturation: number;
  brightness: number;
};

export type HslColor = {
  hue: number;
  saturation: number;
  lightness: number;
};

const defaultColor: ParsedHexColor = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 255,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function clampByte(value: number): number {
  return Math.round(clamp(value, 0, 255));
}

function clampPercent(value: number): number {
  return clamp(value, 0, 100);
}

function normalizeHue(value: number): number {
  return ((value % 360) + 360) % 360;
}

function toHexByte(value: number): string {
  return clampByte(value).toString(16).padStart(2, '0').toUpperCase();
}

export function parseHexColor(value: string): ParsedHexColor | null {
  const normalizedValue = value.trim();

  if (
    !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(normalizedValue)
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

export function resolveHexColor(
  value: string,
  fallbackValue = '#000000',
): ParsedHexColor {
  return parseHexColor(value) ?? parseHexColor(fallbackValue) ?? defaultColor;
}

export function rgbToHsb(
  color: Pick<ParsedHexColor, 'red' | 'green' | 'blue'>,
): HsbColor {
  const red = clampByte(color.red) / 255;
  const green = clampByte(color.green) / 255;
  const blue = clampByte(color.blue) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  let hue = 0;

  if (delta > 0) {
    if (maximum === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (maximum === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  return {
    hue: Math.round(normalizeHue(hue)),
    saturation: Math.round((maximum === 0 ? 0 : delta / maximum) * 100),
    brightness: Math.round(maximum * 100),
  };
}

export function hsbToRgb(color: HsbColor): ParsedHexColor {
  const hue = normalizeHue(color.hue);
  const saturation = clampPercent(color.saturation) / 100;
  const brightness = clampPercent(color.brightness) / 100;
  const chroma = brightness * saturation;
  const hueSegment = hue / 60;
  const secondary = chroma * (1 - Math.abs((hueSegment % 2) - 1));
  const match = brightness - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hueSegment < 1) {
    red = chroma;
    green = secondary;
  } else if (hueSegment < 2) {
    red = secondary;
    green = chroma;
  } else if (hueSegment < 3) {
    green = chroma;
    blue = secondary;
  } else if (hueSegment < 4) {
    green = secondary;
    blue = chroma;
  } else if (hueSegment < 5) {
    red = secondary;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondary;
  }

  return {
    red: clampByte((red + match) * 255),
    green: clampByte((green + match) * 255),
    blue: clampByte((blue + match) * 255),
    alpha: 255,
  };
}

export function rgbToHsl(
  color: Pick<ParsedHexColor, 'red' | 'green' | 'blue'>,
): HslColor {
  const red = clampByte(color.red) / 255;
  const green = clampByte(color.green) / 255;
  const blue = clampByte(color.blue) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  const lightness = (maximum + minimum) / 2;
  let hue = 0;

  if (delta > 0) {
    if (maximum === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (maximum === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  return {
    hue: Math.round(normalizeHue(hue)),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
  };
}

function hueToRgb(primary: number, secondary: number, hue: number): number {
  const normalizedHue = ((hue % 1) + 1) % 1;

  if (normalizedHue < 1 / 6) {
    return primary + (secondary - primary) * 6 * normalizedHue;
  }

  if (normalizedHue < 1 / 2) {
    return secondary;
  }

  if (normalizedHue < 2 / 3) {
    return primary + (secondary - primary) * (2 / 3 - normalizedHue) * 6;
  }

  return primary;
}

export function hslToRgb(color: HslColor): ParsedHexColor {
  const hue = normalizeHue(color.hue) / 360;
  const saturation = clampPercent(color.saturation) / 100;
  const lightness = clampPercent(color.lightness) / 100;

  if (saturation === 0) {
    const channel = clampByte(lightness * 255);

    return {
      red: channel,
      green: channel,
      blue: channel,
      alpha: 255,
    };
  }

  const secondary =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const primary = 2 * lightness - secondary;

  return {
    red: clampByte(hueToRgb(primary, secondary, hue + 1 / 3) * 255),
    green: clampByte(hueToRgb(primary, secondary, hue) * 255),
    blue: clampByte(hueToRgb(primary, secondary, hue - 1 / 3) * 255),
    alpha: 255,
  };
}

export function getColorPickerRgbValue(
  value: string,
  fallbackValue = '#000000',
): string {
  return formatHexColor(resolveHexColor(value, fallbackValue), false);
}

export function getColorPickerAlphaPercent(
  value: string,
  fallbackValue = '#000000',
): number {
  const { alpha } = resolveHexColor(value, fallbackValue);

  return Math.round((alpha / 255) * 100);
}

export function updateHexColorChannels({
  blue,
  currentValue,
  fallbackValue = '#000000',
  green,
  red,
}: {
  blue: number;
  currentValue: string;
  fallbackValue?: string;
  green: number;
  red: number;
}): string {
  const currentColor = resolveHexColor(currentValue, fallbackValue);

  return formatHexColor(
    {
      red,
      green,
      blue,
      alpha: currentColor.alpha,
    },
    currentColor.alpha < 255,
  );
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
  const nextRgb = parseHexColor(rgbValue);

  if (!nextRgb) {
    return currentValue;
  }

  return updateHexColorChannels({
    currentValue,
    fallbackValue,
    red: nextRgb.red,
    green: nextRgb.green,
    blue: nextRgb.blue,
  });
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
  const currentColor = resolveHexColor(currentValue, fallbackValue);
  const normalizedPercent = clampPercent(alphaPercent);
  const alpha = Math.round((normalizedPercent / 100) * 255);

  return formatHexColor(
    {
      ...currentColor,
      alpha,
    },
    alpha < 255,
  );
}
