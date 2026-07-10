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
import { ThemeContrastMatrix } from '@/features/themes/ThemeContrastMatrix';
import { SemanticColorTokenAliasEditor } from '@/features/tokens/SemanticColorTokenAliasEditor';
import { ThemesResponsiveWorkspace } from '@/features/themes/ThemesResponsiveWorkspace';

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
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <ThemesResponsiveWorkspace
        labels={{
          editor: t('themeMapping.title'),
          preview: t('preview.title'),
        }}
        editor={
          <div className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
            <div className="mx-auto w-full max-w-5xl min-w-0">
              <header className="border-border-subtle min-w-0 border-b pb-5">
                <p className="text-action-primary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                  {t('eyebrow')}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.625rem]">
                  {t('title', { projectName: pageData.project.name })}
                </h1>
                <p className="text-content-secondary mt-2 max-w-3xl text-sm leading-6">
                  {t('description')}
                </p>
              </header>

              <div className="mt-5 grid min-w-0 gap-5">
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

              <section className="border-border-subtle bg-surface-primary shadow-soft mt-5 min-w-0 rounded-md border">
                <div className="border-border-subtle flex min-w-0 flex-col gap-2 border-b p-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
                      {t('semanticTokens.eyebrow')}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight">
                      {t('semanticTokens.title')}
                    </h2>
                  </div>
                  <p className="text-content-secondary text-xs font-semibold">
                    {t('semanticTokens.count', {
                      count: semanticColorRows.length,
                    })}
                  </p>
                </div>

                {colorRowsResult.isReadable ? (
                  semanticColorRows.length > 0 ? (
                    <div className="min-w-0">
                      <div className="border-border-subtle bg-background-subtle text-content-tertiary hidden grid-cols-[minmax(13rem,0.85fr)_minmax(0,2fr)] border-b px-4 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] uppercase md:grid">
                        <span>{t('semanticTokens.path')}</span>
                        <span>{t('semanticTokens.currentAlias')}</span>
                      </div>

                      {semanticColorRows.map((row) => {
                        const currentReference =
                          row.reference ??
                          (typeof row.rawValue === 'string'
                            ? row.rawValue
                            : '');
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
                            className="border-border-subtle grid min-w-0 gap-3 border-b p-3 last:border-b-0 sm:p-4 md:grid-cols-[minmax(13rem,0.85fr)_minmax(0,2fr)] md:items-center"
                          >
                            <div className="min-w-0">
                              <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.14em] uppercase md:sr-only">
                                {t('semanticTokens.path')}
                              </p>
                              <div className="mt-1 flex min-w-0 items-center gap-2 md:mt-0">
                                <span
                                  aria-hidden="true"
                                  className="border-border-subtle size-5 shrink-0 rounded-full border"
                                  style={{
                                    backgroundColor:
                                      resolvedColorValue ?? 'transparent',
                                  }}
                                />
                                <h3 className="min-w-0 truncate font-mono text-xs font-semibold">
                                  {row.path}
                                </h3>
                              </div>
                            </div>

                            <SemanticColorTokenAliasEditor
                              locale={locale}
                              projectSlug={pageData.project.slug}
                              tokenPath={row.path}
                              initialReferencePath={
                                currentReferencePath ?? ''
                              }
                              resolvedColorValue={resolvedColorValue}
                              primitiveOptions={primitiveColorAliasOptions}
                            />
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6">
                      <EmptyState
                        title={t('semanticTokens.emptyTitle')}
                        description={t('semanticTokens.emptyDescription')}
                      />
                    </div>
                  )
                ) : (
                  <div className="p-4 sm:p-6">
                    <EmptyState
                      title={t('semanticTokens.invalidTitle')}
                      description={t('semanticTokens.invalidDescription')}
                    />
                  </div>
                )}
              </section>
            </div>
          </div>
        }
        preview={
          <PreviewPanel
            variant="rail"
            themes={previewThemes}
            labels={createPreviewPanelLabels(t)}
          />
        }
      />
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
    <article className="border-border-subtle bg-surface-primary shadow-soft min-w-0 rounded-md border p-4 sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-content-tertiary text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {t(`themes.${theme.mode}`)}
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold tracking-tight">
            {theme.name}
          </h2>
        </div>

        {isDefaultTheme ? (
          <span className="border-action-primary/30 bg-action-primary/10 text-action-primary shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold">
            {t('themes.defaultBadge')}
          </span>
        ) : null}
      </div>

      <div className="mt-4 min-w-0">
        <h3 className="text-sm font-semibold tracking-tight">
          {t('themeMapping.title')}
        </h3>
        <p className="text-content-secondary mt-1 text-xs leading-5">
          {t('themeMapping.description')}
        </p>

        <div className="mt-3 grid min-w-0 gap-2">
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

      <ThemeContrastMatrix
        pairs={contrastPairs}
        labels={{
          title: t('contrast.title'),
          description: t('contrast.description'),
          foreground: t('contrast.foreground'),
          background: t('contrast.background'),
          missingColors: t('contrast.missingColors'),
          invalidColors: t('contrast.invalidColors'),
          ratio: (ratio) => t('contrast.ratio', { ratio }),
          requiredRatio: (required) =>
            t('contrast.requiredRatio', { required }),
          statuses: {
            pass: t('contrast.status.pass'),
            warning: t('contrast.status.warning'),
            fail: t('contrast.status.fail'),
          },
          pairLabels: Object.fromEntries(
            contrastPairs.map((pair) => [
              pair.key,
              t(`contrast.pairs.${pair.key}`),
            ]),
          ),
          colorLabels: {
            background: t('themeMapping.keys.background'),
            surface: t('themeMapping.keys.surface'),
            content: t('themeMapping.keys.content'),
            muted: t('themeMapping.keys.muted'),
            accent: t('themeMapping.keys.accent'),
          },
        }}
      />
    </article>
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
    <div className="border-border-default min-w-0 rounded-md border border-dashed p-6 text-center">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-content-secondary mx-auto mt-2 max-w-xl text-sm leading-6">
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
