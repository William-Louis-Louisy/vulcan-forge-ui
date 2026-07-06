import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import {
  createTokenRows,
  sortTokenSetsByType,
  getActiveTokenSetType,
  type TokenSetType,
} from '@/features/tokens/tokens-editor.utils';
import { getTranslations } from 'next-intl/server';
import {
  TokensEditorShell,
  type TokenSetEditorViewModel,
} from '@/features/tokens/editor/TokensEditorShell';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { buildTokensEditorShellLabels } from './tokens-editor-shell-labels';
import { getTokensEditorPageData } from '@/features/tokens/tokens-editor.queries';

type TokensEditorPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
  searchParams: Promise<{
    set?: string | string[];
    token?: string | string[];
    q?: string | string[];
  }>;
};

export default async function TokensEditorPage({
  params,
  searchParams,
}: TokensEditorPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('TokensEditorPage');
  const resolvedSearchParams = await searchParams;
  const activeTokenSetType = getActiveTokenSetType(resolvedSearchParams.set);

  const selectedTokenPath = getSingleSearchParamValue(
    resolvedSearchParams.token,
  );
  const tokenSearchQuery =
    getSingleSearchParamValue(resolvedSearchParams.q) ?? '';

  const pageData = await getTokensEditorPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const sortedTokenSets = sortTokenSetsByType(pageData.tokenSets);

  const tokenSetViewModels: TokenSetEditorViewModel[] = sortedTokenSets.map(
    (tokenSet) => {
      const rowsResult = createTokenRows(tokenSet.tokens);

      return {
        name: tokenSet.name,
        type: tokenSet.type,
        rows: rowsResult.rows,
        isReadable: rowsResult.isReadable,
        tokenCountLabel: t('tokenCount', { count: rowsResult.rows.length }),
      };
    },
  );

  const allTokenRows = tokenSetViewModels.flatMap((tokenSet) => tokenSet.rows);

  const totalTokenCount = allTokenRows.length;

  const missingEnglishDescriptionCount = allTokenRows.filter(
    (row) => !row.description?.en?.trim(),
  ).length;

  const initialActiveTokenSet =
    tokenSetViewModels.find(
      (tokenSet) => tokenSet.type === activeTokenSetType,
    ) ??
    tokenSetViewModels[0] ??
    null;

  const tokenSetTypeLabels = {
    color: t('tabs.color'),
    spacing: t('tabs.spacing'),
    radius: t('tabs.radius'),
    typography: t('tabs.typography'),
    motion: t('tabs.motion'),
  } satisfies Record<TokenSetType, string>;

  const shellLabels = buildTokensEditorShellLabels({
    t,
    tokenSetTypeLabels,
    totalTokenCount,
    missingEnglishDescriptionCount,
  });

  return (
    <section className="h-[calc(100vh-3rem)] min-h-0 overflow-hidden">
      <TokensEditorShell
        locale={locale}
        projectSlug={pageData.project.slug}
        tokenSets={tokenSetViewModels}
        initialActiveTokenSetType={
          initialActiveTokenSet?.type ?? activeTokenSetType
        }
        initialSelectedTokenPath={selectedTokenPath}
        initialTokenSearchQuery={tokenSearchQuery}
        labels={shellLabels}
      />
    </section>
  );
}

function getSingleSearchParamValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}
