export type ClientStatus = 'active' | 'inactive' | 'archived';

export type Client = {
  id: number;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  stripeCustomerId: string | null;
  status: ClientStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};
