import { describe, expect, it } from 'vitest';
import { createPreviewTokenStyles } from './ComponentVisualMatrix';
import type { ComponentTokenBindingResolution } from './component-token-bindings.utils';

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
