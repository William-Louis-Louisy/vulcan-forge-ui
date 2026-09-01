import { describe, expect, it } from 'vitest';
import { createComponentVisualCssProperties } from './component-visual-preview.utils';

const rawTokenSets = [
  {
    type: 'color',
    name: 'Color',
    tokens: [
      {
        path: 'color.brand.primary',
        type: 'color',
        value: '#123456',
        status: 'ready',
      },
    ],
  },
  {
    type: 'spacing',
    name: 'Spacing',
    tokens: [
      {
        path: 'spacing.4',
        type: 'spacing',
        value: '16px',
        status: 'ready',
      },
    ],
  },
  {
    type: 'radius',
    name: 'Radius',
    tokens: [
      {
        path: 'radius.md',
        type: 'radius',
        value: '8px',
        status: 'ready',
      },
    ],
  },
  {
    type: 'typography',
    name: 'Typography',
    tokens: [
      {
        path: 'typography.button',
        type: 'typography',
        value: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: '0px',
        },
        status: 'ready',
      },
    ],
  },
];

describe('createComponentVisualCssProperties', () => {
  it('resolves token-backed visual properties', () => {
    const styles = createComponentVisualCssProperties({
      visual: {
        spacing: {
          paddingX: {
            source: 'token',
            tokenType: 'spacing',
            path: 'spacing.4',
          },
        },
        radius: {
          radius: {
            source: 'token',
            tokenType: 'radius',
            path: 'radius.md',
          },
        },
        surface: {
          background: {
            source: 'token',
            tokenType: 'color',
            path: 'color.brand.primary',
          },
        },
        typography: {
          source: 'token',
          tokenType: 'typography',
          path: 'typography.button',
        },
      },
      rawTokenSets,
    });

    expect(styles).toMatchObject({
      paddingInline: '16px',
      borderRadius: '8px',
      backgroundColor: '#123456',
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: 1.2,
    });
  });

  it('maps controlled explicit values and dimension modes', () => {
    const styles = createComponentVisualCssProperties({
      visual: {
        dimensions: {
          width: { source: 'mode', value: 'fill' },
          height: { source: 'mode', value: 'auto' },
          minHeight: { source: 'value', value: '40px' },
        },
        radius: {
          topLeft: { source: 'value', value: '18px' },
          topRight: { source: 'value', value: '4px' },
        },
        border: {
          width: { source: 'value', value: '2px' },
          style: 'dashed',
          color: { source: 'value', value: '#abcdef' },
        },
        surface: {
          elevation: { source: 'value', value: 'md' },
        },
      },
      rawTokenSets: [],
    });

    expect(styles).toMatchObject({
      width: '100%',
      height: 'auto',
      minHeight: '40px',
      borderTopLeftRadius: '18px',
      borderTopRightRadius: '4px',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#abcdef',
      boxShadow: '0 4px 10px rgb(0 0 0 / 0.12)',
    });
  });
});
