import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TitleBar } from '@/features/dashboard/TitleBar';
import { getFunnels } from './actions';

const OnboardingFunnelsPage = async () => {
  const funnels = await getFunnels();

  return (
    <>
      <TitleBar
        title="Onboarding Funnels"
        description="Create and manage client onboarding funnels"
      />

      <div className="mt-6 flex justify-between">
        <div />
        <Link href="/dashboard/onboarding-funnels/new">
          <Button>Create Funnel</Button>
        </Link>
      </div>

      <div className="mt-6">
        {funnels.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No funnels yet</p>
            <Link href="/dashboard/onboarding-funnels/new">
              <Button className="mt-4" variant="outline">
                Create your first funnel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {funnels.map((funnel) => (
              <div key={funnel.id} className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{funnel.name}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      funnel.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {funnel.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Slug: {funnel.slug}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link href={`/dashboard/onboarding-funnels/${funnel.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/onboard/${funnel.slug}`}>
                    <Button variant="ghost" size="sm">
                      View Public
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OnboardingFunnelsPage;

