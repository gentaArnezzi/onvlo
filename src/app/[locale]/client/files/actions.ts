'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/libs/DB';
import { filesSchema } from '@/models/Schema';
import { deleteFile } from '@/utils/storage';

import { getClientPortalData } from '../actions';

export async function deleteFileAction(fileId: number) {
  // Verify ownership
  const { client } = await getClientPortalData();

  const [file] = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.id, fileId))
    .limit(1);

  if (!file) {
    throw new Error('File not found');
  }

  // Check if file belongs to client's organization
  if (file.organizationId !== client.organizationId) {
    throw new Error('Unauthorized');
  }

  // Delete from storage
  await deleteFile(file.url);

  // Delete from DB
  await db.delete(filesSchema).where(eq(filesSchema.id, fileId));

  revalidatePath('/client/files');
}
