"use client";

import { useGetAuthUserQuery } from "@/state/api";

export function useIsAdmin() {
  const { data } = useGetAuthUserQuery({});
  const email = data?.userDetails?.email?.toLowerCase();
  return (
    data?.userDetails?.role === "admin" ||
    email === "studionovastack@gmail.com"
  );
}

export function useCanEdit() {
  const { data } = useGetAuthUserQuery({});
  const role = data?.userDetails?.role;
  const email = data?.userDetails?.email?.toLowerCase();
  return (
    role === "admin" ||
    role === "developer" ||
    email === "studionovastack@gmail.com"
  );
}
