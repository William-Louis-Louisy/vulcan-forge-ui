import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import { fireEvent, render, screen } from '@testing-library/react';

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

import {
  ComponentContractEditor,
  type ComponentContractEditorLabels,
} from './ComponentContractEditor';
import userEvent from '@testing-library/user-event';

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
    tokenType: 'Token type',
    tokenPath: 'Token path',
    selectToken: 'Select a token',
  },
};

const contract: ComponentContract = {
  type: 'button',
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
    type: 'radius' as const,
    path: 'radius.md',
    label: 'radius.md',
  },
];

describe('ComponentContractEditor', () => {
  it('renders localized content and compact contract sections', () => {
    render(
      <ComponentContractEditor
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
    expect(screen.getAllByLabelText('Anatomy requirement')[0]).toHaveValue(
      'required',
    );
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
    expect(anatomyRequirements[2]).toHaveValue('optional');
  });

  it('adds an editable size tag', async () => {
    render(
      <ComponentContractEditor
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
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await user.click(screen.getByRole('button', { name: /Add variant/ }));

    const newVariantInput = screen.getAllByLabelText('Key').at(-1);

    expect(newVariantInput).toBeDefined();

    if (!newVariantInput) {
      return;
    }

    await user.click(newVariantInput);
    await user.keyboard('ghost');

    const updatedVariantInput = screen.getAllByLabelText('Key').at(-1);

    expect(updatedVariantInput).toHaveValue('ghost');
    expect(updatedVariantInput).toHaveFocus();
  });

  it('shows an unsaved notice after editing an anatomy requirement', () => {
    render(
      <ComponentContractEditor
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

    fireEvent.change(firstAnatomyRequirement, {
      target: {
        value: 'derived',
      },
    });

    expect(screen.getByRole('status')).toHaveTextContent(
      'Unsaved local changes.',
    );
  });

  it('enables the save button after a valid local change', () => {
    render(
      <ComponentContractEditor
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

  it('adds a visual token binding', async () => {
    render(
      <ComponentContractEditor
        locale="en"
        projectSlug="demo"
        contract={contract}
        labels={labels}
        tokenOptions={tokenOptions}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Add visual token/ }),
    );

    expect(screen.getByLabelText('Token type')).toBeInTheDocument();
    expect(screen.getByLabelText('Token path')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Token path' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'color.background.default' }),
    ).toBeInTheDocument();
  });
});
