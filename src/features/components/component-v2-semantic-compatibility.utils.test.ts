import { describe, expect, it } from 'vitest';
import {
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  type ComponentContract,
} from '@/domain/design-system';
import { mergeLegacySemanticContractIntoV2 } from './component-v2-semantic-compatibility.utils';

function getButtonSeed(): ComponentContract {
  const seed = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === 'button',
  );

  if (!seed) {
    throw new Error('Button seed is required for this test');
  }

  return seed;
}

describe('mergeLegacySemanticContractIntoV2', () => {
  it('updates semantic fields without losing visual, slots or sparse overrides', () => {
    const seed = getButtonSeed();
    const current = migrateLegacyComponentContract(seed);
    current.visual.spacing = {
      paddingX: { source: 'value', value: '20px' },
    };
    current.overrides.variants.primary = {
      radius: {
        topLeft: { source: 'value', value: '16px' },
      },
    };
    current.slots.leadingIcon = {
      enabled: true,
      visual: {
        dimensions: {
          width: { source: 'value', value: '16px' },
        },
      },
    };

    const semanticUpdate: ComponentContract = {
      ...seed,
      name: 'Primary action',
      purpose: {
        en: 'Updated semantic purpose.',
        fr: 'Objectif sémantique mis à jour.',
      },
      status: 'ready',
    };
    const next = mergeLegacySemanticContractIntoV2(current, semanticUpdate);

    expect(next.name).toBe('Primary action');
    expect(next.purpose).toEqual(semanticUpdate.purpose);
    expect(next.status).toBe('ready');
    expect(next.visual).toEqual(current.visual);
    expect(next.slots).toEqual(current.slots);
    expect(next.overrides).toEqual(current.overrides);
  });
});
