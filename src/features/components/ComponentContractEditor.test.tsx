import { describe, expect, it, vi } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => routerMocks,
}));

vi.mock('@/components/layout/ProjectTopbarBreadcrumb', () => ({
  useProjectSaveStatus: vi.fn(),
}));

vi.mock('./update-component-contract.action', () => ({
  updateComponentContractAction: vi.fn(async () => ({
    status: 'idle',
    formError: null,
    savedContract: null,
  })),
}));

vi.mock('./ButtonVisualCustomizationEditor', () => ({
  ButtonVisualCustomizationEditor: () => (
    <section data-testid="button-visual-customization-editor" />
  ),
}));

import {
  ComponentContractEditor,
  type ComponentContractEditorLabels,
} from './ComponentContractEditor';

const labels: ComponentContractEditorLabels = {
  title: 'Component contract editor',
  description: 'Edit this component contract.',
  unsavedNotice: 'Unsaved local changes.',
  validationTitle: 'Validation errors',
  localizedContent: {
    title: 'Localized content',
    editing: 'Editing:',
    purpose: 'Purpose',
    usageGuidelines: 'Usage guidelines',
    contentGuidelines: 'Content guidelines',
    locales: {
      en: 'EN',
      fr: 'FR',
    },
  },
  metadata: {
    title: 'Contract metadata',
  },
  save: {
    action: 'Save contract',
    saving: 'Saving...',
    saved: 'All changes saved.',
    unsaved: 'Unsaved changes.',
    invalid: 'Fix validation errors before saving.',
    errors: {
      unauthorized: 'Unauthorized',
      projectNotFound: 'Project not found',
      componentContractNotFound: 'Component contract not found',
      invalidPayload: 'Invalid payload',
      invalidContract: 'Invalid contract',
      unexpected: 'Unexpected error',
    },
  },
  basics: {
    title: 'Basics',
    name: 'Name',
    status: 'Status',
  },
  anatomy: {
    title: 'Anatomy',
    description: 'Edit anatomy parts.',
    add: 'Add anatomy item',
    key: 'Anatomy key',
    label: 'Anatomy label',
    requirement: 'Anatomy requirement',
    requirements: {
      required: 'Required',
      optional: 'Optional',
      derived: 'Derived',
    },
  },
  collections: {
    title: 'Variants & states',
    editDetails: 'Edit localized labels and descriptions',
  },
  variants: {
    title: 'Variants',
    axis: 'intent',
    add: 'Add variant',
  },
  sizes: {
    title: 'Sizes',
    axis: 'size',
    add: 'Add size',
  },
  states: {
    title: 'States',
    axis: 'states',
    add: 'Add state',
  },
  accessibility: {
    title: 'Accessibility contract',
    add: 'Add accessibility rule',
    severity: 'Severity',
  },
  forbiddenPatterns: {
    title: 'Forbidden patterns',
    add: 'Add forbidden pattern',
  },
  fields: {
    key: 'Key',
    labelEn: 'Label EN',
    labelFr: 'Label FR',
    descriptionEn: 'Description EN',
    descriptionFr: 'Description FR',
    patternEn: 'Pattern EN',
    patternFr: 'Pattern FR',
    remove: 'Remove',
  },
  statuses: {
    draft: 'Draft',
    ready: 'Ready',
    deprecated: 'Deprecated',
  },
  severities: {
    info: 'Info',
    warning: 'Warning',
    critical: 'Critical',
  },
  visualTokens: {
    title: 'Visual tokens',
    description: 'Map design system tokens to preview properties.',
    add: 'Add visual token',
    role: 'Preview role',
    selectRole: 'Select a preview role',
    customRole: 'Custom role (advanced)',
    customRoleDescription: 'Use an arbitrary role key.',
    customRoleKey: 'Custom role key',
    customRolePlaceholder: 'e.g. fontWeight',
    roleAlreadyUsed: 'Already used in this contract',
    roles: {
      background: 'Background',
      foreground: 'Foreground',
      border: 'Border',
      radius: 'Radius',
      padding: 'Padding',
      paddingX: 'Horizontal padding',
      paddingY: 'Vertical padding',
      duration: 'Duration',
      motion: 'Motion',
    },
    tokenType: 'Token type',
    tokenPath: 'Token path',
    selectToken: 'Select a token',
    tokenTypes: {
      color: 'Color',
      spacing: 'Spacing',
      radius: 'Radius',
      typography: 'Typography',
      motion: 'Motion',
    },
  },
};

const contract: ComponentContract = {
  type: 'card',
  name: 'Button',
  purpose: {
    en: 'Triggers an action.',
    fr: 'Déclenche une action.',
  },
  usageGuidelines: {
    en: 'Use for clear user actions.',
    fr: 'Utiliser pour des actions utilisateur claires.',
  },
  contentGuidelines: {
    en: 'Start labels with a verb.',
    fr: 'Commencer les labels par un verbe.',
  },
  status: 'ready',
  anatomy: [
    {
      key: 'root',
      label: {
        en: 'Root',
        fr: 'Racine',
      },
      requirement: 'required',
    },
    {
      key: 'icon-leading',
      label: {
        en: 'Leading icon',
        fr: 'Icône de début',
      },
      requirement: 'optional',
    },
  ],
  variants: [
    {
      key: 'primary',
      label: {
        en: 'Primary',
        fr: 'Primaire',
      },
    },
  ],
  states: [
    {
      key: 'disabled',
      label: {
        en: 'Disabled',
        fr: 'Désactivé',
      },
    },
  ],
  accessibility: [
    {
      key: 'accessible-name',
      severity: 'critical',
      description: {
        en: 'Buttons must expose an accessible name.',
        fr: 'Les boutons doivent exposer un nom accessible.',
      },
    },
  ],
  forbiddenPatterns: [
    {
      en: 'Do not use a button as a navigation link.',
      fr: 'Ne pas utiliser un bouton comme lien de navigation.',
    },
  ],
  sizes: [],
  tokenBindings: [],
};

const tokenOptions = [
  {
    type: 'color' as const,
    path: 'color.background.default',
    label: 'color.background.default',
  },
  {
    type: 'spacing' as const,
    path: 'spacing.4',
    label: 'spacing.4',
  },
  {
    type: 'radius' as const,
    path: 'radius.md',
    label: 'radius.md',
  },
  {
    type: 'typography' as const,
    path: 'typography.fontWeight.semibold',
    label: 'typography.fontWeight.semibold',
  },
  {
    type: 'motion' as const,
    path: 'motion.duration.fast',
    label: 'motion.duration.fast',
  },
];

describe('ComponentContractEditor', () => {
  it('renders localized content and compact contract sections', () => {
    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Button');
    expect(screen.getByLabelText('Purpose · EN')).toHaveValue(
      'Triggers an action.',
    );
    expect(screen.getByLabelText('Usage guidelines · EN')).toHaveValue(
      'Use for clear user actions.',
    );
    expect(screen.getByLabelText('Content guidelines · EN')).toHaveValue(
      'Start labels with a verb.',
    );
    expect(screen.getAllByLabelText('Anatomy key')[0]).toHaveValue('root');
    expect(screen.getAllByLabelText('Anatomy label')[0]).toHaveValue('Root');
    expect(
      screen.getAllByLabelText('Anatomy requirement')[0],
    ).toHaveTextContent('Required');
    expect(screen.getByText('Variants & states')).toBeInTheDocument();
    expect(screen.getByText('intent')).toBeInTheDocument();
    expect(screen.getByText('size')).toBeInTheDocument();
    expect(screen.getByText('states')).toBeInTheDocument();
    expect(screen.getByText('Accessibility contract')).toBeInTheDocument();
    expect(screen.getByText('Localized content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Purpose · FR')).not.toBeInTheDocument();
  });

  it('switches localized content and anatomy labels together', async () => {
    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'FR' }));

    expect(screen.getByLabelText('Purpose · FR')).toHaveValue(
      'Déclenche une action.',
    );
    expect(screen.getByLabelText('Usage guidelines · FR')).toHaveValue(
      'Utiliser pour des actions utilisateur claires.',
    );
    expect(screen.getByLabelText('Content guidelines · FR')).toHaveValue(
      'Commencer les labels par un verbe.',
    );
    expect(screen.getAllByLabelText('Anatomy label')[0]).toHaveValue('Racine');
  });

  it('adds a structured anatomy part with an optional requirement', async () => {
    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Add anatomy item/ }),
    );

    const anatomyKeys = screen.getAllByLabelText('Anatomy key');
    const anatomyRequirements = screen.getAllByLabelText('Anatomy requirement');

    expect(anatomyKeys).toHaveLength(3);
    expect(anatomyRequirements[2]).toHaveTextContent('Optional');
  });

  it('adds an editable size tag', async () => {
    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    const initialKeyFields = screen.getAllByLabelText('Key');

    await userEvent.click(screen.getByRole('button', { name: /Add size/ }));

    expect(screen.getAllByLabelText('Key')).toHaveLength(
      initialKeyFields.length + 1,
    );
  });

  it('keeps a new variant pill focused during continuous typing', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Add variant/ }));

    const newVariantInput = screen
      .getAllByLabelText('Key')
      .find((input) => (input as HTMLInputElement).value === '');

    expect(newVariantInput).toBeDefined();

    if (!newVariantInput) {
      return;
    }

    await user.click(newVariantInput);
    await user.keyboard('ghost');

    expect(screen.getByDisplayValue('ghost')).toHaveFocus();
  });

  it('shows an unsaved notice after editing an anatomy requirement', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    const [firstAnatomyRequirement] = screen.getAllByLabelText(
      'Anatomy requirement',
    );

    expect(firstAnatomyRequirement).toBeDefined();

    if (!firstAnatomyRequirement) {
      return;
    }

    await user.click(firstAnatomyRequirement);
    await user.click(screen.getByRole('option', { name: 'Derived' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Unsaved local changes.',
    );
  });

  it('enables the save button after a valid local change', () => {
    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    const saveButton = screen.getByRole('button', { name: 'Save contract' });

    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Name'), {
      target: {
        value: 'Primary Button',
      },
    });

    expect(saveButton).toBeEnabled();
  });

  it('adds a guided visual token binding', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Add visual token/ }));

    expect(
      screen.getByRole('combobox', { name: 'Preview role' }),
    ).toHaveTextContent('Background');
    expect(screen.getByLabelText('Token type')).toHaveTextContent('Color');
    expect(screen.getByLabelText('Token type')).toBeDisabled();

    const tokenPathSelect = screen.getByRole('combobox', {
      name: 'Token path',
    });
    await user.click(tokenPathSelect);

    expect(
      screen.getByRole('option', { name: 'color.background.default' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'radius.md' }),
    ).not.toBeInTheDocument();
  });

  it('disables official preview roles that are already used', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Add visual token/ }));
    await user.click(screen.getByRole('button', { name: /Add visual token/ }));

    const roleSelects = screen.getAllByRole('combobox', {
      name: 'Preview role',
    });
    expect(roleSelects[0]).toHaveTextContent('Background');
    expect(roleSelects[1]).toHaveTextContent('Foreground');

    if (!roleSelects[1]) {
      return;
    }

    await user.click(roleSelects[1]);

    expect(
      screen.getByRole('option', {
        name: /Background background · Color · Already used in this contract/,
      }),
    ).toBeDisabled();
  });

  it('keeps arbitrary bindings available through the custom role fallback', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Add visual token/ }));
    await user.click(screen.getByRole('combobox', { name: 'Preview role' }));
    await user.click(
      screen.getByRole('option', {
        name: /Custom role \(advanced\) Use an arbitrary role key/,
      }),
    );

    const customRoleInput = screen.getByLabelText('Custom role key');
    await user.type(customRoleInput, 'fontWeight');

    expect(customRoleInput).toHaveValue('fontWeight');
    expect(screen.getByLabelText('Token type')).toBeEnabled();

    await user.click(screen.getByLabelText('Token type'));
    await user.click(screen.getByRole('option', { name: 'Typography' }));

    expect(screen.getByLabelText('Token type')).toHaveTextContent('Typography');
  });

  it('keeps every Button section except naming collapsible and aligns section actions in their headers', () => {
    const buttonContract: ComponentContract = {
      ...contract,
      type: 'button',
    };

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={buttonContract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(screen.getByLabelText('Name').closest('details')).toBeNull();
    expect(
      screen.getByText('Variants & states').closest('details'),
    ).not.toBeNull();

    for (const title of [
      'Localized content',
      'Anatomy',
      'Accessibility contract',
      'Forbidden patterns',
    ]) {
      expect(screen.getByText(title).closest('details')).not.toBeNull();
    }

    const anatomySummary = screen.getByText('Anatomy').closest('summary');
    const anatomyAction = screen.getByRole('button', {
      name: /Add anatomy item/,
    });
    expect(anatomyAction.closest('summary')).toBe(anatomySummary);
    expect(anatomyAction.parentElement).toHaveClass(
      'hidden',
      'group-open:block',
    );
    expect(anatomySummary?.querySelector('svg')).not.toBeNull();

    const accessibilitySummary = screen
      .getByText('Accessibility contract')
      .closest('summary');
    const accessibilityAction = screen.getByRole('button', {
      name: /Add accessibility rule/,
    });
    expect(accessibilityAction.closest('summary')).toBe(accessibilitySummary);
    expect(accessibilityAction.parentElement).toHaveClass(
      'hidden',
      'group-open:block',
    );
    expect(accessibilitySummary?.querySelector('svg')).not.toBeNull();
  });

  it('hides the legacy Visual Tokens editor entirely for Button', () => {
    const buttonContract: ComponentContract = {
      ...contract,
      type: 'button',
      tokenBindings: [
        {
          key: 'radius',
          tokenType: 'radius',
          tokenPath: 'radius.md',
        },
      ],
    };

    render(
      <ComponentContractEditor
        componentKey="button"
        locale="en"
        projectSlug="demo"
        contract={buttonContract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Add visual token/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('combobox', { name: 'Preview role' }),
    ).not.toBeInTheDocument();
  });
});
