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
import type { Priority, Status, Task } from "@/lib/types";
import { formatDate, getErrorMessage } from "@/lib/format";
import {
  Badge,
  PageHeader,
  QueryError,
  dangerButton,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/app/components/ui";
import BoardView from "@/app/components/tasks/BoardView";
import ListView from "@/app/components/tasks/ListView";
import TaskModal from "@/app/components/tasks/TaskModal";
import { useCanEdit, useIsAdmin } from "@/app/use-admin";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Kanban,
  Layers,
  List,
  ListTodo,
  Play,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Avatar } from "@/app/components/ui";

export default function ProjectScreen() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.id;
  const [view, setView] = useState<"board" | "list" | "backlog">("board");
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [creating, setCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users],
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active board tasks (exclude backlog-only tasks)
  const activeTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.priority !== "Backlog" &&
        !task.tags?.toLowerCase().includes("backlog"),
    );
  }, [tasks]);

  // Backlog tasks for this project
  const backlogTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.priority === "Backlog" ||
        task.tags?.toLowerCase().includes("backlog"),
    );
  }, [tasks]);

  const visible = useMemo(() => {
    const query = text.trim().toLowerCase();
    const listToFilter = view === "backlog" ? backlogTasks : activeTasks;
    return listToFilter.filter((task) => {
      const matchesText =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.issueKey.toLowerCase().includes(query);
      const matchesAssignee = !assignee || task.assignedUserId === assignee;
      return matchesText && matchesAssignee;
    });
  }, [activeTasks, assignee, backlogTasks, text, view]);

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

  // Start Sprint action for this project
  const handleStartSprint = async () => {
    if (backlogTasks.length === 0) {
      alert("No backlog issues found to start a sprint!");
      return;
    }

    for (const task of backlogTasks) {
      await updateTask({
        id: task.id,
        patch: {
          status: "To Do",
          priority: task.priority === "Backlog" ? "Medium" : task.priority,
          tags: "sprint:active",
        },
      });
    }

    showToast(`🚀 Sprint Started! ${backlogTasks.length} issues moved to To Do board.`);
    setView("board");
  };

  if (isLoading) return <p className="text-sm text-slate-500">Loading project...</p>;
  if (isError) return <QueryError message={getErrorMessage(error)} />;
  if (!project) return <QueryError message="This project does not exist." />;

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-nova-600 animate-in fade-in flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-nova-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      <PageHeader
        eyebrow="Project Hub"
        title={project.name}
        subtitle={`${project.description || "Active workspace"} · ${formatDate(project.startDate)} – ${formatDate(project.endDate)}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 text-xs font-semibold">
              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  view === "board"
                    ? "bg-nova-600 text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                type="button"
                onClick={() => setView("board")}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Kanban Board</span>
              </button>

              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  view === "list"
                    ? "bg-nova-600 text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                type="button"
                onClick={() => setView("list")}
              >
                <List className="h-3.5 w-3.5" />
                <span>List View</span>
              </button>

              <button
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                  view === "backlog"
                    ? "bg-nova-600 text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                type="button"
                onClick={() => setView("backlog")}
              >
                <ListTodo className="h-3.5 w-3.5" />
                <span>Backlog ({backlogTasks.length})</span>
              </button>
            </div>

            {canEdit && (
              <button
                className="inline-flex items-center gap-1.5 rounded-xl bg-nova-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-nova-700 transition"
                type="button"
                onClick={() => setCreating(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Issue</span>
              </button>
            )}
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2.5">
          <input
            className={`${inputClass} max-w-xs text-xs`}
            placeholder="Filter issues by title or key..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <select
            className={`${inputClass} max-w-xs text-xs`}
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

        {view === "backlog" && isAdmin && (
          <button
            type="button"
            onClick={handleStartSprint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Start Sprint (Push to Board)</span>
          </button>
        )}
      </div>

      {/* VIEW SWITCHER */}
      {view === "board" && (
        <BoardView tasks={visible} users={users} onOpen={openTask} onMove={moveTask} canDrag={canEdit} />
      )}

      {view === "list" && (
        <ListView tasks={visible} users={users} onOpen={openTask} onStatus={moveTask} canEdit={canEdit} />
      )}

      {view === "backlog" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Project Backlog ({backlogTasks.length} issues)
                </h3>
                <p className="text-xs text-slate-500">
                  Issues planned for future sprints. Click "Start Sprint" to push all backlog issues to the To Do board.
                </p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleStartSprint}
                  disabled={backlogTasks.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Start Sprint</span>
                </button>
              )}
            </div>

            {backlogTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No backlog issues for this project yet. Click "New Issue" and set Priority to Backlog.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {backlogTasks.map((task) => {
                  const assign = usersById[task.assignedUserId];
                  return (
                    <div
                      key={task.id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 px-3 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-nova-600">
                          {task.issueKey}
                        </span>
                        <button
                          type="button"
                          onClick={() => openTask(task)}
                          className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-nova-600 text-left"
                        >
                          {task.title}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge tone={task.priority}>{task.priority}</Badge>
                        <span className="text-xs text-slate-500 font-semibold">
                          {task.points ? `${task.points} pts` : "—"}
                        </span>
                        {assign ? (
                          <Avatar name={assign.username} size="sm" />
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                        )}
                        {canEdit && (
                          <button
                            type="button"
                            onClick={async () => {
                              await updateTask({
                                id: task.id,
                                patch: {
                                  status: "To Do",
                                  priority: task.priority === "Backlog" ? "Medium" : task.priority,
                                  tags: "sprint:active",
                                },
                              });
                              showToast(`Pushed ${task.issueKey} to Kanban Board!`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-nova-50 px-2.5 py-1 text-xs font-semibold text-nova-700 hover:bg-nova-100 dark:bg-nova-950 dark:text-nova-300 transition"
                          >
                            <ArrowUp className="h-3 w-3" />
                            <span>Push to Board</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="pt-6">
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

      {/* Task Modal (Used for creating new issues or editing existing ones) */}
      <TaskModal
        open={creating || Boolean(editing)}
        title={editing ? editing.issueKey : "New Issue"}
        projects={project ? [project] : []}
        users={users}
        initial={
          editing ?? {
            projectId,
            authorUserId: currentUser?.userDetails?.id,
            status: "To Do",
            priority: view === "backlog" ? "Backlog" : "Medium",
            tags: view === "backlog" ? "backlog" : "",
          }
        }
        lockProjectId={projectId}
        readOnly={!canEdit}
        submitLabel={editing ? "Save Changes" : "Create Issue"}
        onClose={closeTask}
        onSubmit={async (input) => {
          if (editing) {
            await updateTask({
              id: editing.id,
              patch: input,
            }).unwrap();
            showToast(`Updated ${editing.issueKey}`);
            return;
          }
          await createTask({
            ...input,
            authorUserId: currentUser?.userDetails?.id || input.authorUserId,
          }).unwrap();
          showToast(`Issue created successfully!`);
        }}
        onDelete={
          editing && isAdmin
            ? async () => {
                await deleteTask(editing.id).unwrap();
                showToast(`Deleted issue`);
              }
            : undefined
        }
      />
    </div>
  );
}
