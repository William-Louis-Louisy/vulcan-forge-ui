import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { createPreviewThemes } from '@/features/themes/preview-panel.utils';
import { getThemesEditorPageData } from '@/features/themes/themes-editor.queries';
import {
  PreviewPanel,
  type PreviewPanelLabels,
} from '@/features/themes/PreviewPanel';
import { SemanticColorTokenAliasEditor } from '@/features/tokens/SemanticColorTokenAliasEditor';
import {
  sortThemesByMode,
  getThemeContrastPairs,
  type ThemeColorPair,
  type ThemeEditorTheme,
} from '@/features/themes/themes-editor.utils';
import {
  createTokenRows,
  tokenReferenceToPath,
  isEditableSemanticColorTokenRow,
  getResolvedColorValueForReference,
  getPrimitiveColorTokenAliasOptions,
} from '@/features/tokens/tokens-editor.utils';

type ThemesEditorPageProps = {
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

type ThemesEditorTranslator = Awaited<ReturnType<typeof getTranslations>>;

export default async function ThemesEditorPage({
  params,
}: ThemesEditorPageProps) {
  const { locale: requestedLocale, projectSlug } = await params;

  if (!hasLocale(routing.locales, requestedLocale)) {
    notFound();
  }

  const locale = requestedLocale as Locale;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations('ThemesEditorPage');

  const pageData = await getThemesEditorPageData({
    userId: session.user.id,
    projectSlug,
  });

  if (!pageData) {
    notFound();
  }

  const themes = sortThemesByMode(pageData.themes);

  const previewThemes = createPreviewThemes({
    themes,
    colorTokenSetTokens: pageData.colorTokenSet?.tokens ?? [],
  });

  const colorRowsResult = pageData.colorTokenSet
    ? createTokenRows(pageData.colorTokenSet.tokens)
    : {
        rows: [],
        isReadable: false,
      };

  const primitiveColorAliasOptions = getPrimitiveColorTokenAliasOptions(
    colorRowsResult.rows,
  );

  const semanticColorRows = colorRowsResult.rows.filter(
    isEditableSemanticColorTokenRow,
  );

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-wrap gap-8">
        <Link
          href="/app/design-systems"
          className="text-action-primary text-sm font-semibold"
        >
          {t('backToProjects')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/tokens?set=color`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openTokensEditor')}
        </Link>

        <Link
          href={`/app/design-systems/${pageData.project.slug}/accessibility`}
          className="text-action-primary text-sm font-semibold"
        >
          {t('openAccessibilityCenter')}
        </Link>
      </div>

      <div className="mt-8">
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

      <div className="mt-10">
        <PreviewPanel
          themes={previewThemes}
          labels={createPreviewPanelLabels(t)}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} t={t} theme={theme} />
        ))}
      </div>

      <section className="border-border-subtle bg-surface-primary shadow-soft mt-10 rounded-3xl border p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
              {t('semanticTokens.eyebrow')}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {t('semanticTokens.title')}
            </h2>
          </div>

          <p className="text-content-secondary text-sm">
            {t('semanticTokens.count', { count: semanticColorRows.length })}
          </p>
        </div>

        {colorRowsResult.isReadable ? (
          <div className="mt-6 grid gap-4">
            {semanticColorRows.length > 0 ? (
              semanticColorRows.map((row) => {
                const currentReference =
                  row.reference ??
                  (typeof row.rawValue === 'string' ? row.rawValue : '');

                const currentReferencePath = currentReference
                  ? tokenReferenceToPath(currentReference)
                  : null;

                const resolvedColorValue = currentReference
                  ? getResolvedColorValueForReference({
                      reference: currentReference,
                      primitiveOptions: primitiveColorAliasOptions,
                    })
                  : null;

                return (
                  <article
                    key={row.id}
                    className="border-border-subtle bg-background-subtle rounded-2xl border p-4"
                  >
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start">
                      <div>
                        <p className="text-content-tertiary text-xs font-semibold tracking-[0.18em] uppercase">
                          {t('semanticTokens.path')}
                        </p>
                        <h3 className="wrap-break-words mt-1 font-mono text-sm font-semibold">
                          {row.path}
                        </h3>

                        <p className="text-content-tertiary mt-4 text-xs font-semibold tracking-[0.18em] uppercase">
                          {t('semanticTokens.currentAlias')}
                        </p>
                        <p className="text-content-secondary wrap-break-words mt-1 font-mono text-sm">
                          {currentReference || t('semanticTokens.noAlias')}
                        </p>

                        <ResolvedColorPreview
                          t={t}
                          resolvedColorValue={resolvedColorValue}
                        />
                      </div>

                      <SemanticColorTokenAliasEditor
                        locale={locale}
                        projectSlug={pageData.project.slug}
                        tokenPath={row.path}
                        initialReferencePath={currentReferencePath ?? ''}
                        resolvedColorValue={resolvedColorValue}
                        primitiveOptions={primitiveColorAliasOptions}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <EmptyState
                title={t('semanticTokens.emptyTitle')}
                description={t('semanticTokens.emptyDescription')}
              />
            )}
          </div>
        ) : (
          <EmptyState
            title={t('semanticTokens.invalidTitle')}
            description={t('semanticTokens.invalidDescription')}
          />
        )}
      </section>
    </section>
  );
}

function ThemeCard({
  t,
  theme,
}: {
  t: ThemesEditorTranslator;
  theme: ThemeEditorTheme;
}) {
  const contrastPairs = getThemeContrastPairs(theme.tokens);
  const isDefaultTheme = theme.mode === 'light';

  return (
    <article className="border-border-subtle bg-surface-primary shadow-soft rounded-3xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
            {t(`themes.${theme.mode}`)}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {theme.name}
          </h2>
        </div>

        {isDefaultTheme ? (
          <span className="border-action-primary/30 bg-action-primary/10 text-action-primary rounded-full border px-3 py-1 text-xs font-semibold">
            {t('themes.defaultBadge')}
          </span>
        ) : null}
      </div>

      <div className="mt-6">
        <h3 className="text-content-tertiary text-sm font-semibold tracking-[0.18em] uppercase">
          {t('contrast.title')}
        </h3>

        <p className="text-content-secondary mt-2 text-sm leading-6">
          {t('contrast.description')}
        </p>

        <div className="mt-4 grid gap-3">
          {contrastPairs.map((pair) => (
            <ContrastPairRow key={pair.key} t={t} pair={pair} />
          ))}
        </div>
      </div>
    </article>
  );
}

function ContrastPairRow({
  t,
  pair,
}: {
  t: ThemesEditorTranslator;
  pair: ThemeColorPair;
}) {
  return (
    <div className="border-border-subtle bg-background-subtle rounded-2xl border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">
            {t(`contrast.pairs.${pair.key}`)}
          </p>
          <p className="text-content-tertiary mt-1 text-xs">
            {pair.foregroundKey} / {pair.backgroundKey}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ColorPreview
            label={t('contrast.foreground')}
            value={pair.foregroundValue}
          />
          <ColorPreview
            label={t('contrast.background')}
            value={pair.backgroundValue}
          />
        </div>
      </div>

      <p className="text-content-secondary mt-3 text-xs font-semibold">
        {t('contrast.ratioPending')}
      </p>
    </div>
  );
}

function ColorPreview({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <span
          role="img"
          aria-label={`${label}: ${value}`}
          className="border-border-subtle size-5 rounded-full border"
          style={{ backgroundColor: value }}
        />
      ) : (
        <span className="border-border-default size-5 rounded-full border border-dashed" />
      )}

      <span className="text-content-secondary font-mono text-xs">
        {value ?? '—'}
      </span>
    </div>
  );
}

function ResolvedColorPreview({
  t,
  resolvedColorValue,
}: {
  t: ThemesEditorTranslator;
  resolvedColorValue: string | null;
}) {
  if (!resolvedColorValue) {
    return (
      <p className="text-action-warning mt-4 text-xs font-semibold">
        {t('semanticTokens.unresolved')}
      </p>
    );
  }

  return (
    <div className="text-content-secondary mt-4 flex items-center gap-2 text-xs">
      <span
        role="img"
        aria-label={`${t('semanticTokens.resolvedValue')}: ${resolvedColorValue}`}
        className="border-border-subtle size-5 rounded-full border"
        style={{ backgroundColor: resolvedColorValue }}
      />
      <span>
        {t('semanticTokens.resolvedValue')}: {resolvedColorValue}
      </span>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-border-default rounded-2xl border border-dashed p-8 text-center">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-content-secondary mx-auto mt-3 max-w-xl text-sm leading-6">
        {description}
      </p>
    </div>
  );
}

function createPreviewPanelLabels(
  t: ThemesEditorTranslator,
): PreviewPanelLabels {
  return {
    title: t('preview.title'),
    description: t('preview.description'),
    modeLabel: t('preview.modeLabel'),
    modes: {
      light: t('themes.light'),
      dark: t('themes.dark'),
    },
    empty: t('preview.empty'),
    components: {
      button: t('preview.components.button'),
      textField: t('preview.components.textField'),
      card: t('preview.components.card'),
      alert: t('preview.components.alert'),
    },
    button: {
      primary: t('preview.button.primary'),
      secondary: t('preview.button.secondary'),
    },
    textField: {
      label: t('preview.textField.label'),
      placeholder: t('preview.textField.placeholder'),
      helper: t('preview.textField.helper'),
    },
    card: {
      title: t('preview.card.title'),
      description: t('preview.card.description'),
      cta: t('preview.card.cta'),
    },
    alert: {
      title: t('preview.alert.title'),
      description: t('preview.alert.description'),
    },
  };
}
