'use server';

import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { defaultAppLocale, isAppLocale } from '@/domain/i18n';
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
        where: {
          type: 'color',
        },
        select: {
          id: true,
          tokens: true,
        },
        take: 1,
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

  const colorTokenSet = project.tokenSets[0];

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
