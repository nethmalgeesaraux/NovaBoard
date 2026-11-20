import { createClient } from "@supabase/supabase-js";
import { nextIssueKey } from "@/lib/format";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  AuthUser,
  BackendStatus,
  Priority,
  Project,
  ProjectInput,
  Role,
  Status,
  Task,
  TaskFilters,
  TaskInput,
  Team,
  TeamInput,
  User,
  UserInput,
} from "@/lib/types";

type UserRow = {
  id: string;
  auth_user_id: string | null;
  username: string;
  email: string;
  profile_picture_url: string | null;
  team_id: string | null;
  role: Role | null;
  created_at?: string;
};

type TeamRow = {
  id: string;
  team_name: string;
  product_owner_user_id: string | null;
  project_manager_user_id: string | null;
  created_at?: string;
};

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at?: string;
};

type TaskRow = {
  id: string;
  issue_key: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  tags: string | null;
  start_date: string | null;
  due_date: string | null;
  points: number | null;
  project_id: string;
  author_user_id: string | null;
  assigned_user_id: string | null;
  created_at: string;
};

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    profilePictureUrl: row.profile_picture_url ?? "",
    teamId: row.team_id ?? "",
    role: row.role ?? (row.email.toLowerCase() === "studionovastack@gmail.com" ? "admin" : "developer"),
    createdAt: row.created_at,
  };
}

function mapTeam(row: TeamRow): Team {
  return {
    id: row.id,
    teamName: row.team_name,
    productOwnerUserId: row.product_owner_user_id ?? "",
    projectManagerUserId: row.project_manager_user_id ?? "",
    createdAt: row.created_at,
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
    createdAt: row.created_at,
  };
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    issueKey: row.issue_key,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    priority: row.priority,
    tags: row.tags ?? "",
    startDate: row.start_date ?? "",
    dueDate: row.due_date ?? "",
    points: row.points,
    projectId: row.project_id,
    authorUserId: row.author_user_id ?? "",
    assignedUserId: row.assigned_user_id ?? "",
    createdAt: row.created_at,
  };
}

function matchesSearch(task: Task, search?: string) {
  if (!search?.trim()) return true;
  const query = search.trim().toLowerCase();
  return [task.title, task.description, task.issueKey, task.tags].some((value) =>
    value.toLowerCase().includes(query),
  );
}

function filterTasks(tasks: Task[], filters: TaskFilters = {}) {
  return tasks
    .filter((task) => (filters.projectId ? task.projectId === filters.projectId : true))
    .filter((task) => (filters.priority ? task.priority === filters.priority : true))
    .filter((task) => matchesSearch(task, filters.search))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function requireClient() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your .env.local keys.");
  }
  return supabase;
}

export async function getBackendStatus(): Promise<BackendStatus> {
  if (!isSupabaseConfigured()) {
    return {
      mode: "unconfigured",
      configured: false,
      ok: false,
      message: "Supabase keys missing. Add NEXT_PUBLIC_SUPABASE_URL and key to .env.local.",
    };
  }

  const supabase = requireClient();
  const { error } = await supabase.from("projects").select("id").limit(1);
  if (error) {
    return {
      mode: "supabase",
      configured: true,
      ok: false,
      message: `Database tables not found (${error.message}). Please run supabase/schema.sql in your Supabase SQL editor.`,
    };
  }

  return {
    mode: "supabase",
    configured: true,
    ok: true,
    message: "Connected to Supabase live database.",
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const supabase = getSupabase();
  if (!supabase) {
    return { signedIn: false, userDetails: null };
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  const session = sessionData.session;
  if (!session) return { signedIn: false, userDetails: null };

  const email = (session.user.email ?? "").toLowerCase().trim();
  const isAdminEmail = email === "studionovastack@gmail.com";

  // Look for user row by auth_user_id or email
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .or(`auth_user_id.eq.${session.user.id},email.eq.${email}`)
    .maybeSingle();

  if (error) {
    // If table doesn't exist yet or query failed
    console.error("Error fetching user profile:", error.message);
  }

  // If user profile is not in public.users yet, create or sync it
  if (!data) {
    const defaultUsername =
      session.user.user_metadata?.username ||
      (isAdminEmail ? "Studio NovaStack (Admin)" : email.split("@")[0]);
    const defaultRole: Role = isAdminEmail
      ? "admin"
      : (session.user.user_metadata?.role as Role) || "developer";

    const { data: created, error: insertError } = await supabase
      .from("users")
      .insert({
        auth_user_id: session.user.id,
        email,
        username: defaultUsername,
        role: defaultRole,
      })
      .select("*")
      .single();

    if (!insertError && created) {
      data = created;
    }
  } else if (!data.auth_user_id || (isAdminEmail && data.role !== "admin")) {
    const { data: updated } = await supabase
      .from("users")
      .update({
        auth_user_id: session.user.id,
        role: isAdminEmail ? "admin" : data.role,
      })
      .eq("id", data.id)
      .select("*")
      .single();

    if (updated) data = updated;
  }

  return {
    signedIn: true,
    userDetails: data
      ? mapUser(data as UserRow)
      : {
          id: session.user.id,
          username: isAdminEmail ? "Studio NovaStack (Admin)" : email.split("@")[0],
          email,
          profilePictureUrl: "",
          teamId: "",
          role: isAdminEmail ? "admin" : "developer",
        },
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const supabase = requireClient();
  const cleanEmail = email.trim().toLowerCase();

  const { error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    if (error.message.includes("Email not confirmed")) {
      throw new Error(
        "Email not confirmed yet. Run supabase/schema.sql in Supabase SQL editor to auto-confirm all user accounts.",
      );
    }
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Invalid email or password. Please verify your credentials.");
    }
    throw new Error(error.message);
  }

  return getCurrentUser();
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUsers(): Promise<User[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as UserRow[]).map(mapUser);
}

export async function createUser(input: UserInput): Promise<User> {
  const supabase = requireClient();
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();
  const role: Role = input.role || (email === "studionovastack@gmail.com" ? "admin" : "developer");
  const teamId = input.teamId ? input.teamId : null;

  let authUserId: string | null = null;

  // If password was provided by admin, create their Supabase Auth login account
  if (input.password && input.password.trim().length >= 6) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "";

    // Use a detached client so the currently logged-in Admin session is not overwritten
    const isolatedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data: authData, error: authError } = await isolatedClient.auth.signUp({
      email,
      password: input.password.trim(),
      options: {
        data: {
          username,
          role,
        },
      },
    });

    if (authError) {
      // If user already exists in auth, allow linking to public.users
      if (!authError.message.includes("already registered")) {
        throw new Error(`Authentication setup failed: ${authError.message}`);
      }
    }

    if (authData?.user) {
      authUserId = authData.user.id;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        auth_user_id: authUserId,
        username,
        email,
        team_id: teamId,
        role,
      },
      { onConflict: "email" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapUser(data as UserRow);
}

export async function deleteUser(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getTeams(): Promise<Team[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.from("teams").select("*").order("team_name");
  if (error) throw new Error(error.message);
  return (data as TeamRow[]).map(mapTeam);
}

export async function createTeam(input: TeamInput): Promise<Team> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("teams")
    .insert({
      team_name: input.teamName.trim(),
      product_owner_user_id: input.productOwnerUserId || null,
      project_manager_user_id: input.projectManagerUserId || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTeam(data as TeamRow);
}

export async function getProjects(): Promise<Project[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as ProjectRow[]).map(mapProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapProject(data as ProjectRow) : null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: input.name.trim(),
      description: input.description.trim(),
      start_date: input.startDate || null,
      end_date: input.endDate || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapProject(data as ProjectRow);
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const supabase = requireClient();
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

  if (filters.projectId) query = query.eq("project_id", filters.projectId);
  if (filters.priority) query = query.eq("priority", filters.priority);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return filterTasks((data as TaskRow[]).map(mapTask), { search: filters.search });
}

export async function createTask(input: TaskInput): Promise<Task> {
  const supabase = requireClient();
  const existing = await getTasks({ projectId: input.projectId });
  const project = await getProject(input.projectId);

  const issueKey = nextIssueKey(project?.name ?? "Task", existing, input.projectId);

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      issue_key: issueKey,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      tags: input.tags.trim(),
      start_date: input.startDate || null,
      due_date: input.dueDate || null,
      points: input.points ?? 0,
      project_id: input.projectId,
      author_user_id: input.authorUserId || null,
      assigned_user_id: input.assignedUserId || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTask(data as TaskRow);
}

export async function updateTask(
  id: string,
  patch: Partial<TaskInput> & { status?: Status; priority?: Priority },
): Promise<Task> {
  const supabase = requireClient();
  const row: Record<string, string | number | null> = {};

  if (patch.title !== undefined) row.title = patch.title.trim();
  if (patch.description !== undefined) row.description = patch.description.trim();
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.priority !== undefined) row.priority = patch.priority;
  if (patch.tags !== undefined) row.tags = patch.tags.trim();
  if (patch.startDate !== undefined) row.start_date = patch.startDate || null;
  if (patch.dueDate !== undefined) row.due_date = patch.dueDate || null;
  if (patch.points !== undefined) row.points = patch.points;
  if (patch.assignedUserId !== undefined) {
    row.assigned_user_id = patch.assignedUserId || null;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapTask(data as TaskRow);
}

export async function deleteTask(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
