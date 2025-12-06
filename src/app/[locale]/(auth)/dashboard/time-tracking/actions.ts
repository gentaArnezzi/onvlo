'use server';

import { auth } from '@clerk/nextjs/server';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { projectsSchema, tasksSchema, timeEntriesSchema } from '@/models/Schema';

export async function logTimeEntry(data: {
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  projectId?: number;
  taskId?: number;
  billable?: boolean;
}) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  await db.insert(timeEntriesSchema).values({
    organizationId: orgId,
    userId,
    description: data.description,
    startTime: data.startTime,
    endTime: data.endTime,
    duration: data.duration,
    projectId: data.projectId,
    taskId: data.taskId,
    billable: data.billable ?? true,
  });

  revalidatePath('/dashboard/time-tracking');
}

export async function getTimeEntries() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }

  const entries = await db
    .select({
      id: timeEntriesSchema.id,
      description: timeEntriesSchema.description,
      startTime: timeEntriesSchema.startTime,
      endTime: timeEntriesSchema.endTime,
      duration: timeEntriesSchema.duration,
      billable: timeEntriesSchema.billable,
      project: {
        title: projectsSchema.title,
      },
      task: {
        title: tasksSchema.title,
      },
    })
    .from(timeEntriesSchema)
    .leftJoin(projectsSchema, eq(timeEntriesSchema.projectId, projectsSchema.id))
    .leftJoin(tasksSchema, eq(timeEntriesSchema.taskId, tasksSchema.id))
    .where(eq(timeEntriesSchema.organizationId, orgId))
    .orderBy(desc(timeEntriesSchema.startTime));

  return entries;
}
