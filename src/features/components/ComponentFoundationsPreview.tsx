import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import { ComponentFoundationsPreviewClient } from './ComponentFoundationsPreviewClient';

export function ComponentFoundationsPreviewShell({
  locale,
  component,
  rawTokenSets,
}: {
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
    />
  );
}
