'use server';

import { db } from '@/libs/DB';
import { clientsSchema } from '@/models/Schema';
import { requireAuth } from '@/utils/permissions';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  notes: z.string().optional().nullable(),
});

export async function createClient(data: z.infer<typeof createClientSchema>) {
  const { orgId } = await requireAuth();
  const validated = createClientSchema.parse(data);

  const [client] = await db
    .insert(clientsSchema)
    .values({
      ...validated,
      organizationId: orgId,
    })
    .returning();

  if (!client) {
    throw new Error('Failed to create client');
  }

  return { id: client.id };
}

export async function getClients() {
  const { orgId } = await requireAuth();

  const clients = await db
    .select()
    .from(clientsSchema)
    .where(eq(clientsSchema.organizationId, orgId))
    .orderBy(clientsSchema.createdAt);

  return clients;
}

export async function getClientById(id: number) {
  const { orgId } = await requireAuth();

  const [client] = await db
    .select()
    .from(clientsSchema)
    .where(and(eq(clientsSchema.id, id), eq(clientsSchema.organizationId, orgId)))
    .limit(1);

  return client;
}

export async function updateClient(
  id: number,
  data: Partial<z.infer<typeof createClientSchema>>,
) {
  const { orgId } = await requireAuth();

  const [client] = await db
    .update(clientsSchema)
    .set(data)
    .where(and(eq(clientsSchema.id, id), eq(clientsSchema.organizationId, orgId)))
    .returning();

  if (!client) {
    throw new Error('Failed to update client');
  }

  return { id: client.id };
}

export async function deleteClient(id: number) {
  const { orgId } = await requireAuth();

  await db
    .delete(clientsSchema)
    .where(and(eq(clientsSchema.id, id), eq(clientsSchema.organizationId, orgId)));
}

