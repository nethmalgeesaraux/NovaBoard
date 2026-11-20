"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetAuthUserQuery,
  useGetProjectsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useUpdateTaskMutation,
} from "@/state/api";
import type { Priority, Status, Task } from "@/lib/types";
import { PRIORITIES } from "@/lib/types";
import { formatDate, getErrorMessage } from "@/lib/format";
import {
  Avatar,
  Badge,
  Field,
  Modal,
  PageHeader,
  QueryError,
  cardClass,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/app/components/ui";
import { useCanEdit, useIsAdmin } from "@/app/use-admin";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  Flame,
  Kanban,
  Layers,
  ListTodo,
  Play,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
} from "lucide-react";
import TaskModal from "@/app/components/tasks/TaskModal";

export default function BacklogPage() {
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: tasks = [], isLoading: tasksLoading, isError, error } = useGetTasksQuery();
  const { data: users = [] } = useGetUsersQuery();
  const { data: currentUser } = useGetAuthUserQuery({});

  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const isAdmin = useIsAdmin();
  const canEdit = useCanEdit();

  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreatingBacklog, setIsCreatingBacklog] = useState(false);
  const [startSprintModalOpen, setStartSprintModalOpen] = useState(false);
  const [sprintName, setSprintName] = useState("Sprint 1");
  const [sprintDuration, setSprintDuration] = useState("2-weeks");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])),
    [projects],
  );
  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users],
  );

  // Filter tasks by selected project
  const filteredTasks = useMemo(() => {
    if (selectedProjectId === "all") return tasks;
    return tasks.filter((t) => t.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  // Tasks in planned/active sprint vs tasks in backlog
  // An issue is in the sprint if tags include 'sprint' and not 'backlog'
  const sprintTasks = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        t.tags?.toLowerCase().includes("sprint") &&
        !t.tags?.toLowerCase().includes("backlog") &&
        t.priority !== "Backlog",
    );
  }, [filteredTasks]);

  const backlogTasks = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        t.priority === "Backlog" ||
        t.tags?.toLowerCase().includes("backlog") ||
        (!t.tags?.toLowerCase().includes("sprint") && t.status === "To Do"),
    );
  }, [filteredTasks]);

  const sprintPoints = useMemo(
    () => sprintTasks.reduce((sum, t) => sum + (t.points || 0), 0),
    [sprintTasks],
  );
  const backlogPoints = useMemo(
    () => backlogTasks.reduce((sum, t) => sum + (t.points || 0), 0),
    [backlogTasks],
  );

  const isSprintActive = useMemo(
    () => sprintTasks.some((t) => t.tags?.includes("active-sprint")),
    [sprintTasks],
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Move task between sprint and backlog
  const handleMoveToSprint = async (task: Task) => {
    const newTags = task.tags ? `${task.tags} sprint:1` : "sprint:1";
    const newPriority = task.priority === "Backlog" ? "Medium" : task.priority;
    await updateTask({
      id: task.id,
      patch: {
        priority: newPriority,
        tags: newTags.replace("backlog", "").trim(),
      },
    });
    showToast(`Moved ${task.issueKey} to ${sprintName}`);
  };

  const handleMoveToBacklog = async (task: Task) => {
    await updateTask({
      id: task.id,
      patch: {
        priority: "Backlog",
        tags: "backlog",
      },
    });
    showToast(`Moved ${task.issueKey} to Backlog`);
  };

  // Start Sprint Action
  const handleStartSprint = async () => {
    if (sprintTasks.length === 0) {
      alert("Please add at least one issue to the sprint before starting!");
      return;
    }

    // Move all sprint tasks to To Do and tag them active-sprint
    for (const task of sprintTasks) {
      await updateTask({
        id: task.id,
        patch: {
          status: "To Do",
          priority: task.priority === "Backlog" ? "Medium" : task.priority,
          tags: `sprint:active ${sprintName}`,
        },
      });
    }

    setStartSprintModalOpen(false);
    showToast(
      `🚀 ${sprintName} started! ${sprintTasks.length} issues are now live in the project Kanban Board.`,
    );
  };

  // Complete Sprint Action
  const handleCompleteSprint = async () => {
    if (!window.confirm(`Complete ${sprintName}? Remaining open issues will return to backlog.`))
      return;

    for (const task of sprintTasks) {
      if (task.status !== "Completed") {
        await updateTask({
          id: task.id,
          patch: {
            priority: "Backlog",
            tags: "backlog",
          },
        });
      }
    }
    showToast(`Sprint completed! Incomplete issues moved back to backlog.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl dark:bg-nova-600 animate-in fade-in slide-in-from-bottom-3 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-nova-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        eyebrow="Agile Planning"
        title="Backlog & Sprint Planning"
        subtitle="Organize upcoming features, estimate story points, and start sprints to feed your engineering Kanban board."
        action={
          <div className="flex flex-wrap items-center gap-3">
            <select
              className={`${inputClass} w-auto`}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsCreatingBacklog(true)}
                className={`${primaryButton}`}
              >
                <Plus className="h-4 w-4" />
                <span>New Backlog Issue</span>
              </button>
            )}
          </div>
        }
      />

      <QueryError message={isError ? getErrorMessage(error) : undefined} />

      {/* 1. SPRINT CONTAINER */}
      <div className={`${cardClass} overflow-hidden border-nova-200/80 shadow-md`}>
        {/* Sprint Header */}
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-nova-600 p-2 text-white">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {sprintName}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isSprintActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-nova-50 text-nova-700 dark:bg-nova-950 dark:text-nova-300"
                  }`}
                >
                  {isSprintActive ? "● Active Sprint" : "Planned Sprint"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {sprintTasks.length} issues · {sprintPoints} story points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedProjectId !== "all" && (
              <Link
                href={`/projects/${selectedProjectId}`}
                className={`${secondaryButton} text-xs`}
              >
                <Kanban className="h-3.5 w-3.5 text-nova-600" />
                <span>Open Kanban Board</span>
              </Link>
            )}

            {isAdmin && (
              <>
                {!isSprintActive ? (
                  <button
                    type="button"
                    onClick={() => setStartSprintModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Start Sprint</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteSprint}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Complete Sprint</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sprint Issue List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sprintTasks.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Plan a sprint by dragging or moving issues from the backlog below.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Once ready, click "Start Sprint" to push all tasks to the developer Kanban board!
              </p>
            </div>
          ) : (
            sprintTasks.map((task) => {
              const assignee = usersById[task.assignedUserId];
              const project = projectsById[task.projectId];
              return (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-bold text-nova-600 dark:text-nova-400">
                      {task.issueKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-nova-600 text-left truncate max-w-md"
                    >
                      {task.title}
                    </button>
                    {project && (
                      <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {project.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={task.status}>{task.status}</Badge>
                    <Badge tone={task.priority}>{task.priority}</Badge>

                    <span className="rounded-full bg-nova-50 px-2 py-0.5 text-xs font-bold text-nova-700 dark:bg-nova-950 dark:text-nova-300">
                      {task.points ?? 0} pts
                    </span>

                    {assignee ? (
                      <Avatar name={assignee.username} size="sm" />
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleMoveToBacklog(task)}
                        title="Move to Backlog"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. BACKLOG CONTAINER */}
      <div className={`${cardClass} overflow-hidden shadow-xs`}>
        {/* Backlog Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 dark:border-slate-800 dark:bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Backlog ({backlogTasks.length} issues · {backlogPoints} pts)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Issues not yet committed to a sprint</span>
        </div>

        {/* Backlog Issue List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {backlogTasks.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">
              Your backlog is completely empty. Click "+ New Backlog Issue" to add new tasks.
            </div>
          ) : (
            backlogTasks.map((task) => {
              const assignee = usersById[task.assignedUserId];
              const project = projectsById[task.projectId];
              return (
                <div
                  key={task.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {task.issueKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingTask(task)}
                      className="text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-nova-600 text-left truncate max-w-md"
                    >
                      {task.title}
                    </button>
                    {project && (
                      <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {project.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge tone={task.priority}>{task.priority}</Badge>

                    <span className="text-xs font-semibold text-slate-500">
                      {task.points ? `${task.points} pts` : "—"}
                    </span>

                    {assignee ? (
                      <Avatar name={assignee.username} size="sm" />
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => handleMoveToSprint(task)}
                        className="inline-flex items-center gap-1 rounded-lg border border-nova-200 bg-nova-50 px-2.5 py-1 text-xs font-semibold text-nova-700 hover:bg-nova-100 dark:border-nova-800 dark:bg-nova-950 dark:text-nova-300 transition"
                      >
                        <ArrowUp className="h-3 w-3" />
                        <span>To Sprint</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm(`Delete ${task.issueKey}?`)) return;
                          await deleteTask(task.id);
                          showToast(`Deleted ${task.issueKey}`);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* START SPRINT CONFIRMATION MODAL */}
      <Modal
        open={startSprintModalOpen}
        title={`Start ${sprintName}`}
        onClose={() => setStartSprintModalOpen(false)}
      >
        <div className="space-y-4 text-sm">
          <p className="text-slate-600 dark:text-slate-300">
            Starting this sprint will activate <strong>{sprintTasks.length} issues</strong> (
            <strong>{sprintPoints} story points</strong>).
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="font-bold">What happens next:</span> All tasks in this sprint will move to{" "}
            <strong>"To Do"</strong> status on the active Kanban board so developers can begin working on them!
          </div>

          <Field label="Sprint Name">
            <input
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              className={inputClass}
              required
            />
          </Field>

          <Field label="Duration">
            <select
              value={sprintDuration}
              onChange={(e) => setSprintDuration(e.target.value)}
              className={inputClass}
            >
              <option value="1-week">1 Week</option>
              <option value="2-weeks">2 Weeks (Recommended)</option>
              <option value="3-weeks">3 Weeks</option>
              <option value="4-weeks">4 Weeks</option>
            </select>
          </Field>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStartSprintModalOpen(false)}
              className={secondaryButton}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartSprint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 transition"
            >
              <Rocket className="h-4 w-4" />
              <span>Start Sprint Now</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* CREATE BACKLOG ISSUE MODAL */}
      <Modal
        open={isCreatingBacklog}
        title="Create Backlog Issue"
        onClose={() => setIsCreatingBacklog(false)}
      >
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const projectId = String(form.get("projectId") || projects[0]?.id || "");
            const title = String(form.get("title") || "").trim();
            if (!projectId || !title) return;

            const target = String(form.get("target") || "backlog");
            const pointsVal = form.get("points");
            const points = pointsVal ? Number(pointsVal) : null;

            await createTask({
              projectId,
              title,
              description: String(form.get("description") || ""),
              status: "To Do",
              priority: (form.get("priority") as Priority) || "Medium",
              tags: target === "sprint" ? "sprint:1" : "backlog",
              startDate: "",
              dueDate: String(form.get("dueDate") || ""),
              points,
              authorUserId: currentUser?.userDetails?.id || "",
              assignedUserId: String(form.get("assignedUserId") || ""),
            }).unwrap();

            setIsCreatingBacklog(false);
            showToast(`Created new issue in ${target === "sprint" ? sprintName : "Backlog"}!`);
          }}
        >
          <Field label="Project">
            <select
              name="projectId"
              className={inputClass}
              defaultValue={selectedProjectId !== "all" ? selectedProjectId : projects[0]?.id}
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Issue Title">
            <input
              name="title"
              className={inputClass}
              required
              placeholder="e.g. Implement user authentication flows"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              rows={3}
              className={inputClass}
              placeholder="Detailed specifications or acceptance criteria..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Priority">
              <select name="priority" className={inputClass} defaultValue="Medium">
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Story Points">
              <select name="points" className={inputClass} defaultValue="3">
                <option value="1">1 pt (Very Easy)</option>
                <option value="2">2 pts (Easy)</option>
                <option value="3">3 pts (Medium)</option>
                <option value="5">5 pts (Complex)</option>
                <option value="8">8 pts (Very Complex)</option>
                <option value="13">13 pts (Epic Task)</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Assign Developer">
              <select name="assignedUserId" className={inputClass} defaultValue="">
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Destination">
              <select name="target" className={inputClass} defaultValue="backlog">
                <option value="backlog">Backlog</option>
                <option value="sprint">{sprintName} (Sprint)</option>
              </select>
            </Field>
          </div>

          <Field label="Due Date">
            <input name="dueDate" type="date" className={inputClass} />
          </Field>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreatingBacklog(false)}
              className={secondaryButton}
            >
              Cancel
            </button>
            <button type="submit" disabled={creatingTask} className={primaryButton}>
              {creatingTask ? "Creating..." : "Add to Backlog"}
            </button>
          </div>
        </form>
      </Modal>

      {/* TASK EDIT MODAL */}
      {editingTask && (
        <TaskModal
          open={Boolean(editingTask)}
          title={editingTask.issueKey}
          projects={projects}
          users={users}
          initial={editingTask}
          readOnly={!canEdit}
          submitLabel="Save Changes"
          onClose={() => setEditingTask(null)}
          onSubmit={async (input) => {
            await updateTask({
              id: editingTask.id,
              patch: input,
            }).unwrap();
            setEditingTask(null);
            showToast(`Updated ${editingTask.issueKey}`);
          }}
          onDelete={
            isAdmin
              ? async () => {
                  await deleteTask(editingTask.id).unwrap();
                  setEditingTask(null);
                  showToast(`Deleted issue`);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}

