"use client";

import { useState } from "react";
import { useSignInMutation } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Code2,
  Kanban,
  KeyRound,
  Layers,
  Lock,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Users2,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";

export default function LoginScreen() {
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

  const scrollToLogin = () => {
    const el = document.getElementById("login-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-dark-800 transition-colors duration-200 dark:bg-slate-dark-950 dark:text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-dark-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-nova-700 to-nova-500 font-bold text-white shadow-md shadow-nova-600/20">
              N
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg">NovaBoard</span>
                <span className="rounded-full bg-nova-500/10 px-2 py-0.5 text-[11px] font-semibold text-nova-600 dark:text-nova-400 border border-nova-500/20">
                  v2.0 Jira-Grade
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">NovaStack Studio Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-nova-600 dark:hover:text-nova-400 transition">
              Features
            </a>
            <a href="#preview" className="hover:text-nova-600 dark:hover:text-nova-400 transition">
              Kanban Board
            </a>
            <a href="#jira-comparison" className="hover:text-nova-600 dark:hover:text-nova-400 transition">
              Why NovaBoard
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              type="button"
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={scrollToLogin}
              className="inline-flex items-center gap-2 rounded-xl bg-nova-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-nova-700 transition"
            >
              <KeyRound className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-nova-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-nova-500/20 bg-nova-50/70 px-3.5 py-1.5 text-xs font-semibold text-nova-700 dark:bg-nova-950/60 dark:text-nova-300 mb-6 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              <span>NovaStack Studio Internal Project Engine</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.15]">
              Deliver Projects Faster with{" "}
              <span className="bg-gradient-to-r from-nova-600 to-teal-500 bg-clip-text text-transparent">
                Jira-Grade Agility
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Designed specifically for NovaStack Studio engineers and leadership. Plan sprints,
              track issues, manage developer accounts, and ship high-impact digital solutions with zero friction.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={scrollToLogin}
                className="inline-flex items-center gap-2 rounded-xl bg-nova-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-nova-600/25 hover:bg-nova-700 transition"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition shadow-sm"
              >
                <span>Explore Features</span>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Live Supabase Database
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Role-Based Developer Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Agile Kanban & Sprints
              </span>
            </div>
          </div>

          {/* Interactive Kanban Preview Mockup */}
          <div id="preview" className="mt-14 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-3 text-xs font-semibold text-slate-400">
                  Active Sprint Board: NovaStack Core Platform
                </span>
              </div>
              <span className="rounded-md bg-nova-50 px-2.5 py-1 text-xs font-semibold text-nova-700 dark:bg-nova-950 dark:text-nova-300">
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* To Do */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    To Do (2)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-[11px] font-bold text-nova-600">NS-104</span>
                    <p className="mt-1 text-xs font-medium">Implement Client Billing API Integration</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-medium">
                        Medium
                      </span>
                      <span className="text-slate-400">5 pts</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-[11px] font-bold text-nova-600">NS-105</span>
                    <p className="mt-1 text-xs font-medium">Configure Automated Sentry Monitoring</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-medium">
                        Low
                      </span>
                      <span className="text-slate-400">2 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div className="rounded-xl border border-nova-200/50 bg-nova-50/30 p-3.5 dark:border-nova-900/30 dark:bg-nova-950/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-nova-700 dark:text-nova-400">
                    In Progress (1)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-nova-500 animate-pulse" />
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-nova-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-[11px] font-bold text-nova-600">NS-102</span>
                    <p className="mt-1 text-xs font-semibold">Supabase PostgreSQL Connection & RLS</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">
                        Urgent
                      </span>
                      <span className="text-nova-600 font-semibold">8 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Under Review */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Under Review (1)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-[11px] font-bold text-nova-600">NS-101</span>
                    <p className="mt-1 text-xs font-medium">Developer Account Provisioning UI</p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-medium">
                        High
                      </span>
                      <span className="text-slate-400">5 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed */}
              <div className="rounded-xl border border-emerald-200/40 bg-emerald-50/20 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Completed (2)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-2.5">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900 opacity-80">
                    <span className="text-[11px] font-bold text-slate-400 line-through">NS-99</span>
                    <p className="mt-1 text-xs font-medium line-through text-slate-500">
                      Studio Design Tokens & Tailwind Palette
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                        Done
                      </span>
                      <span className="text-slate-400">3 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Login Portal Section */}
      <section id="login-section" className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg bg-nova-50 px-3 py-1 text-xs font-semibold text-nova-700 dark:bg-nova-950 dark:text-nova-300">
                <Lock className="h-3.5 w-3.5" />
                <span>Restricted Company Workspace</span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Sign in to Your NovaStack Engineering Portal
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                NovaBoard gives your team real-time visibility into software delivery, sprint velocity, and task assignments.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-nova-50 p-2 text-nova-600 dark:bg-nova-950 dark:text-nova-400 shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Administrator Governed</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Only the Workspace Admin (<code>studionovastack@gmail.com</code>) can create new developer accounts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-nova-50 p-2 text-nova-600 dark:bg-nova-950 dark:text-nova-400 shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Direct Developer Login</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Developers sign in using the email and password provided by the Administrator.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="rounded-xl bg-nova-50 p-2 text-nova-600 dark:bg-nova-950 dark:text-nova-400 shrink-0">
                    <Kanban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Full Jira-Like Workflow</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Engineers can move tasks across columns, edit issue details, log story points, and monitor deadlines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Quick Fill Helper */}
              <div className="rounded-xl border border-nova-200 bg-nova-50/70 p-4 dark:border-nova-900 dark:bg-nova-950/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-nova-800 dark:text-nova-200">
                    Workspace Administrator Quick Login
                  </span>
                  <button
                    type="button"
                    onClick={handleAdminQuickFill}
                    className="rounded-lg bg-nova-600 px-3 py-1 font-semibold text-white hover:bg-nova-700 transition"
                  >
                    Quick Fill Admin
                  </button>
                </div>
                <p className="mt-1.5 text-nova-900/80 dark:text-nova-300">
                  Click to pre-fill admin email (<code>studionovastack@gmail.com</code>) and configured password.
                </p>
              </div>
            </div>

            {/* Right Login Form Card */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Workspace Sign In</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Enter your NovaBoard credentials</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-nova-600 text-sm font-bold text-white shadow-sm">
                    N
                  </span>
                </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("admin")}
                    className={`rounded-lg py-2 transition ${
                      activeTab === "admin"
                        ? "bg-white text-nova-700 shadow-xs dark:bg-slate-900 dark:text-nova-300"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Workspace Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("developer")}
                    className={`rounded-lg py-2 transition ${
                      activeTab === "developer"
                        ? "bg-white text-nova-700 shadow-xs dark:bg-slate-900 dark:text-nova-300"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    Developer / Member
                  </button>
                </div>

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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-nova-500 focus:ring-2 focus:ring-nova-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white transition"
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
                          className="text-[11px] text-nova-600 hover:underline"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-nova-500 focus:ring-2 focus:ring-nova-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white transition"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200">
                      <p className="font-semibold">Sign in failed</p>
                      <p className="mt-0.5">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-nova-600 py-3 text-sm font-semibold text-white shadow-md shadow-nova-600/20 hover:bg-nova-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>Sign In to Workspace</span>
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800 text-center">
                  <p className="text-xs text-slate-400">
                    Need an account? Contact the Workspace Administrator (
                    <a
                      href="mailto:studionovastack@gmail.com"
                      className="text-nova-600 hover:underline"
                    >
                      studionovastack@gmail.com
                    </a>
                    )
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-nova-600 dark:text-nova-400">
              Built for NovaStack Engineering
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything Your Team Needs to Build & Ship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <Kanban className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Kanban & Agile Sprints
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamless drag-and-drop workflow across To Do, In Progress, Under Review, and Completed columns.
                Instant updates for real-time team synchronization.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Developer Provisioning
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralized team management. Administrators can create developer accounts, set roles,
                and instantly share credentials with new recruits or contractors.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Sprint Analytics & Metrics
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Automated story points tracking, overdue deadline alerts, and issue priority distributions
                to keep every client milestone on schedule.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Developer-First Issue Details
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Jira-standard issue keys (e.g. PRJ-101), markdown descriptions, tag categorizations,
                assigned developer avatars, and story estimation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Multi-Project Support
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Manage all NovaStack Studio client and internal products under one roof.
                Switch between projects, boards, and timelines in milliseconds.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs hover:border-nova-400 transition dark:border-slate-800 dark:bg-slate-900">
              <div className="rounded-xl bg-nova-50 p-3 text-nova-600 dark:bg-nova-950 dark:text-nova-400 w-fit mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Live Supabase PostgreSQL
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Row Level Security (RLS) protects workspace data at the database layer.
                No mock data fallbacks — everything connects directly to your live Supabase project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jira vs NovaBoard Comparison */}
      <section id="jira-comparison" className="py-16 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Why NovaStack Built NovaBoard Instead of Jira
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Jira power without the unnecessary corporate bloat
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Capability</th>
                  <th className="px-6 py-4 font-bold text-nova-600">NovaBoard</th>
                  <th className="px-6 py-4 font-semibold text-slate-400">Standard Jira</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-6 py-4 font-medium">Speed & Load Time</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">⚡ Instant (&lt; 200ms)</td>
                  <td className="px-6 py-4 text-slate-400">Slow (2-5s)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">User Provisioning</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">Admin creates developers in 1-click</td>
                  <td className="px-6 py-4 text-slate-400">Complex invite/Atlassian SSO flow</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Database Control</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">Direct Supabase PostgreSQL</td>
                  <td className="px-6 py-4 text-slate-400">Proprietary cloud locked</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">UI Complexity</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">Clean, focused, modern</td>
                  <td className="px-6 py-4 text-slate-400">Cluttered with 50+ menus</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Cost</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">100% Free for NovaStack Studio</td>
                  <td className="px-6 py-4 text-slate-400">\$8.15+/user/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-nova-600 text-xs font-bold text-white">
              N
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              NovaBoard © 2026 NovaStack Studio
            </span>
          </div>
          <p>The Internal Agile Project Engine for NovaStack Software Solutions.</p>
        </div>
      </footer>
    </div>
  );
}
