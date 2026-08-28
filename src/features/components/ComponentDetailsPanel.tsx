import type { Locale } from '@/i18n/routing';
import { ComponentContractEditorBoundary } from './ComponentContractEditorBoundary';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentTokenOption } from './component-token-bindings.utils';
import type { ComponentContractEditorLabels } from './ComponentContractEditor';
import { DeleteComponentContractButton } from './DeleteComponentContractButton';
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
    <article className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto w-full max-w-3xl min-w-0">
        <header className="border-border-subtle flex min-w-0 flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between sm:pb-5">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold tracking-tight sm:text-[1.625rem]">
              {component.name}
            </h2>
            <p className="text-content-tertiary mt-1.5 truncate font-mono text-xs">
              {component.type} · {t(`categories.${component.category}`)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start">
            <StatusBadge t={t} status={component.status} />
            <DeleteComponentContractButton
              locale={locale}
              projectSlug={projectSlug}
              componentType={component.type}
              labels={{
                ariaLabel: t('editor.delete.ariaLabel', {
                  name: component.name,
                }),
                title: t('editor.delete.title'),
                description: t('editor.delete.description', {
                  name: component.name,
                }),
                cancel: t('editor.delete.cancel'),
                submit: t('editor.delete.submit'),
                submitting: t('editor.delete.submitting'),
                errors: {
                  unauthorized: t('editor.delete.errors.unauthorized'),
                  projectNotFound: t('editor.delete.errors.projectNotFound'),
                  componentNotFound: t(
                    'editor.delete.errors.componentNotFound',
                  ),
                  componentAlreadyExists: t(
                    'editor.delete.errors.componentAlreadyExists',
                  ),
                  invalidPayload: t('editor.delete.errors.invalidPayload'),
                  unexpected: t('editor.delete.errors.unexpected'),
                },
              }}
            />
          </div>
        </header>

        <div className="mt-4 min-w-0 sm:mt-5">
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
      role: t('editor.visualTokens.role'),
      selectRole: t('editor.visualTokens.selectRole'),
      customRole: t('editor.visualTokens.customRole'),
      customRoleDescription: t('editor.visualTokens.customRoleDescription'),
      customRoleKey: t('editor.visualTokens.customRoleKey'),
      customRolePlaceholder: t('editor.visualTokens.customRolePlaceholder'),
      roleAlreadyUsed: t('editor.visualTokens.roleAlreadyUsed'),
      roles: {
        background: t('editor.visualTokens.roles.background'),
        foreground: t('editor.visualTokens.roles.foreground'),
        border: t('editor.visualTokens.roles.border'),
        radius: t('editor.visualTokens.roles.radius'),
        padding: t('editor.visualTokens.roles.padding'),
        paddingX: t('editor.visualTokens.roles.paddingX'),
        paddingY: t('editor.visualTokens.roles.paddingY'),
        duration: t('editor.visualTokens.roles.duration'),
        motion: t('editor.visualTokens.roles.motion'),
      },
      tokenType: t('editor.visualTokens.tokenType'),
      tokenPath: t('editor.visualTokens.tokenPath'),
      selectToken: t('editor.visualTokens.selectToken'),
      tokenTypes: {
        color: t('editor.visualTokens.tokenTypes.color'),
        spacing: t('editor.visualTokens.tokenTypes.spacing'),
        radius: t('editor.visualTokens.tokenTypes.radius'),
        typography: t('editor.visualTokens.tokenTypes.typography'),
        motion: t('editor.visualTokens.tokenTypes.motion'),
      },
    },
  };
}
