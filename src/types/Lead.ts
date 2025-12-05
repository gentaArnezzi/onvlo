export type LeadStage = 'New' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';

export interface Lead {
  id: number;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  stage: LeadStage;
  tags: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

