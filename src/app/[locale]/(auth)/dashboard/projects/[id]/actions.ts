'use server';

import { db } from '@/libs/DB';
import { filesSchema, projectsSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';

export async function getProjectFiles(projectId: number) {
  const { orgId } = await requireAuth();

  // Verify project belongs to organization
  const [project] = await db
    .select()
    .from(projectsSchema)
    .where(
      and(
        eq(projectsSchema.id, projectId),
        eq(projectsSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  if (!project) {
    throw new Error('Project not found');
  }

  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.projectId, projectId))
    .orderBy(filesSchema.createdAt);

  return files;
}

export async function deleteProjectFile(fileId: number) {
  const { orgId } = await requireAuth();

  // Verify file belongs to organization
  const [file] = await db
    .select()
    .from(filesSchema)
    .where(
      and(
        eq(filesSchema.id, fileId),
        eq(filesSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  if (!file) {
    throw new Error('File not found');
  }

  // Delete file via API
  await fetch(`/api/files/${fileId}`, {
    method: 'DELETE',
  });
}

