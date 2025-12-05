const OnboardingSuccessPage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your onboarding has been completed successfully. We'll be in touch soon!
        </p>
      </div>
    </div>
  );
};

export default OnboardingSuccessPage;

