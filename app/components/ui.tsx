"use client";

import { useEffect } from "react";
import type { Priority, Status } from "@/lib/types";
import { initials } from "@/lib/format";
import { useGetBackendStatusQuery } from "@/state/api";

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-nova-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-nova-700 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-dark-800 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-dark-900 dark:text-slate-100 dark:hover:bg-slate-dark-800";

export const dangerButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60";

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-dark-800 outline-none ring-nova-500/30 placeholder:text-slate-400 focus:border-nova-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-dark-950 dark:text-slate-100";

export const cardClass =
  "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-dark-900";

const priorityStyles: Record<Priority, string> = {
  Urgent: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200",
  High: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-200",
  Medium: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100",
  Low: "bg-nova-50 text-nova-800 dark:bg-nova-950 dark:text-nova-100",
  Backlog: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
};

const statusStyles: Record<Status, string> = {
  "To Do": "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  "Work In Progress": "bg-nova-50 text-nova-800 dark:bg-nova-950 dark:text-nova-100",
  "Under Review": "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-100",
  Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-nova-700 dark:text-nova-300">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-dark-800 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: Priority | Status | "slate";
}) {
  const toneClass =
    tone in priorityStyles
      ? priorityStyles[tone as Priority]
      : tone in statusStyles
        ? statusStyles[tone as Status]
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
  return (
    <span
      title={name}
      className={`inline-flex ${dimension} shrink-0 items-center justify-center rounded-full bg-nova-100 font-bold text-nova-800 dark:bg-nova-900 dark:text-nova-100`}
    >
      {initials(name)}
    </span>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-dark-950/50"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-dark-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-dark-800 dark:text-white">{title}</h2>
          <button className={secondaryButton} onClick={onClose} type="button">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${cardClass} px-6 py-10 text-center`}>
      <p className="font-medium text-slate-dark-800 dark:text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}

export function QueryError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">
      {message}
    </div>
  );
}

export function DemoBanner() {
  const { data } = useGetBackendStatusQuery();
  if (!data || data.mode !== "demo") return null;

  return (
    <div className="mb-4 rounded-xl border border-nova-200 bg-nova-50 px-4 py-3 text-sm text-nova-900 dark:border-nova-800 dark:bg-nova-950 dark:text-nova-100">
      Demo mode. Issues stay in this browser until you add the Supabase URL and anon key
      to <span className="font-semibold"> .env.local</span> and run{" "}
      <span className="font-semibold">supabase/schema.sql</span>.
    </div>
  );
}
