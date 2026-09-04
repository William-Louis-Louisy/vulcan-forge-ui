import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  componentContractV2Schema,
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

const contractV2 = migrateLegacyComponentContract(contract);

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
  contractV2,
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

function ApplyDirectV2VisualButton() {
  const preview = useComponentContractPreview();

  return (
    <button
      type="button"
      onClick={() => {
        if (!preview) {
          return;
        }

        preview.setContractV2(
          componentContractV2Schema.parse({
            ...preview.contractV2,
            visual: {
              ...preview.contractV2.visual,
              spacing: {
                ...preview.contractV2.visual.spacing,
                paddingX: { source: 'value', value: '24px' },
              },
              radius: {
                topLeft: { source: 'value', value: '18px' },
                topRight: { source: 'value', value: '4px' },
                bottomRight: { source: 'value', value: '18px' },
                bottomLeft: { source: 'value', value: '4px' },
              },
            },
          }),
        );
      }}
    >
      Apply V2 visual
    </button>
  );
}

describe('ComponentFoundationsPreviewClient', () => {
  it('renders the Primary base Button template without a border', () => {
    render(
      <ComponentContractPreviewProvider
        initialContract={contract}
        initialContractV2={contractV2}
      >
        <ComponentFoundationsPreviewClient
          locale="en"
          component={component}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    const previewButton = screen.getByRole('button', { name: 'Button' });

    expect(previewButton).toHaveStyle({ borderStyle: 'none' });
    expect(previewButton).not.toHaveClass('border');
  });

  it('updates the Button V2 matrix when the legacy editor publishes a visual token binding', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractPreviewProvider
        initialContract={contract}
        initialContractV2={contractV2}
      >
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

  it('applies direct V2 spacing and asymmetric radius changes immediately', async () => {
    const user = userEvent.setup();

    render(
      <ComponentContractPreviewProvider
        initialContract={contract}
        initialContractV2={contractV2}
      >
        <ApplyDirectV2VisualButton />
        <ComponentFoundationsPreviewClient
          locale="en"
          component={component}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    const previewButton = screen.getByRole('button', { name: 'Button' });

    await user.click(screen.getByRole('button', { name: 'Apply V2 visual' }));

    expect(previewButton).toHaveStyle({
      paddingInline: '24px',
      borderRadius: '18px 4px 18px 4px',
    });
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
    const alertContractV2 = migrateLegacyComponentContract(alertContract);
    const alertComponent: ComponentRegistryItem = {
      ...component,
      id: 'alert',
      key: 'alert',
      templateKey: 'alert',
      type: 'alert',
      name: 'Alert',
      category: 'feedback',
      contract: alertContract,
      contractV2: alertContractV2,
    };

    render(
      <ComponentContractPreviewProvider
        initialContract={alertContract}
        initialContractV2={alertContractV2}
      >
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

  it('renders TextField through the V2 resolver without a legacy binding notice', async () => {
    const user = userEvent.setup();
    const textFieldContract: ComponentContract = {
      ...contract,
      type: 'textField',
      name: 'TextField',
      variants: [
        {
          key: 'default',
          label: { en: 'Default' },
        },
      ],
      sizes: [
        {
          key: 'md',
          label: { en: 'Medium' },
        },
      ],
      states: [
        {
          key: 'focus',
          label: { en: 'Focus' },
        },
        {
          key: 'invalid',
          label: { en: 'Invalid' },
        },
        {
          key: 'disabled',
          label: { en: 'Disabled' },
        },
      ],
      tokenBindings: [],
    };
    const migratedTextFieldContract = migrateLegacyComponentContract(
      textFieldContract,
      {
        key: 'textField',
        name: 'TextField',
        templateKey: 'textField',
        category: 'input',
      },
    );
    const textFieldContractV2 = componentContractV2Schema.parse({
      ...migratedTextFieldContract,
      visual: {
        ...migratedTextFieldContract.visual,
        surface: {
          background: { source: 'value', value: '#fefefe' },
        },
      },
      overrides: {
        ...migratedTextFieldContract.overrides,
        states: {
          ...migratedTextFieldContract.overrides.states,
          invalid: {
            border: {
              color: { source: 'value', value: '#cc0000' },
            },
          },
        },
      },
    });
    const textFieldComponent: ComponentRegistryItem = {
      ...component,
      id: 'text-field',
      key: 'textField',
      templateKey: 'textField',
      type: 'textField',
      name: 'TextField',
      category: 'input',
      contract: textFieldContract,
      contractV2: textFieldContractV2,
    };

    render(
      <ComponentContractPreviewProvider
        initialContract={textFieldContract}
        initialContractV2={textFieldContractV2}
      >
        <ComponentFoundationsPreviewClient
          locale="en"
          component={textFieldComponent}
          rawTokenSets={rawTokenSets}
        />
      </ComponentContractPreviewProvider>,
    );

    expect(
      screen.queryByText('foundationsPreview.noTokenBindingsNotice'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-component-v2-preview="textField"]'),
    ).not.toBeNull();

    const input = screen.getByRole('textbox', { name: 'TextField' });
    expect(input).toHaveAttribute('data-preview-v2', 'true');
    expect(input).toHaveStyle({ backgroundColor: '#fefefe' });

    const stateSelect = screen.getByRole('combobox', {
      name: 'foundationsPreview.state',
    });
    await user.click(stateSelect);
    await user.click(screen.getByRole('option', { name: 'Invalid' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveStyle({ borderColor: '#cc0000' });

    await user.click(stateSelect);
    await user.click(screen.getByRole('option', { name: 'Disabled' }));
    expect(input).toBeDisabled();
  });
});
