"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignInMutation } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  Lock,
  Moon,
  Shield,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";

export default function WorkspaceLogin() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"admin" | "developer">("admin");

  const handleAdminQuickFill = () => {
    setEmail("studionovastack@gmail.com");
    setPassword("novaboard@2005");
    setActiveTab("admin");
    setError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn({
        email: email.trim(),
        password,
      }).unwrap();
    } catch (signInError) {
      setError(getErrorMessage(signInError));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-dark-800 transition-colors duration-200 dark:bg-slate-dark-950 dark:text-slate-100 p-4 sm:p-6">
      {/* Top bar with Dark Mode & Landing Page Link */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full pt-2">
        <Link
          href="/landing"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-nova-600 dark:text-slate-400 dark:hover:text-nova-400 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>NovaStack Landing Page</span>
        </Link>

        <button
          aria-label="Toggle dark mode"
          type="button"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-nova-700 to-nova-500 font-bold text-lg text-white shadow-md shadow-nova-600/30">
                N
              </span>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  NovaBoard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  NovaStack Studio Workspace
                </p>
              </div>
            </div>
            <span className="rounded-full bg-nova-50 px-2.5 py-0.5 text-[10px] font-bold text-nova-700 dark:bg-nova-950 dark:text-nova-300 border border-nova-200 dark:border-nova-800">
              v2.0
            </span>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                handleAdminQuickFill();
              }}
              className={`rounded-xl py-2.5 transition flex items-center justify-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-white text-nova-700 shadow-sm dark:bg-slate-900 dark:text-nova-300"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Workspace Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("developer");
                setEmail("");
                setPassword("");
              }}
              className={`rounded-xl py-2.5 transition flex items-center justify-center gap-1.5 ${
                activeTab === "developer"
                  ? "bg-white text-nova-700 shadow-sm dark:bg-slate-900 dark:text-nova-300"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Developer</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  activeTab === "admin"
                    ? "studionovastack@gmail.com"
                    : "developer@novastack.studio"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-nova-500 focus:bg-white focus:ring-2 focus:ring-nova-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {activeTab === "admin" && (
                  <button
                    type="button"
                    onClick={handleAdminQuickFill}
                    className="text-[11px] text-nova-600 dark:text-nova-400 font-semibold hover:underline"
                  >
                    Fill Admin Password
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-nova-500 focus:bg-white focus:ring-2 focus:ring-nova-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950 transition"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200">
                <p className="font-semibold">Sign In Failed</p>
                <p className="mt-0.5">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-nova-600 py-3 text-sm font-bold text-white shadow-md shadow-nova-600/25 hover:bg-nova-700 transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Signing in to Workspace...</span>
              ) : (
                <>
                  <span>Sign In to NovaBoard</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              Developer accounts are created by Workspace Admin. Need access? Contact{" "}
              <a href="mailto:studionovastack@gmail.com" className="text-nova-600 hover:underline">
                studionovastack@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-2">
        NovaBoard © 2026 NovaStack Studio. Internal Engineering Workspace.
      </div>
    </div>
  );
}

