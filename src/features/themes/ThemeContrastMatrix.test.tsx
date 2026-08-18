import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ThemeColorPair } from './themes-editor.utils';
import {
  ThemeContrastMatrix,
  type ThemeContrastMatrixLabels,
} from './ThemeContrastMatrix';

const labels: ThemeContrastMatrixLabels = {
  title: 'Contrast matrix',
  description: 'Key theme contrast checks.',
  foreground: 'Foreground',
  background: 'Background',
  missingColors: 'Missing colors',
  invalidColors: 'Invalid colors',
  ratio: (ratio) => `Ratio ${ratio}:1`,
  requiredRatio: (required) => `Required ${required}:1`,
  statuses: {
    pass: 'Pass',
    warning: 'Warning',
    fail: 'Fail',
  },
  grades: {
    aaa: 'AAA',
    aa: 'AA',
    largeOnly: 'Large text only',
    fail: 'Fail',
  },
  pairLabels: {
    contentOnBackground: 'Content on background',
    contentOnSurface: 'Content on surface',
    mutedOnBackground: 'Muted on background',
  },
  colorLabels: {
    background: 'App background',
    surface: 'Surface',
    content: 'Content',
    muted: 'Muted',
    accent: 'Accent',
    info: 'Info',
    success: 'Success',
    warning: 'Warning',
    danger: 'Danger',
  },
};

function createPair(
  overrides: Partial<ThemeColorPair> &
    Pick<ThemeColorPair, 'key' | 'foregroundKey' | 'backgroundKey'>,
): ThemeColorPair {
  return {
    foregroundReferencePath: 'color.primitive.neutral.950',
    backgroundReferencePath: 'color.primitive.neutral.0',
    foregroundValue: '#070707',
    backgroundValue: '#ffffff',
    contrast: {
      foreground: '#070707',
      background: '#ffffff',
      ratio: 14.8,
      requiredRatio: 4.5,
      status: 'pass',
      textSize: 'normal',
      isValid: true,
      error: null,
    },
    ...overrides,
  };
}

const pairs: ThemeColorPair[] = [
  createPair({
    key: 'contentOnBackground',
    foregroundKey: 'content',
    backgroundKey: 'background',
  }),
  createPair({
    key: 'contentOnSurface',
    foregroundKey: 'content',
    backgroundKey: 'surface',
    contrast: {
      foreground: '#070707',
      background: '#f7f3eb',
      ratio: 13.9,
      requiredRatio: 4.5,
      status: 'pass',
      textSize: 'normal',
      isValid: true,
      error: null,
    },
  }),
  createPair({
    key: 'mutedOnBackground',
    foregroundKey: 'muted',
    backgroundKey: 'background',
    foregroundValue: '#999999',
    contrast: {
      foreground: '#999999',
      background: '#ffffff',
      ratio: 2.85,
      requiredRatio: 4.5,
      status: 'fail',
      textSize: 'normal',
      isValid: true,
      error: null,
    },
  }),
];

describe('ThemeContrastMatrix', () => {
  it('renders a localized matrix and compact pair cards', () => {
    const { container } = render(
      <ThemeContrastMatrix pairs={pairs} labels={labels} />,
    );

    expect(
      screen.getByRole('table', { name: 'Contrast matrix' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Foreground ↓ / Background →')).toBeInTheDocument();
    expect(screen.getAllByText('14.80:1')).toHaveLength(2);
    expect(screen.getAllByText('Content on background')).toHaveLength(1);
    expect(
      container.querySelectorAll('[data-contrast-grade="aaa"]'),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll('[data-contrast-grade="fail"]'),
    ).toHaveLength(2);
  });

  it('surfaces missing colors without inventing a ratio', () => {
    render(
      <ThemeContrastMatrix
        pairs={[
          createPair({
            key: 'contentOnBackground',
            foregroundKey: 'content',
            backgroundKey: 'background',
            foregroundValue: null,
            contrast: null,
          }),
        ]}
        labels={labels}
      />,
    );

    expect(screen.getAllByText('Missing colors')).toHaveLength(2);
  });
});
