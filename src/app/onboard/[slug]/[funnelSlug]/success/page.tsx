'use client';

import { ArrowRight, CheckCircle2, CreditCard, Folder, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const OnboardingSuccessPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Success Icon + Title */}
        <div className="space-y-4 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-600 duration-300 animate-in zoom-in dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="size-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              🎉 Welcome Aboard!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your onboarding has been completed successfully.
            </p>
          </div>
        </div>

        {/* What Happens Next Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">📋 What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </div>
              </div>
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">
                  We've sent you a welcome email with your client portal access details.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Folder className="size-4" />
                </div>
              </div>
              <div>
                <p className="font-medium">Your project will be set up</p>
                <p className="text-sm text-muted-foreground">
                  Our team will set up your first project and assign team members within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 shrink-0">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="size-4" />
                </div>
              </div>
              <div>
                <p className="font-medium">Track everything in one place</p>
                <p className="text-sm text-muted-foreground">
                  View projects, tasks, invoices, and communicate with your team from your portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/client" className="flex-1 sm:flex-initial">
            <Button size="lg" className="w-full sm:w-auto">
              Access Client Portal
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/" className="flex-1 sm:flex-initial">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at
            {' '}
            <a href="mailto:support@flowstackpro.com" className="text-primary hover:underline">
              support@flowstackpro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;
