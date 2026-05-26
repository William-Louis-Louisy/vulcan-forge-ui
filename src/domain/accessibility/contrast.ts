export type HexColor = `#${string}`;

export type ParsedHexColor = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type ContrastTextSize = 'normal' | 'large';

export type ContrastStatus = 'pass' | 'warning' | 'fail';

export type ContrastEvaluation = {
  foreground: string;
  background: string;
  ratio: number | null;
  requiredRatio: number;
  status: ContrastStatus;
  textSize: ContrastTextSize;
  isValid: boolean;
  error: 'invalidForegroundColor' | 'invalidBackgroundColor' | null;
};

const hexColorPattern =
  /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function isHexColor(value: string): value is HexColor {
  return hexColorPattern.test(value.trim());
}

function expandShortHexChannel(channel: string): string {
  return `${channel}${channel}`;
}

function parseAlpha(alphaHex: string | undefined): number {
  if (!alphaHex) {
    return 1;
  }

  return Number.parseInt(alphaHex, 16) / 255;
}

export function parseHexColor(value: string): ParsedHexColor | null {
  const normalizedValue = value.trim();

  if (!isHexColor(normalizedValue)) {
    return null;
  }

  const hex = normalizedValue.slice(1);

  if (hex.length === 3 || hex.length === 4) {
    const [red, green, blue, alpha] = hex.split('');

    if (!red || !green || !blue) {
      return null;
    }

    return {
      red: Number.parseInt(expandShortHexChannel(red), 16),
      green: Number.parseInt(expandShortHexChannel(green), 16),
      blue: Number.parseInt(expandShortHexChannel(blue), 16),
      alpha: parseAlpha(alpha ? expandShortHexChannel(alpha) : undefined),
    };
  }

  const red = hex.slice(0, 2);
  const green = hex.slice(2, 4);
  const blue = hex.slice(4, 6);
  const alpha = hex.length === 8 ? hex.slice(6, 8) : undefined;

  return {
    red: Number.parseInt(red, 16),
    green: Number.parseInt(green, 16),
    blue: Number.parseInt(blue, 16),
    alpha: parseAlpha(alpha),
  };
}

function linearizeChannel(channel: number): number {
  const normalizedChannel = channel / 255;

  return normalizedChannel <= 0.03928
    ? normalizedChannel / 12.92
    : ((normalizedChannel + 0.055) / 1.055) ** 2.4;
}

export function getRelativeLuminance(color: ParsedHexColor): number {
  return (
    0.2126 * linearizeChannel(color.red) +
    0.7152 * linearizeChannel(color.green) +
    0.0722 * linearizeChannel(color.blue)
  );
}

function compositeChannel({
  foregroundChannel,
  foregroundAlpha,
  backgroundChannel,
}: {
  foregroundChannel: number;
  foregroundAlpha: number;
  backgroundChannel: number;
}): number {
  return Math.round(
    foregroundChannel * foregroundAlpha +
      backgroundChannel * (1 - foregroundAlpha),
  );
}

export function compositeColorOverBackground({
  foreground,
  background,
}: {
  foreground: ParsedHexColor;
  background: ParsedHexColor;
}): ParsedHexColor {
  if (foreground.alpha >= 1) {
    return {
      ...foreground,
      alpha: 1,
    };
  }

  return {
    red: compositeChannel({
      foregroundChannel: foreground.red,
      foregroundAlpha: foreground.alpha,
      backgroundChannel: background.red,
    }),
    green: compositeChannel({
      foregroundChannel: foreground.green,
      foregroundAlpha: foreground.alpha,
      backgroundChannel: background.green,
    }),
    blue: compositeChannel({
      foregroundChannel: foreground.blue,
      foregroundAlpha: foreground.alpha,
      backgroundChannel: background.blue,
    }),
    alpha: 1,
  };
}

function roundContrastRatio(ratio: number): number {
  return Math.round(ratio * 100) / 100;
}

export function calculateContrastRatio({
  foreground,
  background,
}: {
  foreground: string;
  background: string;
}): number | null {
  const parsedForeground = parseHexColor(foreground);
  const parsedBackground = parseHexColor(background);

  if (!parsedForeground || !parsedBackground) {
    return null;
  }

  const opaqueBackground =
    parsedBackground.alpha < 1
      ? compositeColorOverBackground({
          foreground: parsedBackground,
          background: {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 1,
          },
        })
      : parsedBackground;

  const opaqueForeground = compositeColorOverBackground({
    foreground: parsedForeground,
    background: opaqueBackground,
  });

  const foregroundLuminance = getRelativeLuminance(opaqueForeground);
  const backgroundLuminance = getRelativeLuminance(opaqueBackground);

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return roundContrastRatio((lighter + 0.05) / (darker + 0.05));
}

export function getRequiredContrastRatio(textSize: ContrastTextSize): number {
  return textSize === 'large' ? 3 : 4.5;
}

export function getWarningContrastRatio(textSize: ContrastTextSize): number {
  return textSize === 'large' ? 2.5 : 3;
}

export function getContrastStatus({
  ratio,
  textSize,
}: {
  ratio: number;
  textSize: ContrastTextSize;
}): ContrastStatus {
  const requiredRatio = getRequiredContrastRatio(textSize);

  if (ratio >= requiredRatio) {
    return 'pass';
  }

  return ratio >= getWarningContrastRatio(textSize) ? 'warning' : 'fail';
}

export function evaluateContrast({
  foreground,
  background,
  textSize = 'normal',
}: {
  foreground: string;
  background: string;
  textSize?: ContrastTextSize;
}): ContrastEvaluation {
  const parsedForeground = parseHexColor(foreground);

  if (!parsedForeground) {
    return {
      foreground,
      background,
      ratio: null,
      requiredRatio: getRequiredContrastRatio(textSize),
      status: 'fail',
      textSize,
      isValid: false,
      error: 'invalidForegroundColor',
    };
  }

  const parsedBackground = parseHexColor(background);

  if (!parsedBackground) {
    return {
      foreground,
      background,
      ratio: null,
      requiredRatio: getRequiredContrastRatio(textSize),
      status: 'fail',
      textSize,
      isValid: false,
      error: 'invalidBackgroundColor',
    };
  }

  const ratio = calculateContrastRatio({
    foreground,
    background,
  });

  if (ratio === null) {
    return {
      foreground,
      background,
      ratio: null,
      requiredRatio: getRequiredContrastRatio(textSize),
      status: 'fail',
      textSize,
      isValid: false,
      error: 'invalidForegroundColor',
    };
  }

  return {
    foreground,
    background,
    ratio,
    requiredRatio: getRequiredContrastRatio(textSize),
    status: getContrastStatus({
      ratio,
      textSize,
    }),
    textSize,
    isValid: true,
    error: null,
  };
}
