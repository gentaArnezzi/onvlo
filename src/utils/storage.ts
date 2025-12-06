import { Buffer } from 'node:buffer';
import fs from 'node:fs/promises';
import path from 'node:path';

// For MVP, using local file storage
// In production, replace with Vercel Blob or S3

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

export async function uploadFile(
  file: File,
  organizationId: string,
  projectId?: number,
): Promise<UploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }

  // Create upload directory if it doesn't exist
  const orgDir = path.join(UPLOAD_DIR, organizationId);
  const projectDir = projectId
    ? path.join(orgDir, `project_${projectId}`)
    : orgDir;

  await fs.mkdir(projectDir, { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-z0-9.-]/gi, '_');
  const filename = `${timestamp}_${sanitizedName}`;
  const filePath = path.join(projectDir, filename);

  // Write file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  // Return file URL (relative to uploads directory)
  const relativePath = projectId
    ? `${organizationId}/project_${projectId}/${filename}`
    : `${organizationId}/${filename}`;

  return {
    url: `/api/files/download/${encodeURIComponent(relativePath)}`,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
  };
}

export async function deleteFile(url: string): Promise<void> {
  // Extract relative path from URL
  const match = url.match(/\/api\/files\/download\/(.+)/);
  if (!match) {
    throw new Error('Invalid file URL');
  }

  const relativePath = decodeURIComponent(match[1] || '');
  const filePath = path.join(UPLOAD_DIR, relativePath);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Failed to delete file:', error);
    // Don't throw error if file doesn't exist
  }
}

export async function getFilePath(relativePath: string): Promise<string> {
  return path.join(UPLOAD_DIR, relativePath);
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  return { valid: true };
}
