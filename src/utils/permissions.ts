import { auth, currentUser } from '@clerk/nextjs/server';

import { ORG_ROLE } from '@/types/Auth';

export type Permission = 'read' | 'write' | 'delete' | 'admin';

export async function requireAuth() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }
  return { userId, orgId };
}

export async function requireRole(allowedRoles: string[]) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !orgId) {
    throw new Error('Unauthorized');
  }
  if (!orgRole || !allowedRoles.includes(orgRole)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return { userId, orgId, orgRole };
}

export async function requireOwnerOrAdmin() {
  return requireRole([ORG_ROLE.ADMIN, 'org:owner']);
}

export function canAccess(resourceOrgId: string, userOrgId: string | null): boolean {
  return resourceOrgId === userOrgId;
}

