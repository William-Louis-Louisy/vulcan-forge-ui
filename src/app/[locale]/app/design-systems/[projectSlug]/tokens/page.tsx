import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getTokensEditorPageData } from '@/features/tokens/tokens-editor.queries';
import {
  TokenTable,
  type TokenTableLabels,
} from '@/features/tokens/TokenTable';
import {
  createTokenRows,
  type TokenRowData,
} from '@/features/tokens/tokens-editor.utils';
import {
  tokenSetTypes,
  sortTokenSetsByType,
  getActiveTokenSetType,
  type TokenSetType,
} from '@/features/tokens/tokens-editor.utils';

type TokensEditorPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
  searchParams: Promise<{
    set?: string | string[];
  }>;
};

type TokensEditorTranslator = Awaited<ReturnType<typeof getTranslations>>;

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

  const pageData = await getTokensEditorPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const sortedTokenSets = sortTokenSetsByType(pageData.tokenSets);
  const activeTokenSet =
    sortedTokenSets.find((tokenSet) => tokenSet.type === activeTokenSetType) ??
    sortedTokenSets[0] ??
    null;

  const tokenRowsResult = activeTokenSet
    ? createTokenRows(activeTokenSet.tokens)
    : {
        rows: [],
        isReadable: false,
      };

  return (
    <section className="mx-auto max-w-7xl">
      <Link
        href="/app/design-systems"
        className="text-action-primary text-sm font-semibold"
      >
        {t('backLink')}
      </Link>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-action-primary text-sm font-semibold tracking-[0.24em] uppercase">
            {t('eyebrow')}
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            {t('title', { projectName: pageData.project.name })}
          </h1>

          <p className="text-content-secondary mt-4 max-w-3xl">
            {t('description')}
          </p>
        </div>
      </div>

      <TokenSetTabs
        t={t}
        projectSlug={pageData.project.slug}
        activeTokenSetType={activeTokenSet?.type ?? activeTokenSetType}
      />

      <div className="mt-8">
        {activeTokenSet ? (
          <TokenSetPanel
            t={t}
            locale={locale}
            projectSlug={pageData.project.slug}
            tokenSetName={activeTokenSet.name}
            tokenSetType={activeTokenSet.type}
            rows={tokenRowsResult.rows}
            isReadable={tokenRowsResult.isReadable}
          />
        ) : (
          <EmptyTokenSetsState t={t} />
        )}
      </div>
    </section>
  );
}

function TokenSetTabs({
  t,
  projectSlug,
  activeTokenSetType,
}: {
  t: TokensEditorTranslator;
  projectSlug: string;
  activeTokenSetType: TokenSetType;
}) {
  return (
    <nav
      aria-label={t('tabs.label')}
      className="border-border-subtle bg-surface-primary shadow-soft mt-8 overflow-x-auto rounded-2xl border p-2"
    >
      <div className="flex min-w-max gap-2">
        {tokenSetTypes.map((tokenSetType) => {
          const isActive = tokenSetType === activeTokenSetType;

          return (
            <Link
              key={tokenSetType}
              href={`/app/design-systems/${projectSlug}/tokens?set=${tokenSetType}`}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'rounded-xl px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-action-primary text-action-primary-content'
                  : 'text-content-secondary hover:bg-background-subtle hover:text-content-primary',
              ].join(' ')}
            >
              {t(`tabs.${tokenSetType}`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TokenSetPanel({
  t,
  locale,
  projectSlug,
  tokenSetName,
  tokenSetType,
  rows,
  isReadable,
}: {
  t: TokensEditorTranslator;
  locale: Locale;
  projectSlug: string;
  tokenSetName: string;
  tokenSetType: TokenSetType;
  rows: TokenRowData[];
  isReadable: boolean;
}) {
  if (!isReadable) {
    return (
      <div className="border-action-danger/30 bg-action-danger/10 shadow-soft rounded-3xl border p-8">
        <h2 className="text-action-danger text-2xl font-semibold tracking-tight">
          {t('states.invalidTokensTitle')}
        </h2>
        <p className="text-content-secondary mt-3 max-w-2xl text-sm leading-6">
          {t('states.invalidTokensDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-5 lg:p-6">
      <div className="border-border-subtle flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {t(`tabs.${tokenSetType}`)}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {tokenSetName}
          </h2>
        </div>

        <p className="text-content-secondary text-sm">
          {t('tokenCount', { count: rows.length })}
        </p>
      </div>

      {rows.length > 0 ? (
        <div className="mt-6">
          <TokenTable
            locale={locale}
            projectSlug={projectSlug}
            rows={rows}
            labels={createTokenTableLabels(t)}
          />
        </div>
      ) : (
        <div className="border-border-default mt-6 rounded-2xl border border-dashed p-8 text-center">
          <h3 className="text-xl font-semibold tracking-tight">
            {t('states.emptyTokenSetTitle')}
          </h3>
          <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
            {t('states.emptyTokenSetDescription')}
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyTokenSetsState({ t }: { t: TokensEditorTranslator }) {
  return (
    <div className="border-border-default bg-surface-primary shadow-soft rounded-3xl border border-dashed p-10 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        {t('states.emptyTitle')}
      </h2>
      <p className="text-content-secondary mx-auto mt-4 max-w-xl leading-7">
        {t('states.emptyDescription')}
      </p>
    </div>
  );
}

function createTokenTableLabels(t: TokensEditorTranslator): TokenTableLabels {
  return {
    columns: {
      path: t('table.columns.path'),
      type: t('table.columns.type'),
      value: t('table.columns.value'),
      descriptionStatus: t('table.columns.descriptionStatus'),
      validationStatus: t('table.columns.validationStatus'),
    },
    descriptionStatus: {
      available: t('table.descriptionStatus.available'),
      fallback: t('table.descriptionStatus.fallback'),
      missing: t('table.descriptionStatus.missing'),
    },
    validationStatus: {
      valid: t('table.validationStatus.valid'),
      invalid: t('table.validationStatus.invalid'),
      errorsLabel: t('table.validationStatus.errorsLabel'),
    },
    semanticAlias: {
      resolvedValue: t('table.semanticAlias.resolvedValue'),
      unresolved: t('table.semanticAlias.unresolved'),
    },
    noDescription: t('table.noDescription'),
    colorSwatchLabel: t('table.colorSwatchLabel'),
  };
}
