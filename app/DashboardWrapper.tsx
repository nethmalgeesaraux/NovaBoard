"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetBackendStatusQuery } from "@/state/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Check, Copy, Database, ExternalLink, RefreshCw } from "lucide-react";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const configured = isSupabaseConfigured();
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useGetBackendStatusQuery();
  const { data: auth, isLoading: authLoading, refetch: refetchAuth } = useGetAuthUserQuery({});
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleRefresh = async () => {
    setChecking(true);
    await Promise.all([refetchStatus(), refetchAuth()]);
    setTimeout(() => setChecking(false), 800);
  };

  const handleCopySQL = async () => {
    try {
      const res = await fetch("/api/schema-sql");
      if (res.ok) {
        const sql = await res.text();
        await navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch {
      // fallback
    }
  };

  if (configured && (statusLoading || authLoading) && !auth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-dark-950 dark:text-slate-400 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-nova-600 border-t-transparent" />
        <p>Connecting to Supabase...</p>
      </div>
    );
  }

  // If Supabase is connected but tables haven't been created yet
  if (configured && status && !status.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-dark-950">
        <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-7 text-sm dark:border-slate-800 dark:bg-slate-dark-900 shadow-xl">
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

          <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              3 Quick Steps to Complete Setup:
            </p>
            <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
              <li>
                Open the file <strong className="font-mono text-nova-600">supabase/schema.sql</strong> in your project.
              </li>
              <li>
                Go to your{" "}
                <a
                  href="https://supabase.com/dashboard/project/mnucdpuwmzszpfmhjdcn/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nova-600 underline font-semibold inline-flex items-center gap-1"
                >
                  Supabase SQL Editor
                  <ExternalLink className="h-3 w-3 inline" />
                </a>
                , paste the SQL script, and click <strong>Run</strong>.
              </li>
              <li>
                Click the <strong>Check Connection</strong> button below once executed!
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              href="https://supabase.com/dashboard/project/mnucdpuwmzszpfmhjdcn/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-nova-600 px-4 py-2 text-xs font-semibold text-white hover:bg-nova-700 transition"
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

  if (configured && auth && !auth.signedIn) {
    return <LoginScreen />;
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
