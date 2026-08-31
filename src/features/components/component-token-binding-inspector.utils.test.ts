import { describe, expect, it } from 'vitest';
import type { ComponentTokenBindingDraft } from './component-contract-editor.utils';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import {
  getComponentTokenBindingInspectorState,
  isComponentTokenBindingRendered,
} from './component-token-binding-inspector.utils';

const tokenOptions: ComponentTokenOption[] = [
  {
    type: 'color',
    path: 'color.semantic.action.primary',
    label: 'color.semantic.action.primary',
    value: '{color.primitive.blue.500}',
    resolvedValue: '#2563eb',
    status: 'ready',
    isResolved: true,
  },
  {
    type: 'spacing',
    path: 'spacing.4',
    label: 'spacing.4',
    value: '1rem',
    resolvedValue: '1rem',
    status: 'ready',
    isResolved: true,
  },
  {
    type: 'color',
    path: 'color.legacy.brand',
    label: 'color.legacy.brand',
    value: '#2563eb',
    resolvedValue: '#2563eb',
    status: 'deprecated',
    isResolved: true,
  },
  {
    type: 'color',
    path: 'color.semantic.broken',
    label: 'color.semantic.broken',
    value: '{color.primitive.missing}',
    resolvedValue: '{color.primitive.missing}',
    status: 'ready',
    isResolved: false,
  },
];

function createBinding(
  overrides: Partial<ComponentTokenBindingDraft> = {},
): ComponentTokenBindingDraft {
  return {
    draftId: 'token-binding-0',
    key: 'background',
    tokenType: 'color',
    tokenPath: 'color.semantic.action.primary',
    description: { en: '', fr: '' },
    ...overrides,
  };
}

describe('component token binding inspector diagnostics', () => {
  it('reports a resolved renderer role with its expected token type', () => {
    const state = getComponentTokenBindingInspectorState({
      binding: createBinding(),
      tokenOptions,
      componentType: 'button',
    });

    expect(state.previewRole).toBe('background');
    expect(state.expectedTokenType).toBe('color');
    expect(state.resolutionState).toBe('resolved');
    expect(state.token?.resolvedValue).toBe('#2563eb');
    expect(state.hasRendererEffect).toBe(true);
  });

  it('distinguishes unassigned, missing and type-mismatched token paths', () => {
    expect(
      getComponentTokenBindingInspectorState({
        binding: createBinding({ tokenPath: '' }),
        tokenOptions,
        componentType: 'button',
      }).resolutionState,
    ).toBe('unassigned');

    expect(
      getComponentTokenBindingInspectorState({
        binding: createBinding({ tokenPath: 'color.unknown' }),
        tokenOptions,
        componentType: 'button',
      }).resolutionState,
    ).toBe('missing');

    expect(
      getComponentTokenBindingInspectorState({
        binding: createBinding({ tokenPath: 'spacing.4' }),
        tokenOptions,
        componentType: 'button',
      }).resolutionState,
    ).toBe('typeMismatch');
  });

  it('surfaces unresolved references and deprecated tokens separately', () => {
    expect(
      getComponentTokenBindingInspectorState({
        binding: createBinding({ tokenPath: 'color.semantic.broken' }),
        tokenOptions,
        componentType: 'button',
      }).resolutionState,
    ).toBe('unresolved');

    expect(
      getComponentTokenBindingInspectorState({
        binding: createBinding({ tokenPath: 'color.legacy.brand' }),
        tokenOptions,
        componentType: 'button',
      }).resolutionState,
    ).toBe('deprecated');
  });

  it('keeps valid custom bindings explicit when the renderer has no effect', () => {
    const state = getComponentTokenBindingInspectorState({
      binding: createBinding({ key: 'fontWeight' }),
      tokenOptions,
      componentType: 'button',
    });

    expect(state.previewRole).toBeNull();
    expect(state.resolutionState).toBe('resolved');
    expect(state.hasRendererEffect).toBe(false);
  });

  it('recognizes Alert status bindings as renderer-specific visual bindings', () => {
    expect(
      isComponentTokenBindingRendered({
        key: 'danger',
        componentType: 'alert',
      }),
    ).toBe(true);
    expect(
      isComponentTokenBindingRendered({
        key: 'danger',
        componentType: 'button',
      }),
    ).toBe(false);
  });
});
