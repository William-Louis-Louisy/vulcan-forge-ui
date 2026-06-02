import type { AiInstructionProfileContent } from './ai-instruction-profile.schema';

export type SaveAiInstructionProfileActionState = {
  status: 'idle' | 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'invalidPayload'
    | 'unexpected'
    | null;
  savedProfile: AiInstructionProfileContent | null;
};

export const initialSaveAiInstructionProfileActionState: SaveAiInstructionProfileActionState =
  {
    status: 'idle',
    formError: null,
    savedProfile: null,
  };
