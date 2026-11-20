"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProjectsQuery, useGetTasksQuery } from "@/state/api";
import { Badge, EmptyState, PageHeader, inputClass, primaryButton } from "@/app/components/ui";

export default function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";
  const [value, setValue] = useState(initial);
  const query = initial.trim();

  const { data: tasks = [] } = useGetTasksQuery(query ? { search: query } : undefined, {
    skip: !query,
  });
  const { data: projects = [] } = useGetProjectsQuery(undefined, { skip: !query });
  const matchedProjects = projects.filter((project) => {
    const haystack = `${project.name} ${project.description}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        eyebrow="Find work"
        title="Search"
        subtitle="Look up issues by key, title, tag, or description, and projects by name."
      />
      <form
        className="mb-6 flex max-w-xl gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }}
      >
        <input
          className={inputClass}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="NB-102, invoice, design..."
        />
        <button className={primaryButton} type="submit">
          Search
        </button>
      </form>

      {!query && <EmptyState title="Start with a word or an issue key" body="Results show up here." />}

      {query && (
        <div className="grid gap-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold">Projects</h2>
            {matchedProjects.length === 0 && <p className="text-sm text-slate-500">No projects.</p>}
            <div className="grid gap-3">
              {matchedProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`} className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-slate-500">{project.description}</p>
                </Link>
              ))}
            </div>
          </section>
          <section>
            <h2 className="mb-3 text-sm font-semibold">Issues</h2>
            {tasks.length === 0 && <p className="text-sm text-slate-500">No issues.</p>}
            <div className="grid gap-3">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/projects/${task.projectId}?task=${task.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"
                >
                  <div>
                    <p className="text-xs font-semibold text-nova-700 dark:text-nova-300">{task.issueKey}</p>
                    <p className="font-medium">{task.title}</p>
                  </div>
                  <Badge tone={task.status}>{task.status}</Badge>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
