"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import { useIsAdmin } from "@/app/use-admin";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Globe,
  Home,
  Layers3,
  ListTodo,
  LockIcon,
  type LucideIcon,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const { data: currentUser } = useGetAuthUserQuery({});
  const isAdmin = useIsAdmin();
  const username = currentUser?.userDetails?.username || "NovaStack";
  const roleLabel =
    currentUser?.userDetails?.role === "admin"
      ? "Admin"
      : currentUser?.userDetails?.role === "developer"
        ? "Developer"
        : "View only";

  const sidebarClassNames = `fixed flex h-full flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white shadow-sm transition-all duration-300 z-40 dark:border-slate-800 dark:bg-slate-dark-900 ${
    isSidebarCollapsed ? "w-0 border-transparent" : "w-64"
  }`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-64 flex-col">
        <div className="flex min-h-14 items-center justify-between px-5 pt-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nova-600 text-sm font-bold text-white">
              N
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-dark-800 dark:text-white">
              NovaBoard
            </span>
          </Link>
          <button
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => dispatch(setIsSidebarCollapsed(true))}
            aria-label="Collapse sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-nova-100 text-sm font-bold text-nova-800 dark:bg-nova-900 dark:text-nova-100">
            NS
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-wide dark:text-slate-100">
              NovaStack Studio
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <LockIcon className="h-3 w-3" />
              Private workspace
            </div>
          </div>
        </div>

        <nav className="mt-3">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Projects" href="/projects" />
          <SidebarLink icon={ListTodo} label="Backlog & Sprints" href="/backlog" />
          <SidebarLink icon={Layers3} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
          <SidebarLink icon={Globe} label="Landing Page" href="/landing" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
        </nav>

        <div className="mt-2 flex items-center justify-between px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex items-center gap-1"
          >
            Projects
            {showProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {isAdmin && (
            <Link href="/projects" aria-label="New project" className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Plus className="h-4 w-4" />
            </Link>
          )}
        </div>
        {showProjects &&
          (projects?.length ? (
            projects.map((project) => (
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
              />
            ))
          ) : (
            <p className="px-8 py-2 text-xs text-slate-400">No projects yet</p>
          ))}

        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="mt-2 flex w-full items-center justify-between px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
        >
          Priority
          {showPriority ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showPriority && (
          <>
            <SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" />
            <SidebarLink icon={ShieldAlert} label="High" href="/priority/high" />
            <SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" />
            <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
            <SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" />
          </>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-600 text-xs font-bold text-white">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium dark:text-white">{username}</p>
            <p className="text-xs text-slate-500">{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="block w-full">
      <div
        className={`relative mx-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? "bg-nova-50 font-medium text-nova-800 dark:bg-nova-950 dark:text-nova-100"
            : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-nova-600" />
        )}
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
