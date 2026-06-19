import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import {
  PreviewPanel,
  type PreviewPanelLabels,
} from '@/features/themes/PreviewPanel';
import {
  themeColorKeys,
  sortThemesByMode,
  getThemeColorValue,
  getThemeContrastPairs,
  getThemeColorRawValue,
  getThemeColorReferencePath,
  createThemeColorTokenOptions,
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
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { createPreviewThemes } from '@/features/themes/preview-panel.utils';
import { getThemesEditorPageData } from '@/features/themes/themes-editor.queries';
import { ThemeTokenReferenceEditor } from '@/features/themes/ThemeTokenReferenceEditor';
import { SemanticColorTokenAliasEditor } from '@/features/tokens/SemanticColorTokenAliasEditor';

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

  const themeColorTokenOptions = createThemeColorTokenOptions(
    pageData.colorTokenSet?.tokens ?? [],
  );

  const semanticColorRows = colorRowsResult.rows.filter(
    isEditableSemanticColorTokenRow,
  );

  return (
    <section className="mx-auto max-w-7xl">
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
          <ThemeCard
            key={theme.id}
            t={t}
            locale={locale}
            projectSlug={pageData.project.slug}
            theme={theme}
            colorTokenOptions={themeColorTokenOptions}
          />
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
  locale,
  projectSlug,
  theme,
  colorTokenOptions,
}: {
  t: ThemesEditorTranslator;
  locale: Locale;
  projectSlug: string;
  theme: ThemeEditorTheme;
  colorTokenOptions: ReturnType<typeof createThemeColorTokenOptions>;
}) {
  const contrastPairs = getThemeContrastPairs({
    tokens: theme.tokens,
    colorTokenOptions,
  });
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
          {t('themeMapping.title')}
        </h3>

        <p className="text-content-secondary mt-2 text-sm leading-6">
          {t('themeMapping.description')}
        </p>

        <div className="mt-4 grid gap-3">
          {themeColorKeys.map((colorKey) => {
            const rawValue = getThemeColorRawValue({
              tokens: theme.tokens,
              colorKey,
            });

            const referencePath = getThemeColorReferencePath({
              tokens: theme.tokens,
              colorKey,
            });

            const resolvedValue = getThemeColorValue({
              tokens: theme.tokens,
              colorKey,
              colorTokenOptions,
            });

            return (
              <ThemeTokenReferenceEditor
                key={colorKey}
                locale={locale}
                projectSlug={projectSlug}
                themeId={theme.id}
                colorKey={colorKey}
                initialReferencePath={referencePath}
                legacyDirectValue={referencePath ? null : rawValue}
                resolvedValue={resolvedValue}
                options={colorTokenOptions}
                labels={{
                  slotLabel: t('themeMapping.slotLabel'),
                  selectLabel: t('themeMapping.selectLabel', {
                    colorName: t(`themeMapping.keys.${colorKey}`),
                  }),
                  placeholder: t('themeMapping.placeholder'),
                  currentReference: t('themeMapping.currentReference'),
                  resolvedValue: t('themeMapping.resolvedValue'),
                  legacyDirectValue: t('themeMapping.legacyDirectValue'),
                  save: t('themeMapping.form.save'),
                  saving: t('themeMapping.form.saving'),
                  saved: t('themeMapping.form.saved'),
                  unsaved: t('themeMapping.form.unsaved'),
                  noOptions: t('themeMapping.form.noOptions'),
                  errors: {
                    unauthorized: t('themeMapping.form.errors.unauthorized'),
                    invalidPayload: t(
                      'themeMapping.form.errors.invalidPayload',
                    ),
                    themeNotFound: t('themeMapping.form.errors.themeNotFound'),
                    invalidTokenReference: t(
                      'themeMapping.form.errors.invalidTokenReference',
                    ),
                    unexpected: t('themeMapping.form.errors.unexpected'),
                  },
                }}
              />
            );
          })}
        </div>
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
            {pair.foregroundReferencePath
              ? `{${pair.foregroundReferencePath}}`
              : pair.foregroundKey}{' '}
            /{' '}
            {pair.backgroundReferencePath
              ? `{${pair.backgroundReferencePath}}`
              : pair.backgroundKey}
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

      <ContrastRatioSummary t={t} pair={pair} />
    </div>
  );
}

function ContrastRatioSummary({
  t,
  pair,
}: {
  t: ThemesEditorTranslator;
  pair: ThemeColorPair;
}) {
  if (!pair.foregroundValue || !pair.backgroundValue) {
    return (
      <p className="text-action-warning mt-3 text-xs font-semibold">
        {t('contrast.missingColors')}
      </p>
    );
  }

  if (!pair.contrast?.isValid || pair.contrast.ratio === null) {
    return (
      <p className="text-action-danger mt-3 text-xs font-semibold">
        {t('contrast.invalidColors')}
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-1">
      <span
        className={[
          'w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
          pair.contrast.status === 'pass'
            ? 'bg-action-success/10 text-action-success'
            : '',
          pair.contrast.status === 'warning'
            ? 'bg-action-warning/10 text-action-warning'
            : '',
          pair.contrast.status === 'fail'
            ? 'bg-action-danger/10 text-action-danger'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {t(`contrast.status.${pair.contrast.status}`)}
      </span>

      <p className="text-content-secondary text-xs font-semibold">
        {t('contrast.ratio', {
          ratio: pair.contrast.ratio.toFixed(2),
        })}
      </p>

      <p className="text-content-tertiary text-xs">
        {t('contrast.requiredRatio', {
          required: pair.contrast.requiredRatio.toFixed(1),
        })}
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
