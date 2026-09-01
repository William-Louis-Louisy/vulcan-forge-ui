import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  migrateLegacyComponentContract,
  type ComponentContract,
} from '@/domain/design-system';
import {
  ComponentContractPreviewProvider,
  useComponentContractPreview,
} from './ComponentContractPreviewContext';
import { ComponentFoundationsPreviewClient } from './ComponentFoundationsPreviewClient';
import type { ComponentRegistryItem } from './components-registry.utils';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
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
  key: 'button',
  templateKey: 'button',
  type: 'button',
  name: 'Button',
  status: 'ready',
  category: 'action',
  platforms: ['web'],
  contract,
  contractV2: migrateLegacyComponentContract(contract),
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

describe('ComponentFoundationsPreviewClient', () => {
  it('updates the matrix when the editor publishes a visual token binding', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractPreviewProvider initialContract={contract}>
        <ApplyVisualBindingButton />
        <ComponentFoundationsPreviewClient
          locale="en"
          component={component}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    const previewButton = screen.getByRole('button', { name: 'Button' });

    expect(previewButton).not.toHaveStyle({ backgroundColor: '#ff0000' });

    await user.click(
      screen.getByRole('button', { name: 'Apply visual binding' }),
    );

    expect(previewButton).toHaveStyle({ backgroundColor: '#ff0000' });
    expect(screen.getByText('#ff0000')).toBeInTheDocument();
  });

  it('routes rendering from templateKey instead of the legacy identity type', () => {
    const marketingContract: ComponentContract = {
      ...contract,
      name: 'Marketing CTA',
    };
    const marketingComponent: ComponentRegistryItem = {
      ...component,
      id: 'marketing-cta',
      key: 'marketingCta',
      templateKey: 'button',
      type: 'card',
      name: 'Marketing CTA',
      contract: marketingContract,
      contractV2: migrateLegacyComponentContract(marketingContract, {
        key: 'marketingCta',
        name: 'Marketing CTA',
        templateKey: 'button',
        category: 'action',
      }),
    };

    render(
      <ComponentFoundationsPreviewClient
        locale="en"
        component={marketingComponent}
        rawTokenSets={rawTokenSets}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Marketing CTA' }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-preview-component="card"]'),
    ).not.toBeInTheDocument();
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
      key: 'alert',
      templateKey: 'alert',
      type: 'alert',
      name: 'Alert',
      category: 'feedback',
      contract: alertContract,
      contractV2: migrateLegacyComponentContract(alertContract),
    };

    render(
      <ComponentContractPreviewProvider initialContract={alertContract}>
        <ComponentFoundationsPreviewClient
          locale="en"
          component={alertComponent}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    expect(
      screen.getByText('foundationsPreview.missingStatusColorsNotice'),
    ).toBeInTheDocument();
  });
});
