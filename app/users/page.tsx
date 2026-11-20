"use client";

import { useState } from "react";
import { useCreateUserMutation, useGetTeamsQuery, useGetUsersQuery } from "@/state/api";
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

export default function UsersPage() {
  const { data: users = [], isError, error } = useGetUsersQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [message, setMessage] = useState("");
  const isAdmin = useIsAdmin();
  const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Users"
        subtitle="Studio members who can own and be assigned to issues."
      />
      <QueryError message={isError ? getErrorMessage(error) : message} />
      <div className={`grid gap-4 ${isAdmin ? "lg:grid-cols-[1.3fr_0.7fr]" : ""}`}>
        <div className={`${cardClass} overflow-x-auto`}>
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium">
                      <Avatar name={user.username} size="sm" />
                      {user.username}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">{teamsById[user.teamId]?.teamName ?? "—"}</td>
                  <td className="px-4 py-3">{user.role === "admin" ? "Admin" : "View only"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isAdmin && (
        <form
          className={`${cardClass} space-y-3 p-5`}
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            try {
              await createUser({
                username: String(form.get("username") ?? ""),
                email: String(form.get("email") ?? ""),
                teamId: String(form.get("teamId") ?? ""),
              }).unwrap();
              event.currentTarget.reset();
              setMessage("");
            } catch (createError) {
              setMessage(getErrorMessage(createError));
            }
          }}
        >
          <h2 className="font-semibold">Add member</h2>
          <Field label="Name">
            <input name="username" className={inputClass} required />
          </Field>
          <Field label="Email">
            <input name="email" type="email" className={inputClass} required />
          </Field>
          <Field label="Team">
            <select name="teamId" className={inputClass} defaultValue="">
              <option value="">No team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </Field>
          <button className={primaryButton} disabled={isLoading} type="submit">
            {isLoading ? "Saving..." : "Add user"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
}
