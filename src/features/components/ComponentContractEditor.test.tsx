import { describe, expect, it } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import { fireEvent, render, screen } from '@testing-library/react';

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

const labels: ComponentContractEditorLabels = {
  title: 'Component contract editor',
  description: 'Edit this component contract.',
  unsavedNotice: 'Unsaved local changes.',
  validationTitle: 'Validation errors',
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
};

describe('ComponentContractEditor', () => {
  it('renders editable component contract fields', () => {
    render(
      <ComponentContractEditor
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
      />,
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Button');
    expect(screen.getByLabelText('Purpose EN')).toHaveValue(
      'Triggers an action.',
    );
    expect(screen.getByText('Variants')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
  });

  it('shows an unsaved notice after editing a field', () => {
    render(
      <ComponentContractEditor
        locale="en"
        projectSlug="project"
        contract={contract}
        labels={labels}
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
});
