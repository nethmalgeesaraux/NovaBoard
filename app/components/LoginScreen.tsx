"use client";

import { useState } from "react";
import { useSignInMutation } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import { Field, inputClass, primaryButton } from "@/app/components/ui";

export default function LoginScreen() {
  const [signIn, { isLoading }] = useSignInMutation();
  const [error, setError] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-dark-950">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-dark-900"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setError("");
          try {
            await signIn({
              email: String(form.get("email") ?? ""),
              password: String(form.get("password") ?? ""),
            }).unwrap();
          } catch (signInError) {
            setError(getErrorMessage(signInError));
          }
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-600 text-sm font-bold text-white">
            N
          </span>
          <div>
            <p className="text-lg font-semibold">NovaBoard</p>
            <p className="text-sm text-slate-500">NovaStack Studio workspace</p>
          </div>
        </div>
        <div className="space-y-3">
          <Field label="Email">
            <input
              name="email"
              type="email"
              autoComplete="username"
              className={inputClass}
              required
              placeholder="you@novastack.studio"
            />
          </Field>
          <Field label="Password">
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className={inputClass}
              required
            />
          </Field>
        </div>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <button className={`${primaryButton} mt-5 w-full`} disabled={isLoading} type="submit">
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-xs text-slate-500">
          Admins can add projects, teams, and issues. Everyone else can view the workspace.
        </p>
      </form>
    </div>
  );
}
