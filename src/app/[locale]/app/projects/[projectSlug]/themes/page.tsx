import { auth } from '@/auth';
import { hasLocale } from 'next-intl';
import { EmptyState, Notice } from '@/components/ui';
import { AppLink } from '@/components/navigation/AppLink';
import {
  PreviewPanel,
  type PreviewPanelLabels,
} from '@/features/themes/PreviewPanel';
import {
  sortThemesByMode,
  getThemeColorValue,
  getThemeContrastPairs,
  getThemeColorRawValue,
  getThemeColorReferencePath,
  createThemeColorTokenOptions,
  getThemeColorRoleKeys,
  isThemeColorKey,
  type ThemeEditorTheme,
} from '@/features/themes/themes-editor.utils';
import { getTranslations } from 'next-intl/server';
import { notFound, redirect } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { createPreviewThemes } from '@/features/themes/preview-panel.utils';
import { getThemesEditorPageData } from '@/features/themes/themes-editor.queries';
import { ThemeTokenReferenceEditor } from '@/features/themes/ThemeTokenReferenceEditor';
import { ThemeColorRoleCreateForm } from '@/features/themes/ThemeColorRoleCreateForm';
import { ThemeContrastMatrix } from '@/features/themes/ThemeContrastMatrix';
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
  const themeColorTokenOptions = createThemeColorTokenOptions(
    pageData.colorTokenSet?.tokens ?? [],
  );

  return (
    <section className="flex min-h-0 flex-col xl:absolute xl:inset-0 xl:h-auto xl:overflow-hidden">
      <ThemesResponsiveWorkspace
        labels={{
          editor: t('themeMapping.title'),
          preview: t('preview.title'),
          workspaceNavigation: t('workspace.navigationLabel'),
          themeNavigation: t('themes.navigationLabel'),
        }}
        title={t('workspaceTitle')}
        description={t('description')}
        projectName={pageData.project.name}
        summary={t('themes.count', { count: themes.length })}
        themes={themes.map((theme) => ({
          id: theme.id,
          label: t(`themes.${theme.mode}`),
          content: (
            <ThemeEditorPanel
              t={t}
              locale={locale}
              projectSlug={pageData.project.slug}
              theme={theme}
              colorTokenOptions={themeColorTokenOptions}
            />
          ),
        }))}
        emptyState={
          <div className="p-4 md:p-6 xl:p-7">
            <EmptyState
              title={t('themes.emptyTitle')}
              description={t('themes.emptyDescription')}
              className="mx-auto max-w-2xl"
            />
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

function ThemeEditorPanel({
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
  const roleKeys = getThemeColorRoleKeys(theme.tokens);
  const isDefaultTheme = theme.mode === 'light';
  const hasColorTokenOptions = colorTokenOptions.length > 0;

  return (
    <div className="min-w-0 px-4 py-4 md:px-6 xl:px-7">
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

      {!hasColorTokenOptions ? (
        <Notice
          tone="warning"
          title={t('themeMapping.noTokenOptionsTitle')}
          className="mt-4 rounded-md"
        >
          <p>{t('themeMapping.noTokenOptionsDescription')}</p>
          <AppLink
            href={`/app/projects/${projectSlug}/tokens`}
            className="border-action-warning/40 hover:bg-action-warning/10 mt-3 inline-flex min-h-9 items-center justify-center rounded-md border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t('openTokensEditor')}
          </AppLink>
        </Notice>
      ) : null}

      <section className="border-border-subtle bg-surface-primary mt-4 min-w-0 rounded-md border">
        <header className="border-border-subtle border-b p-4">
          <h3 className="text-sm font-semibold tracking-tight">
            {t('themeMapping.title')}
          </h3>
          <p className="text-content-secondary mt-1 text-xs leading-5">
            {t('themeMapping.description')}
          </p>
        </header>

        <ThemeColorRoleCreateForm
          locale={locale}
          projectSlug={projectSlug}
          themeId={theme.id}
          options={colorTokenOptions}
          labels={{
            title: t('themeMapping.createRole.title'),
            description: t('themeMapping.createRole.description'),
            open: t('themeMapping.createRole.open'),
            cancel: t('themeMapping.createRole.cancel'),
            roleKeyLabel: t('themeMapping.createRole.roleKeyLabel'),
            roleKeyPlaceholder: t('themeMapping.createRole.roleKeyPlaceholder'),
            roleKeyHint: t('themeMapping.createRole.roleKeyHint'),
            tokenLabel: t('themeMapping.createRole.tokenLabel'),
            tokenPlaceholder: t('themeMapping.createRole.tokenPlaceholder'),
            submit: t('themeMapping.createRole.submit'),
            submitting: t('themeMapping.createRole.submitting'),
            added: t('themeMapping.createRole.added'),
            errors: {
              unauthorized: t('themeMapping.createRole.errors.unauthorized'),
              invalidPayload: t(
                'themeMapping.createRole.errors.invalidPayload',
              ),
              themeNotFound: t('themeMapping.createRole.errors.themeNotFound'),
              invalidTokenReference: t(
                'themeMapping.createRole.errors.invalidTokenReference',
              ),
              invalidRoleKey: t(
                'themeMapping.createRole.errors.invalidRoleKey',
              ),
              invalidTokenPath: t(
                'themeMapping.createRole.errors.invalidTokenPath',
              ),
              themeTokensMalformed: t(
                'themeMapping.createRole.errors.themeTokensMalformed',
              ),
              roleAlreadyExists: t(
                'themeMapping.createRole.errors.roleAlreadyExists',
              ),
              unexpected: t('themeMapping.createRole.errors.unexpected'),
            },
          }}
        />

        <div className="grid min-w-0 gap-2 p-3 sm:p-4">
          {roleKeys.map((roleKey) => {
            const rawValue = getThemeColorRawValue({
              tokens: theme.tokens,
              colorKey: roleKey,
            });
            const referencePath = getThemeColorReferencePath({
              tokens: theme.tokens,
              colorKey: roleKey,
            });
            const resolvedValue = getThemeColorValue({
              tokens: theme.tokens,
              colorKey: roleKey,
              colorTokenOptions,
            });
            const roleLabel = isThemeColorKey(roleKey)
              ? t(`themeMapping.keys.${roleKey}`)
              : roleKey;

            return (
              <ThemeTokenReferenceEditor
                key={roleKey}
                locale={locale}
                projectSlug={projectSlug}
                themeId={theme.id}
                roleKey={roleKey}
                initialReferencePath={referencePath}
                legacyDirectValue={referencePath ? null : rawValue}
                resolvedValue={resolvedValue}
                options={colorTokenOptions}
                showNoOptionsMessage={false}
                labels={{
                  slotLabel: t('themeMapping.slotLabel'),
                  selectLabel: t('themeMapping.selectLabel', {
                    colorName: roleLabel,
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
                    invalidRoleKey: t(
                      'themeMapping.form.errors.invalidRoleKey',
                    ),
                    invalidTokenPath: t(
                      'themeMapping.form.errors.invalidTokenPath',
                    ),
                    themeTokensMalformed: t(
                      'themeMapping.form.errors.themeTokensMalformed',
                    ),
                    unexpected: t('themeMapping.form.errors.unexpected'),
                  },
                }}
              />
            );
          })}
        </div>
      </section>

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
          grades: {
            aaa: t('contrast.grades.aaa'),
            aa: t('contrast.grades.aa'),
            largeOnly: t('contrast.grades.largeOnly'),
            fail: t('contrast.grades.fail'),
          },
          pairLabels: {
            contentOnBackground: t('contrast.pairs.contentOnBackground'),
            contentOnSurface: t('contrast.pairs.contentOnSurface'),
            mutedOnBackground: t('contrast.pairs.mutedOnBackground'),
            mutedOnSurface: t('contrast.pairs.mutedOnSurface'),
            accentOnBackground: t('contrast.pairs.accentOnBackground'),
            accentOnSurface: t('contrast.pairs.accentOnSurface'),
            infoOnBackground: t('contrast.pairs.infoOnBackground'),
            infoOnSurface: t('contrast.pairs.infoOnSurface'),
            successOnBackground: t('contrast.pairs.successOnBackground'),
            successOnSurface: t('contrast.pairs.successOnSurface'),
            warningOnBackground: t('contrast.pairs.warningOnBackground'),
            warningOnSurface: t('contrast.pairs.warningOnSurface'),
            dangerOnBackground: t('contrast.pairs.dangerOnBackground'),
            dangerOnSurface: t('contrast.pairs.dangerOnSurface'),
          },
          colorLabels: {
            background: t('themeMapping.keys.background'),
            surface: t('themeMapping.keys.surface'),
            content: t('themeMapping.keys.content'),
            muted: t('themeMapping.keys.muted'),
            accent: t('themeMapping.keys.accent'),
            info: t('themeMapping.keys.info'),
            success: t('themeMapping.keys.success'),
            warning: t('themeMapping.keys.warning'),
            danger: t('themeMapping.keys.danger'),
          },
        }}
      />
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
