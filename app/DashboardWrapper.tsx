"use client";

import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetBackendStatusQuery } from "@/state/api";
import { isSupabaseConfigured } from "@/lib/supabase";

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const configured = isSupabaseConfigured();
  const { data: status, isLoading: statusLoading } = useGetBackendStatusQuery();
  const { data: auth, isLoading: authLoading } = useGetAuthUserQuery({});

  if (configured && (statusLoading || authLoading) && !auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500 dark:bg-slate-dark-950">
        Connecting to Supabase...
      </div>
    );
  }

  if (configured && status && !status.ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-dark-950">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-dark-900">
          <h1 className="text-lg font-semibold">Supabase is connected, tables are missing</h1>
          <p className="mt-2 text-slate-500">{status.message}</p>
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
