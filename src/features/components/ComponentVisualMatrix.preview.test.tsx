import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComponentPreview } from './ComponentVisualMatrix';
import type {
  ComponentPreviewSemanticPalette,
  ComponentTokenBindingResolution,
} from './component-token-bindings.utils';

const tokenBindingResolution: ComponentTokenBindingResolution = {
  invalidTokenSetsCount: 0,
  missingBindings: [],
  bindings: {
    'background-color': {
      key: 'background-color',
      tokenType: 'color',
      tokenPath: 'color.primitive.brand',
      value: '#123456',
      resolvedValue: '#123456',
      status: 'ready',
      isResolved: true,
    },
    borderRadius: {
      key: 'borderRadius',
      tokenType: 'radius',
      tokenPath: 'radius.xl',
      value: '1rem',
      resolvedValue: '1rem',
      status: 'ready',
      isResolved: true,
    },
    padding: {
      key: 'padding',
      tokenType: 'spacing',
      tokenPath: 'spacing.8',
      value: '2rem',
      resolvedValue: '2rem',
      status: 'ready',
      isResolved: true,
    },
  },
};

const semanticPalette: ComponentPreviewSemanticPalette = {
  action: {
    primary: '#ff8731',
    danger: '#b43a2a',
  },
  status: {
    info: 'var(--vf-action-info)',
    success: '#3f7a4f',
    warning: 'var(--vf-action-warning)',
    danger: 'var(--vf-action-danger)',
  },
  missingStatusTones: ['info', 'warning', 'danger'],
};

describe('ComponentPreview visual token recipes', () => {
  it('applies background, radius and padding bindings to cards', () => {
    const { container } = render(
      <ComponentPreview
        type="card"
        name="Card"
        variantKey="default"
        sizeKey="md"
        stateKey=""
        tokenBindingResolution={tokenBindingResolution}
        semanticPalette={semanticPalette}
      />,
    );

    const preview = container.querySelector('[data-preview-component="card"]');

    expect(preview).toHaveStyle({
      backgroundColor: '#123456',
      borderRadius: '1rem',
      padding: '2rem',
    });
  });

  it('applies root bindings and semantic action colors to dialogs', () => {
    const { container } = render(
      <ComponentPreview
        type="dialog"
        name="Dialog"
        variantKey="default"
        sizeKey="md"
        stateKey="open"
        tokenBindingResolution={tokenBindingResolution}
        semanticPalette={semanticPalette}
      />,
    );

    const preview = container.querySelector(
      '[data-preview-component="dialog"]',
    );
    const primaryAction = preview?.querySelector('footer > span:last-child');

    expect(preview).toHaveStyle({
      backgroundColor: '#123456',
      borderRadius: '1rem',
      padding: '2rem',
    });
    expect(primaryAction).toHaveStyle({ backgroundColor: '#ff8731' });
  });

  it('uses semantic status colors for alerts while keeping structural bindings', () => {
    const { container } = render(
      <ComponentPreview
        type="alert"
        name="Alert"
        variantKey="success"
        sizeKey="md"
        stateKey=""
        tokenBindingResolution={{
          ...tokenBindingResolution,
          bindings: {
            borderRadius: tokenBindingResolution.bindings.borderRadius!,
            padding: tokenBindingResolution.bindings.padding!,
          },
        }}
        semanticPalette={semanticPalette}
      />,
    );

    const preview = container.querySelector('[data-preview-component="alert"]');

    expect(preview).toHaveStyle({
      color: '#3f7a4f',
      borderRadius: '1rem',
      padding: '2rem',
    });
  });
});
