import { prisma } from '@/server/db/prisma';
import type { Prisma } from '@/generated/prisma/client';
import type {
  AccessibilityCenterIssue,
  AccessibilityCenterReport,
} from './accessibility-center.utils';

export type PersistedAccessibilityReportStatus = 'pass' | 'warning' | 'fail';

export type PersistAccessibilityReportResult =
  | {
      status: 'success';
      report: {
        id: string;
        status: PersistedAccessibilityReportStatus;
        score: number;
        createdAt: Date;
      };
    }
  | {
      status: 'error';
      error: 'projectNotFound' | 'unexpected';
    };

export function mapAccessibilityReportStatus(
  status: AccessibilityCenterReport['status'],
): PersistedAccessibilityReportStatus {
  if (status === 'healthy') {
    return 'pass';
  }

  if (status === 'needsAttention') {
    return 'warning';
  }

  return 'fail';
}

function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export function serializeAccessibilityIssues(
  issues: AccessibilityCenterIssue[],
): Prisma.InputJsonValue {
  return toInputJsonValue(issues);
}

export async function persistAccessibilityReportForUser({
  userId,
  projectSlug,
  report,
}: {
  userId: string;
  projectSlug: string;
  report: AccessibilityCenterReport;
}): Promise<PersistAccessibilityReportResult> {
  const project = await prisma.designSystemProject.findFirst({
    where: {
      slug: projectSlug,
      workspace: {
        members: {
          some: {
            userId,
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
      error: 'projectNotFound',
    };
  }

  try {
    const persistedReport = await prisma.accessibilityReport.create({
      data: {
        projectId: project.id,
        status: mapAccessibilityReportStatus(report.status),
        score: report.score,
        issues: serializeAccessibilityIssues(report.issues),
      },
      select: {
        id: true,
        status: true,
        score: true,
        createdAt: true,
      },
    });

    return {
      status: 'success',
      report: persistedReport,
    };
  } catch {
    return {
      status: 'error',
      error: 'unexpected',
    };
  }
}
