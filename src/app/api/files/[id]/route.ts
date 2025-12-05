import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { filesSchema } from '@/models/Schema';
import { and, eq } from 'drizzle-orm';
import { deleteFile } from '@/utils/storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId, orgId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = Number(params.id);
    if (isNaN(fileId)) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    // Get file record
    const [file] = await db
      .select()
      .from(filesSchema)
      .where(
        and(
          eq(filesSchema.id, fileId),
          eq(filesSchema.organizationId, orgId || ''),
        ),
      )
      .limit(1);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete from storage
    await deleteFile(file.url);

    // Delete from database
    await db
      .delete(filesSchema)
      .where(eq(filesSchema.id, fileId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('File delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Delete failed' },
      { status: 500 },
    );
  }
}

