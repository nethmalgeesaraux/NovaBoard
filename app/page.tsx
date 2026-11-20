"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetAuthUserQuery, useGetProjectsQuery, useGetTasksQuery, useGetUsersQuery } from "@/state/api";
import { PRIORITIES } from "@/lib/types";
import { formatDate, getErrorMessage, isOverdue } from "@/lib/format";
import { Avatar, Badge, DemoBanner, PageHeader, QueryError, cardClass } from "@/app/components/ui";

export default function Home() {
  const { data: currentUser } = useGetAuthUserQuery({});
  const { data: projects = [], isError: projectsError, error: projectsErrorValue } =
    useGetProjectsQuery();
  const { data: tasks = [], isLoading, isError, error } = useGetTasksQuery();
  const { data: users = [] } = useGetUsersQuery();
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));
  const projectsById = Object.fromEntries(projects.map((project) => [project.id, project]));

  const open = tasks.filter((task) => task.status !== "Completed");
  const completed = tasks.filter((task) => task.status === "Completed");
  const overdue = tasks.filter((task) => isOverdue(task.dueDate, task.status));
  const mine = open.filter((task) => task.assignedUserId === currentUser?.userDetails?.id);
  const priorityData = PRIORITIES.map((priority) => ({
    name: priority,
    count: tasks.filter((task) => task.priority === priority).length,
  }));

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="NovaStack Studio"
        title={`Hello${currentUser?.userDetails?.username ? `, ${currentUser.userDetails.username.split(" ")[0]}` : ""}`}
        subtitle="Track projects, move issues across the board, and see what is due."
      />
      <QueryError
        message={
          isError || projectsError
            ? getErrorMessage(error || projectsErrorValue)
            : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Projects" value={projects.length} />
        <Stat label="Open issues" value={open.length} />
        <Stat label="Completed" value={completed.length} />
        <Stat label="Overdue" value={overdue.length} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <section className={`${cardClass} p-4`}>
          <h2 className="mb-4 text-sm font-semibold">Issues by priority</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1E8A9E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className={`${cardClass} p-4`}>
          <h2 className="mb-3 text-sm font-semibold">Assigned to you</h2>
          <div className="space-y-3">
            {mine.length === 0 && (
              <p className="text-sm text-slate-500">No open issues are assigned to this member.</p>
            )}
            {mine.slice(0, 5).map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}?task=${task.id}`}
                className="block rounded-xl border border-slate-100 px-3 py-2 hover:border-nova-300 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-nova-700 dark:text-nova-300">
                    {task.issueKey}
                  </span>
                  <Badge tone={task.priority}>{task.priority}</Badge>
                </div>
                <p className="mt-1 text-sm font-medium">{task.title}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className={`${cardClass} mt-4 overflow-x-auto`}>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-sm font-semibold">Recent issues</h2>
          {isLoading && <span className="text-xs text-slate-400">Loading...</span>}
        </div>
        <table className="min-w-full text-left text-sm">
          <tbody>
            {tasks.slice(0, 6).map((task) => {
              const assignee = usersById[task.assignedUserId];
              return (
                <tr key={task.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-nova-700 dark:text-nova-300">
                    <Link href={`/projects/${task.projectId}?task=${task.id}`}>{task.issueKey}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-500">{projectsById[task.projectId]?.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={task.status}>{task.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{formatDate(task.dueDate)}</td>
                  <td className="px-4 py-3">
                    {assignee && (
                      <span className="flex items-center gap-2">
                        <Avatar name={assignee.username} size="sm" />
                        {assignee.username}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className={`${cardClass} px-4 py-4`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
