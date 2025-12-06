import '@/styles/global.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Client Onboarding',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
