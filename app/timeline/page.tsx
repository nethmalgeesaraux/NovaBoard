"use client";

import { parseISO, isValid, format } from "date-fns";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import type { Task } from "@/lib/types";
import { PageHeader, cardClass } from "@/app/components/ui";
import Link from "next/link";

const statusColor: Record<string, string> = {
  "To Do": "bg-slate-400",
  "Work In Progress": "bg-nova-500",
  "Under Review": "bg-amber-400",
  Completed: "bg-emerald-500",
};

function timeOf(value: string) {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date.getTime() : null;
}

export default function TimelinePage() {
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();

  const ranged = tasks
    .map((task) => {
      const start = timeOf(task.startDate) ?? timeOf(task.createdAt);
      const end = timeOf(task.dueDate) ?? start;
      if (start === null || end === null) return null;
      return { task, start, end: Math.max(end, start) };
    })
    .filter((item): item is { task: Task; start: number; end: number } => item !== null);

  const fallbackTime = 1735689600000; // Jan 1 2025
  const min = ranged.length ? Math.min(...ranged.map((item) => item.start)) : fallbackTime;
  const max = ranged.length ? Math.max(...ranged.map((item) => item.end)) : min + 1;
  const span = Math.max(max - min, 1);

  const months: Date[] = [];
  const cursor = new Date(min);
  cursor.setDate(1);
  while (cursor.getTime() <= max) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Schedule"
        title="Timeline"
        subtitle="Issue windows across NovaStack projects. Bar color follows status."
      />
      <div className={`${cardClass} overflow-x-auto p-4`}>
        <div className="relative mb-4 h-6 min-w-[720px]">
          {months.map((month) => (
            <span
              key={month.toISOString()}
              className="absolute text-xs text-slate-400"
              style={{ left: `${((month.getTime() - min) / span) * 100}%` }}
            >
              {format(month, "MMM yyyy")}
            </span>
          ))}
        </div>
        <div className="min-w-[720px] space-y-6">
          {projects.map((project) => {
            const rows = ranged.filter((item) => item.task.projectId === project.id);
            return (
              <div key={project.id}>
                <Link href={`/projects/${project.id}`} className="text-sm font-semibold hover:text-nova-700">
                  {project.name}
                </Link>
                <div className="relative mt-2 h-24 rounded-xl bg-slate-50 dark:bg-slate-dark-950">
                  {rows.map((item, index) => (
                    <Link
                      key={item.task.id}
                      href={`/projects/${project.id}?task=${item.task.id}`}
                      title={`${item.task.issueKey} ${item.task.title}`}
                      className={`absolute h-7 truncate rounded-md px-2 text-xs leading-7 text-white ${
                        statusColor[item.task.status] ?? "bg-nova-600"
                      }`}
                      style={{
                        left: `${((item.start - min) / span) * 100}%`,
                        width: `${Math.max(((item.end - item.start) / span) * 100, 8)}%`,
                        top: 8 + (index % 3) * 28,
                      }}
                    >
                      {item.task.issueKey} {item.task.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
