'use client';

import { Button } from '@/components/ui/button';

interface File {
  id: number;
  name: string;
  url: string;
  mimeType: string;
}

interface FilePreviewProps {
  file: File;
  onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  const isImage = file.mimeType.startsWith('image/');
  const isPdf = file.mimeType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative h-full w-full max-w-6xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{file.name}</h3>
          <Button variant="ghost" onClick={onClose} className="text-white">
            Close
          </Button>
        </div>

        <div className="flex h-[calc(100%-4rem)] items-center justify-center rounded-lg bg-white">
          {isImage && (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          )}

          {isPdf && (
            <iframe
              src={file.url}
              className="h-full w-full"
              title={file.name}
            />
          )}

          {!isImage && !isPdf && (
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                Preview not available for this file type
              </p>
              <a href={file.url} download>
                <Button>Download File</Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

