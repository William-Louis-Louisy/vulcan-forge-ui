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
      groups: {
        primitive: t('groups.primitive'),
        semantic: t('groups.semantic'),
        other: t('groups.other'),
      },
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
      genericValue: {
        label: t('genericValueEditor.label'),
        submit: t('genericValueEditor.submit'),
        success: t('genericValueEditor.success'),
        fieldErrors: {
          tokenRadiusValueInvalid: t(
            'genericValueEditor.fieldErrors.tokenRadiusValueInvalid',
          ),
          tokenValueRequired: t(
            'genericValueEditor.fieldErrors.tokenValueRequired',
          ),
          tokenSpacingValueInvalid: t(
            'genericValueEditor.fieldErrors.tokenSpacingValueInvalid',
          ),
          tokenMotionValueInvalid: t(
            'genericValueEditor.fieldErrors.tokenMotionValueInvalid',
          ),
        },
        formErrors: {
          unauthorized: t('genericValueEditor.formErrors.unauthorized'),
          projectNotFound: t('genericValueEditor.formErrors.projectNotFound'),
          tokenSetNotFound: t('genericValueEditor.formErrors.tokenSetNotFound'),
          tokenSetMalformed: t(
            'genericValueEditor.formErrors.tokenSetMalformed',
          ),
          tokenValidationFailed: t(
            'genericValueEditor.formErrors.tokenValidationFailed',
          ),
          tokenNotFound: t('genericValueEditor.formErrors.tokenNotFound'),
          tokenTypeMismatch: t(
            'genericValueEditor.formErrors.tokenTypeMismatch',
          ),
          unexpected: t('genericValueEditor.formErrors.unexpected'),
        },
      },
      semanticAlias: {
        resolvedValue: t('table.semanticAlias.resolvedValue'),
        unresolved: t('table.semanticAlias.unresolved'),
      },
      typographyValue: {
        title: t('typographyValueEditor.title'),
        fontFamilyLabel: t('typographyValueEditor.fontFamilyLabel'),
        fontSizeLabel: t('typographyValueEditor.fontSizeLabel'),
        fontWeightLabel: t('typographyValueEditor.fontWeightLabel'),
        lineHeightLabel: t('typographyValueEditor.lineHeightLabel'),
        letterSpacingLabel: t('typographyValueEditor.letterSpacingLabel'),
        submit: t('typographyValueEditor.submit'),
        success: t('typographyValueEditor.success'),
        fieldErrors: {
          tokenValueRequired: t(
            'typographyValueEditor.fieldErrors.tokenValueRequired',
          ),
          tokenTypographyValueInvalid: t(
            'typographyValueEditor.fieldErrors.tokenTypographyValueInvalid',
          ),
        },
        formErrors: {
          unauthorized: t('typographyValueEditor.formErrors.unauthorized'),
          projectNotFound: t(
            'typographyValueEditor.formErrors.projectNotFound',
          ),
          tokenSetNotFound: t(
            'typographyValueEditor.formErrors.tokenSetNotFound',
          ),
          tokenSetMalformed: t(
            'typographyValueEditor.formErrors.tokenSetMalformed',
          ),
          tokenValidationFailed: t(
            'typographyValueEditor.formErrors.tokenValidationFailed',
          ),
          tokenNotFound: t('typographyValueEditor.formErrors.tokenNotFound'),
          tokenTypeMismatch: t(
            'typographyValueEditor.formErrors.tokenTypeMismatch',
          ),
          unexpected: t('typographyValueEditor.formErrors.unexpected'),
        },
      },
    },
    createColorToken: {
      title: t('createColorToken.title'),
      description: t('createColorToken.description'),
      kindLabel: t('createColorToken.kindLabel'),
      primitiveKind: t('createColorToken.primitiveKind'),
      semanticKind: t('createColorToken.semanticKind'),
      pathLabel: t('createColorToken.pathLabel'),
      valueLabel: t('createColorToken.valueLabel'),
      referenceLabel: t('createColorToken.referenceLabel'),
      descriptionEnLabel: t('createColorToken.descriptionEnLabel'),
      descriptionFrLabel: t('createColorToken.descriptionFrLabel'),
      submit: t('createColorToken.submit'),
      success: t('createColorToken.success'),
      cancel: t('createColorToken.cancel'),
      fieldErrors: {
        tokenPathRequired: t('createColorToken.fieldErrors.tokenPathRequired'),
        tokenPathInvalid: t('createColorToken.fieldErrors.tokenPathInvalid'),
        tokenValueRequired: t(
          'createColorToken.fieldErrors.tokenValueRequired',
        ),
        tokenColorValueInvalid: t(
          'createColorToken.fieldErrors.tokenColorValueInvalid',
        ),
        tokenReferenceRequired: t(
          'createColorToken.fieldErrors.tokenReferenceRequired',
        ),
        tokenReferenceInvalid: t(
          'createColorToken.fieldErrors.tokenReferenceInvalid',
        ),
      },
      formErrors: {
        unauthorized: t('createColorToken.formErrors.unauthorized'),
        projectNotFound: t('createColorToken.formErrors.projectNotFound'),
        tokenSetNotFound: t('createColorToken.formErrors.tokenSetNotFound'),
        tokenSetMalformed: t('createColorToken.formErrors.tokenSetMalformed'),
        tokenValidationFailed: t(
          'createColorToken.formErrors.tokenValidationFailed',
        ),
        tokenPathAlreadyExists: t(
          'createColorToken.formErrors.tokenPathAlreadyExists',
        ),
        primitiveReferenceNotFound: t(
          'createColorToken.formErrors.primitiveReferenceNotFound',
        ),
        primitiveReferenceInvalid: t(
          'createColorToken.formErrors.primitiveReferenceInvalid',
        ),
        unexpected: t('createColorToken.formErrors.unexpected'),
      },
    },
    createDesignToken: {
      spacing: {
        title: t('createDesignToken.spacing.title'),
        description: t('createDesignToken.spacing.description'),
        pathLabel: t('createDesignToken.pathLabel'),
        valueLabel: t('createDesignToken.valueLabel'),
        descriptionEnLabel: t('createDesignToken.descriptionEnLabel'),
        descriptionFrLabel: t('createDesignToken.descriptionFrLabel'),
        submit: t('createDesignToken.submit'),
        success: t('createDesignToken.success'),
        cancel: t('createDesignToken.cancel'),
        pathPlaceholder: 'spacing.4',
        valuePlaceholder: '1rem',
        fieldErrors: {
          tokenPathRequired: t(
            'createDesignToken.fieldErrors.tokenPathRequired',
          ),
          tokenPathInvalid: t('createDesignToken.fieldErrors.tokenPathInvalid'),
          tokenValueRequired: t(
            'createDesignToken.fieldErrors.tokenValueRequired',
          ),
          tokenSpacingValueInvalid: t(
            'createDesignToken.fieldErrors.tokenSpacingValueInvalid',
          ),
        },
        formErrors: {
          unauthorized: t('createDesignToken.formErrors.unauthorized'),
          projectNotFound: t('createDesignToken.formErrors.projectNotFound'),
          tokenSetNotFound: t('createDesignToken.formErrors.tokenSetNotFound'),
          tokenSetMalformed: t(
            'createDesignToken.formErrors.tokenSetMalformed',
          ),
          tokenValidationFailed: t(
            'createDesignToken.formErrors.tokenValidationFailed',
          ),
          tokenPathAlreadyExists: t(
            'createDesignToken.formErrors.tokenPathAlreadyExists',
          ),
          unexpected: t('createDesignToken.formErrors.unexpected'),
        },
      },
      radius: {
        title: t('createDesignToken.radius.title'),
        description: t('createDesignToken.radius.description'),
        pathLabel: t('createDesignToken.pathLabel'),
        valueLabel: t('createDesignToken.valueLabel'),
        descriptionEnLabel: t('createDesignToken.descriptionEnLabel'),
        descriptionFrLabel: t('createDesignToken.descriptionFrLabel'),
        submit: t('createDesignToken.submit'),
        success: t('createDesignToken.success'),
        cancel: t('createDesignToken.cancel'),
        pathPlaceholder: 'radius.md',
        valuePlaceholder: '0.5rem',
        fieldErrors: {
          tokenPathRequired: t(
            'createDesignToken.fieldErrors.tokenPathRequired',
          ),
          tokenPathInvalid: t('createDesignToken.fieldErrors.tokenPathInvalid'),
          tokenValueRequired: t(
            'createDesignToken.fieldErrors.tokenValueRequired',
          ),
          tokenRadiusValueInvalid: t(
            'createDesignToken.fieldErrors.tokenRadiusValueInvalid',
          ),
        },
        formErrors: {
          unauthorized: t('createDesignToken.formErrors.unauthorized'),
          projectNotFound: t('createDesignToken.formErrors.projectNotFound'),
          tokenSetNotFound: t('createDesignToken.formErrors.tokenSetNotFound'),
          tokenSetMalformed: t(
            'createDesignToken.formErrors.tokenSetMalformed',
          ),
          tokenValidationFailed: t(
            'createDesignToken.formErrors.tokenValidationFailed',
          ),
          tokenPathAlreadyExists: t(
            'createDesignToken.formErrors.tokenPathAlreadyExists',
          ),
          unexpected: t('createDesignToken.formErrors.unexpected'),
        },
      },
      motion: {
        title: t('createDesignToken.motion.title'),
        description: t('createDesignToken.motion.description'),
        pathLabel: t('createDesignToken.pathLabel'),
        valueLabel: t('createDesignToken.valueLabel'),
        descriptionEnLabel: t('createDesignToken.descriptionEnLabel'),
        descriptionFrLabel: t('createDesignToken.descriptionFrLabel'),
        submit: t('createDesignToken.submit'),
        success: t('createDesignToken.success'),
        cancel: t('createDesignToken.cancel'),
        pathPlaceholder: 'motion.fast',
        valuePlaceholder: '150ms',
        fieldErrors: {
          tokenPathRequired: t(
            'createDesignToken.fieldErrors.tokenPathRequired',
          ),
          tokenPathInvalid: t('createDesignToken.fieldErrors.tokenPathInvalid'),
          tokenValueRequired: t(
            'createDesignToken.fieldErrors.tokenValueRequired',
          ),
          tokenMotionValueInvalid: t(
            'createDesignToken.fieldErrors.tokenMotionValueInvalid',
          ),
        },
        formErrors: {
          unauthorized: t('createDesignToken.formErrors.unauthorized'),
          projectNotFound: t('createDesignToken.formErrors.projectNotFound'),
          tokenSetNotFound: t('createDesignToken.formErrors.tokenSetNotFound'),
          tokenSetMalformed: t(
            'createDesignToken.formErrors.tokenSetMalformed',
          ),
          tokenValidationFailed: t(
            'createDesignToken.formErrors.tokenValidationFailed',
          ),
          tokenPathAlreadyExists: t(
            'createDesignToken.formErrors.tokenPathAlreadyExists',
          ),
          unexpected: t('createDesignToken.formErrors.unexpected'),
        },
      },
    },
    createTypographyToken: {
      title: t('createTypographyToken.title'),
      description: t('createTypographyToken.description'),
      pathLabel: t('createTypographyToken.pathLabel'),
      pathPlaceholder: 'typography.body',
      fontFamilyLabel: t('createTypographyToken.fontFamilyLabel'),
      fontFamilyPlaceholder: 'Inter',
      fontSizeLabel: t('createTypographyToken.fontSizeLabel'),
      fontSizePlaceholder: '1rem',
      fontWeightLabel: t('createTypographyToken.fontWeightLabel'),
      fontWeightPlaceholder: '600',
      lineHeightLabel: t('createTypographyToken.lineHeightLabel'),
      lineHeightPlaceholder: '1.5',
      letterSpacingLabel: t('createTypographyToken.letterSpacingLabel'),
      letterSpacingPlaceholder: '-0.01em',
      descriptionEnLabel: t('createTypographyToken.descriptionEnLabel'),
      descriptionFrLabel: t('createTypographyToken.descriptionFrLabel'),
      submit: t('createTypographyToken.submit'),
      success: t('createTypographyToken.success'),
      cancel: t('createTypographyToken.cancel'),
      fieldErrors: {
        tokenPathRequired: t(
          'createTypographyToken.fieldErrors.tokenPathRequired',
        ),
        tokenPathInvalid: t(
          'createTypographyToken.fieldErrors.tokenPathInvalid',
        ),
        tokenValueRequired: t(
          'createTypographyToken.fieldErrors.tokenValueRequired',
        ),
        tokenTypographyValueInvalid: t(
          'createTypographyToken.fieldErrors.tokenTypographyValueInvalid',
        ),
      },
      formErrors: {
        unauthorized: t('createTypographyToken.formErrors.unauthorized'),
        projectNotFound: t('createTypographyToken.formErrors.projectNotFound'),
        tokenSetNotFound: t(
          'createTypographyToken.formErrors.tokenSetNotFound',
        ),
        tokenSetMalformed: t(
          'createTypographyToken.formErrors.tokenSetMalformed',
        ),
        tokenValidationFailed: t(
          'createTypographyToken.formErrors.tokenValidationFailed',
        ),
        tokenPathAlreadyExists: t(
          'createTypographyToken.formErrors.tokenPathAlreadyExists',
        ),
        unexpected: t('createTypographyToken.formErrors.unexpected'),
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
