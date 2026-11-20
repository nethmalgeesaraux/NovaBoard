"use client";

import { useState } from "react";
import { useCreateTeamMutation, useGetTeamsQuery, useGetUsersQuery } from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import {
  Avatar,
  Field,
  PageHeader,
  QueryError,
  cardClass,
  inputClass,
  primaryButton,
} from "@/app/components/ui";
import { useIsAdmin } from "@/app/use-admin";

export default function TeamsPage() {
  const { data: teams = [], isError, error } = useGetTeamsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [message, setMessage] = useState("");
  const isAdmin = useIsAdmin();
  const usersById = Object.fromEntries(users.map((user) => [user.id, user]));

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Teams"
        subtitle="Product owners and project managers for each NovaStack team."
      />
      <QueryError message={isError ? getErrorMessage(error) : message} />
      <div className={`grid gap-4 ${isAdmin ? "lg:grid-cols-[1.2fr_0.8fr]" : ""}`}>
        <div className="grid gap-4">
          {teams.map((team) => {
            const members = users.filter((user) => user.teamId === team.id);
            const owner = usersById[team.productOwnerUserId];
            const manager = usersById[team.projectManagerUserId];
            return (
              <section key={team.id} className={`${cardClass} p-5`}>
                <h2 className="text-lg font-semibold">{team.teamName}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Owner: {owner?.username ?? "—"} · Manager: {manager?.username ?? "—"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {members.map((member) => (
                    <span key={member.id} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-sm dark:bg-slate-dark-950">
                      <Avatar name={member.username} size="sm" />
                      {member.username}
                    </span>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        {isAdmin && (
        <form
          className={`${cardClass} h-fit space-y-3 p-5`}
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            try {
              await createTeam({
                teamName: String(form.get("teamName") ?? ""),
                productOwnerUserId: String(form.get("productOwnerUserId") ?? ""),
                projectManagerUserId: String(form.get("projectManagerUserId") ?? ""),
              }).unwrap();
              event.currentTarget.reset();
              setMessage("");
            } catch (createError) {
              setMessage(getErrorMessage(createError));
            }
          }}
        >
          <h2 className="font-semibold">New team</h2>
          <Field label="Team name">
            <input name="teamName" className={inputClass} required />
          </Field>
          <Field label="Product owner">
            <select name="productOwnerUserId" className={inputClass} defaultValue="">
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project manager">
            <select name="projectManagerUserId" className={inputClass} defaultValue="">
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </Field>
          <button className={primaryButton} disabled={isLoading} type="submit">
            {isLoading ? "Saving..." : "Create team"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
