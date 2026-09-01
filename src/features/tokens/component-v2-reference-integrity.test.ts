import { describe, expect, it } from 'vitest';
import {
  componentContractV2Schema,
  migrateLegacyComponentContract,
  mvpComponentContractSeeds,
  type DesignToken,
} from '@/domain/design-system';
import { renameTokenAcrossProject } from './rename-token.utils';
import {
  detachComponentTokenBindings,
  findTokenDependencies,
} from './delete-token.utils';

const buttonSeed = mvpComponentContractSeeds.find(
  (seed) => seed.type === 'button',
);

function createStoredButtonV2() {
  const contract = migrateLegacyComponentContract(buttonSeed, {
    key: 'marketingCta',
    name: 'Marketing CTA',
    templateKey: 'button',
    category: 'action',
  });

  return {
    id: 'component-marketing-cta',
    key: contract.key,
    name: contract.name,
    templateKey: contract.templateKey,
    category: contract.category,
    contractVersion: 2,
    contract,
  };
}

describe('Component V2 token reference integrity', () => {
  const primaryColorToken: DesignToken = {
    path: 'color.semantic.action.primary',
    type: 'color',
    value: '#2563eb',
    status: 'ready',
  };

  it('renames first-class DesignValue references and legacy bindings together', () => {
    const component = createStoredButtonV2();
    const result = renameTokenAcrossProject({
      tokenSets: [{ id: 'colors', tokens: [primaryColorToken] }],
      targetTokenSetId: 'colors',
      themes: [],
      componentContracts: [component],
      currentTokenPath: 'color.semantic.action.primary',
      nextTokenPath: 'color.semantic.action.brandPrimary',
    });

    expect(result.status).toBe('success');

    if (result.status !== 'success') {
      return;
    }

    expect(result.componentUpdates).toHaveLength(1);

    const updatedContract = componentContractV2Schema.parse(
      result.componentUpdates[0]?.contract,
    );

    expect(updatedContract.visual.surface?.background).toEqual({
      source: 'token',
      tokenType: 'color',
      path: 'color.semantic.action.brandPrimary',
    });
    expect(
      updatedContract.tokenBindings.find(
        (binding) => binding.key === 'background',
      )?.tokenPath,
    ).toBe('color.semantic.action.brandPrimary');
    expect(result.migratedReferencesCount).toBe(2);
  });

  it('detects and detaches first-class DesignValue references on deletion', () => {
    const component = createStoredButtonV2();
    const tokenPath = 'color.semantic.action.primary';
    const dependencies = findTokenDependencies({
      tokenPath,
      tokenSets: [],
      themes: [],
      componentContracts: [component],
    });

    expect(dependencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'component',
          label: expect.stringContaining('visual.surface.background'),
        }),
        expect.objectContaining({
          kind: 'component',
          label: expect.stringContaining('background'),
        }),
      ]),
    );

    const detached = detachComponentTokenBindings({
      contract: component.contract,
      tokenPath,
      key: component.key,
      name: component.name,
      templateKey: component.templateKey,
      category: component.category,
      contractVersion: component.contractVersion,
    });
    const detachedContract = componentContractV2Schema.parse(detached.value);

    expect(detached.removedCount).toBe(2);
    expect(detachedContract.visual.surface?.background).toBeUndefined();
    expect(
      detachedContract.tokenBindings.some(
        (binding) => binding.tokenPath === tokenPath,
      ),
    ).toBe(false);
  });
});
