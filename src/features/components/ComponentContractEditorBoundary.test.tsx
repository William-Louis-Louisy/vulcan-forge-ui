import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import type { ComponentContractEditorLabels } from './ComponentContractEditor';

vi.mock('./ComponentContractEditor', async () => {
  const React = await import('react');

  function MockComponentContractEditor({
    contract,
  }: {
    contract: ComponentContract;
  }) {
    const [name, setName] = React.useState(contract.name);

    return (
      <input
        aria-label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    );
  }

  return {
    ComponentContractEditor: MockComponentContractEditor,
  };
});

import { ComponentContractEditorBoundary } from './ComponentContractEditorBoundary';

const buttonContract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: { en: 'Triggers an action.', fr: 'Déclenche une action.' },
  status: 'ready',
  anatomy: [],
  variants: [],
  sizes: [],
  states: [],
  tokenBindings: [],
  accessibility: [],
  forbiddenPatterns: [],
};

const textFieldContract: ComponentContract = {
  ...buttonContract,
  type: 'textField',
  name: 'TextField',
};

describe('ComponentContractEditorBoundary', () => {
  it('remounts the stateful editor when the selected component changes', () => {
    const { rerender } = render(
      <ComponentContractEditorBoundary
        componentId="button-id"
        componentKey="button"
        locale="en"
        projectSlug="project"
        contract={buttonContract}
        labels={{} as ComponentContractEditorLabels}
        tokenOptions={[]}
      />,
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Unsaved button name' },
    });

    expect(screen.getByLabelText('Name')).toHaveValue('Unsaved button name');

    rerender(
      <ComponentContractEditorBoundary
        componentId="text-field-id"
        componentKey="textField"
        locale="en"
        projectSlug="project"
        contract={textFieldContract}
        labels={{} as ComponentContractEditorLabels}
        tokenOptions={[]}
      />,
    );

    expect(screen.getByLabelText('Name')).toHaveValue('TextField');
  });
});
