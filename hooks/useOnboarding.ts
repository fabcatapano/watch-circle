"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getAllProviders } from "@/services/subscriptions";
import { completeOnboarding } from "@/services/onboarding";
import { ROUTES } from "@/utils/constants";
import type { StreamingProvider, TMDBSearchResult } from "@/types";

export type OnboardingStep = 1 | 2 | 3;

export function useOnboarding(userId: string) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<OnboardingStep>(1);
  const [allProviders, setAllProviders] = useState<StreamingProvider[]>([]);
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProviders(supabase).then(({ data }) => {
      setAllProviders(data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAdvanceFromStep1 = selectedProviderIds.length >= 1;
  const canAdvanceFromStep2 = selectedSeries.length >= 3;

  const next = useCallback(() => {
    if (step === 1 && canAdvanceFromStep1) setStep(2);
    else if (step === 2 && canAdvanceFromStep2) setStep(3);
  }, [step, canAdvanceFromStep1, canAdvanceFromStep2]);

  const back = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }, [step]);

  const toggleProvider = useCallback(
    (provider: StreamingProvider) => {
      const allProvider = allProviders.find((p) => p.tmdb_provider_id === 0);
      const isAll = provider.tmdb_provider_id === 0;
      const isSelected = selectedProviderIds.includes(provider.id);

      if (isAll) {
        setSelectedProviderIds(isSelected ? [] : [provider.id]);
      } else if (isSelected) {
        setSelectedProviderIds((prev) => prev.filter((id) => id !== provider.id));
      } else {
        setSelectedProviderIds((prev) => [
          ...prev.filter((id) => id !== allProvider?.id),
          provider.id,
        ]);
      }
    },
    [allProviders, selectedProviderIds]
  );

  const toggleSeries = useCallback((series: TMDBSearchResult) => {
    setSelectedSeries((prev) => {
      const exists = prev.some((s) => s.id === series.id);
      if (exists) return prev.filter((s) => s.id !== series.id);
      return [...prev, series];
    });
  }, []);

  const finish = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const mappedSeries = selectedSeries.map((s) => ({
        id: s.id,
        name: s.name ?? s.title ?? "",
        poster_path: s.poster_path,
      }));

      const { error } = await completeOnboarding(supabase, userId, selectedProviderIds, mappedSeries);
      if (error) {
        setError("Something went wrong. Please try again.");
        setSaving(false);
        return;
      }
      router.push(ROUTES.FEED);
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }, [supabase, userId, selectedProviderIds, selectedSeries, router]);

  return {
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
  };
}
