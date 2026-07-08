import type { routing } from '../i18n/routing';
import type baseMessages from '../messages/en.json';
import type { componentGuidelineMessages } from '../messages/component-guidelines';

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

type Messages = DeepMerge<
  typeof baseMessages,
  (typeof componentGuidelineMessages)['en']
>;

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
