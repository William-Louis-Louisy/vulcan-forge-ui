import type { DocumentationProfileContent } from './documentation-profile.schema';

export type SaveDocumentationProfileActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'invalidPayload'
    | 'unexpected'
    | null;
  savedProfile: DocumentationProfileContent | null;
};

export const initialSaveDocumentationProfileActionState: SaveDocumentationProfileActionState =
  {
    status: 'idle',
    formError: null,
    savedProfile: null,
  };
