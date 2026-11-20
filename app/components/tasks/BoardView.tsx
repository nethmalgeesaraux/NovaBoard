"use client";

import { useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { STATUSES, type Status, type Task, type User } from "@/lib/types";
import { formatDate, isOverdue } from "@/lib/format";
import { Avatar, Badge } from "@/app/components/ui";

const TASK_TYPE = "TASK";

function TaskCard({
  task,
  assignee,
  onOpen,
  canDrag,
}: {
  task: Task;
  assignee?: User;
  onOpen: (task: Task) => void;
  canDrag: boolean;
}) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: TASK_TYPE,
      item: { id: task.id },
      canDrag,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [canDrag, task.id],
  );

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      drag(node);
    },
    [drag],
  );

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-dark-950 ${
        canDrag ? "cursor-grab active:cursor-grabbing" : ""
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <button className="w-full text-left" onClick={() => onOpen(task)} type="button">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-nova-700 dark:text-nova-300">{task.issueKey}</span>
          <Badge tone={task.priority}>{task.priority}</Badge>
        </div>
        <p className="text-sm font-medium text-slate-dark-800 dark:text-white">{task.title}</p>
        {task.tags && (
          <p className="mt-2 text-xs text-slate-500">{task.tags}</p>
        )}
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className={isOverdue(task.dueDate, task.status) ? "font-medium text-rose-600" : ""}>
            {task.dueDate ? formatDate(task.dueDate) : "No due date"}
          </span>
          <span className="flex items-center gap-2">
            {task.points !== null && <span>{task.points} pts</span>}
            {assignee && <Avatar name={assignee.username} size="sm" />}
          </span>
        </div>
      </button>
    </div>
  );
}

function Column({
  status,
  tasks,
  usersById,
  onOpen,
  onMove,
  canDrag,
}: {
  status: Status;
  tasks: Task[];
  usersById: Record<string, User>;
  onOpen: (task: Task) => void;
  onMove: (id: string, status: Status) => void;
  canDrag: boolean;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: TASK_TYPE,
      canDrop: () => canDrag,
      drop: (item: { id: string }) => onMove(item.id, status),
    }),
    [canDrag, onMove, status],
  );

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      drop(node);
    },
    [drop],
  );

  return (
    <section
      ref={ref}
      className="flex min-h-[28rem] w-72 shrink-0 flex-col rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-dark-900"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{status}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-dark-950">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={usersById[task.assignedUserId]}
            onOpen={onOpen}
            canDrag={canDrag}
          />
        ))}
      </div>
    </section>
  );
}

export default function BoardView({
  tasks,
  users,
  onOpen,
  onMove,
  canDrag = true,
}: {
  tasks: Task[];
  users: User[];
  onOpen: (task: Task) => void;
  onMove: (id: string, status: Status) => void;
  canDrag?: boolean;
}) {
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STATUSES.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            usersById={usersById}
            onOpen={onOpen}
            onMove={onMove}
            canDrag={canDrag}
          />
        ))}
      </div>
    </DndProvider>
  );
}
