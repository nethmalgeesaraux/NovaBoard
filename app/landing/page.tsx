"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetAuthUserQuery } from "@/state/api";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Flame,
  Globe,
  Kanban,
  KeyRound,
  Layers,
  Lock,
  Moon,
  Play,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  Users2,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";

export default function LandingPage() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: currentUser } = useGetAuthUserQuery({});
  const [activeFeatureTab, setActiveFeatureTab] = useState<"kanban" | "backlog" | "team">("kanban");

  const isSignedIn = Boolean(currentUser?.signedIn);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 font-sans selection:bg-nova-500 selection:text-white">
      {/* Background Ambient Glows (2026 Mesh) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-nova-600/20 via-teal-500/10 to-transparent blur-[140px] rounded-full" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[500px] bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[400px] bg-nova-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 1. Futuristic Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-nova-600 to-teal-400 font-black text-white shadow-lg shadow-nova-500/25 border border-white/20">
              N
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  NovaBoard
                </span>
                <span className="rounded-full bg-gradient-to-r from-nova-500/20 to-teal-500/20 px-2 py-0.5 text-[10px] font-bold text-nova-300 border border-nova-500/30">
                  2026 Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                NovaStack Studio Engineering OS
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <a href="#features" className="hover:text-nova-400 transition">
              Capabilities
            </a>
            <a href="#interactive-preview" className="hover:text-nova-400 transition">
              Sprint Engine
            </a>
            <a href="#jira-matrix" className="hover:text-nova-400 transition">
              Jira Benchmark
            </a>
            <a href="#about" className="hover:text-nova-400 transition">
              About NovaStack
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle theme"
              type="button"
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5 transition"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isSignedIn ? (
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-nova-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-nova-600/30 hover:opacity-95 transition"
              >
                <span>Open Workspace</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-nova-600 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-nova-600/30 hover:opacity-95 transition"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Workspace Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* 2026 Micro Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-nova-500/30 bg-nova-500/10 px-4 py-1.5 text-xs font-semibold text-nova-300 mb-8 backdrop-blur-xl shadow-inner">
              <Sparkles className="h-3.5 w-3.5 text-nova-400 animate-pulse" />
              <span>Next-Gen Agile Delivery for NovaStack Studio Engineers</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl text-white leading-[1.1]">
              The High-Velocity{" "}
              <span className="bg-gradient-to-r from-nova-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Project Engine
              </span>{" "}
              for Modern Studios.
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Eliminate Jira clutter. Experience ultra-fast sprint boards, backlog refinement,
              role-based developer provisioning, and interactive card discussions — backed by Supabase.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={isSignedIn ? "/projects" : "/"}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-nova-500 via-nova-600 to-teal-600 px-7 py-4 text-sm font-extrabold text-white shadow-xl shadow-nova-600/30 hover:shadow-nova-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{isSignedIn ? "Enter NovaBoard Workspace" : "Launch Workspace Portal"}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#interactive-preview"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-slate-200 hover:bg-white/10 hover:border-white/25 transition backdrop-blur-xl"
              >
                <Play className="h-4 w-4 fill-current text-nova-400" />
                <span>Explore Live Sprint Engine</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Direct Supabase PostgreSQL
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Admin Sprint Push to Kanban
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                Developer Comment Discussions
              </span>
            </div>
          </div>

          {/* 3. Interactive Showcase (2026 UI Sandbox) */}
          <div
            id="interactive-preview"
            className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-7 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
          >
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                <span className="ml-3 font-mono text-xs text-slate-400">
                  NovaBoard v2.6 // Sprint Engine Interactive Simulator
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("kanban")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    activeFeatureTab === "kanban"
                      ? "bg-nova-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Active Kanban Board
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("backlog")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    activeFeatureTab === "backlog"
                      ? "bg-nova-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sprint & Backlog Planning
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFeatureTab("team")}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    activeFeatureTab === "team"
                      ? "bg-nova-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Developer Discussion
                </button>
              </div>
            </div>

            {/* TAB 1: Active Kanban */}
            {activeFeatureTab === "kanban" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
                {/* To Do Column */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400">
                    <span>TO DO (3)</span>
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5 hover:border-nova-500/50 transition">
                      <span className="font-mono text-[11px] font-bold text-nova-400">NS-201</span>
                      <p className="mt-1 text-xs font-semibold text-slate-200">
                        Design Next-Gen Dark UI Tokens
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 font-bold border border-amber-500/30">
                          Medium
                        </span>
                        <span className="font-mono text-nova-300">5 pts</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5 hover:border-nova-500/50 transition">
                      <span className="font-mono text-[11px] font-bold text-nova-400">NS-204</span>
                      <p className="mt-1 text-xs font-semibold text-slate-200">
                        Supabase RLS Multi-Tenant Policies
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px]">
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-rose-300 font-bold border border-rose-500/30">
                          Urgent
                        </span>
                        <span className="font-mono text-nova-300">8 pts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* In Progress */}
                <div className="rounded-2xl border border-nova-500/30 bg-nova-500/[0.05] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-nova-400">
                    <span>IN PROGRESS (1)</span>
                    <span className="h-2 w-2 rounded-full bg-nova-400 animate-ping" />
                  </div>
                  <div className="rounded-xl border border-nova-500/40 bg-slate-900/90 p-3.5 shadow-lg shadow-nova-500/10">
                    <span className="font-mono text-[11px] font-bold text-nova-400">NS-203</span>
                    <p className="mt-1 text-xs font-semibold text-white">
                      Sprint Push Engine & To Do Pipeline
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-orange-300 font-bold border border-orange-500/30">
                        High
                      </span>
                      <span className="font-mono text-nova-400 font-bold">5 pts</span>
                    </div>
                  </div>
                </div>

                {/* Under Review */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-amber-400">
                    <span>UNDER REVIEW (1)</span>
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3.5">
                    <span className="font-mono text-[11px] font-bold text-nova-400">NS-199</span>
                    <p className="mt-1 text-xs font-semibold text-slate-200">
                      Developer Read-Only Card Permissions
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="rounded-full bg-nova-500/20 px-2 py-0.5 text-nova-300 font-bold border border-nova-500/30">
                        Low
                      </span>
                      <span className="font-mono text-nova-300">3 pts</span>
                    </div>
                  </div>
                </div>

                {/* Completed */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-emerald-400">
                    <span>COMPLETED (4)</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3.5 opacity-80">
                    <span className="font-mono text-[11px] font-bold text-slate-500 line-through">
                      NS-195
                    </span>
                    <p className="mt-1 text-xs font-semibold line-through text-slate-400">
                      Initial Supabase PostgreSQL Setup
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">
                        Done
                      </span>
                      <span className="font-mono text-slate-400">5 pts</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Sprint & Backlog Planning */}
            {activeFeatureTab === "backlog" && (
              <div className="space-y-4 animate-in fade-in">
                {/* Sprint 1 Planned Container */}
                <div className="rounded-2xl border border-nova-500/30 bg-nova-500/10 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <Rocket className="h-5 w-5 text-nova-400" />
                      <div>
                        <span className="font-bold text-sm text-white">Sprint 1 (Planned)</span>
                        <p className="text-xs text-slate-400">2 issues · 13 Story Points</p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                      <Play className="h-3 w-3 fill-current" />
                      <span>Start Sprint (Push to Board)</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-3 border border-white/10 text-xs">
                      <span className="font-mono text-nova-400 font-bold">NS-201</span>
                      <span className="font-semibold text-slate-200">
                        Design Next-Gen Dark UI Tokens
                      </span>
                      <span className="font-mono text-nova-300 font-bold">5 pts</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-900/90 p-3 border border-white/10 text-xs">
                      <span className="font-mono text-nova-400 font-bold">NS-204</span>
                      <span className="font-semibold text-slate-200">
                        Supabase RLS Multi-Tenant Policies
                      </span>
                      <span className="font-mono text-nova-300 font-bold">8 pts</span>
                    </div>
                  </div>
                </div>

                {/* Backlog List */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                    Unallocated Backlog (5 Issues Waiting)
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-xl bg-white/[0.02] p-3 border border-white/5">
                      <span className="font-mono text-slate-500">NS-205</span>
                      <span className="text-slate-300 font-medium">
                        Automated GitHub Deployment Webhook
                      </span>
                      <span className="rounded-lg bg-nova-500/20 text-nova-300 px-2 py-0.5 font-bold">
                        To Sprint ⬆
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Developer Discussion & Card View */}
            {activeFeatureTab === "team" && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-5 animate-in fade-in max-w-2xl mx-auto space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-nova-400">NS-102</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                      Developer View (Read-Only Specs)
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    Supabase PostgreSQL Connection & RLS Security
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect tables with Row Level Security. Only Admin can edit specs, developers can comment and progress status.
                  </p>
                </div>

                {/* Comments Mockup */}
                <div className="space-y-2.5 text-xs">
                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">Studio NovaStack</span>
                      <span className="rounded-full bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.2 font-bold">
                        Admin
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">10 mins ago</span>
                    </div>
                    <p className="text-slate-300 pl-1">
                      Please make sure all tasks move to To Do automatically once the sprint starts.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white">Kasun Perera</span>
                      <span className="rounded-full bg-nova-500/20 text-nova-300 text-[10px] px-2 py-0.2 font-bold">
                        Developer
                      </span>
                      <span className="text-[10px] text-slate-500 ml-auto">Just now</span>
                    </div>
                    <p className="text-slate-300 pl-1">
                      Checked and verified! Drag-and-drop on the Kanban board is working perfectly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Platform Capabilities Grid */}
      <section id="features" className="py-24 border-t border-white/10 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-nova-400 mb-2">
              Architected for Engineering Velocity
            </h2>
            <p className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              Every Tool NovaStack Engineers Need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Kanban className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Jira-Style Agile Sprints</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Drag and drop issues across To Do, In Progress, Under Review, and Completed.
                Instant status updates with story point calculation.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Backlog & Sprint Push</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Admin organizes upcoming features in the Backlog. One click on "Start Sprint"
                activates all tasks directly into the developer's To Do board.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Direct Developer Provisioning</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Admin creates developer accounts with password generation. Instant credential copying
                so engineers can log in without public self-registration.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Role-Based Card Governance</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Developers see clean read-only specifications and discuss work through comments.
                Core specs, story points, and deletion remain protected for leadership.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Supabase Database</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Row Level Security (RLS) protects workspace data at the database layer.
                No mock data fallbacks — everything connects directly to your live Supabase project.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-xl hover:border-nova-500/50 hover:bg-slate-900/90 transition-all group">
              <div className="rounded-2xl bg-nova-500/10 border border-nova-500/20 p-4 text-nova-400 w-fit mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Sub-200ms Load Times</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Built on Next.js Turbopack with zero Jira bloat. Instant transitions between
                Kanban boards, backlog planning, and developer profiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 2026 Jira Benchmark Matrix */}
      <section id="jira-matrix" className="py-24 border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Why NovaBoard Outperforms Traditional Jira
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Modern engineering performance benchmark for software teams
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-xl">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Metric / Feature</th>
                  <th className="px-6 py-4 font-extrabold text-nova-400">NovaBoard 2026</th>
                  <th className="px-6 py-4 font-semibold text-slate-400">Standard Jira</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="px-6 py-4 font-medium">Board Load & Drag Latency</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">⚡ &lt; 150ms Instant</td>
                  <td className="px-6 py-4 text-slate-400">2,500ms – 5,000ms</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Developer Account Setup</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">1-Click Admin Provisioning</td>
                  <td className="px-6 py-4 text-slate-400">Complex SSO / Multi-step Invite</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Database Ownership</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">Direct Supabase PostgreSQL</td>
                  <td className="px-6 py-4 text-slate-400">Closed Cloud Proprietary</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Developer Privacy Controls</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">Database hidden from devs</td>
                  <td className="px-6 py-4 text-slate-400">Confusing permissions matrix</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Monthly Cost</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">100% Free for NovaStack Studio</td>
                  <td className="px-6 py-4 text-slate-400">\$8.15+ per developer / month</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="py-20 border-t border-white/10 bg-gradient-to-b from-slate-900/50 to-slate-950 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Ready to Build at High Velocity?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Log in to the NovaBoard workspace and take control of your studio's engineering sprints.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-nova-500 via-nova-600 to-teal-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-nova-600/30 hover:scale-[1.02] transition-all"
            >
              <span>Access NovaBoard Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-white/10 py-8 text-xs text-slate-500 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-nova-600 text-xs font-bold text-white">
              N
            </span>
            <span className="font-semibold text-slate-300">
              NovaBoard 2026 // NovaStack Studio
            </span>
          </div>
          <p>Engineered for high-impact software solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
