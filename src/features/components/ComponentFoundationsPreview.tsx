import type { Locale } from '@/i18n/routing';
import type { ComponentRegistryItem } from './components-registry.utils';
import { ComponentFoundationsPreviewClient } from './ComponentFoundationsPreviewClient';

export function ComponentFoundationsPreviewShell({
  locale,
  component,
  rawTokenSets,
  mode,
}: {
  locale: Locale;
  component: ComponentRegistryItem;
  rawTokenSets: Array<{
    type: string;
    name: string;
    tokens: unknown;
  }>;
  mode: 'instance' | 'matrix';
}) {
  return (
    <ComponentFoundationsPreviewClient
      locale={locale}
      component={component}
      rawTokenSets={rawTokenSets}
      mode={mode}
    />
  );
}
