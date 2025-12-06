import fs from 'node:fs/promises';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { getFilePath } from '@/utils/storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  try {
    const relativePath = params.path.join('/');
    const filePath = await getFilePath(relativePath);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath);

    // Determine content type from file extension
    const ext = relativePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      txt: 'text/plain',
      csv: 'text/csv',
    };

    const contentType = contentTypes[ext || ''] || 'application/octet-stream';

    return new NextResponse(fileBuffer as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${relativePath.split('/').pop()}"`,
      },
    });
  } catch (error: any) {
    console.error('File download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 },
    );
  }
}
