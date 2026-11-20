"use client";

import { STATUSES, type Status, type Task, type User } from "@/lib/types";
import { formatDate, isOverdue } from "@/lib/format";
import { Avatar, Badge } from "@/app/components/ui";

export default function ListView({
  tasks,
  users,
  onOpen,
  onStatus,
  canEdit = true,
}: {
  tasks: Task[];
  users: User[];
  onOpen: (task: Task) => void;
  onStatus: (id: string, status: Status) => void;
  canEdit?: boolean;
}) {
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-dark-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
          <tr>
            <th className="px-4 py-3 font-medium">Key</th>
            <th className="px-4 py-3 font-medium">Issue</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Assignee</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="px-4 py-3 font-medium">Points</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignee = usersById[task.assignedUserId];
            return (
              <tr key={task.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <td className="px-4 py-3 font-semibold text-nova-700 dark:text-nova-300">
                  <button type="button" onClick={() => onOpen(task)}>
                    {task.issueKey}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button type="button" className="text-left font-medium" onClick={() => onOpen(task)}>
                    {task.title}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {canEdit ? (
                    <select
                      className="rounded-lg border border-slate-200 bg-transparent px-2 py-1 dark:border-slate-700"
                      value={task.status}
                      onChange={(event) => onStatus(task.id, event.target.value as Status)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    task.status
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={task.priority}>{task.priority}</Badge>
                </td>
                <td className="px-4 py-3">
                  {assignee ? (
                    <span className="flex items-center gap-2">
                      <Avatar name={assignee.username} size="sm" />
                      {assignee.username}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td
                  className={`px-4 py-3 ${
                    isOverdue(task.dueDate, task.status) ? "font-medium text-rose-600" : ""
                  }`}
                >
                  {formatDate(task.dueDate)}
                </td>
                <td className="px-4 py-3">{task.points ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tasks.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-slate-500">No issues match this view.</p>
      )}
    </div>
  );
}
