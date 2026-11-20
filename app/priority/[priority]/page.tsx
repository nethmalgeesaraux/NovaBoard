"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetProjectsQuery, useGetTasksQuery, useGetUsersQuery } from "@/state/api";
import { PRIORITIES, type Priority } from "@/lib/types";
import { formatDate, getErrorMessage } from "@/lib/format";
import { Avatar, Badge, EmptyState, PageHeader, QueryError } from "@/app/components/ui";

const priorityFromParam = (value: string): Priority | null => {
  return PRIORITIES.find((priority) => priority.toLowerCase() === value.toLowerCase()) ?? null;
};

export default function PriorityPage() {
  const params = useParams<{ priority: string }>();
  const priority = priorityFromParam(params.priority);
  const { data: tasks = [], isError, error, isLoading } = useGetTasksQuery(
    priority ? { priority } : undefined,
    { skip: !priority },
  );
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const projectsById = Object.fromEntries(projects.map((project) => [project.id, project]));
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

  if (!priority) {
    return <QueryError message="That priority does not exist." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Priority"
        title={priority}
        subtitle="Every open and finished issue filed at this priority."
      />
      <QueryError message={isError ? getErrorMessage(error) : undefined} />
      {isLoading && <p className="text-sm text-slate-500">Loading issues...</p>}
      {!isLoading && tasks.length === 0 && (
        <EmptyState title="Nothing here" body={`No ${priority.toLowerCase()} issues yet.`} />
      )}
      <div className="grid gap-3">
        {tasks.map((task) => {
          const assignee = usersById[task.assignedUserId];
          return (
            <Link
              key={task.id}
              href={`/projects/${task.projectId}?task=${task.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-dark-900"
            >
              <div>
                <p className="text-xs font-semibold text-nova-700 dark:text-nova-300">
                  {task.issueKey} · {projectsById[task.projectId]?.name}
                </p>
                <p className="mt-1 font-medium">{task.title}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Badge tone={task.status}>{task.status}</Badge>
                <span>{formatDate(task.dueDate)}</span>
                {assignee && <Avatar name={assignee.username} size="sm" />}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
