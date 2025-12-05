'use server';

import { db } from '@/libs/DB';
import {
  clientsSchema,
  invoicesSchema,
  projectsSchema,
  tasksSchema,
} from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq, gte, sql } from 'drizzle-orm';

export async function getDashboardStats() {
  const { orgId } = await requireAuth();

  // Active Clients
  const activeClients = await db
    .select({ count: sql<number>`count(*)` })
    .from(clientsSchema)
    .where(
      and(
        eq(clientsSchema.organizationId, orgId),
        eq(clientsSchema.status, 'active'),
      ),
    );

  // Active Projects
  const activeProjects = await db
    .select({ count: sql<number>`count(*)` })
    .from(projectsSchema)
    .where(
      and(
        eq(projectsSchema.organizationId, orgId),
        eq(projectsSchema.status, 'Active'),
      ),
    );

  // Revenue last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenue = await db
    .select({ total: sql<number>`sum(${invoicesSchema.total})` })
    .from(invoicesSchema)
    .where(
      and(
        eq(invoicesSchema.organizationId, orgId),
        eq(invoicesSchema.status, 'Paid'),
        gte(invoicesSchema.paidAt, thirtyDaysAgo),
      ),
    );

  // Overdue Invoices
  const today = new Date();
  const overdueInvoices = await db
    .select({ count: sql<number>`count(*)` })
    .from(invoicesSchema)
    .where(
      and(
        eq(invoicesSchema.organizationId, orgId),
        eq(invoicesSchema.status, 'Sent'),
        sql`${invoicesSchema.dueDate} < ${today}`,
      ),
    );

  return {
    activeClients: Number(activeClients[0]?.count || 0),
    activeProjects: Number(activeProjects[0]?.count || 0),
    revenue30Days: Number(revenue[0]?.total || 0),
    overdueInvoices: Number(overdueInvoices[0]?.count || 0),
  };
}

export async function getRecentActivity() {
  const { orgId } = await requireAuth();

  // Get recent projects
  const recentProjects = await db
    .select()
    .from(projectsSchema)
    .where(eq(projectsSchema.organizationId, orgId))
    .orderBy(sql`${projectsSchema.createdAt} DESC`)
    .limit(5);

  // Get recent tasks through projects
  const recentTasks = await db
    .select({
      id: tasksSchema.id,
      title: tasksSchema.title,
      status: tasksSchema.status,
      projectId: tasksSchema.projectId,
      createdAt: tasksSchema.createdAt,
    })
    .from(tasksSchema)
    .innerJoin(projectsSchema, eq(tasksSchema.projectId, projectsSchema.id))
    .where(eq(projectsSchema.organizationId, orgId))
    .orderBy(sql`${tasksSchema.createdAt} DESC`)
    .limit(5);

  return {
    recentProjects,
    recentTasks,
  };
}

