import type { routing } from '../i18n/routing';
import type baseMessages from '../messages/en.json';
import type { componentGuidelineMessages } from '../messages/component-guidelines';
import type { componentPreviewMessages } from '../messages/component-preview-messages';
import type { componentV2CustomizationMessages } from '../messages/component-v2-customization-messages';
import type { themePreviewMessages } from '../messages/theme-preview-messages';
import type { themeEditorMessages } from '../messages/theme-editor-messages';
import type { accessibilityCenterMessages } from '../messages/accessibility-center-messages';
import type { projectOverviewMessages } from '../messages/project-overview-messages';
import type { brandProfileMessages } from '../messages/brand-profile-messages';
import type { brandOverviewMessages } from '../messages/brand-overview-messages';
import type { brandOnboardingMessages } from '../messages/brand-onboarding-messages';
import type { projectSettingsMessages } from '../messages/project-settings-messages';
import type { publicSurfaceMessages } from '../messages/public-surface-messages';
import type { examplesPageMessages } from '../messages/examples-page-messages';
import type { learnMessages } from '../messages/learn-messages';
import type { learnDesignSystemsMessages } from '../messages/learn-design-systems-messages';
import type { learnDesignTokensMessages } from '../messages/learn-design-tokens-messages';
import type { learnThemesMessages } from '../messages/learn-themes-messages';
import type { learnComponentsMessages } from '../messages/learn-components-messages';
import type { learnAccessibilityMessages } from '../messages/learn-accessibility-messages';
import type { learnDocumentationDeliveryMessages } from '../messages/learn-documentation-delivery-messages';
import type { learnAiReadyDesignSystemsMessages } from '../messages/learn-ai-ready-design-systems-messages';
import type { productEditorPreviewMessages } from '../messages/product-editor-preview-messages';
import type { errorSurfaceMessages } from '../messages/error-surface-messages';
import type { journeyPolishMessages } from '../messages/journey-polish-messages';
import type { tokenStatusEditorMessages } from '../messages/token-status-editor-messages';

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
  DeepMerge<
    (typeof componentGuidelineMessages)['en'],
    (typeof componentPreviewMessages)['en']
  >,
  (typeof componentV2CustomizationMessages)['en']
>;

type ThemeMessages = DeepMerge<
  (typeof themePreviewMessages)['en'],
  (typeof themeEditorMessages)['en']
>;

type ProjectOverviewMessages = DeepMerge<
  (typeof projectOverviewMessages)['en'],
  (typeof brandOverviewMessages)['en']
>;

type ProjectMessages = DeepMerge<
  DeepMerge<ProjectOverviewMessages, (typeof brandProfileMessages)['en']>,
  (typeof projectSettingsMessages)['en']
>;

type ProductMessages = DeepMerge<
  DeepMerge<ThemeMessages, (typeof accessibilityCenterMessages)['en']>,
  ProjectMessages
>;

type ExistingLearnMessages = DeepMerge<
  DeepMerge<
    DeepMerge<
      DeepMerge<
        DeepMerge<
          DeepMerge<
            (typeof learnMessages)['en'],
            (typeof learnDesignSystemsMessages)['en']
          >,
          (typeof learnDesignTokensMessages)['en']
        >,
        (typeof learnThemesMessages)['en']
      >,
      (typeof learnComponentsMessages)['en']
    >,
    (typeof learnAccessibilityMessages)['en']
  >,
  (typeof learnDocumentationDeliveryMessages)['en']
>;

type LearnMessages = DeepMerge<
  ExistingLearnMessages,
  (typeof learnAiReadyDesignSystemsMessages)['en']
>;

type PublicMessages = DeepMerge<
  DeepMerge<
    (typeof publicSurfaceMessages)['en'],
    (typeof productEditorPreviewMessages)['en']
  >,
  DeepMerge<(typeof examplesPageMessages)['en'], LearnMessages>
>;

type ScopedMessages = DeepMerge<
  DeepMerge<
    DeepMerge<ComponentMessages, ProductMessages>,
    DeepMerge<
      (typeof brandOnboardingMessages)['en'],
      (typeof journeyPolishMessages)['en']
    >
  >,
  DeepMerge<
    PublicMessages,
    DeepMerge<
      (typeof errorSurfaceMessages)['en'],
      (typeof tokenStatusEditorMessages)['en']
    >
  >
>;

type Messages = WidenMessageValues<
  DeepMerge<typeof baseMessages, ScopedMessages>
>;

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: Messages;
  }
}
