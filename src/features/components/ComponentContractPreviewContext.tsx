'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  componentContractV2Schema,
  migrateLegacyComponentContract,
  type ComponentContract,
  type ComponentContractV2,
  type ComponentVisualProperties,
} from '@/domain/design-system';

type ComponentContractPreviewContextValue = {
  contract: ComponentContract;
  contractV2: ComponentContractV2;
  setContract: (contract: ComponentContract) => void;
  setContractV2: (contract: ComponentContractV2) => void;
};

const ComponentContractPreviewContext =
  createContext<ComponentContractPreviewContextValue | null>(null);

function mergeMigratedLegacyVisualProperties(
  current: ComponentVisualProperties,
  migrated: ComponentVisualProperties,
): ComponentVisualProperties {
  return {
    ...current,
    ...(migrated.spacing
      ? { spacing: { ...current.spacing, ...migrated.spacing } }
      : {}),
    ...(migrated.radius
      ? { radius: { ...current.radius, ...migrated.radius } }
      : {}),
    ...(migrated.surface
      ? { surface: { ...current.surface, ...migrated.surface } }
      : {}),
  };
}

export function ComponentContractPreviewProvider({
  initialContract,
  initialContractV2,
  children,
}: {
  initialContract: ComponentContract;
  initialContractV2: ComponentContractV2;
  children: ReactNode;
}) {
  const [contract, setContractState] = useState(initialContract);
  const [contractV2, setContractV2] = useState(initialContractV2);

  const setContract = useCallback((nextContract: ComponentContract) => {
    setContractState((currentContract) => {
      if (
        JSON.stringify(currentContract.tokenBindings) !==
        JSON.stringify(nextContract.tokenBindings)
      ) {
        setContractV2((currentContractV2) => {
          const migrated = migrateLegacyComponentContract(nextContract, {
            key: currentContractV2.key,
            name: nextContract.name,
            templateKey: currentContractV2.templateKey,
            category: currentContractV2.category,
          });

          return componentContractV2Schema.parse({
            ...currentContractV2,
            visual: mergeMigratedLegacyVisualProperties(
              currentContractV2.visual,
              migrated.visual,
            ),
          });
        });
      }

      return nextContract;
    });
  }, []);

  const value = useMemo(
    () => ({
      contract,
      contractV2,
      setContract,
      setContractV2,
    }),
    [contract, contractV2, setContract],
  );

  return (
    <ComponentContractPreviewContext.Provider value={value}>
      <div className="contents">{children}</div>
    </ComponentContractPreviewContext.Provider>
  );
}

export function useComponentContractPreview() {
  return useContext(ComponentContractPreviewContext);
}
