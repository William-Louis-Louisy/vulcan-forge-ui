import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ComponentContract } from '@/domain/design-system';
import {
  ComponentContractPreviewProvider,
  useComponentContractPreview,
} from './ComponentContractPreviewContext';
import { ComponentContractWorkspaceProvider } from './ComponentContractWorkspaceContext';
import { ComponentFoundationsPreviewClient } from './ComponentFoundationsPreviewClient';
import type { ComponentRegistryItem } from './components-registry.utils';

const routerMocks = vi.hoisted(() => ({
  refresh: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => routerMocks,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/en/app/projects/demo/components',
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

const contract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: {
    en: 'Triggers an action.',
  },
  status: 'ready',
  anatomy: ['root', 'label'],
  variants: [
    {
      key: 'primary',
      label: {
        en: 'Primary',
      },
    },
  ],
  sizes: [
    {
      key: 'md',
      label: {
        en: 'Medium',
      },
    },
  ],
  states: [],
  tokenBindings: [],
  accessibility: [],
  forbiddenPatterns: [],
};

const component: ComponentRegistryItem = {
  id: 'button',
  type: 'button',
  name: 'Button',
  status: 'ready',
  category: 'action',
  platforms: ['web'],
  contract,
  isValid: true,
  completeness: {
    score: 100,
    level: 'complete',
    missingFields: [],
    warnings: [],
  },
};

const rawTokenSets = [
  {
    type: 'color',
    name: 'Color',
    tokens: [
      {
        path: 'color.primitive.brand',
        type: 'color',
        value: '#ff0000',
        description: {
          en: 'Brand color.',
        },
        status: 'ready',
      },
    ],
  },
];

function ApplyVisualBindingButton() {
  const preview = useComponentContractPreview();

  return (
    <button
      type="button"
      onClick={() =>
        preview?.setContract({
          ...contract,
          tokenBindings: [
            {
              key: 'background',
              tokenType: 'color',
              tokenPath: 'color.primitive.brand',
            },
          ],
        })
      }
    >
      Apply visual binding
    </button>
  );
}

function renderPreview({
  previewContract = contract,
  previewComponent = component,
}: {
  previewContract?: ComponentContract;
  previewComponent?: ComponentRegistryItem;
} = {}) {
  return render(
    <ComponentContractPreviewProvider initialContract={previewContract}>
      <ComponentContractWorkspaceProvider
        locale="en"
        projectSlug="demo"
        contract={previewContract}
      >
        <ApplyVisualBindingButton />
        <ComponentFoundationsPreviewClient
          locale="en"
          component={previewComponent}
          rawTokenSets={rawTokenSets}
          mode="instance"
        />
      </ComponentContractWorkspaceProvider>
    </ComponentContractPreviewProvider>,
  );
}

describe('ComponentFoundationsPreviewClient', () => {
  it('updates the instance when the editor publishes a visual token binding', async () => {
    const user = userEvent.setup();

    renderPreview();

    const previewButton = screen.getByRole('button', { name: 'Button' });

    expect(previewButton).not.toHaveStyle({ backgroundColor: '#ff0000' });

    await user.click(
      screen.getByRole('button', { name: 'Apply visual binding' }),
    );

    expect(previewButton).toHaveStyle({ backgroundColor: '#ff0000' });
    expect(screen.getByText('#ff0000')).toBeInTheDocument();
  });

  it('warns when an Alert has no semantic status palette', () => {
    const alertContract: ComponentContract = {
      ...contract,
      type: 'alert',
      name: 'Alert',
      variants: [
        {
          key: 'info',
          label: {
            en: 'Info',
          },
        },
      ],
    };
    const alertComponent: ComponentRegistryItem = {
      ...component,
      id: 'alert',
      type: 'alert',
      name: 'Alert',
      category: 'feedback',
      contract: alertContract,
    };

    renderPreview({
      previewContract: alertContract,
      previewComponent: alertComponent,
    });

    expect(
      screen.getByText('foundationsPreview.missingStatusColorsNotice'),
    ).toBeInTheDocument();
  });
});
