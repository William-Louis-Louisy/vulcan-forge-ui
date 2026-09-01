import { describe, expect, it } from 'vitest';
import {
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  resolveComponentVisualProperties,
} from '@/domain/design-system';
import {
  createButtonVisualCustomizationFingerprint,
  getButtonVisualProperty,
  resetButtonVisualProperty,
  setButtonVisualProperty,
} from './button-visual-customization.utils';

function createButtonContract() {
  const seed = mvpComponentContractSeeds.find(
    (candidate) => candidate.type === 'button',
  );

  if (!seed) {
    throw new Error('Button seed is required for this test');
  }

  return migrateLegacyComponentContract(seed);
}

describe('Button visual customization utilities', () => {
  it('writes validated direct visual properties to the base layer', () => {
    const contract = createButtonContract();
    const next = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'spacing',
      'paddingX',
      { source: 'value', value: '20px' },
    );

    expect(
      getButtonVisualProperty(next, { kind: 'base' }, 'spacing', 'paddingX'),
    ).toEqual({ source: 'value', value: '20px' });
  });

  it('keeps variant, size and state overrides sparse and independent', () => {
    const contract = createButtonContract();
    const withVariant = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'surface',
      'background',
      { source: 'value', value: '#112233' },
    );
    const withSize = setButtonVisualProperty(
      withVariant,
      { kind: 'size', key: 'lg' },
      'spacing',
      'paddingX',
      { source: 'value', value: '24px' },
    );
    const withState = setButtonVisualProperty(
      withSize,
      { kind: 'state', key: 'hover' },
      'radius',
      'topLeft',
      { source: 'value', value: '14px' },
    );

    expect(withState.overrides.variants.primary).toEqual({
      surface: { background: { source: 'value', value: '#112233' } },
    });
    expect(withState.overrides.sizes.lg).toEqual({
      spacing: { paddingX: { source: 'value', value: '24px' } },
    });
    expect(withState.overrides.states.hover).toEqual({
      radius: { topLeft: { source: 'value', value: '14px' } },
    });
  });

  it('removes the property and empty override entry on reset', () => {
    const contract = setButtonVisualProperty(
      createButtonContract(),
      { kind: 'variant', key: 'primary' },
      'spacing',
      'paddingX',
      { source: 'value', value: '18px' },
    );
    const reset = resetButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'spacing',
      'paddingX',
    );

    expect(reset.overrides.variants.primary).toBeUndefined();
  });

  it('resolves template, base, variant, size and state in the documented order', () => {
    let contract = createButtonContract();
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'spacing',
      'paddingX',
      { source: 'value', value: '12px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'spacing',
      'paddingX',
      { source: 'value', value: '16px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'size', key: 'lg' },
      'spacing',
      'paddingX',
      { source: 'value', value: '20px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'state', key: 'hover' },
      'spacing',
      'paddingX',
      { source: 'value', value: '24px' },
    );

    const resolved = resolveComponentVisualProperties({
      base: contract.visual,
      overrides: contract.overrides,
      variantKey: 'primary',
      sizeKey: 'lg',
      stateKey: 'hover',
    });

    expect(resolved.spacing?.paddingX).toEqual({
      source: 'value',
      value: '24px',
    });
  });

  it('fingerprints only visual customization state', () => {
    const contract = createButtonContract();
    const renamed = { ...contract, name: 'Renamed Button' };

    expect(createButtonVisualCustomizationFingerprint(renamed)).toBe(
      createButtonVisualCustomizationFingerprint(contract),
    );
  });
});
