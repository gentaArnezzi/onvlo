import { FileList } from '@/components/files/FileList';
import { FileUpload } from '@/components/files/FileUpload';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { getClientFiles, getClientPortalData } from '../actions';
import { deleteFileAction } from './actions';

const ClientFilesPage = async () => {
  const data = await getClientPortalData();
  const { projects } = data;

  const projectIds = projects.map(p => p.id);
  const files = await getClientFiles(projectIds);

  // Group files by project
  const filesByProject = projects.map(project => ({
    project,
    files: files.filter(f => f.projectId === project.id),
  }));

  return (
    <>
      <TitleBar
        title="My Files"
        description="View and download files from your projects"
      />

      <div className="mt-6 space-y-6">
        {filesByProject.map(({ project, files: projectFiles }) => (
          <div key={project.id} className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{project.title}</h3>
            </div>

            <div className="mb-6">
              <FileUpload projectId={project.id} />
            </div>

            {projectFiles.length > 0
              ? (
                  <FileList
                    files={projectFiles.map(f => ({
                      ...f,
                      size: f.size || 0,
                      mimeType: f.mimeType || 'application/octet-stream',
                      url: f.url,
                      createdAt: new Date(f.createdAt),
                    }))}
                    canDelete
                    onDelete={deleteFileAction}
                  />
                )
              : (
                  <p className="text-sm text-muted-foreground">
                    No files for this project yet
                  </p>
                )}
          </div>
        ))}

        {filesByProject.every(({ files }) => files.length === 0) && filesByProject.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No projects available</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientFilesPage;
