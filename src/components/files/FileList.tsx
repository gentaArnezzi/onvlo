'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilePreview } from './FilePreview';

interface File {
  id: number;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

interface FileListProps {
  files: File[];
  canDelete?: boolean;
  onDelete?: (fileId: number) => Promise<void>;
  onRefresh?: () => void;
}

export function FileList({
  files,
  canDelete = false,
  onDelete,
  onRefresh,
}: FileListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const handleDelete = async (fileId: number) => {
    if (!onDelete) return;

    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    setDeletingId(fileId);
    try {
      await onDelete(fileId);
      onRefresh?.();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round(bytes / k ** i * 100) / 100} ${sizes[i]}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    if (mimeType === 'application/pdf') {
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No files uploaded yet
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 rounded-md border bg-card p-3 transition-colors hover:bg-muted"
          >
            <div className="text-muted-foreground">{getFileIcon(file.mimeType)}</div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} •{' '}
                {new Date(file.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewFile(file)}
              >
                Preview
              </Button>
              <a href={file.url} download target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </a>
              {canDelete && onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(file.id)}
                  disabled={deletingId === file.id}
                >
                  {deletingId === file.id ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {previewFile && (
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </>
  );
}

