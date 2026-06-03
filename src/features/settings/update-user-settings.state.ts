import type { UserSettings } from './user-settings.schema';

export type UpdateUserSettingsActionState = {
  status: 'idle' | 'success' | 'error';
  formError: 'unauthorized' | 'invalidPayload' | 'unexpected' | null;
  savedSettings: UserSettings | null;
};

export const initialUpdateUserSettingsActionState: UpdateUserSettingsActionState =
  {
    status: 'idle',
    formError: null,
    savedSettings: null,
  };
