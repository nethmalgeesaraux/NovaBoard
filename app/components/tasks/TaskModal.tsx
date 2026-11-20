"use client";

import { useState } from "react";
import { PRIORITIES, STATUSES, type Project, type Task, type TaskInput, type User } from "@/lib/types";
import { getErrorMessage } from "@/lib/format";
import { Field, Modal, dangerButton, inputClass, primaryButton, secondaryButton } from "@/app/components/ui";

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
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (!open) return null;

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const pointsValue = String(form.get("points") ?? "").trim();
          const input: TaskInput = {
            title: String(form.get("title") ?? ""),
            description: String(form.get("description") ?? ""),
            status: String(form.get("status") ?? "To Do") as TaskInput["status"],
            priority: String(form.get("priority") ?? "Medium") as TaskInput["priority"],
            tags: String(form.get("tags") ?? ""),
            startDate: String(form.get("startDate") ?? ""),
            dueDate: String(form.get("dueDate") ?? ""),
            points: pointsValue ? Number(pointsValue) : null,
            projectId: lockProjectId || String(form.get("projectId") ?? ""),
            authorUserId: initial?.authorUserId || users[0]?.id || "",
            assignedUserId: String(form.get("assignedUserId") ?? ""),
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
        {initial?.issueKey && (
          <p className="text-sm font-semibold text-nova-700 dark:text-nova-300">{initial.issueKey}</p>
        )}
        <Field label="Title">
          <input name="title" className={inputClass} defaultValue={initial?.title ?? ""} required disabled={readOnly} />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            rows={4}
            className={inputClass}
            defaultValue={initial?.description ?? ""}
            disabled={readOnly}
          />
        </Field>
        {!lockProjectId && (
          <Field label="Project">
            <select name="projectId" className={inputClass} defaultValue={initial?.projectId ?? projects[0]?.id} disabled={readOnly}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Status">
            <select name="status" className={inputClass} defaultValue={initial?.status ?? "To Do"} disabled={readOnly}>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </Field>
          <Field label="Priority">
            <select name="priority" className={inputClass} defaultValue={initial?.priority ?? "Medium"} disabled={readOnly}>
              {PRIORITIES.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </Field>
          <Field label="Assignee">
            <select
              name="assignedUserId"
              className={inputClass}
              defaultValue={initial?.assignedUserId ?? ""}
              disabled={readOnly}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags">
            <input name="tags" className={inputClass} defaultValue={initial?.tags ?? ""} placeholder="Design, Bug" disabled={readOnly} />
          </Field>
          <Field label="Start">
            <input name="startDate" type="date" className={inputClass} defaultValue={initial?.startDate ?? ""} disabled={readOnly} />
          </Field>
          <Field label="Due">
            <input name="dueDate" type="date" className={inputClass} defaultValue={initial?.dueDate ?? ""} disabled={readOnly} />
          </Field>
          <Field label="Story points">
            <input
              name="points"
              type="number"
              min={0}
              className={inputClass}
              defaultValue={initial?.points ?? ""}
              disabled={readOnly}
            />
          </Field>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {readOnly ? (
            <button className={secondaryButton} type="button" onClick={onClose}>
              Close
            </button>
          ) : onDelete ? (
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
                } catch (deleteError) {
                  setError(getErrorMessage(deleteError));
                } finally {
                  setPending(false);
                }
              }}
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          {!readOnly && (
          <button className={primaryButton} disabled={pending} type="submit">
            {pending ? "Saving..." : submitLabel}
          </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
