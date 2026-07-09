import { describe, expect, it } from 'vitest';
import type { ComponentRegistryItem } from './components-registry.utils';
import {
  createPreviewTokenStyles,
  createVisualMatrixAxes,
  getAlertPreviewTone,
  getPreviewSizeCategory,
  getPreviewWidthClassName,
  isInteractiveCardVariant,
} from './ComponentVisualMatrix';
import type { ComponentTokenBindingResolution } from './component-token-bindings.utils';

describe('createVisualMatrixAxes', () => {
  it('uses documented variants, sizes and states', () => {
    const contract = {
      variants: [
        {
          key: 'primary',
          label: {
            en: 'Primary',
          },
        },
      ],
      sizes: [
        {
          key: 'sm',
          label: {
            en: 'Small',
          },
        },
      ],
      states: [
        {
          key: 'disabled',
          label: {
            en: 'Disabled',
          },
        },
      ],
    } as ComponentRegistryItem['contract'];

    expect(createVisualMatrixAxes(contract)).toMatchObject({
      variants: [{ key: 'primary' }],
      sizes: [{ key: 'sm' }],
      states: [{ key: 'disabled' }],
      hasFallback: false,
    });
  });

  it('provides a default variant and medium size for incomplete contracts', () => {
    const contract = {
      variants: [],
      sizes: [],
      states: [],
    } as unknown as ComponentRegistryItem['contract'];

    expect(createVisualMatrixAxes(contract)).toMatchObject({
      variants: [{ key: 'default' }],
      sizes: [{ key: 'md' }],
      states: [],
      hasFallback: true,
    });
  });
});

describe('getPreviewSizeCategory', () => {
  it.each([
    ['xs', 'small'],
    ['sm', 'small'],
    ['compact', 'small'],
    ['md', 'medium'],
    ['default', 'medium'],
    ['lg', 'large'],
    ['xl', 'large'],
  ])('maps %s to the %s preview category', (sizeKey, expected) => {
    expect(getPreviewSizeCategory(sizeKey)).toBe(expected);
  });

  it('assigns visibly distinct widths to each preview category', () => {
    expect(getPreviewWidthClassName('small')).toBe('w-28');
    expect(getPreviewWidthClassName('medium')).toBe('w-36');
    expect(getPreviewWidthClassName('large')).toBe('w-48');
  });
});

describe('component-specific preview recipes', () => {
  it.each([
    ['info', 'info'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['danger', 'danger'],
    ['destructive', 'danger'],
  ])('maps the %s alert variant to the %s tone', (variant, expected) => {
    expect(getAlertPreviewTone(variant)).toBe(expected);
  });

  it('recognizes interactive card variants without affecting default cards', () => {
    expect(isInteractiveCardVariant('interactive')).toBe(true);
    expect(isInteractiveCardVariant('clickable')).toBe(true);
    expect(isInteractiveCardVariant('default')).toBe(false);
  });
});

describe('createPreviewTokenStyles', () => {
  it('maps resolved token bindings to preview CSS styles', () => {
    const resolution: ComponentTokenBindingResolution = {
      invalidTokenSetsCount: 0,
      missingBindings: [],
      bindings: {
        background: {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.default',
          value: '{color.primitive.blue.500}',
          resolvedValue: '#2563eb',
          status: 'ready',
          isResolved: true,
        },
        foreground: {
          key: 'foreground',
          tokenType: 'color',
          tokenPath: 'color.foreground.default',
          value: '#ffffff',
          resolvedValue: '#ffffff',
          status: 'ready',
          isResolved: true,
        },
        radius: {
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
          value: '0.5rem',
          resolvedValue: '0.5rem',
          status: 'ready',
          isResolved: true,
        },
        paddingX: {
          key: 'paddingX',
          tokenType: 'spacing',
          tokenPath: 'spacing.4',
          value: '1rem',
          resolvedValue: '1rem',
          status: 'ready',
          isResolved: true,
        },
        duration: {
          key: 'duration',
          tokenType: 'motion',
          tokenPath: 'motion.duration.fast',
          value: '150ms',
          resolvedValue: '150ms',
          status: 'ready',
          isResolved: true,
        },
      },
    };

    expect(createPreviewTokenStyles(resolution)).toMatchObject({
      backgroundColor: '#2563eb',
      color: '#ffffff',
      borderRadius: '0.5rem',
      paddingInline: '1rem',
      transitionDuration: '150ms',
    });
  });

  it('does not use numeric values for color-only CSS properties', () => {
    const resolution: ComponentTokenBindingResolution = {
      invalidTokenSetsCount: 0,
      missingBindings: [],
      bindings: {
        background: {
          key: 'background',
          tokenType: 'color',
          tokenPath: 'color.background.default',
          value: 42,
          resolvedValue: 42,
          status: 'ready',
          isResolved: true,
        },
      },
    };

    expect(
      createPreviewTokenStyles(resolution).backgroundColor,
    ).toBeUndefined();
  });
});
