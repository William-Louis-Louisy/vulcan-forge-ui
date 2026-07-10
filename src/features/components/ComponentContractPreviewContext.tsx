'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ComponentContract } from '@/domain/design-system';

type ComponentContractPreviewContextValue = {
  contract: ComponentContract;
  setContract: (contract: ComponentContract) => void;
};

const ComponentContractPreviewContext =
  createContext<ComponentContractPreviewContextValue | null>(null);

export function ComponentContractPreviewProvider({
  initialContract,
  children,
}: {
  initialContract: ComponentContract;
  children: ReactNode;
}) {
  const [contract, setContract] = useState(initialContract);
  const value = useMemo(
    () => ({
      contract,
      setContract,
    }),
    [contract],
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
