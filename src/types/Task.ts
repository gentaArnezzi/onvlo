export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Task = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  assigneeId: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  dueDate: Date | null;
  visibleToClient: boolean;
  labels: string | null;
  createdAt: Date;
  updatedAt: Date;
};
