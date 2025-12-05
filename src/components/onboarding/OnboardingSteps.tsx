'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface OnboardingStepsProps {
  organizationName: string;
  steps: {
    id: string;
    title: string;
    component: React.ReactNode;
  }[];
  onComplete: () => void;
}

export function OnboardingSteps({
  organizationName,
  steps,
  onComplete,
}: OnboardingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo/Branding */}
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
              <div
                key={step.id}
                className="flex flex-1 items-center"
              >
                <div className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
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

      {/* Step Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold">{currentStepData.title}</h1>
        {currentStepData.component}
      </div>
    </div>
  );
}

