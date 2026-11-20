"use client";

import { useState } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAuthUserQuery,
  useGetTeamsQuery,
  useGetUsersQuery,
} from "@/state/api";
import { getErrorMessage } from "@/lib/format";
import type { Role } from "@/lib/types";
import {
  Avatar,
  Field,
  PageHeader,
  QueryError,
  cardClass,
  inputClass,
  primaryButton,
  secondaryButton,
  dangerButton,
} from "@/app/components/ui";
import { useIsAdmin } from "@/app/use-admin";
import { Check, Copy, Eye, EyeOff, KeyRound, Shield, Trash2, UserCheck, UserPlus } from "lucide-react";

export default function UsersPage() {
  const { data: users = [], isError, error } = useGetUsersQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: currentUser } = useGetAuthUserQuery({});
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const [message, setMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    email: string;
    password?: string;
    username: string;
    role: string;
  } | null>(null);

  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAdmin = useIsAdmin();
  const teamsById = Object.fromEntries(teams.map((team) => [team.id, team]));

  const generatePassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pass = "Nova@";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPasswordValue(pass);
  };

  const copyCredentials = () => {
    if (!successInfo) return;
    const text = `NovaBoard Login Credentials:
Workspace: NovaStack Studio
Email: ${successInfo.email}
Password: ${successInfo.password || "(as specified)"}
Role: ${successInfo.role}
Portal: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team & Access Control"
        title="Developers & Members"
        subtitle="Manage engineers and collaborators. Admin can provision accounts and provide credentials directly to developers."
      />

      <QueryError message={isError ? getErrorMessage(error) : message} />

      {successInfo && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/90 p-5 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-100 shadow-sm animate-in fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-600 p-2 text-white">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Account Created Successfully!</h3>
                <p className="text-sm opacity-90 mt-0.5">
                  Share these credentials with the team member to let them sign in to NovaBoard.
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <div>
                    <span className="text-slate-500 block font-sans">Name</span>
                    <strong>{successInfo.username}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Email</span>
                    <strong>{successInfo.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Password</span>
                    <strong>{successInfo.password}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-sans">Role</span>
                    <strong className="capitalize">{successInfo.role}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyCredentials}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Credentials"}
              </button>
              <button
                type="button"
                onClick={() => setSuccessInfo(null)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`grid gap-6 ${isAdmin ? "lg:grid-cols-[1.4fr_0.8fr]" : ""}`}>
        {/* Users Table */}
        <div className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-base">Team Members ({users.length})</h2>
              <p className="text-xs text-slate-500">All registered developers and administrators</p>
            </div>
            <span className="text-xs font-medium text-slate-400">
              {isAdmin ? "Admin Controls Active" : "View Only"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Developer / Member</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Team</th>
                  <th className="px-5 py-3 font-medium">Access Role</th>
                  {isAdmin && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">
                      No members registered yet.
                    </td>
                  </tr>
                )}
                {users.map((user) => {
                  const isCurrent = user.id === currentUser?.userDetails?.id;
                  const isUserAdmin = user.role === "admin";
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.username} size="md" />
                          <div>
                            <span className="font-medium text-slate-dark-800 dark:text-slate-100">
                              {user.username}
                            </span>
                            {isCurrent && (
                              <span className="ml-2 rounded-full bg-nova-50 px-2 py-0.5 text-[10px] font-semibold text-nova-700 dark:bg-nova-950 dark:text-nova-300">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                        {teamsById[user.teamId]?.teamName ?? (
                          <span className="text-slate-400 italic">No team</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isUserAdmin
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                              : user.role === "developer"
                                ? "bg-nova-50 text-nova-800 dark:bg-nova-950 dark:text-nova-200 border border-nova-200 dark:border-nova-800"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {isUserAdmin ? <Shield className="h-3 w-3" /> : null}
                          {isUserAdmin ? "Admin" : user.role === "developer" ? "Developer" : "Viewer"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5 text-right">
                          {!isCurrent && (
                            <button
                              type="button"
                              disabled={deleting}
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    `Are you sure you want to remove ${user.username} (${user.email})?`,
                                  )
                                )
                                  return;
                                try {
                                  await deleteUser(user.id).unwrap();
                                } catch (err) {
                                  setMessage(getErrorMessage(err));
                                }
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                              title="Delete user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Form: Provision Developer Account */}
        {isAdmin ? (
          <form
            className={`${cardClass} space-y-4 p-5 h-fit`}
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const username = String(form.get("username") ?? "").trim();
              const email = String(form.get("email") ?? "").trim().toLowerCase();
              const password = String(form.get("password") ?? "").trim();
              const role = String(form.get("role") ?? "developer") as Role;
              const teamId = String(form.get("teamId") ?? "");

              if (!password || password.length < 6) {
                setMessage("Password must be at least 6 characters long.");
                return;
              }

              try {
                setMessage("");
                await createUser({
                  username,
                  email,
                  password,
                  role,
                  teamId,
                }).unwrap();

                setSuccessInfo({
                  username,
                  email,
                  password,
                  role,
                });

                event.currentTarget.reset();
                setPasswordValue("");
              } catch (createError) {
                setMessage(getErrorMessage(createError));
              }
            }}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-nova-600" />
              <div>
                <h2 className="font-semibold text-base">Create Member Account</h2>
                <p className="text-xs text-slate-500">
                  Provision login credentials for developers
                </p>
              </div>
            </div>

            <Field label="Full Name">
              <input
                name="username"
                className={inputClass}
                required
                placeholder="e.g. Kasun Fernando"
              />
            </Field>

            <Field label="Email Address (Login Username)">
              <input
                name="email"
                type="email"
                className={inputClass}
                required
                placeholder="developer@novastack.studio"
              />
            </Field>

            <Field label="Temporary Password">
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className={`${inputClass} pr-20 font-mono`}
                    required
                    placeholder="Min 6 characters"
                    minLength={6}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title={showPassword ? "Hide" : "Show"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="inline-flex items-center gap-1 text-xs text-nova-600 hover:text-nova-700 font-medium"
                  >
                    <KeyRound className="h-3 w-3" />
                    Generate random password
                  </button>
                  {passwordValue && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {passwordValue.length} chars
                    </span>
                  )}
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Role">
                <select name="role" className={inputClass} defaultValue="developer">
                  <option value="developer">Developer</option>
                  <option value="admin">Administrator</option>
                  <option value="viewer">Viewer</option>
                </select>
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
            </div>

            <div className="pt-2">
              <button
                className={`${primaryButton} w-full`}
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? "Creating Account..." : "Create Account & Grant Access"}
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              New developers can log in immediately using their email and this password. No public registration is required.
            </p>
          </form>
        ) : (
          <div className={`${cardClass} p-5 text-sm text-slate-500 space-y-2`}>
            <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
              <Shield className="h-4 w-4 text-nova-600" />
              <span>Restricted Access</span>
            </div>
            <p>
              Only Workspace Administrators (<code>studionovastack@gmail.com</code>) can create new developer accounts. Please reach out to your lead for account changes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
