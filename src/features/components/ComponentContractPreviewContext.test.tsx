import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  migrateLegacyComponentContract,
  type ComponentContract,
} from '@/domain/design-system';
import {
  ComponentContractPreviewProvider,
  useComponentContractPreview,
} from './ComponentContractPreviewContext';

const legacyButtonContract: ComponentContract = {
  type: 'button',
  name: 'Button',
  purpose: { en: 'Triggers an action.' },
  status: 'ready',
  anatomy: [],
  variants: [],
  sizes: [],
  states: [],
  tokenBindings: [
    {
      key: 'radius',
      tokenType: 'radius',
      tokenPath: 'radius.md',
    },
  ],
  accessibility: [],
  forbiddenPatterns: [],
};

function Harness() {
  const preview = useComponentContractPreview();

  if (!preview) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          preview.setContractV2({
            ...preview.contractV2,
            visual: {
              ...preview.contractV2.visual,
              radius: {
                radius: { source: 'value', value: '8px' },
                topLeft: { source: 'value', value: '18px' },
                bottomRight: { source: 'value', value: '32px' },
              },
            },
          })
        }
      >
        Author V2 radius
      </button>
      <button
        type="button"
        onClick={() =>
          preview.setContract({
            ...preview.contract,
            tokenBindings: [
              {
                key: 'radius',
                tokenType: 'radius',
                tokenPath: 'radius.xl',
              },
            ],
          })
        }
      >
        Change legacy radius
      </button>
      <output data-testid="radius-state">
        {JSON.stringify(preview.contractV2.visual.radius)}
      </output>
    </>
  );
}

describe('ComponentContractPreviewProvider Button V2 ownership', () => {
  it('keeps the migrated initial radius but ignores later legacy radius rewrites', async () => {
    const user = userEvent.setup();
    const initialContractV2 =
      migrateLegacyComponentContract(legacyButtonContract);

    render(
      <ComponentContractPreviewProvider
        initialContract={legacyButtonContract}
        initialContractV2={initialContractV2}
      >
        <Harness />
      </ComponentContractPreviewProvider>,
    );

    expect(screen.getByTestId('radius-state')).toHaveTextContent('radius.md');

    await user.click(screen.getByRole('button', { name: 'Author V2 radius' }));
    await user.click(
      screen.getByRole('button', { name: 'Change legacy radius' }),
    );

    const radiusState = screen.getByTestId('radius-state');
    expect(radiusState).toHaveTextContent('"8px"');
    expect(radiusState).toHaveTextContent('"18px"');
    expect(radiusState).toHaveTextContent('"32px"');
    expect(radiusState).not.toHaveTextContent('radius.xl');
  });
});
