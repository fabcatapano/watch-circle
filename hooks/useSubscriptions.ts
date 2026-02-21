"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getAllProviders,
  getUserSubscribedProviderIds,
  setUserSubscriptions,
} from "@/services/subscriptions";
import type { StreamingProvider } from "@/types";

export function useSubscriptions(userId: string) {
  const [allProviders, setAllProviders] = useState<StreamingProvider[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [providersRes, userIds] = await Promise.all([
      getAllProviders(supabase),
      getUserSubscribedProviderIds(supabase, userId),
    ]);
    setAllProviders(providersRes.data);
    setSelectedIds(userIds);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSubscriptions = useCallback(
    async (ids: string[]) => {
      // Optimistic update
      setSelectedIds(ids);
      setSaving(true);
      await setUserSubscriptions(supabase, userId, ids);
      setSaving(false);
    },
    [supabase, userId]
  );

  return { allProviders, selectedIds, loading, saving, saveSubscriptions };
}
