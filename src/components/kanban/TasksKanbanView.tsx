'use client';

import { useRouter } from 'next/navigation';
import { KanbanBoard, type KanbanColumn } from './KanbanBoard';

const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Done'] as const;

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: Date | null;
  project: {
    title: string;
  } | null;
}

interface TasksKanbanViewProps {
  tasks: Task[];
  onMoveTask: (taskId: string, fromStatus: string, toStatus: string) => Promise<void>;
}

export function TasksKanbanView({
  tasks,
  onMoveTask,
}: TasksKanbanViewProps) {
  const router = useRouter();

  // Group tasks by status
  const columns: KanbanColumn[] = TASK_STATUSES.map((status) => ({
    id: status,
    title: status,
    items: tasks.filter((task) => task.status === status),
  }));

  const handleItemMove = async (
    itemId: string,
    fromColumn: string,
    toColumn: string,
  ) => {
    await onMoveTask(itemId, fromColumn, toColumn);
    router.refresh();
  };

  const handleItemClick = (task: Task) => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted';
    }
  };

  const renderTask = (task: Task) => (
    <div>
      <div className="font-medium">{task.title}</div>
      {task.description && (
        <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {task.description}
        </div>
      )}
      {task.project && (
        <div className="mt-2 text-xs text-muted-foreground">
          Project: {task.project.title}
        </div>
      )}
      <div className="mt-2 flex items-center gap-2">
        {task.priority && (
          <span
            className={`rounded-full px-2 py-1 text-xs ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <KanbanBoard
      columns={columns}
      onItemMove={handleItemMove}
      onItemClick={handleItemClick}
      renderItem={renderTask}
    />
  );
}

