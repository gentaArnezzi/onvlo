export type ProjectStatus = 'Planned' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';

export interface Project {
  id: number;
  organizationId: string;
  clientId: number;
  title: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

