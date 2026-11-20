"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import { useGetAuthUserQuery, useGetBackendStatusQuery, useSignOutMutation } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import { PageHeader, QueryError, cardClass, secondaryButton, dangerButton } from "@/app/components/ui";
import { CheckCircle2, Database, ExternalLink, Moon, Shield, Sun, User } from "lucide-react";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: status, isError, error, refetch } = useGetBackendStatusQuery();
  const { data: currentUser } = useGetAuthUserQuery({});
  const [signOut, { isLoading: signingOut }] = useSignOutMutation();

  const user = currentUser?.userDetails;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        subtitle="Manage appearance, view database connectivity, and review your NovaStack Studio profile."
      />
      <QueryError message={isError ? getErrorMessage(error) : undefined} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Profile Card */}
        <section className={`${cardClass} p-5 space-y-4`}>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-nova-600" />
            <h2 className="font-semibold text-base">Your Profile</h2>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.username || "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Email</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{user?.email || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Role</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-nova-50 px-2 py-0.5 font-semibold text-nova-700 dark:bg-nova-950 dark:text-nova-300 capitalize">
                <Shield className="h-3 w-3" />
                {user?.role || "developer"}
              </span>
            </div>
          </div>
          <button
            className={`${dangerButton} w-full`}
            type="button"
            disabled={signingOut}
            onClick={() => signOut()}
          >
            {signingOut ? "Signing out..." : "Sign Out of NovaBoard"}
          </button>
        </section>

        {/* Database Connectivity */}
        <section className={`${cardClass} p-5 space-y-4`}>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-nova-600" />
            <h2 className="font-semibold text-base">Supabase Database</h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-800/60 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Backend</span>
              <span className="font-semibold">Live Supabase PostgreSQL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Status</span>
              <span
                className={`font-semibold inline-flex items-center gap-1 ${
                  status?.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"
                }`}
              >
                {status?.ok && <CheckCircle2 className="h-3.5 w-3.5" />}
                {status?.ok ? "Connected & Synchronized" : "Tables Missing / Attention Required"}
              </span>
            </div>
            <p className="pt-1 text-[11px] text-slate-500 leading-relaxed">{status?.message}</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button className={secondaryButton} type="button" onClick={() => refetch()}>
              Check Connection
            </button>
            <a
              href="https://supabase.com/dashboard/project/mnucdpuwmzszpfmhjdcn"
              target="_blank"
              rel="noopener noreferrer"
              className={`${secondaryButton} inline-flex items-center gap-1.5`}
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Appearance Card */}
        <section className={`${cardClass} p-5 space-y-3`}>
          <h2 className="font-semibold text-base">Appearance</h2>
          <p className="text-xs text-slate-500">
            Switch between light and dark themes for your NovaBoard session.
          </p>
          <button
            className={`${secondaryButton} mt-2 inline-flex items-center gap-2`}
            type="button"
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
          </button>
        </section>
      </div>
    </div>
  );
}
