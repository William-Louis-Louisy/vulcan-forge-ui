import { createComponentAiContractPreview } from './ComponentAiContractPreview.utils';
import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/projects/[projectSlug]/components/page';

export function ComponentAiContractShell({
  t,
  locale,
  component,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
}) {
  const preview = createComponentAiContractPreview({
    component,
    locale,
    copy: {
      strictRules: t('aiContract.ruleLabels.strictRules'),
      purpose: t('aiContract.ruleLabels.purpose'),
      usageGuidelines: t('aiContract.ruleLabels.usageGuidelines'),
      contentGuidelines: t('aiContract.ruleLabels.contentGuidelines'),
      anatomy: t('aiContract.ruleLabels.anatomy'),
      variants: t('aiContract.ruleLabels.variants'),
      sizes: t('aiContract.ruleLabels.sizes'),
      states: t('aiContract.ruleLabels.states'),
      tokenBindings: t('aiContract.ruleLabels.tokenBindings'),
      accessibility: t('aiContract.ruleLabels.accessibility'),
      forbidden: t('aiContract.ruleLabels.forbidden'),
      severities: {
        info: t('severity.info'),
        warning: t('severity.warning'),
        critical: t('severity.critical'),
      },
    },
  });
  const contractText = [
    preview.heading,
    ...preview.rules.map((rule) => `- ${rule}`),
  ].join('\n');

  return (
    <section className="min-w-0 px-3 pb-4 sm:px-4">
      <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
        {t('aiContract.eyebrow')}
      </p>

      <pre className="mt-3 max-w-full overflow-x-auto rounded-md bg-[var(--vf-color-stone-900)] p-3 font-mono text-[0.6875rem] leading-[1.55] [overflow-wrap:anywhere] whitespace-pre-wrap text-[var(--vf-color-stone-150)]">
        {contractText}
      </pre>

      {preview.missingSourceData.length > 0 ? (
        <div className="border-action-warning/30 bg-action-warning/10 text-action-warning mt-3 rounded-md border px-3 py-2.5 text-xs leading-5">
          <p className="font-semibold">{t('aiContract.incomplete.title')}</p>
          <p className="mt-0.5 opacity-90">
            {t('aiContract.incomplete.description')}
          </p>
          <ul className="mt-2 grid gap-1">
            {preview.missingSourceData.map((item) => (
              <li key={item} className="flex min-w-0 items-start gap-1.5">
                <span aria-hidden="true">–</span>
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  {t(`aiContract.missingSourceData.${item}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
