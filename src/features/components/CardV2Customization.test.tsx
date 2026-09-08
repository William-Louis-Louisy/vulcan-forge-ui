import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  componentContractV2Schema,
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  type ComponentContractV2,
} from '@/domain/design-system';
import { ButtonVisualPreviewMatrix } from './ButtonVisualPreviewMatrix';
import type { ComponentRegistryItem } from './components-registry.utils';
import {
  createComponentPreviewSemanticPalette,
} from './component-token-bindings.utils';

const cardSelector = '[data-preview-component="card"]';
const v2CardSelector = '[data-component-v2-preview="card"]';

function createCardFixture() {
  const semanticContract = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === 'card',
  );

  if (!semanticContract) {
    throw new Error('Card seed is required for this test');
  }

  const migrated = migrateLegacyComponentContract(semanticContract);
  const contractV2: ComponentContractV2 = componentContractV2Schema.parse({
    ...migrated,
    visual: {
      surface: {
        background: { source: 'value', value: '#fefefe' },
      },
    },
    overrides: {
      variants: {
        interactive: {
          border: {
            width: { source: 'value', value: '2px' },
            style: 'solid',
            color: { source: 'value', value: '#cc0000' },
          },
        },
      },
      sizes: {
        lg: {
          radius: {
            radius: { source: 'value', value: '18px' },
          },
        },
      },
      states: {},
    },
  });
  const component: ComponentRegistryItem = {
    id: 'card',
    key: 'card',
    templateKey: 'card',
    type: 'card',
    name: 'Card',
    status: 'ready',
    category: 'layout',
    platforms: ['web'],
    contract: semanticContract,
    contractV2,
    isValid: true,
    completeness: {
      score: 100,
      level: 'complete',
      missingFields: [],
      warnings: [],
    },
  };

  return { component, contractV2 };
}

const labels = {
  baseState: 'Base',
  state: 'State',
};

const semanticPalette = createComponentPreviewSemanticPalette([]);

describe('Card V2 customization preview', () => {
  it('resolves Card V2 base, variant and size layers', () => {
    const { component, contractV2 } = createCardFixture();
    const { container } = render(
      <ButtonVisualPreviewMatrix
        locale="en"
        component={component}
        contractV2={contractV2}
        labels={labels}
        rawTokenSets={[]}
        semanticPalette={semanticPalette}
      />,
    );

    expect(container.querySelector(v2CardSelector)).not.toBeNull();

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(cardSelector),
    );
    const interactiveLargeCard = cards.at(-1);

    expect(interactiveLargeCard).toHaveAttribute('data-preview-v2', 'true');
    expect(interactiveLargeCard).toHaveStyle({
      backgroundColor: '#fefefe',
      borderTopWidth: '2px',
      borderRightWidth: '2px',
      borderBottomWidth: '2px',
      borderLeftWidth: '2px',
      borderColor: '#cc0000',
      borderRadius: '18px',
    });
  });

  it('renders only enabled Card slots', () => {
    const { component, contractV2 } = createCardFixture();
    const slotsContract = componentContractV2Schema.parse({
      ...contractV2,
      slots: {
        ...contractV2.slots,
        header: { enabled: false },
        content: { enabled: true },
        footer: { enabled: false },
      },
    });

    const { container } = render(
      <ButtonVisualPreviewMatrix
        locale="en"
        component={{ ...component, contractV2: slotsContract }}
        contractV2={slotsContract}
        labels={labels}
        rawTokenSets={[]}
        semanticPalette={semanticPalette}
      />,
    );

    const firstCard = container.querySelector(cardSelector);

    expect(firstCard?.querySelector('[data-card-slot="header"]')).toBeNull();
    expect(
      firstCard?.querySelector('[data-card-slot="content"]'),
    ).not.toBeNull();
    expect(firstCard?.querySelector('[data-card-slot="footer"]')).toBeNull();
  });
});
