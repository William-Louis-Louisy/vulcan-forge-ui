import { revalidatePath } from 'next/cache';
import type { Locale } from '@/i18n/routing';

const themeConsumerSections = [
  'themes',
  'accessibility',
  'documentation',
  'exports',
  'ai-instructions',
] as const;

export function revalidateThemeConsumers({
  locale,
  projectSlug,
}: {
  locale: Locale;
  projectSlug: string;
}) {
  for (const section of themeConsumerSections) {
    revalidatePath(`/${locale}/app/projects/${projectSlug}/${section}`);
  }
}
