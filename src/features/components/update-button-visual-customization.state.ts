import type { ComponentContractV2 } from '@/domain/design-system';

export type UpdateButtonVisualCustomizationFormError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'componentContractNotFound'
  | 'invalidPayload'
  | 'invalidContract'
  | 'unexpected';

export type UpdateButtonVisualCustomizationActionState =
  | {
      status: 'idle';
      formError: null;
      savedContract: null;
    }
  | {
      status: 'success';
      formError: null;
      savedContract: ComponentContractV2;
    }
  | {
      status: 'error';
      formError: UpdateButtonVisualCustomizationFormError;
      savedContract: null;
    };

export const initialUpdateButtonVisualCustomizationActionState: UpdateButtonVisualCustomizationActionState = {
  status: 'idle',
  formError: null,
  savedContract: null,
};
