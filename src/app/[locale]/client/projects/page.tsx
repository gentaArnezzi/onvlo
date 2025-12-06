import Link from 'next/link';

import { TitleBar } from '@/features/dashboard/TitleBar';

import { getClientPortalData } from '../actions';

const ClientProjectsPage = async () => {
  const data = await getClientPortalData();
  const { projects } = data;

  return (
    <>
      <TitleBar
        title="My Projects"
        description="View all your projects"
      />

      <div className="mt-6">
        {projects.length === 0
          ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-muted-foreground">No projects yet</p>
              </div>
            )
          : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => (
                  <Link
                    key={project.id}
                    href={`/client/projects/${project.id}`}
                    className="block rounded-lg border bg-card p-6 transition-colors hover:bg-muted"
                  >
                    <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          project.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-muted'
                        }`}
                      >
                        {project.status}
                      </span>
                      {project.budget && (
                        <span className="text-sm font-medium">
                          $
                          {project.budget.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {project.startDate && (
                      <div className="mt-4 text-xs text-muted-foreground">
                        Started:
                        {' '}
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
      </div>
    </>
  );
};

export default ClientProjectsPage;
