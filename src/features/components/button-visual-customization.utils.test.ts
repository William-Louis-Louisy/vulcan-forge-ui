import { describe, expect, it } from 'vitest';
import {
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  resolveComponentVisualProperties,
} from '@/domain/design-system';
import {
  createButtonVisualCustomizationFingerprint,
  getButtonVisualProperty,
  resetButtonVisualGroup,
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

  it('resets an entire visual group only in the selected scope', () => {
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
      { kind: 'base' },
      'border',
      'width',
      { source: 'value', value: '2px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'border',
      'color',
      { source: 'value', value: '#112233' },
    );

    const reset = resetButtonVisualGroup(
      contract,
      { kind: 'base' },
      'border',
    );

    expect(reset.visual.border).toBeUndefined();
    expect(reset.visual.spacing?.paddingX).toEqual({
      source: 'value',
      value: '12px',
    });
    expect(reset.overrides.variants.primary?.border?.color).toEqual({
      source: 'value',
      value: '#112233',
    });
  });

  it('fingerprints only visual customization state', () => {
    const contract = createButtonContract();
    const renamed = { ...contract, name: 'Renamed Button' };

    expect(createButtonVisualCustomizationFingerprint(renamed)).toBe(
      createButtonVisualCustomizationFingerprint(contract),
    );
  });

  it('resetting a corner keeps the authored uniform radius intact', () => {
    let contract = createButtonContract();
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'radius',
      { source: 'value', value: '8px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'topLeft',
      { source: 'value', value: '18px' },
    );
    contract = resetButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'topLeft',
    );

    expect(
      getButtonVisualProperty(contract, { kind: 'base' }, 'radius', 'topLeft'),
    ).toBeUndefined();
    expect(
      getButtonVisualProperty(contract, { kind: 'base' }, 'radius', 'radius'),
    ).toEqual({ source: 'value', value: '8px' });
  });

  it('setting a uniform base radius clears same-layer corner overrides', () => {
    let contract = createButtonContract();
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'topLeft',
      { source: 'value', value: '18px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'bottomRight',
      { source: 'value', value: '32px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'radius',
      { source: 'value', value: '8px' },
    );

    expect(contract.visual.radius).toEqual({
      radius: { source: 'value', value: '8px' },
    });
  });

  it('setting a uniform override radius clears corners only in that override layer', () => {
    let contract = createButtonContract();
    contract = setButtonVisualProperty(
      contract,
      { kind: 'base' },
      'radius',
      'topLeft',
      { source: 'value', value: '24px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'radius',
      'topRight',
      { source: 'value', value: '18px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'radius',
      'bottomLeft',
      { source: 'value', value: '32px' },
    );
    contract = setButtonVisualProperty(
      contract,
      { kind: 'variant', key: 'primary' },
      'radius',
      'radius',
      { source: 'value', value: '6px' },
    );

    expect(contract.visual.radius?.topLeft).toEqual({
      source: 'value',
      value: '24px',
    });
    expect(contract.overrides.variants.primary?.radius).toEqual({
      radius: { source: 'value', value: '6px' },
    });
  });
});
