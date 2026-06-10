import type { ComponentRegistryItem } from './components-registry.utils';
import type { resolveLocalizedStringWithFallback } from '@/domain/i18n';

type ResolvableLocalizedString = Parameters<
  typeof resolveLocalizedStringWithFallback
>[0]['localizedString'];

type ComponentLocalizedString = {
  en?: string | undefined;
  fr?: string | undefined;
};

export function toResolvableLocalizedString(
  localizedString: ComponentLocalizedString,
): ResolvableLocalizedString {
  const normalizedLocalizedString: ResolvableLocalizedString = {};

  if (typeof localizedString.en === 'string') {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (typeof localizedString.fr === 'string') {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

export function filterComponentRegistryItems({
  items,
  query,
}: {
  items: ComponentRegistryItem[];
  query: string;
}) {
  if (!query) {
    return items;
  }

  const normalizedQuery = query.toLowerCase();

  return items.filter((item) =>
    [item.name, item.type, item.category, ...item.platforms]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
