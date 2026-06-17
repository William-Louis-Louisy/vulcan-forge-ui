import type { Locale } from '@/i18n/routing';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import { ComponentContractEditor } from './ComponentContractEditor';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import type { ComponentContractEditorLabels } from './ComponentContractEditor';
import { toResolvableLocalizedString } from './components-registry-page.utils';
import { StatusBadge } from '@/app/[locale]/app/design-systems/[projectSlug]/components/page';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/design-systems/[projectSlug]/components/page';

export function ComponentDetails({
  t,
  locale,
  projectSlug,
  component,
  tokenOptions,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  projectSlug: string;
  component: ComponentRegistryItem;
  tokenOptions: ComponentTokenOption[];
}) {
  const purpose = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(component.contract.purpose),
    locale,
  });

  return (
    <article className="px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {t(`categories.${component.category}`)}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {component.name}
          </h2>
          <p className="text-content-secondary mt-3 max-w-2xl text-sm leading-6">
            {purpose.value}
          </p>
        </div>

        <StatusBadge t={t} status={component.status} />
      </div>
      <div className="mt-8">
        <ComponentContractEditor
          locale={locale}
          projectSlug={projectSlug}
          contract={component.contract}
          labels={createComponentContractEditorLabels(t)}
          tokenOptions={tokenOptions}
        />
      </div>
    </article>
  );
}

function createComponentContractEditorLabels(
  t: ComponentsRegistryTranslator,
): ComponentContractEditorLabels {
  return {
    title: t('editor.title'),
    description: t('editor.description'),
    unsavedNotice: t('editor.unsavedNotice'),
    save: {
      action: t('editor.save.action'),
      saving: t('editor.save.saving'),
      saved: t('editor.save.saved'),
      unsaved: t('editor.save.unsaved'),
      invalid: t('editor.save.invalid'),
      errors: {
        unauthorized: t('editor.save.errors.unauthorized'),
        projectNotFound: t('editor.save.errors.projectNotFound'),
        componentContractNotFound: t(
          'editor.save.errors.componentContractNotFound',
        ),
        invalidPayload: t('editor.save.errors.invalidPayload'),
        invalidContract: t('editor.save.errors.invalidContract'),
        unexpected: t('editor.save.errors.unexpected'),
      },
    },
    validationTitle: t('editor.validationTitle'),
    basics: {
      title: t('editor.basics.title'),
      name: t('editor.basics.name'),
      status: t('editor.basics.status'),
      purposeEn: t('editor.basics.purposeEn'),
      purposeFr: t('editor.basics.purposeFr'),
    },
    anatomy: {
      title: t('editor.anatomy.title'),
      description: t('editor.anatomy.description'),
      add: t('editor.anatomy.add'),
    },
    variants: {
      title: t('editor.variants.title'),
      add: t('editor.variants.add'),
    },
    states: {
      title: t('editor.states.title'),
      add: t('editor.states.add'),
    },
    accessibility: {
      title: t('editor.accessibility.title'),
      add: t('editor.accessibility.add'),
      severity: t('editor.accessibility.severity'),
    },
    forbiddenPatterns: {
      title: t('editor.forbiddenPatterns.title'),
      add: t('editor.forbiddenPatterns.add'),
    },
    fields: {
      key: t('editor.fields.key'),
      labelEn: t('editor.fields.labelEn'),
      labelFr: t('editor.fields.labelFr'),
      descriptionEn: t('editor.fields.descriptionEn'),
      descriptionFr: t('editor.fields.descriptionFr'),
      patternEn: t('editor.fields.patternEn'),
      patternFr: t('editor.fields.patternFr'),
      remove: t('editor.fields.remove'),
    },
    statuses: {
      draft: t('statuses.draft'),
      ready: t('statuses.ready'),
      deprecated: t('statuses.deprecated'),
    },
    severities: {
      info: t('severity.info'),
      warning: t('severity.warning'),
      critical: t('severity.critical'),
    },
    localizedContent: {
      title: t('editor.localizedContent.title'),
      editing: t('editor.localizedContent.editing'),
      schemaNotice: t('editor.localizedContent.schemaNotice'),
      locales: {
        en: t('editor.localizedContent.locales.en'),
        fr: t('editor.localizedContent.locales.fr'),
      },
    },
    metadata: {
      title: t('editor.metadata.title'),
    },
    visualTokens: {
      title: t('editor.visualTokens.title'),
      description: t('editor.visualTokens.description'),
      add: t('editor.visualTokens.add'),
      tokenType: t('editor.visualTokens.tokenType'),
      tokenPath: t('editor.visualTokens.tokenPath'),
      selectToken: t('editor.visualTokens.selectToken'),
    },
  };
}
