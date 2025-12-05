import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { filesSchema } from '@/models/Schema';
import { uploadFile, validateFile } from '@/utils/storage';

export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId')
      ? Number(formData.get('projectId'))
      : undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    // Upload file
    const uploadResult = await uploadFile(
      file,
      orgId || 'public',
      projectId,
    );

    // Create file record in database
    const [fileRecord] = await db
      .insert(filesSchema)
      .values({
        organizationId: orgId || 'public',
        projectId: projectId || null,
        name: uploadResult.filename,
        url: uploadResult.url,
        size: uploadResult.size,
        mimeType: uploadResult.mimeType,
        uploadedBy: userId,
      })
      .returning();

    return NextResponse.json(fileRecord);
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 },
    );
  }
}

