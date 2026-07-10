import type { ComponentContractType } from '@/domain/design-system';

export type ComponentContractMutationError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'componentNotFound'
  | 'componentAlreadyExists'
  | 'invalidPayload'
  | 'unexpected';

export type CreateComponentContractActionState = {
  status: 'idle' | 'success' | 'error';
  error: ComponentContractMutationError | null;
  componentType: ComponentContractType | null;
};

export type DeleteComponentContractActionState = {
  status: 'idle' | 'success' | 'error';
  error: ComponentContractMutationError | null;
};

export const initialCreateComponentContractActionState: CreateComponentContractActionState =
  {
    status: 'idle',
    error: null,
    componentType: null,
  };

export const initialDeleteComponentContractActionState: DeleteComponentContractActionState =
  {
    status: 'idle',
    error: null,
  };
