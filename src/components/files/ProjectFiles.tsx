'use client';

import { useRouter } from 'next/navigation';
import { FileUpload } from './FileUpload';
import { FileList } from './FileList';

interface ProjectFilesProps {
  projectId: number;
  files: Array<{
    id: number;
    name: string;
    url: string;
    size: number | null;
    mimeType: string | null;
    createdAt: Date;
  }>;
  onDelete: (fileId: number) => Promise<void>;
}

export function ProjectFiles({ projectId, files, onDelete }: ProjectFilesProps) {
  const router = useRouter();

  const handleUploadComplete = () => {
    router.refresh();
  };

  const handleDelete = async (fileId: number) => {
    await onDelete(fileId);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <FileUpload
        projectId={projectId}
        onUploadComplete={handleUploadComplete}
      />
      <FileList
        files={files}
        canDelete
        onDelete={handleDelete}
        onRefresh={handleRefresh}
      />
    </div>
  );
}
