import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { ActiveLink } from '@/components/ActiveLink';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
  const t = useTranslations('DashboardLayout');

  return (
    <>
      <div className="shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-3 py-4">
          <DashboardHeader
            menu={[
              {
                href: '/dashboard',
                label: t('home'),
              },
              {
                href: '/dashboard/leads',
                label: 'Leads',
              },
              {
                href: '/dashboard/clients',
                label: 'Clients',
              },
              {
                href: '/dashboard/projects',
                label: 'Projects',
              },
              {
                href: '/dashboard/tasks',
                label: 'Tasks',
              },
              {
                href: '/dashboard/proposals',
                label: 'Proposals',
              },
              {
                href: '/dashboard/invoices',
                label: 'Invoices',
              },
              {
                href: '/dashboard/onboarding-funnels',
                label: 'Onboarding Funnels',
              },
              {
                href: '/dashboard/settings',
                label: 'Settings',
              },
              {
                href: '/dashboard/organization-profile/organization-members',
                label: t('members'),
              },
            ]}
          />
        </div>
      </div>

      <div className="min-h-[calc(100vh-72px)] bg-muted">
        <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-6">
          {props.children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
