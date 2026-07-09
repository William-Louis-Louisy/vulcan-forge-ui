import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import type { ComponentsRegistryTranslator } from '@/app/[locale]/app/projects/[projectSlug]/components/page';
import { ComponentFoundationsPreviewClient } from './ComponentFoundationsPreviewClient';

export function ComponentFoundationsPreviewShell({
  t,
  locale,
  component,
  rawTokenSets,
}: {
  t: ComponentsRegistryTranslator;
  locale: Locale;
  component: ComponentRegistryItem;
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>;
}) {
  return (
    <ComponentFoundationsPreviewClient
      locale={locale}
      component={component}
      rawTokenSets={rawTokenSets}
      labels={{
        title: t('foundationsPreview.title'),
        noTokenBindingsNotice: t(
          'foundationsPreview.noTokenBindingsNotice',
        ),
        incompleteMatrixNotice: t(
          'foundationsPreview.incompleteMatrixNotice',
        ),
        baseState: t('foundationsPreview.baseState'),
        state: t('foundationsPreview.state'),
        resolvedTokens: t('foundationsPreview.resolvedTokens'),
        tokenBindingWarning: ({ missing, invalid }) =>
          t('foundationsPreview.tokenBindingWarning', {
            missing,
            invalid,
          }),
      }}
    />
  );
}
