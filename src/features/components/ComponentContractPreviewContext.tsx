'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  ComponentContract,
  ComponentContractV2,
} from '@/domain/design-system';

type ComponentContractPreviewContextValue = {
  contract: ComponentContract;
  contractV2: ComponentContractV2;
  setContract: (contract: ComponentContract) => void;
  setContractV2: (contract: ComponentContractV2) => void;
};

const ComponentContractPreviewContext =
  createContext<ComponentContractPreviewContextValue | null>(null);

export function ComponentContractPreviewProvider({
  initialContract,
  initialContractV2,
  children,
}: {
  initialContract: ComponentContract;
  initialContractV2: ComponentContractV2;
  children: ReactNode;
}) {
  const [contract, setContract] = useState(initialContract);
  const [contractV2, setContractV2] = useState(initialContractV2);
  const value = useMemo(
    () => ({
      contract,
      contractV2,
      setContract,
      setContractV2,
    }),
    [contract, contractV2],
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
