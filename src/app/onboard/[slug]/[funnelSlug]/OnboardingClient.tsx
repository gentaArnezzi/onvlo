'use client';

import { useState } from 'react';

import type { FormField } from '@/components/forms/FormFieldBuilder';
import { DynamicForm } from '@/components/onboarding/DynamicForm';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type OnboardingClientProps = {
  organizationName: string;
  formFields: FormField[];
  agreementTemplate: string;
  onSubmit: (data: any) => Promise<void>;
};

export function OnboardingClient({
  organizationName,
  formFields,
  agreementTemplate,
  onSubmit,
}: OnboardingClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'form', title: 'Information' },
    { id: 'agreement', title: 'Agreement' },
  ];

  const handleFormSubmit = (data: Record<string, any>) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handleAgreementSubmit = async () => {
    if (!agreedToTerms) {
      // In a real app, you'd want to use a toast notification library like react-hot-toast
      console.error('Please agree to the terms and conditions');
      return;
    }

    // Submit all data
    await onSubmit(formData);
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <h2 className="text-xl font-bold">{organizationName}</h2>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b bg-muted">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex items-center">
                  <div
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted-foreground/20 text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-2 hidden text-sm font-medium md:block">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {currentStep === 0 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for choosing
              {' '}
              {organizationName}
              . We're excited to work with
              you!
            </p>
            <p className="text-muted-foreground">
              This onboarding process will help us understand your needs and get you
              set up quickly. It should only take a few minutes.
            </p>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold">What to expect:</h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                <li>Fill out a brief information form</li>
                <li>Review and accept our terms</li>
                <li>Get instant access to your client portal</li>
              </ul>
            </div>
            <Button onClick={() => setCurrentStep(1)} className="w-full">
              Get Started
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h1 className="mb-6 text-3xl font-bold">Tell us about yourself</h1>
            {formFields.length > 0
              ? (
                  <DynamicForm
                    fields={formFields}
                    onSubmit={handleFormSubmit}
                    onBack={goBack}
                  />
                )
              : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Please provide your basic information to continue.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={goBack}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(2)}>Continue</Button>
                    </div>
                  </div>
                )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Agreement</h1>
            {agreementTemplate
              ? (
                  <>
                    <div className="rounded-md border bg-card p-6">
                      <div className="max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
                        {agreementTemplate}
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-md border bg-muted p-4">
                      <input
                        type="checkbox"
                        id="agree"
                        checked={agreedToTerms}
                        onChange={e => setAgreedToTerms(e.target.checked)}
                        className="mt-1 size-4 shrink-0 rounded border-gray-300"
                      />
                      <Label htmlFor="agree" className="cursor-pointer">
                        I have read and agree to the terms and conditions outlined above
                      </Label>
                    </div>
                  </>
                )
              : (
                  <p className="text-muted-foreground">
                    No agreement required for this onboarding.
                  </p>
                )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={goBack}>
                Back
              </Button>
              <Button
                onClick={handleAgreementSubmit}
                disabled={!!agreementTemplate && !agreedToTerms}
              >
                Complete Onboarding
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
