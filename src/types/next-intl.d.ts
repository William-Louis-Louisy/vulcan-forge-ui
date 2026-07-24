import type { routing } from '../i18n/routing';
import type baseMessages from '../messages/en.json';
import type { componentGuidelineMessages } from '../messages/component-guidelines';
import type { componentPreviewMessages } from '../messages/component-preview-messages';
import type { themePreviewMessages } from '../messages/theme-preview-messages';
import type { themeEditorMessages } from '../messages/theme-editor-messages';
import type { accessibilityCenterMessages } from '../messages/accessibility-center-messages';
import type { projectOverviewMessages } from '../messages/project-overview-messages';
import type { brandProfileMessages } from '../messages/brand-profile-messages';

type DeepMerge<Left, Right> = {
  [Key in keyof Left | keyof Right]: Key extends keyof Right
    ? Key extends keyof Left
      ? Left[Key] extends Record<string, unknown>
        ? Right[Key] extends Record<string, unknown>
          ? DeepMerge<Left[Key], Right[Key]>
          : Right[Key]
        : Right[Key]
      : Right[Key]
    : Key extends keyof Left
      ? Left[Key]
      : never;
};

type WidenMessageValues<Value> = Value extends string
  ? string
  : Value extends number
    ? number
    : Value extends boolean
      ? boolean
      : Value extends readonly unknown[]
        ? { [Index in keyof Value]: WidenMessageValues<Value[Index]> }
        : Value extends Record<string, unknown>
          ? { [Key in keyof Value]: WidenMessageValues<Value[Key]> }
          : Value;

type ComponentMessages = DeepMerge<
  (typeof componentGuidelineMessages)['en'],
  (typeof componentPreviewMessages)['en']
>;

type ThemeMessages = DeepMerge<
  (typeof themePreviewMessages)['en'],
  (typeof themeEditorMessages)['en']
>;

type ProjectMessages = DeepMerge<
  (typeof projectOverviewMessages)['en'],
  (typeof brandProfileMessages)['en']
>;

type ProductMessages = DeepMerge<
  DeepMerge<ThemeMessages, (typeof accessibilityCenterMessages)['en']>,
  ProjectMessages
>;

type ScopedMessages = DeepMerge<ComponentMessages, ProductMessages>;

type Messages = WidenMessageValues<
  DeepMerge<typeof baseMessages, ScopedMessages>
>;

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
