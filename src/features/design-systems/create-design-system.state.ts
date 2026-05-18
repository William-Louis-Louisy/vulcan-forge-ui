import type { CreateDesignSystemValidationMessageKey } from './create-design-system.schema';

export type CreateDesignSystemStep =
  | 'basics'
  | 'platformsLanguages'
  | 'visualDirection'
  | 'accessibilityTarget'
  | 'review';

export type CreateDesignSystemField =
  | 'name'
  | 'description'
  | 'platforms'
  | 'defaultLocale'
  | 'supportedLocales'
  | 'visualDirection'
  | 'accessibilityTarget';

export type CreateDesignSystemActionState = {
  status: 'idle' | 'error';
  fieldErrors: Partial<
    Record<CreateDesignSystemField, CreateDesignSystemValidationMessageKey[]>
  >;
  formError:
    | 'missingWorkspace'
    | 'slugAlreadyUsed'
    | 'unauthorized'
    | 'unexpected'
    | null;
  values: {
    name: string;
    description: string;
    platforms: string[];
    defaultLocale: string;
    supportedLocales: string[];
    visualDirection: string;
    accessibilityTarget: string;
  };
};

export const createDesignSystemSteps = [
  'basics',
  'platformsLanguages',
  'visualDirection',
  'accessibilityTarget',
  'review',
] as const satisfies readonly CreateDesignSystemStep[];

export const initialCreateDesignSystemActionState: CreateDesignSystemActionState =
  {
    status: 'idle',
    fieldErrors: {},
    formError: null,
    values: {
      name: '',
      description: '',
      platforms: ['web'],
      defaultLocale: 'en',
      supportedLocales: ['en', 'fr'],
      visualDirection: 'minimal',
      accessibilityTarget: 'wcag_aa',
    },
  };
