import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: 'Client Portal',
    description: 'View your projects and invoices',
  };
}

export default function ClientPortalLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-muted">
        <nav className="border-b bg-background">
          <div className="mx-auto max-w-screen-xl px-3 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Client Portal</h1>
              <div className="flex items-center gap-4">
                <a
                  href="/client"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </a>
                <a
                  href="/client/projects"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Projects
                </a>
                <a
                  href="/client/invoices"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Invoices
                </a>
                <a
                  href="/client/files"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Files
                </a>
              </div>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-6">
          {props.children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';

