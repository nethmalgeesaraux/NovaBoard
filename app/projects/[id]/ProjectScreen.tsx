"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  useDeleteProjectMutation,
  useDeleteTaskMutation,
  useGetProjectQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import type { Status, Task } from "@/lib/types";
import { formatDate, getErrorMessage } from "@/lib/format";
import { PageHeader, QueryError, dangerButton, inputClass, secondaryButton } from "@/app/components/ui";
import BoardView from "@/app/components/tasks/BoardView";
import ListView from "@/app/components/tasks/ListView";
import TaskModal from "@/app/components/tasks/TaskModal";
import { useCanEdit, useIsAdmin } from "@/app/use-admin";

export default function ProjectScreen() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.id;
  const [view, setView] = useState<"board" | "list">("board");
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: project, isLoading, isError, error } = useGetProjectQuery(projectId);
  const { data: tasks = [] } = useGetTasksQuery({ projectId });
  const { data: users = [] } = useGetUsersQuery();
  const { data: currentUser } = useGetAuthUserQuery({});
  const [updateTask] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const isAdmin = useIsAdmin();
  const canEdit = useCanEdit();

  const taskId = searchParams.get("task");
  const editing = tasks.find((task) => task.id === taskId) ?? null;

  const visible = useMemo(() => {
    const query = text.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesText =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.issueKey.toLowerCase().includes(query);
      const matchesAssignee = !assignee || task.assignedUserId === assignee;
      return matchesText && matchesAssignee;
    });
  }, [assignee, tasks, text]);

  const openTask = (task: Task) => {
    router.replace(`/projects/${projectId}?task=${task.id}`, { scroll: false });
  };

  const closeTask = () => {
    setCreating(false);
    router.replace(`/projects/${projectId}`, { scroll: false });
  };

  const moveTask = async (id: string, status: Status) => {
    const task = tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;
    await updateTask({ id, patch: { status } });
  };

  if (isLoading) return <p className="text-sm text-slate-500">Loading project...</p>;
  if (isError) return <QueryError message={getErrorMessage(error)} />;
  if (!project) return <QueryError message="This project does not exist." />;

  return (
    <div>
      <PageHeader
        eyebrow="Project"
        title={project.name}
        subtitle={`${project.description} · ${formatDate(project.startDate)} – ${formatDate(project.endDate)}`}
        action={
          <div className="flex gap-2">
            <button className={secondaryButton} type="button" onClick={() => setView(view === "board" ? "list" : "board")}>
              {view === "board" ? "List" : "Board"}
            </button>
            {canEdit && (
              <button className="rounded-lg bg-nova-600 px-3 py-2 text-sm font-semibold text-white hover:bg-nova-700" type="button" onClick={() => setCreating(true)}>
                New issue
              </button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder="Filter by title or key"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <select
          className={`${inputClass} max-w-xs`}
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
        >
          <option value="">All assignees</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {view === "board" ? (
        <BoardView tasks={visible} users={users} onOpen={openTask} onMove={moveTask} canDrag={canEdit} />
      ) : (
        <ListView tasks={visible} users={users} onOpen={openTask} onStatus={moveTask} canEdit={canEdit} />
      )}

      {isAdmin && (
      <div className="mt-8">
        <button
          className={dangerButton}
          type="button"
          onClick={async () => {
            if (!window.confirm(`Delete ${project.name} and its issues?`)) return;
            await deleteProject(projectId);
            router.push("/projects");
          }}
        >
          Delete project
        </button>
      </div>
      )}

      <TaskModal
        open={creating || Boolean(editing)}
        title={editing ? editing.issueKey : "New issue"}
        projects={project ? [project] : []}
        users={users}
        initial={
          editing ?? {
            projectId,
            authorUserId: currentUser?.userDetails?.id,
            status: "To Do",
            priority: "Medium",
          }
        }
        lockProjectId={projectId}
        readOnly={!canEdit}
        submitLabel={editing ? "Save issue" : "Create issue"}
        onClose={closeTask}
        onSubmit={async (input) => {
          if (editing) {
            await updateTask({
              id: editing.id,
              patch: input,
            }).unwrap();
            return;
          }
          await createTask({
            ...input,
            authorUserId: currentUser?.userDetails?.id || input.authorUserId,
          }).unwrap();
        }}
        onDelete={
          editing && isAdmin
            ? async () => {
                await deleteTask(editing.id).unwrap();
              }
            : undefined
        }
      />
    </div>
  );
}
