"use client";

import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { StreamingStep } from "@/components/onboarding/StreamingStep";
import { FavoritesStep } from "@/components/onboarding/FavoritesStep";
import { CompletionStep } from "@/components/onboarding/CompletionStep";
import { Skeleton } from "@/components/ui/Skeleton";

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading || !user) {
    return (
      <div className="min-h-dvh bg-background flex flex-col pt-safe-top pb-safe-bottom">
        <div className="px-4 pt-4">
          <Skeleton className="h-6 w-full mb-6" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <OnboardingFlow userId={user.id} />;
}

function OnboardingFlow({ userId }: { userId: string }) {
  const {
    step,
    allProviders,
    selectedProviderIds,
    selectedSeries,
    loading,
    saving,
    error,
    canAdvanceFromStep1,
    canAdvanceFromStep2,
    next,
    back,
    toggleProvider,
    toggleSeries,
    finish,
  } = useOnboarding(userId);

  if (loading) {
    return (
      <div className="min-h-dvh bg-background flex flex-col pt-safe-top pb-safe-bottom">
        <div className="px-4 pt-4">
          <Skeleton className="h-6 w-full mb-6" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col pt-safe-top pb-safe-bottom">
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <StreamingStep
          allProviders={allProviders}
          selectedIds={selectedProviderIds}
          onToggle={toggleProvider}
          onNext={next}
          canAdvance={canAdvanceFromStep1}
        />
      )}

      {step === 2 && (
        <FavoritesStep
          selectedSeries={selectedSeries}
          onToggle={toggleSeries}
          onNext={next}
          onBack={back}
          canAdvance={canAdvanceFromStep2}
        />
      )}

      {step === 3 && (
        <CompletionStep
          allProviders={allProviders}
          selectedProviderIds={selectedProviderIds}
          selectedSeries={selectedSeries}
          saving={saving}
          error={error}
          onFinish={finish}
          onBack={back}
        />
      )}
    </div>
  );
}
