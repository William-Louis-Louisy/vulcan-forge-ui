import type { BrandProfile } from '@/domain/design-system';

export type SaveBrandProfileFormError =
  | 'unauthorized'
  | 'projectNotFound'
  | 'invalidPayload'
  | 'unexpected';

export type SaveBrandProfileActionState = {
  status: 'idle' | 'success' | 'error';
  formError: SaveBrandProfileFormError | null;
  savedProductName: string | null;
  savedProfile: BrandProfile | null;
};

export const initialSaveBrandProfileActionState: SaveBrandProfileActionState = {
  status: 'idle',
  formError: null,
  savedProductName: null,
  savedProfile: null,
};
