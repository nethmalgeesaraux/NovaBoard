import { format, isValid, parseISO } from "date-fns";
import type { TaskComment } from "./types";

export function parseTaskData(rawDescription: string): {
  description: string;
  comments: TaskComment[];
} {
  if (!rawDescription) return { description: "", comments: [] };
  const trimmed = rawDescription.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if ("body" in parsed || "comments" in parsed) {
        return {
          description: typeof parsed.body === "string" ? parsed.body : "",
          comments: Array.isArray(parsed.comments) ? parsed.comments : [],
        };
      }
    } catch {}
  }
  return { description: rawDescription, comments: [] };
}

export function serializeTaskData(description: string, comments: TaskComment[]): string {
  if (!comments || comments.length === 0) {
    return description;
  }
  return JSON.stringify({
    body: description,
    comments,
  });
}

export function formatDate(value?: string) {
  if (!value) return "—";
  const date = parseISO(value);
  if (!isValid(date)) return value;
  return format(date, "dd MMM yyyy");
}

export function isOverdue(dueDate: string, status: string) {
  if (!dueDate || status === "Completed") return false;
  const due = parseISO(dueDate);
  if (!isValid(due)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

export function initials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "error" in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === "string" && value) return value;
  }
  if (error && typeof error === "object" && "data" in error) {
    const value = (error as { data?: unknown }).data;
    if (typeof value === "string" && value) return value;
  }
  return "Something went wrong";
}

export function nextIssueKey(
  projectName: string,
  tasks: { issueKey: string; projectId: string }[],
  projectId: string,
) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const previous = projectTasks[0]?.issueKey.split("-")[0];
  const prefix =
    previous ||
    projectName
      .split(/\s+/)
      .map((word) => word[0] ?? "")
      .join("")
      .slice(0, 3)
      .toUpperCase() ||
    "NS";
  const numbers = projectTasks
    .map((task) => Number(task.issueKey.split("-")[1]))
    .filter((value) => Number.isFinite(value));
  const next = (numbers.length ? Math.max(...numbers) : 100) + 1;
  return `${prefix}-${next}`;
}
