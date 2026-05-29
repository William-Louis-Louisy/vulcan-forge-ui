import type { ComponentContract } from '@/domain/design-system';

export type UpdateComponentContractActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'componentContractNotFound'
    | 'invalidPayload'
    | 'invalidContract'
    | 'unexpected'
    | null;
  savedContract: ComponentContract | null;
};

export const initialUpdateComponentContractActionState: UpdateComponentContractActionState =
  {
    status: 'idle',
    formError: null,
    savedContract: null,
  };
