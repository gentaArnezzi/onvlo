import Link from 'next/link';
import { redirect } from 'next/navigation';

import { TasksKanbanView } from '@/components/kanban/TasksKanbanView';
import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';

import { getTasks, updateTask } from '../actions';

const TasksKanbanPage = async () => {
  const tasks = await getTasks();

  async function handleMoveTask(
    taskId: string,

    toStatus: string,
  ) {
    'use server';
    await updateTask(Number(taskId), { status: toStatus as any });
    redirect('/dashboard/tasks/kanban');
  }

  return (
    <>
      <TitleBar
        title="Tasks Kanban"
        description="Manage tasks in a visual board"
      />

      <div className="mt-6 flex gap-4">
        <Link href="/dashboard/tasks">
          <Button variant="outline">← Back to List View</Button>
        </Link>
        <Link href="/dashboard/tasks/new">
          <Button>Add Task</Button>
        </Link>
      </div>

      <div className="mt-6">
        <TasksKanbanView tasks={tasks} onMoveTask={handleMoveTask} />
      </div>
    </>
  );
};

export default TasksKanbanPage;
