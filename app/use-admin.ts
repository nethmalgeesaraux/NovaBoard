"use client";

import { useGetAuthUserQuery } from "@/state/api";
import { isSupabaseConfigured } from "@/lib/supabase";

export function useIsAdmin() {
  const { data } = useGetAuthUserQuery({});
  if (!isSupabaseConfigured()) return true;
  return data?.userDetails?.role === "admin";
}
