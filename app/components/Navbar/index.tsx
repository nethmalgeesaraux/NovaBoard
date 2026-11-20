"use client";

import React, { useState } from "react";
import { Menu, Moon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useSignOutMutation } from "@/state/api";
import { isSupabaseConfigured } from "@/lib/supabase";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: currentUser } = useGetAuthUserQuery({});
  const [signOut, { isLoading: signingOut }] = useSignOutMutation();
  const username = currentUser?.userDetails?.username || "NovaStack";
  const role = currentUser?.userDetails?.role;

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-dark-950/90">
      <div className="flex items-center gap-4">
        {isSidebarCollapsed && (
          <button
            aria-label="Open sidebar"
            onClick={() => dispatch(setIsSidebarCollapsed(false))}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <form
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-44 rounded-lg border border-transparent bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-nova-400 sm:w-64 dark:bg-slate-dark-900 dark:text-white"
            type="search"
            placeholder="Search issues..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-1">
        <button
          aria-label="Toggle color mode"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <Link
          href="/settings"
          aria-label="Settings"
          className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <div className="mx-2 hidden h-6 w-px bg-slate-200 md:block dark:bg-slate-700" />
        <div className="hidden items-center gap-2 md:flex">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-600 text-xs font-bold text-white">
            {username.slice(0, 1).toUpperCase()}
          </span>
          <span className="text-sm font-medium">{username}</span>
          {role && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {role === "admin" ? "Admin" : "View only"}
            </span>
          )}
        </div>
        {isSupabaseConfigured() && (
          <button
            className="rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            type="button"
            disabled={signingOut}
            onClick={() => signOut()}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
