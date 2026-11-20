"use client";

import { useState } from "react";
import Link from "next/link";
import { useCreateProjectMutation, useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { formatDate, getErrorMessage } from "@/lib/format";
import {
  EmptyState,
  Field,
  PageHeader,
  QueryError,
  cardClass,
  inputClass,
  primaryButton,
} from "@/app/components/ui";
import { useIsAdmin } from "@/app/use-admin";

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError, error } = useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const [createProject, { isLoading: saving }] = useCreateProjectMutation();
  const [message, setMessage] = useState("");
  const isAdmin = useIsAdmin();

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        subtitle="Each project has a board, a list, and issues your team can move through review."
      />
      <QueryError message={isError ? getErrorMessage(error) : message} />

      <div className={`grid gap-4 ${isAdmin ? "lg:grid-cols-[1.4fr_0.8fr]" : ""}`}>
        <div className="grid gap-4">
          {isLoading && <p className="text-sm text-slate-500">Loading projects...</p>}
          {!isLoading && projects.length === 0 && (
            <EmptyState title="No projects yet" body="Create the first project for NovaStack Studio." />
          )}
          {projects.map((project) => {
            const projectTasks = tasks.filter((task) => task.projectId === project.id);
            const done = projectTasks.filter((task) => task.status === "Completed").length;
            return (
              <Link key={project.id} href={`/projects/${project.id}`} className={`${cardClass} block p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">{project.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                  </div>
                  <span className="rounded-full bg-nova-50 px-2 py-1 text-xs font-medium text-nova-800 dark:bg-nova-950 dark:text-nova-100">
                    {done}/{projectTasks.length} done
                  </span>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  {formatDate(project.startDate)} – {formatDate(project.endDate)}
                </p>
              </Link>
            );
          })}
        </div>

        {isAdmin && (
        <form
          className={`${cardClass} h-fit space-y-3 p-5`}
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name") ?? "").trim();
            if (!name) return;
            try {
              await createProject({
                name,
                description: String(form.get("description") ?? ""),
                startDate: String(form.get("startDate") ?? ""),
                endDate: String(form.get("endDate") ?? ""),
              }).unwrap();
              event.currentTarget.reset();
              setMessage("");
            } catch (createError) {
              setMessage(getErrorMessage(createError));
            }
          }}
        >
          <h2 className="font-semibold">New project</h2>
          <Field label="Name">
            <input name="name" className={inputClass} required placeholder="NovaBoard Platform" />
          </Field>
          <Field label="Description">
            <textarea name="description" rows={3} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <input name="startDate" type="date" className={inputClass} />
            </Field>
            <Field label="End">
              <input name="endDate" type="date" className={inputClass} />
            </Field>
          </div>
          <button className={primaryButton} disabled={saving} type="submit">
            {saving ? "Creating..." : "Create project"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
