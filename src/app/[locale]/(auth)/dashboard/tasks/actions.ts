'use server';

import { db } from '@/libs/DB';
import { projectsSchema, tasksSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createTaskSchema = z.object({
  projectId: z.number(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  status: z.enum(['Todo', 'In Progress', 'Review', 'Done']).default('Todo'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional().nullable(),
  dueDate: z.date().optional().nullable(),
  visibleToClient: z.boolean().default(false),
  labels: z.string().optional().nullable(),
});

export async function createTask(data: z.infer<typeof createTaskSchema>) {
  const { orgId } = await requireAuth();
  const validated = createTaskSchema.parse(data);

  // Verify project belongs to organization
  const [project] = await db
    .select()
    .from(projectsSchema)
    .where(
      and(
        eq(projectsSchema.id, validated.projectId),
        eq(projectsSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  if (!project) {
    throw new Error('Project not found');
  }

  const [task] = await db.insert(tasksSchema).values(validated).returning();

  return task;
}

export async function getTasks() {
  const { orgId } = await requireAuth();

  const tasks = await db
    .select({
      id: tasksSchema.id,
      title: tasksSchema.title,
      description: tasksSchema.description,
      status: tasksSchema.status,
      priority: tasksSchema.priority,
      dueDate: tasksSchema.dueDate,
      projectId: tasksSchema.projectId,
      assigneeId: tasksSchema.assigneeId,
      visibleToClient: tasksSchema.visibleToClient,
      createdAt: tasksSchema.createdAt,
      project: {
        title: projectsSchema.title,
      },
    })
    .from(tasksSchema)
    .innerJoin(projectsSchema, eq(tasksSchema.projectId, projectsSchema.id))
    .where(eq(projectsSchema.organizationId, orgId))
    .orderBy(tasksSchema.createdAt);

  return tasks;
}

export async function getTasksByProject(projectId: number) {
  const { orgId } = await requireAuth();

  // Verify project belongs to organization
  const [project] = await db
    .select()
    .from(projectsSchema)
    .where(
      and(eq(projectsSchema.id, projectId), eq(projectsSchema.organizationId, orgId)),
    )
    .limit(1);

  if (!project) {
    throw new Error('Project not found');
  }

  const tasks = await db
    .select()
    .from(tasksSchema)
    .where(eq(tasksSchema.projectId, projectId))
    .orderBy(tasksSchema.createdAt);

  return tasks;
}

export async function getTaskById(id: number) {
  const { orgId } = await requireAuth();

  const [task] = await db
    .select({
      id: tasksSchema.id,
      title: tasksSchema.title,
      description: tasksSchema.description,
      status: tasksSchema.status,
      priority: tasksSchema.priority,
      dueDate: tasksSchema.dueDate,
      projectId: tasksSchema.projectId,
      assigneeId: tasksSchema.assigneeId,
      visibleToClient: tasksSchema.visibleToClient,
      labels: tasksSchema.labels,
      createdAt: tasksSchema.createdAt,
      updatedAt: tasksSchema.updatedAt,
    })
    .from(tasksSchema)
    .innerJoin(projectsSchema, eq(tasksSchema.projectId, projectsSchema.id))
    .where(
      and(
        eq(tasksSchema.id, id),
        eq(projectsSchema.organizationId, orgId),
      ),
    )
    .limit(1);

  return task;
}

export async function updateTask(
  id: number,
  data: Partial<z.infer<typeof createTaskSchema>>,
) {
  const { orgId } = await requireAuth();

  // Verify task belongs to organization
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }

  const [updated] = await db
    .update(tasksSchema)
    .set(data)
    .where(eq(tasksSchema.id, id))
    .returning();

  return updated;
}

export async function deleteTask(id: number) {
  const { orgId } = await requireAuth();

  // Verify task belongs to organization
  const task = await getTaskById(id);
  if (!task) {
    throw new Error('Task not found');
  }

  await db.delete(tasksSchema).where(eq(tasksSchema.id, id));
}

export async function getMyTasks() {
  const { userId, orgId } = await requireAuth();

  const tasks = await db
    .select({
      id: tasksSchema.id,
      title: tasksSchema.title,
      status: tasksSchema.status,
      priority: tasksSchema.priority,
      dueDate: tasksSchema.dueDate,
      projectId: tasksSchema.projectId,
      createdAt: tasksSchema.createdAt,
    })
    .from(tasksSchema)
    .innerJoin(projectsSchema, eq(tasksSchema.projectId, projectsSchema.id))
    .where(
      and(
        eq(projectsSchema.organizationId, orgId),
        eq(tasksSchema.assigneeId, userId),
      ),
    )
    .orderBy(tasksSchema.createdAt);

  return tasks;
}

