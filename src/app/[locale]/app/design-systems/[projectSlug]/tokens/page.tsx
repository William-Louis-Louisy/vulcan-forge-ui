import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { resolveLocalizedStringWithFallback } from '@/domain/i18n';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getTokensEditorPageData } from '@/features/tokens/tokens-editor.queries';
import {
  formatTokenValue,
  getActiveTokenSetType,
  isHexColorValue,
  parseTokenSetTokens,
  sortTokenSetsByType,
  tokenSetTypes,
  type TokenSetType,
} from '@/features/tokens/tokens-editor.utils';
import type { DesignToken } from '@/domain/design-system';

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

type ResolvableLocalizedString = Parameters<
  typeof resolveLocalizedStringWithFallback
>[0]['localizedString'];

function toResolvableLocalizedString(
  localizedString: NonNullable<DesignToken['description']>,
): ResolvableLocalizedString {
  const normalizedLocalizedString: ResolvableLocalizedString = {};

  if (localizedString.en) {
    normalizedLocalizedString.en = localizedString.en;
  }

  if (localizedString.fr) {
    normalizedLocalizedString.fr = localizedString.fr;
  }

  return normalizedLocalizedString;
}

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

  const parsedTokens = activeTokenSet
    ? parseTokenSetTokens(activeTokenSet.tokens)
    : {
        tokens: [],
        isValid: false,
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
            tokenSetName={activeTokenSet.name}
            tokenSetType={activeTokenSet.type}
            tokens={parsedTokens.tokens}
            isValid={parsedTokens.isValid}
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
  tokenSetName,
  tokenSetType,
  tokens,
  isValid,
}: {
  t: TokensEditorTranslator;
  locale: Locale;
  tokenSetName: string;
  tokenSetType: TokenSetType;
  tokens: DesignToken[];
  isValid: boolean;
}) {
  if (!isValid) {
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
          {t('tokenCount', { count: tokens.length })}
        </p>
      </div>

      {tokens.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {tokens.map((token) => (
            <TokenCard key={token.path} t={t} locale={locale} token={token} />
          ))}
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

function TokenCard({
  t,
  locale,
  token,
}: {
  t: TokensEditorTranslator;
  locale: Locale;
  token: DesignToken;
}) {
  const tokenValue = formatTokenValue(token.value);
  const description = token.description
    ? resolveLocalizedStringWithFallback({
        localizedString: toResolvableLocalizedString(token.description),
        locale,
      }).value
    : t('token.noDescription');

  return (
    <article className="border-border-subtle bg-background-subtle grid gap-4 rounded-2xl border p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center">
      <div>
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {t('token.path')}
        </p>
        <h3 className="text-content-primary mt-1 font-mono text-sm font-semibold break-words">
          {token.path}
        </h3>
      </div>

      <div>
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {t('token.type')}
        </p>
        <p className="text-content-primary mt-1 text-sm font-semibold">
          {token.type}
        </p>
      </div>

      <div>
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {t('token.value')}
        </p>
        <div className="mt-1 flex items-center gap-2">
          {typeof token.value === 'string' && isHexColorValue(token.value) ? (
            <span
              aria-hidden="true"
              className="border-border-subtle size-5 rounded-full border"
              style={{ backgroundColor: token.value }}
            />
          ) : null}

          <p className="text-content-primary font-mono text-sm font-semibold break-all">
            {tokenValue}
          </p>
        </div>
      </div>

      <div>
        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
          {t('token.description')}
        </p>
        <p className="text-content-secondary mt-1 text-sm leading-6">
          {description}
        </p>
      </div>
    </article>
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
