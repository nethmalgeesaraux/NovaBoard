"use client";

import { useMemo, useState } from "react";
import {
  PRIORITIES,
  STATUSES,
  type Project,
  type Task,
  type TaskComment,
  type TaskInput,
  type User,
} from "@/lib/types";
import { formatDate, getErrorMessage, parseTaskData, serializeTaskData } from "@/lib/format";
import {
  Avatar,
  Badge,
  Field,
  Modal,
  dangerButton,
  inputClass,
  primaryButton,
  secondaryButton,
} from "@/app/components/ui";
import { useGetAuthUserQuery } from "@/state/api";
import { useIsAdmin } from "@/app/use-admin";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MessageSquare,
  Send,
  Shield,
  Tag,
  User as UserIcon,
} from "lucide-react";

type TaskModalProps = {
  open: boolean;
  title: string;
  projects: Project[];
  users: User[];
  initial?: Partial<Task>;
  lockProjectId?: string;
  submitLabel: string;
  readOnly?: boolean;
  onClose: () => void;
  onSubmit: (input: TaskInput) => Promise<void>;
  onDelete?: () => Promise<void>;
};

export default function TaskModal({
  open,
  title,
  projects,
  users,
  initial,
  lockProjectId,
  submitLabel,
  readOnly = false,
  onClose,
  onSubmit,
  onDelete,
}: TaskModalProps) {
  const { data: authData } = useGetAuthUserQuery({});
  const isAdmin = useIsAdmin();

  // Parse initial description and existing comments
  const parsedData = useMemo(() => {
    return parseTaskData(initial?.description ?? "");
  }, [initial?.description]);

  const [descriptionBody, setDescriptionBody] = useState(parsedData.description);
  const [comments, setComments] = useState<TaskComment[]>(parsedData.comments);
  const [newCommentText, setNewCommentText] = useState("");
  const [currentStatus, setCurrentStatus] = useState(initial?.status ?? "To Do");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [commentPending, setCommentPending] = useState(false);

  const usersById = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users],
  );
  const project = projects.find(
    (p) => p.id === (lockProjectId || initial?.projectId || projects[0]?.id),
  );

  if (!open) return null;

  // Add Comment handler (both Admin and Developers can comment)
  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    const authorUser = authData?.userDetails;
    const newComment: TaskComment = {
      id: crypto.randomUUID(),
      authorId: authorUser?.id || "unknown",
      authorName: authorUser?.username || "NovaStack Member",
      authorRole: authorUser?.role || "developer",
      content: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewCommentText("");

    // If existing task, save immediately
    if (initial?.id) {
      setCommentPending(true);
      try {
        const serialized = serializeTaskData(descriptionBody, updatedComments);
        await onSubmit({
          title: initial.title || "Untitled",
          description: serialized,
          status: currentStatus as TaskInput["status"],
          priority: (initial.priority as TaskInput["priority"]) || "Medium",
          tags: initial.tags || "",
          startDate: initial.startDate || "",
          dueDate: initial.dueDate || "",
          points: initial.points ?? null,
          projectId: lockProjectId || initial.projectId || projects[0]?.id || "",
          authorUserId: initial.authorUserId || "",
          assignedUserId: initial.assignedUserId || "",
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setCommentPending(false);
      }
    }
  };

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        className="space-y-4 text-sm"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const pointsValue = String(form.get("points") ?? initial?.points ?? "").trim();

          const serializedDescription = serializeTaskData(
            isAdmin ? descriptionBody : parsedData.description,
            comments,
          );

          const input: TaskInput = {
            title: isAdmin
              ? String(form.get("title") ?? initial?.title ?? "")
              : initial?.title || "",
            description: serializedDescription,
            status: (form.get("status") || currentStatus) as TaskInput["status"],
            priority: isAdmin
              ? ((form.get("priority") || initial?.priority || "Medium") as TaskInput["priority"])
              : ((initial?.priority || "Medium") as TaskInput["priority"]),
            tags: isAdmin ? String(form.get("tags") ?? initial?.tags ?? "") : initial?.tags || "",
            startDate: isAdmin
              ? String(form.get("startDate") ?? initial?.startDate ?? "")
              : initial?.startDate || "",
            dueDate: isAdmin
              ? String(form.get("dueDate") ?? initial?.dueDate ?? "")
              : initial?.dueDate || "",
            points: pointsValue ? Number(pointsValue) : null,
            projectId: lockProjectId || String(form.get("projectId") ?? initial?.projectId ?? ""),
            authorUserId: initial?.authorUserId || users[0]?.id || "",
            assignedUserId: isAdmin
              ? String(form.get("assignedUserId") ?? initial?.assignedUserId ?? "")
              : initial?.assignedUserId || "",
          };

          if (!input.title.trim() || !input.projectId) {
            setError("Title and project are required.");
            return;
          }

          setPending(true);
          setError("");
          try {
            await onSubmit(input);
            onClose();
          } catch (submitError) {
            setError(getErrorMessage(submitError));
          } finally {
            setPending(false);
          }
        }}
      >
        {/* Issue Key & Project info */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-nova-600 dark:text-nova-400">
              {initial?.issueKey || "NEW ISSUE"}
            </span>
            {project && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {project.name}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {isAdmin ? "Admin Editor" : "Developer View & Comments"}
          </span>
        </div>

        {/* 1. Core Issue Fields:
            - If Admin: fully editable inputs
            - If Developer: read-only Jira-style details panel! */}
        {isAdmin ? (
          <div className="space-y-3">
            <Field label="Issue Title">
              <input
                name="title"
                className={inputClass}
                defaultValue={initial?.title ?? ""}
                required
                placeholder="e.g. Implement user authentication"
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                className={inputClass}
                value={descriptionBody}
                onChange={(e) => setDescriptionBody(e.target.value)}
                placeholder="Describe acceptance criteria or specs..."
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <select
                  name="status"
                  className={inputClass}
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as any)}
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  name="priority"
                  className={inputClass}
                  defaultValue={initial?.priority ?? "Medium"}
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority}>{priority}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Assignee">
                <select
                  name="assignedUserId"
                  className={inputClass}
                  defaultValue={initial?.assignedUserId ?? ""}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Story Points">
                <input
                  name="points"
                  type="number"
                  min={0}
                  className={inputClass}
                  defaultValue={initial?.points ?? ""}
                  placeholder="e.g. 3"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Due Date">
                <input
                  name="dueDate"
                  type="date"
                  className={inputClass}
                  defaultValue={initial?.dueDate ?? ""}
                />
              </Field>

              <Field label="Tags">
                <input
                  name="tags"
                  className={inputClass}
                  defaultValue={initial?.tags ?? ""}
                  placeholder="Backend, API, Urgent"
                />
              </Field>
            </div>
          </div>
        ) : (
          /* DEVELOPER VIEW: Read-Only details (cannot edit title, points, etc.) */
          <div className="space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {initial?.title || "Untitled Issue"}
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800">
                {parsedData.description || "No description provided."}
              </p>
            </div>

            {/* Read-Only Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Priority</span>
                <div className="mt-1">
                  <Badge tone={initial?.priority}>{initial?.priority || "Medium"}</Badge>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Story Points</span>
                <span className="mt-1 inline-block font-mono font-bold text-nova-600 dark:text-nova-400">
                  {initial?.points ? `${initial.points} pts` : "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Assignee</span>
                <div className="mt-1 flex items-center gap-1.5">
                  {initial?.assignedUserId && usersById[initial.assignedUserId] ? (
                    <>
                      <Avatar name={usersById[initial.assignedUserId].username} size="sm" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {usersById[initial.assignedUserId].username}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 italic">Unassigned</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Due Date</span>
                <span className="mt-1 inline-block text-slate-700 dark:text-slate-300">
                  {formatDate(initial?.dueDate)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Tags</span>
                <span className="mt-1 inline-block text-slate-700 dark:text-slate-300">
                  {initial?.tags || "None"}
                </span>
              </div>

              {/* Developer CAN update status to move card forward */}
              <div>
                <span className="text-slate-400 block font-medium">Current Status</span>
                <select
                  name="status"
                  className="mt-1 w-full rounded-lg border border-nova-300 bg-white px-2 py-1 text-xs font-semibold text-nova-800 dark:border-nova-700 dark:bg-slate-900 dark:text-nova-200"
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value as any)}
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2. JIRA-STYLE ACTIVITY & COMMENTS SECTION */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-nova-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Activity & Comments ({comments.length})
            </h4>
          </div>

          {/* Comment Stream */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-3">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No comments yet. Both Admin and Developers can post comments here.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Avatar name={comment.authorName} size="sm" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {comment.authorName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-semibold ${
                          comment.authorRole === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-nova-50 text-nova-700 dark:bg-nova-950 dark:text-nova-300"
                        }`}
                      >
                        {comment.authorRole === "admin" ? "Admin" : "Developer"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 pl-8 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input Box */}
          <div className="flex items-end gap-2">
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write a comment or ask for updates..."
              rows={2}
              className={`${inputClass} text-xs`}
            />
            <button
              type="button"
              disabled={commentPending || !newCommentText.trim()}
              onClick={handleAddComment}
              className="inline-flex items-center gap-1.5 rounded-xl bg-nova-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-nova-700 disabled:opacity-50 transition shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{commentPending ? "Posting..." : "Comment"}</span>
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          {onDelete && isAdmin ? (
            <button
              type="button"
              className={dangerButton}
              disabled={pending}
              onClick={async () => {
                if (!window.confirm("Delete this issue?")) return;
                setPending(true);
                try {
                  await onDelete();
                  onClose();
                } catch (err) {
                  setError(getErrorMessage(err));
                } finally {
                  setPending(false);
                }
              }}
            >
              Delete Issue
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button className={secondaryButton} type="button" onClick={onClose}>
              {isAdmin ? "Cancel" : "Close"}
            </button>
            <button className={primaryButton} disabled={pending} type="submit">
              {pending ? "Saving..." : isAdmin ? submitLabel : "Save Status"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
