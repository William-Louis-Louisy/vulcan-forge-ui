import type { Locale } from '@/i18n/routing';
import { ComponentContractEditorBoundary } from './ComponentContractEditorBoundary';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import type { ComponentContractEditorLabels } from './ComponentContractEditor';
import { StatusBadge } from '@/app/[locale]/app/projects/[projectSlug]/components/page';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/projects/[projectSlug]/components/page';

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
  return (
    <article className="min-w-0 px-6 py-5">
      <div className="mx-auto w-full max-w-3xl">
        <header className="border-border-subtle flex min-w-0 flex-col gap-3 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-[1.625rem] font-semibold tracking-tight">
              {component.name}
            </h1>
            <p className="text-content-tertiary mt-1.5 truncate font-mono text-xs">
              {component.type} · {t(`categories.${component.category}`)}
            </p>
          </div>

          <StatusBadge t={t} status={component.status} />
        </header>

        <div className="mt-5 min-w-0">
          <ComponentContractEditorBoundary
            componentId={component.id}
            locale={locale}
            projectSlug={projectSlug}
            contract={component.contract}
            labels={createComponentContractEditorLabels(t)}
            tokenOptions={tokenOptions}
          />
        </div>
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
    },
    anatomy: {
      title: t('editor.anatomy.title'),
      description: t('editor.anatomy.description'),
      add: t('editor.anatomy.add'),
      key: t('editor.anatomy.key'),
      label: t('editor.anatomy.label'),
      requirement: t('editor.anatomy.requirement'),
      requirements: {
        required: t('editor.anatomy.requirements.required'),
        optional: t('editor.anatomy.requirements.optional'),
        derived: t('editor.anatomy.requirements.derived'),
      },
    },
    collections: {
      title: t('editor.collections.title'),
      editDetails: t('editor.collections.editDetails'),
    },
    variants: {
      title: t('editor.variants.title'),
      axis: t('editor.variants.axis'),
      add: t('editor.variants.add'),
    },
    sizes: {
      title: t('editor.sizes.title'),
      axis: t('editor.sizes.axis'),
      add: t('editor.sizes.add'),
    },
    states: {
      title: t('editor.states.title'),
      axis: t('editor.states.axis'),
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
      purpose: t('editor.localizedContent.purpose'),
      usageGuidelines: t('editor.localizedContent.usageGuidelines'),
      contentGuidelines: t('editor.localizedContent.contentGuidelines'),
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
