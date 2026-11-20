"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import WorkspaceLogin from "./components/WorkspaceLogin";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetBackendStatusQuery } from "@/state/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SCHEMA_SQL } from "@/lib/schema-sql";
import { Check, Copy, Database, ExternalLink, RefreshCw } from "lucide-react";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const configured = isSupabaseConfigured();
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useGetBackendStatusQuery();
  const { data: auth, isLoading: authLoading, refetch: refetchAuth } = useGetAuthUserQuery({});
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  // If on /landing, render the standalone Landing Page directly without workspace chrome!
  if (pathname === "/landing") {
    return <>{children}</>;
  }

  const handleRefresh = async () => {
    setChecking(true);
    await Promise.all([refetchStatus(), refetchAuth()]);
    setTimeout(() => setChecking(false), 800);
  };

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SCHEMA_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  if (configured && (statusLoading || authLoading) && !auth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-dark-950 dark:text-slate-400 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-nova-600 border-t-transparent" />
        <p>Connecting to NovaBoard Workspace...</p>
      </div>
    );
  }

  // If not signed in, show clean, focused Workspace Login Portal (NOT the landing page)
  if (configured && auth && !auth.signedIn) {
    return <WorkspaceLogin />;
  }

  // If signed in, but database tables haven't been created yet
  if (configured && status && !status.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-dark-950">
        <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-7 text-sm dark:border-slate-800 dark:bg-slate-900 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-nova-50 p-2.5 text-nova-600 dark:bg-nova-950 dark:text-nova-400">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                Supabase Connected • Setup Database Tables
              </h1>
              <p className="text-xs text-slate-500">
                Connection established to <code>mnucdpuwmzszpfmhjdcn.supabase.co</code>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200 mb-5">
            <p className="font-semibold mb-1">Database Tables Pending:</p>
            <p className="leading-relaxed">
              The database tables (<code>users</code>, <code>teams</code>, <code>projects</code>, <code>tasks</code>) and admin triggers have not been executed in your Supabase SQL editor yet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCopySQL}
              className="inline-flex items-center gap-1.5 rounded-xl bg-nova-600 px-4 py-2 text-xs font-semibold text-white hover:bg-nova-700 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied SQL Code!" : "Copy SQL Code"}</span>
            </button>

            <a
              href="https://supabase.com/dashboard/project/mnucdpuwmzszpfmhjdcn/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={checking}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
              <span>{checking ? "Checking..." : "Check Connection"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-dark-800 dark:bg-slate-dark-950 dark:text-slate-100">
      <Sidebar />
      {!isSidebarCollapsed && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-dark-950/40 md:hidden"
          onClick={() => dispatch(setIsSidebarCollapsed(true))}
        />
      )}
      <main
        className={`flex min-h-screen w-full flex-col ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardWrapper;
