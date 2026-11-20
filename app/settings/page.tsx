"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import { useGetBackendStatusQuery, useResetDemoDataMutation } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import { PageHeader, QueryError, cardClass, secondaryButton } from "@/app/components/ui";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: status, isError, error, refetch } = useGetBackendStatusQuery();
  const [resetDemo, { isLoading }] = useResetDemoDataMutation();

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        subtitle="NovaBoard keeps appearance on this device. Project data goes to Supabase once the keys are set."
      />
      <QueryError message={isError ? getErrorMessage(error) : undefined} />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={`${cardClass} p-5`}>
          <h2 className="font-semibold">Appearance</h2>
          <p className="mt-1 text-sm text-slate-500">Uses the NovaStack palette from the global stylesheet.</p>
          <button
            className={`${secondaryButton} mt-4`}
            type="button"
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          >
            {isDarkMode ? "Use light mode" : "Use dark mode"}
          </button>
        </section>

        <section className={`${cardClass} p-5`}>
          <h2 className="font-semibold">Database</h2>
          <p className="mt-2 text-sm">
            Mode: <span className="font-semibold">{status?.mode ?? "checking"}</span>
          </p>
          <p className={`mt-2 text-sm ${status?.ok ? "text-emerald-700 dark:text-emerald-300" : "text-rose-600"}`}>
            {status?.message}
          </p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Sign in to see the live workspace. Admins can add projects, people, and issues.
            Other accounts can view them.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={secondaryButton} type="button" onClick={() => refetch()}>
              Check connection
            </button>
            {status?.mode === "demo" && (
              <button
                className={secondaryButton}
                type="button"
                disabled={isLoading}
                onClick={() => resetDemo()}
              >
                Reset demo data
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
