import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/server/db/prisma';
import { ProjectTopbarBreadcrumbRegistration } from '@/components/layout/ProjectTopbarBreadcrumb';

type ProjectEditorLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
    projectSlug: string;
  }>;
};

export default async function ProjectEditorLayout({
  children,
  params,
}: ProjectEditorLayoutProps) {
  const { locale, projectSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
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
      name: true,
      slug: true,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <>
      <ProjectTopbarBreadcrumbRegistration
        projectName={project.name}
        projectSlug={project.slug}
      />

      {children}
    </>
  );
}
