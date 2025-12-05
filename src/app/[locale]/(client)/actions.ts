'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import {
  clientsSchema,
  invoicesSchema,
  projectsSchema,
  tasksSchema,
} from '@/models/Schema';
import { and, eq } from 'drizzle-orm';

export async function getClientByEmail(email: string) {
  const [client] = await db
    .select()
    .from(clientsSchema)
    .where(eq(clientsSchema.email, email))
    .limit(1);

  return client;
}

export async function getClientProjects(clientId: number) {
  const projects = await db
    .select()
    .from(projectsSchema)
    .where(eq(projectsSchema.clientId, clientId))
    .orderBy(projectsSchema.createdAt);

  return projects;
}

export async function getClientInvoices(clientId: number) {
  const invoices = await db
    .select()
    .from(invoicesSchema)
    .where(eq(invoicesSchema.clientId, clientId))
    .orderBy(invoicesSchema.createdAt);

  return invoices;
}

export async function getClientTasks(projectIds: number[]) {
  if (projectIds.length === 0) {
    return [];
  }

  // Get all tasks for client's projects that are visible
  const tasks = await db
    .select()
    .from(tasksSchema)
    .where(eq(tasksSchema.visibleToClient, true));

  // Filter by projectIds (in production, use sql`IN` for better performance)
  return tasks.filter((task) => projectIds.includes(task.projectId));
}

export async function getClientFiles(projectIds: number[]) {
  if (projectIds.length === 0) {
    return [];
  }

  const { filesSchema } = await import('@/models/Schema');

  // Get all files for client's projects
  const files = await db
    .select()
    .from(filesSchema)
    .orderBy(filesSchema.createdAt);

  // Filter by projectIds
  return files.filter((file) => file.projectId && projectIds.includes(file.projectId));
}

export async function getClientPortalData() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user email from Clerk
  const { currentUser } = await import('@clerk/nextjs/server');
  const user = await currentUser();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('User email not found');
  }

  const email = user.emailAddresses[0].emailAddress;

  // Find client by email
  const client = await getClientByEmail(email);

  if (!client) {
    throw new Error('Client not found. Please contact your agency.');
  }

  // Get client's projects
  const projects = await getClientProjects(client.id);

  // Get client's invoices
  const invoices = await getClientInvoices(client.id);

  // Get visible tasks for client's projects
  const projectIds = projects.map((p) => p.id);
  const tasks = await getClientTasks(projectIds);

  return {
    client,
    projects,
    invoices,
    tasks,
  };
}

