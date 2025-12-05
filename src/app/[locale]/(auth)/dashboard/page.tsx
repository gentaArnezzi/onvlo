import { getTranslations } from 'next-intl/server';

import { TitleBar } from '@/features/dashboard/TitleBar';
import { getDashboardStats, getRecentActivity } from './actions';

const DashboardIndexPage = async () => {
  const t = await getTranslations('DashboardIndex');
  const stats = await getDashboardStats();
  const activity = await getRecentActivity();

  return (
    <>
      <TitleBar
        title={t('title_bar')}
        description={t('title_bar_description')}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Active Clients
          </div>
          <div className="mt-2 text-3xl font-bold">{stats.activeClients}</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Active Projects
          </div>
          <div className="mt-2 text-3xl font-bold">{stats.activeProjects}</div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Revenue (30 days)
          </div>
          <div className="mt-2 text-3xl font-bold">
            ${stats.revenue30Days.toLocaleString()}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Overdue Invoices
          </div>
          <div className="mt-2 text-3xl font-bold">{stats.overdueInvoices}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Projects</h3>
          {activity.recentProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet</p>
          ) : (
            <ul className="space-y-2">
              {activity.recentProjects.map((project) => (
                <li key={project.id} className="text-sm">
                  <div className="font-medium">{project.title}</div>
                  <div className="text-muted-foreground">{project.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Tasks</h3>
          {activity.recentTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          ) : (
            <ul className="space-y-2">
              {activity.recentTasks.map((task) => (
                <li key={task.id} className="text-sm">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-muted-foreground">{task.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardIndexPage;
