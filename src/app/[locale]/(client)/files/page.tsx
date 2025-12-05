import { TitleBar } from '@/features/dashboard/TitleBar';
import { getClientPortalData, getClientFiles } from '../actions';
import { FileList } from '@/components/files/FileList';

const ClientFilesPage = async () => {
  const data = await getClientPortalData();
  const { projects } = data;

  const projectIds = projects.map((p) => p.id);
  const files = await getClientFiles(projectIds);

  // Group files by project
  const filesByProject = projects.map((project) => ({
    project,
    files: files.filter((f) => f.projectId === project.id),
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
            <h3 className="mb-4 text-lg font-semibold">{project.title}</h3>
            {projectFiles.length > 0 ? (
              <FileList
                files={projectFiles.map((f) => ({
                  ...f,
                  createdAt: new Date(f.createdAt),
                }))}
                canDelete={false}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No files for this project yet
              </p>
            )}
          </div>
        ))}

        {filesByProject.every(({ files }) => files.length === 0) && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No files available yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientFilesPage;

