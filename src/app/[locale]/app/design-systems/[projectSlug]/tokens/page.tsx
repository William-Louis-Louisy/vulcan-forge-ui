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
  type TokensEditorShellLabels,
  type TokenSetEditorViewModel,
} from '@/features/tokens/editor/TokensEditorShell';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getTokensEditorPageData } from '@/features/tokens/tokens-editor.queries';
import { TokenEditorLimitationsNotice } from '@/features/tokens/editor/TokenEditorLimitationsNotice';

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

  const shellLabels: TokensEditorShellLabels = {
    toolbar: {
      searchLabel: t('toolbar.searchLabel'),
      searchPlaceholder: t('toolbar.searchPlaceholder'),
      newToken: t('toolbar.newToken'),
    },
    tabs: {
      label: t('tabs.label'),
      items: tokenSetTypeLabels,
    },
    tokenSet: {
      invalidTokensTitle: t('states.invalidTokensTitle'),
      invalidTokensDescription: t('states.invalidTokensDescription'),
      nonColorTitle: t('limitations.nonColor.title'),
      nonColorDescriptions: {
        color: t('limitations.nonColor.description', {
          tokenSetType: tokenSetTypeLabels.color,
        }),
        spacing: t('limitations.nonColor.description', {
          tokenSetType: tokenSetTypeLabels.spacing,
        }),
        radius: t('limitations.nonColor.description', {
          tokenSetType: tokenSetTypeLabels.radius,
        }),
        typography: t('limitations.nonColor.description', {
          tokenSetType: tokenSetTypeLabels.typography,
        }),
        motion: t('limitations.nonColor.description', {
          tokenSetType: tokenSetTypeLabels.motion,
        }),
      },
      emptySearchTitle: t('states.emptyTokenSetTitle'),
      emptySearchDescription: t('states.emptyTokenSetDescription'),
    },
    inspector: {
      eyebrow: t('inspector.eyebrow'),
      empty: t('inspector.empty'),
      value: t('inspector.value'),
      description: t('inspector.description'),
      noDescription: t('inspector.noDescription'),
      colorSwatchLabel: t('table.colorSwatchLabel'),
      rename: {
        title: t('rename.title'),
        description: t('rename.description'),
        inputLabel: t('rename.inputLabel'),
        submit: t('rename.submit'),
        success: t('rename.success'),
        fieldErrors: {
          tokenPathRequired: t('rename.fieldErrors.tokenPathRequired'),
          tokenPathInvalid: t('rename.fieldErrors.tokenPathInvalid'),
        },
        formErrors: {
          unauthorized: t('rename.formErrors.unauthorized'),
          projectNotFound: t('rename.formErrors.projectNotFound'),
          tokenSetNotFound: t('rename.formErrors.tokenSetNotFound'),
          tokenSetMalformed: t('rename.formErrors.tokenSetMalformed'),
          tokenValidationFailed: t('rename.formErrors.tokenValidationFailed'),
          tokenNotFound: t('rename.formErrors.tokenNotFound'),
          tokenPathAlreadyExists: t('rename.formErrors.tokenPathAlreadyExists'),
          unexpected: t('rename.formErrors.unexpected'),
        },
      },
      semanticAlias: {
        resolvedValue: t('table.semanticAlias.resolvedValue'),
        unresolved: t('table.semanticAlias.unresolved'),
      },
    },
  };

  return (
    <section className="mx-auto max-w-7xl">
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

      <TokenEditorLimitationsNotice
        labels={{
          eyebrow: t('limitations.eyebrow'),
          title: t('limitations.title'),
          description: t('limitations.description'),
          badge: t('limitations.badge'),
          available: {
            title: t('limitations.available.title'),
            items: [
              t('limitations.available.colorEdition'),
              t('limitations.available.descriptionEdition'),
              t('limitations.available.themeReferences'),
            ],
          },
          upcoming: {
            title: t('limitations.upcoming.title'),
            items: [
              t('limitations.upcoming.renameTokens'),
              t('limitations.upcoming.createTokens'),
              t('limitations.upcoming.spacingRadiusTypographyMotion'),
            ],
          },
        }}
      />

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
