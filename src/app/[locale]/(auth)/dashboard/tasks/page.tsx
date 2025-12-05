import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getMyTasks, getTasks } from './actions';

const TasksPage = async () => {
  const allTasks = await getTasks();
  const myTasks = await getMyTasks();

  return (
    <>
      <TitleBar title="Tasks" description="Manage your tasks" />

      <div className="mt-6 flex justify-between">
        <Link href="/dashboard/tasks/kanban">
          <Button variant="outline">Kanban View</Button>
        </Link>
        <Link href="/dashboard/tasks/new">
          <Button>Create Task</Button>
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold">My Tasks</h2>
        {myTasks.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No tasks assigned to you</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{task.priority || '-'}</td>
                    <td className="px-4 py-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/tasks/${task.id}`} className="ml-2">
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

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">All Tasks</h2>
        {allTasks.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTasks.map((task) => (
                  <tr key={task.id} className="border-b">
                    <td className="px-4 py-3">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{task.priority || '-'}</td>
                    <td className="px-4 py-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/tasks/${task.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/tasks/${task.id}`} className="ml-2">
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

export default TasksPage;

