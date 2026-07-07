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
    schemaNotice:
      'Usage guidelines and Content guidelines are not persisted yet.',
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
    purposeEn: 'Purpose EN',
    purposeFr: 'Purpose FR',
  },
  anatomy: {
    title: 'Anatomy',
    description: 'Edit anatomy parts.',
    add: 'Add anatomy item',
  },
  variants: {
    title: 'Variants',
    add: 'Add variant',
  },
  states: {
    title: 'States',
    add: 'Add state',
  },
  accessibility: {
    title: 'Accessibility',
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
  status: 'ready',
  anatomy: ['root', 'label'],
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

describe('ComponentContractEditor', () => {
  it('renders editable component contract fields', () => {
    render(
      <ComponentContractEditor
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={[
          {
            type: 'color',
            path: 'color.background.default',
            label: 'color.background.default',
          },
          {
            type: 'radius',
            path: 'radius.md',
            label: 'radius.md',
          },
        ]}
      />,
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Button');
    expect(screen.getByLabelText('Purpose EN')).toHaveValue(
      'Triggers an action.',
    );
    expect(screen.getByText('Variants')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Localized content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'FR' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Purpose FR')).not.toBeInTheDocument();
  });

  it('shows an unsaved notice after editing a field', () => {
    render(
      <ComponentContractEditor
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
        tokenOptions={[
          {
            type: 'color',
            path: 'color.background.default',
            label: 'color.background.default',
          },
          {
            type: 'radius',
            path: 'radius.md',
            label: 'radius.md',
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: {
        value: 'Primary Button',
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
        tokenOptions={[
          {
            type: 'color',
            path: 'color.background.default',
            label: 'color.background.default',
          },
          {
            type: 'radius',
            path: 'radius.md',
            label: 'radius.md',
          },
        ]}
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
        tokenOptions={[
          {
            type: 'color',
            path: 'color.background.default',
            label: 'color.background.default',
          },
          {
            type: 'radius',
            path: 'radius.md',
            label: 'radius.md',
          },
        ]}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Add visual token' }),
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
