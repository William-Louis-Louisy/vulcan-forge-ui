import {
  getComponentAiContractModelGaps,
  getComponentAiContractMissingSourceData,
} from './ComponentAiContractPreview.utils';
import type { Locale } from '@/i18n/routing';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import type { ComponentRegistryItem } from './components-registry.utils';
import { toResolvableLocalizedString } from './components-registry-page.utils';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/design-systems/[projectSlug]/components/page';

export function ComponentAiContractShell({
  t,
  locale,
  component,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
}) {
  const purpose = resolveLocalizedStringWithFallback({
    localizedString: toResolvableLocalizedString(component.contract.purpose),
    locale,
  });

  const missingSourceData = getComponentAiContractMissingSourceData(component);
  const modelGaps = getComponentAiContractModelGaps();

  return (
    <section className="p-4">
      <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
        {t('aiContract.eyebrow')}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight">
        {t('aiContract.title')}
      </h2>

      <p className="text-content-secondary mt-3 text-sm leading-6">
        {t('aiContract.description')}
      </p>

      <div className="mt-5 rounded-2xl bg-[#0B0F14] p-4 font-mono text-[12px] leading-6 text-slate-100">
        <AiContractSection title={t('aiContract.sections.identity')}>
          <AiContractLine
            label={t('aiContract.fields.component')}
            value={component.name}
          />
          <AiContractLine
            label={t('aiContract.fields.type')}
            value={component.type}
          />
          <AiContractLine
            label={t('aiContract.fields.category')}
            value={t(`categories.${component.category}`)}
          />
          <AiContractLine
            label={t('aiContract.fields.status')}
            value={t(`statuses.${component.status}`)}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.purpose')}>
          <p className="text-slate-300">
            {purpose.value || t('aiContract.empty.purpose')}
          </p>
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.allowedVariants')}>
          <AiContractLocalizedList
            emptyLabel={t('aiContract.empty.variants')}
            items={component.contract.variants.map((variant) => ({
              key: variant.key,
              label: resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(variant.label),
                locale,
              }).value,
            }))}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.allowedStates')}>
          <AiContractLocalizedList
            emptyLabel={t('aiContract.empty.states')}
            items={component.contract.states.map((state) => ({
              key: state.key,
              label: resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(state.label),
                locale,
              }).value,
            }))}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.accessibilityRules')}>
          <AiContractAccessibilityList
            t={t}
            locale={locale}
            rules={component.contract.accessibility}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.forbiddenPatterns')}>
          <AiContractTextList
            emptyLabel={t('aiContract.empty.forbiddenPatterns')}
            items={component.contract.forbiddenPatterns.map((pattern) =>
              resolveLocalizedStringWithFallback({
                localizedString: toResolvableLocalizedString(pattern),
                locale,
              }),
            )}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.missingSourceData')}>
          <AiContractSimpleList
            emptyLabel={t('aiContract.empty.missingSourceData')}
            items={missingSourceData.map((item) =>
              t(`aiContract.missingSourceData.${item}`),
            )}
          />
        </AiContractSection>

        <AiContractSection title={t('aiContract.sections.modelGaps')}>
          <AiContractSimpleList
            emptyLabel={t('aiContract.empty.modelGaps')}
            items={modelGaps.map((item) => t(`aiContract.modelGaps.${item}`))}
          />
        </AiContractSection>
      </div>
    </section>
  );
}

function AiContractSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="not-first:mt-5">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function AiContractLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="text-slate-500">{label}: </span>
      <span className="text-slate-200">{value}</span>
    </p>
  );
}

function AiContractLocalizedList({
  items,
  emptyLabel,
}: {
  items: Array<{
    key: string;
    label: string;
  }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {items.map((item) => (
        <li key={item.key}>
          <span className="text-slate-500">- {item.key}</span>
          {item.label ? (
            <span className="text-slate-300"> — {item.label}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function AiContractAccessibilityList({
  t,
  locale,
  rules,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  rules: ComponentRegistryItem['contract']['accessibility'];
}) {
  if (rules.length === 0) {
    return (
      <p className="text-slate-500">{t('aiContract.empty.accessibility')}</p>
    );
  }

  return (
    <ul className="grid gap-2">
      {rules.map((rule) => {
        const description = resolveLocalizedStringWithFallback({
          localizedString: toResolvableLocalizedString(rule.description),
          locale,
        });

        return (
          <li key={rule.key}>
            <p>
              <span className="text-slate-500">- {rule.key}</span>
              <span className="text-slate-300">
                {' '}
                [{t(`severity.${rule.severity}`)}]
              </span>
            </p>
            {description.value ? (
              <p className="pl-4 text-slate-400">{description.value}</p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function AiContractTextList({
  items,
  emptyLabel,
}: {
  items: Array<{
    value: string;
  }>;
  emptyLabel: string;
}) {
  const availableItems = items.filter((item) => item.value);

  if (availableItems.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {availableItems.map((item, index) => (
        <li key={`${item.value}-${index}`} className="text-slate-300">
          - {item.value}
        </li>
      ))}
    </ul>
  );
}

function AiContractSimpleList({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="grid gap-1">
      {items.map((item) => (
        <li key={item} className="text-slate-300">
          - {item}
        </li>
      ))}
    </ul>
  );
}
