import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getProjects } from './actions';

const ProjectsPage = async () => {
  const projects = await getProjects();

  return (
    <>
      <TitleBar title="Projects" description="Manage your projects" />

      <div className="mt-6 flex justify-between">
        <div />
        <Link href="/dashboard/projects/new">
          <Button>Create Project</Button>
        </Link>
      </div>

      <div className="mt-6">
        {projects.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No projects yet</p>
            <Link href="/dashboard/projects/new">
              <Button className="mt-4" variant="outline">
                Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Budget</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b">
                    <td className="px-4 py-3">{project.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {project.startDate
                        ? new Date(project.startDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {project.budget ? `$${project.budget.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/projects/${project.id}`} className="ml-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;

