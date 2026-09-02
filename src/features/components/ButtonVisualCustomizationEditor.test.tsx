import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  type ComponentContractV2,
} from '@/domain/design-system';
import { ButtonVisualCustomizationEditor } from './ButtonVisualCustomizationEditor';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      title: 'Visual tokens',
      description: 'Edit the Button appearance.',
      scope: 'Editing layer',
      target: 'Target',
      addProperty: 'Add visual property',
      removeProperty: 'Remove visual property',
      noPropertiesToAdd: 'All optional properties are already visible.',
      independentCorners: 'Independent corners',
      'scopes.base': 'Base',
      'scopes.variant': 'Variant',
      'scopes.size': 'Size',
      'scopes.state': 'State',
      inherited: 'Inherited',
      templateDefault: 'Template default',
      reset: 'Reset',
      source: 'Value source',
      token: 'Token',
      explicit: 'Explicit value',
      modeAuto: 'Auto',
      modeFill: 'Fill',
      unset: 'Inherit / default',
      selectToken: 'Select token',
      valuePlaceholder: 'e.g. 12px',
      colorPlaceholder: 'e.g. #111827',
      'groups.dimensions': 'Dimensions',
      'groups.spacing': 'Spacing',
      'groups.radius': 'Radius',
      'groups.fill': 'Fill',
      'groups.border': 'Stroke / Border',
      'groups.typography': 'Typography',
      'properties.width': 'Width',
      'properties.minWidth': 'Min width',
      'properties.height': 'Height',
      'properties.minHeight': 'Min height',
      'properties.paddingX': 'Padding X',
      'properties.paddingY': 'Padding Y',
      'properties.gap': 'Gap',
      'properties.radius': 'Radius',
      'properties.topLeft': 'Top-left radius',
      'properties.topRight': 'Top-right radius',
      'properties.bottomRight': 'Bottom-right radius',
      'properties.bottomLeft': 'Bottom-left radius',
      'properties.background': 'Background',
      'properties.foreground': 'Foreground',
      'properties.borderWidth': 'Border width',
      'properties.borderColor': 'Border color',
      'properties.borderStyle': 'Border style',
      'properties.fontFamily': 'Font family',
      'properties.fontSize': 'Font size',
      'properties.fontWeight': 'Font weight',
      'properties.lineHeight': 'Line height',
      'properties.letterSpacing': 'Letter spacing',
      'properties.textAlign': 'Text align',
      'borderStyles.none': 'None',
      'borderStyles.solid': 'Solid',
      'borderStyles.dashed': 'Dashed',
      'borderStyles.dotted': 'Dotted',
      'textAlignments.left': 'Left',
      'textAlignments.center': 'Center',
      'textAlignments.right': 'Right',
      'textAlignments.justify': 'Justify',
      'save.action': 'Save visual tokens',
      'save.saving': 'Saving…',
      'save.saved': 'Visual tokens saved',
      'save.unsaved': 'Unsaved visual changes',
      'save.invalid': 'Visual tokens are invalid',
    };

    return messages[key] ?? key;
  },
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock('./update-button-visual-customization.action', () => ({
  updateButtonVisualCustomizationAction: vi.fn(async () => ({
    status: 'idle',
    formError: null,
    savedContract: null,
  })),
}));

vi.mock('./ComponentContractPreviewContext', () => ({
  useComponentContractPreview: () => null,
}));

vi.mock('@/features/save-context/usePreserveSaveContext', () => ({
  usePreserveSaveContext: () => vi.fn(),
}));

vi.mock('@/features/save-context/useActionBackedProjectSaveStatus', () => ({
  useActionBackedProjectSaveStatus: () => ({
    hasUnsavedChanges: false,
    markCurrentDraftSubmitted: vi.fn(),
    status: 'saved',
  }),
}));

function createEditorProps() {
  const semanticContract = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === 'button',
  );

  if (!semanticContract) {
    throw new Error('Button seed is required for this test');
  }

  const migrated = migrateLegacyComponentContract(semanticContract);
  const contractV2: ComponentContractV2 = {
    ...migrated,
    visual: {
      radius: {
        radius: { source: 'value', value: '8px' },
      },
    },
    overrides: {
      variants: {},
      sizes: {},
      states: {},
    },
  };

  return {
    locale: 'en' as const,
    projectSlug: 'demo',
    componentKey: 'button',
    semanticContract,
    contractV2,
    tokenOptions: [
      { type: 'spacing' as const, path: 'spacing.4', label: 'spacing.4' },
      { type: 'radius' as const, path: 'radius.md', label: 'radius.md' },
      {
        type: 'color' as const,
        path: 'color.brand.primary',
        label: 'color.brand.primary',
      },
      {
        type: 'typography' as const,
        path: 'typography.button',
        label: 'typography.button',
      },
    ],
  };
}

describe('ButtonVisualCustomizationEditor', () => {
  it('uses one uniform radius control until independent corners are enabled', async () => {
    const user = userEvent.setup();

    render(<ButtonVisualCustomizationEditor {...createEditorProps()} />);

    const independentCorners = screen.getByRole('checkbox', {
      name: 'Independent corners',
    });

    expect(independentCorners).not.toBeChecked();
    expect(
      screen.queryByText('Top-left radius'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Bottom-right radius'),
    ).not.toBeInTheDocument();

    await user.click(independentCorners);

    expect(independentCorners).toBeChecked();
    expect(screen.getByText('Top-left radius')).toBeInTheDocument();
    expect(screen.getByText('Top-right radius')).toBeInTheDocument();
    expect(screen.getByText('Bottom-right radius')).toBeInTheDocument();
    expect(screen.getByText('Bottom-left radius')).toBeInTheDocument();
  });

  it('adds and removes optional visual groups progressively', async () => {
    const user = userEvent.setup();

    render(<ButtonVisualCustomizationEditor {...createEditorProps()} />);

    expect(screen.queryByText('Stroke / Border')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Add visual property' }),
    );
    await user.click(screen.getByRole('button', { name: 'Stroke / Border' }));

    expect(screen.getByText('Stroke / Border')).toBeInTheDocument();
    expect(screen.getByText('Border width')).toBeInTheDocument();
    expect(screen.getByText('Border style')).toBeInTheDocument();
    expect(screen.getByText('Border color')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', {
        name: 'Remove visual property Stroke / Border',
      }),
    );

    expect(screen.queryByText('Stroke / Border')).not.toBeInTheDocument();
  });

  it('starts in independent-corner mode when the current scope already owns corners', () => {
    const props = createEditorProps();
    const contractV2: ComponentContractV2 = {
      ...props.contractV2,
      visual: {
        ...props.contractV2.visual,
        radius: {
          radius: { source: 'value', value: '8px' },
          topLeft: { source: 'value', value: '16px' },
        },
      },
    };

    render(
      <ButtonVisualCustomizationEditor {...props} contractV2={contractV2} />,
    );

    expect(
      screen.getByRole('checkbox', { name: 'Independent corners' }),
    ).toBeChecked();
    expect(screen.getByText('Top-left radius')).toBeInTheDocument();
  });
});
