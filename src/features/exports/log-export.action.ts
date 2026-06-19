'use server';

import { z } from 'zod';
import { auth } from '@/auth';
import {
  exportCenterFormats,
  type ExportCenterFormat,
} from './export-center.utils';
import {
  ExportFormat,
  ExportStatus,
  AppLocale as PrismaAppLocale,
} from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/db/prisma';
import { appLocaleSchema } from '@/domain/i18n';

const logExportStatusSchema = z.enum(['success', 'failed']);

const logExportPayloadSchema = z.object({
  projectSlug: z.string().min(1),
  pageLocale: appLocaleSchema,
  format: z.enum(exportCenterFormats),
  exportLocale: appLocaleSchema.nullable(),
  status: logExportStatusSchema,
  errorMessage: z.string().max(500).nullable().optional(),
});

export type LogExportStatus = z.infer<typeof logExportStatusSchema>;

export type LogExportActionPayload = z.infer<typeof logExportPayloadSchema>;

export type LogExportActionResult = {
  status: 'success' | 'error';
  formError:
    | 'unauthorized'
    | 'projectNotFound'
    | 'invalidPayload'
    | 'unexpected'
    | null;
};

const exportFormatMap: Record<ExportCenterFormat, ExportFormat> = {
  cssVariables: ExportFormat.cssVariables,
  tailwindV4: ExportFormat.tailwindV4,
  typescriptTheme: ExportFormat.typescriptTheme,
  reactNativeTheme: ExportFormat.reactNativeTheme,
  documentationMarkdown: ExportFormat.markdownDocumentation,
  aiInstructions: ExportFormat.aiInstructions,
};

const exportStatusMap: Record<LogExportStatus, ExportStatus> = {
  success: ExportStatus.success,
  failed: ExportStatus.failed,
};

function toPrismaLocale(locale: LogExportActionPayload['exportLocale']) {
  if (!locale) {
    return null;
  }

  return locale === 'fr' ? PrismaAppLocale.fr : PrismaAppLocale.en;
}

export async function logExportAction(
  payload: LogExportActionPayload,
): Promise<LogExportActionResult> {
  const parsedPayload = logExportPayloadSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      status: 'error',
      formError: 'invalidPayload',
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      status: 'error',
      formError: 'unauthorized',
    };
  }

  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: parsedPayload.data.projectSlug,
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
    },
  });

  if (!project) {
    return {
      status: 'error',
      formError: 'projectNotFound',
    };
  }

  try {
    await prisma.exportLog.create({
      data: {
        projectId: project.id,
        format: exportFormatMap[parsedPayload.data.format],
        locale: toPrismaLocale(parsedPayload.data.exportLocale),
        status: exportStatusMap[parsedPayload.data.status],
        errorMessage: parsedPayload.data.errorMessage ?? null,
      },
    });

    revalidatePath(
      `/${parsedPayload.data.pageLocale}/app/projects/${parsedPayload.data.projectSlug}/exports`,
    );

    return {
      status: 'success',
      formError: null,
    };
  } catch {
    return {
      status: 'error',
      formError: 'unexpected',
    };
  }
}
