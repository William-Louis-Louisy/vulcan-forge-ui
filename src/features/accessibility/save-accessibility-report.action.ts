'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { defaultAppLocale, isAppLocale, type AppLocale } from '@/domain/i18n';
import type { ComponentContractType } from '@/domain/design-system';
import type { ThemeMode } from '@/features/themes/themes-editor.utils';
import { createAccessibilityCenterReport } from './accessibility-center.utils';
import type { SaveAccessibilityReportActionState } from './save-accessibility-report.state';
import { persistAccessibilityReportForUser } from './accessibility-report-persistence.service';

function getFormStringValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function getActionLocale(formData: FormData) {
  const rawLocale = getFormStringValue(formData, 'locale');

  return isAppLocale(rawLocale) ? rawLocale : defaultAppLocale;
}

export async function saveAccessibilityReportAction(
  _previousState: SaveAccessibilityReportActionState,
  formData: FormData,
): Promise<SaveAccessibilityReportActionState> {
  const locale = getActionLocale(formData);
  const projectSlug = getFormStringValue(formData, 'projectSlug');

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
      savedReport: null,
    };
  }

  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      id: true,
      defaultLocale: true,
      supportedLocales: true,
      themes: {
        select: {
          id: true,
          mode: true,
          name: true,
          tokens: true,
          updatedAt: true,
        },
      },
      tokenSets: {
        orderBy: {
          type: 'asc',
        },
        select: {
          id: true,
          type: true,
          name: true,
          tokens: true,
        },
      },
      componentContracts: {
        orderBy: {
          type: 'asc',
        },
        select: {
          id: true,
          type: true,
          name: true,
          contract: true,
        },
      },
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
      savedReport: null,
    };
  }

  const colorTokenSet = project.tokenSets.find(
    (tokenSet) => tokenSet.type === 'color',
  );

  if (!colorTokenSet) {
    return {
      status: 'error',
      formError: 'colorTokenSetNotFound',
      savedReport: null,
    };
  }

  const report = createAccessibilityCenterReport({
    colorTokenSetTokens: colorTokenSet.tokens,
    themes: project.themes.map((theme) => ({
      id: theme.id,
      mode: theme.mode as ThemeMode,
      name: theme.name,
      tokens: theme.tokens,
      updatedAt: theme.updatedAt,
    })),
    defaultLocale: project.defaultLocale as AppLocale,
    supportedLocales: project.supportedLocales as AppLocale[],
    tokenSets: project.tokenSets.map((tokenSet) => ({
      id: tokenSet.id,
      type: tokenSet.type,
      name: tokenSet.name,
      tokens: tokenSet.tokens,
    })),
    componentContracts: project.componentContracts.map((componentContract) => ({
      id: componentContract.id,
      type: componentContract.type as ComponentContractType,
      name: componentContract.name,
      contract: componentContract.contract,
    })),
  });

  const persistenceResult = await persistAccessibilityReportForUser({
    userId: session.user.id,
    projectSlug,
    report,
  });

  if (persistenceResult.status === 'error') {
    return {
      status: 'error',
      formError: persistenceResult.error,
      savedReport: null,
    };
  }

  revalidatePath(`/${locale}/app/projects/${projectSlug}/accessibility`);

  return {
    status: 'success',
    formError: null,
    savedReport: {
      id: persistenceResult.report.id,
      score: persistenceResult.report.score,
      status: persistenceResult.report.status,
      createdAt: persistenceResult.report.createdAt.toISOString(),
    },
  };
}
