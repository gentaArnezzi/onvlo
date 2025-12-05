'use server';

import { db } from '@/libs/DB';
import { projectsSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createProjectSchema = z.object({
  clientId: z.number(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z
    .enum(['Planned', 'Active', 'On Hold', 'Completed', 'Cancelled'])
    .default('Planned'),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  budget: z.number().optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  const { orgId } = await requireAuth();
  const validated = createProjectSchema.parse(data);

  const [project] = await db
    .insert(projectsSchema)
    .values({
      ...validated,
      organizationId: orgId,
    })
    .returning();

  return project;
}

export async function getProjects() {
  const { orgId } = await requireAuth();

  const projects = await db
    .select()
    .from(projectsSchema)
    .where(eq(projectsSchema.organizationId, orgId))
    .orderBy(projectsSchema.createdAt);

  return projects;
}

export async function getProjectById(id: number) {
  const { orgId } = await requireAuth();

  const [project] = await db
    .select()
    .from(projectsSchema)
    .where(and(eq(projectsSchema.id, id), eq(projectsSchema.organizationId, orgId)))
    .limit(1);

  return project;
}

export async function updateProject(
  id: number,
  data: Partial<z.infer<typeof createProjectSchema>>,
) {
  const { orgId } = await requireAuth();

  const [project] = await db
    .update(projectsSchema)
    .set(data)
    .where(and(eq(projectsSchema.id, id), eq(projectsSchema.organizationId, orgId)))
    .returning();

  return project;
}

export async function deleteProject(id: number) {
  const { orgId } = await requireAuth();

  await db
    .delete(projectsSchema)
    .where(and(eq(projectsSchema.id, id), eq(projectsSchema.organizationId, orgId)));
}

export async function getProjectsByClient(clientId: number) {
  const { orgId } = await requireAuth();

  const projects = await db
    .select()
    .from(projectsSchema)
    .where(
      and(
        eq(projectsSchema.clientId, clientId),
        eq(projectsSchema.organizationId, orgId),
      ),
    )
    .orderBy(projectsSchema.createdAt);

  return projects;
}

