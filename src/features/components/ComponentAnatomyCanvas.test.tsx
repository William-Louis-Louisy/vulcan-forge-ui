import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentAnatomyCanvas } from './ComponentAnatomyCanvas';

const workspaceMocks = vi.hoisted(() => ({
  setDraft: vi.fn(),
  setAuthoringSelection: vi.fn(),
}));

vi.mock('./ComponentContractWorkspaceContext', () => ({
  useComponentContractWorkspace: () => ({
    draft: {
      type: 'button',
      name: 'Button',
      status: 'ready',
      purpose: { en: 'Triggers an action.', fr: '' },
      usageGuidelines: { en: '', fr: '' },
      contentGuidelines: { en: '', fr: '' },
      anatomy: [
        {
          draftId: 'anatomy-0',
          key: 'root',
          label: { en: 'Root', fr: 'Racine' },
          requirement: 'required',
        },
        {
          draftId: 'anatomy-1',
          key: 'label',
          label: { en: 'Label', fr: 'Libellé' },
          requirement: 'required',
        },
      ],
      variants: [],
      sizes: [],
      states: [],
      tokenBindings: [],
      accessibility: [],
      forbiddenPatterns: [],
    },
    setDraft: workspaceMocks.setDraft,
    activeLocale: 'en',
    authoringSelection: { kind: 'component' },
    setAuthoringSelection: workspaceMocks.setAuthoringSelection,
  }),
}));

const labels = {
  title: 'Anatomy',
  description: 'Define the structural parts of the component.',
  add: 'Add anatomy item',
  component: 'Component',
  flatStructure: 'Flat contract structure',
  empty: 'No anatomy parts yet.',
  selectPart: 'Select a part to edit it in the Inspector.',
  untitled: 'Untitled part',
  requirements: {
    required: 'Required',
    optional: 'Optional',
    derived: 'Derived',
  },
};

describe('ComponentAnatomyCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the flat anatomy structure and sends part selection to the Inspector context', async () => {
    const user = userEvent.setup();

    render(<ComponentAnatomyCanvas labels={labels} />);

    expect(screen.getByText('Flat contract structure')).toBeInTheDocument();
    expect(screen.getByText('Root')).toBeInTheDocument();
    expect(screen.getByText('Label')).toBeInTheDocument();

    const rootPartButton = screen.getByText('Root').closest('button');
    expect(rootPartButton).not.toBeNull();

    await user.click(rootPartButton!);

    expect(workspaceMocks.setAuthoringSelection).toHaveBeenLastCalledWith({
      kind: 'anatomyPart',
      draftId: 'anatomy-0',
    });

    const componentButton = screen.getByText('Button').closest('button');
    expect(componentButton).not.toBeNull();

    await user.click(componentButton!);

    expect(workspaceMocks.setAuthoringSelection).toHaveBeenLastCalledWith({
      kind: 'component',
    });
  });
});
