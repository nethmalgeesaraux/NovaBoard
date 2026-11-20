import { createDemoDatabase } from "@/lib/demo-data";
import { nextIssueKey } from "@/lib/format";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  AuthUser,
  BackendStatus,
  Database,
  Priority,
  Project,
  ProjectInput,
  Status,
  Task,
  TaskFilters,
  TaskInput,
  Team,
  TeamInput,
  User,
  UserInput,
} from "@/lib/types";

const STORAGE_KEY = "novaboard-demo-db";

type UserRow = {
  id: string;
  username: string;
  email: string;
  profile_picture_url: string | null;
  team_id: string | null;
  role: "admin" | "viewer" | null;
};

type TeamRow = {
  id: string;
  team_name: string;
  product_owner_user_id: string | null;
  project_manager_user_id: string | null;
};

type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
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

function emptyUser(): User {
  return {
    id: "",
    username: "NovaStack",
    email: "",
    profilePictureUrl: "",
    teamId: "",
    role: "viewer",
  };
}

function mapUser(row: UserRow): User {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    profilePictureUrl: row.profile_picture_url ?? "",
    teamId: row.team_id ?? "",
    role: row.role === "admin" ? "admin" : "viewer",
  };
}

function mapTeam(row: TeamRow): Team {
  return {
    id: row.id,
    teamName: row.team_name,
    productOwnerUserId: row.product_owner_user_id ?? "",
    projectManagerUserId: row.project_manager_user_id ?? "",
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
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

function loadLocal(): Database {
  if (typeof window === "undefined") return createDemoDatabase();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = createDemoDatabase();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Database;
    if (!parsed.users || !parsed.teams || !parsed.projects || !parsed.tasks) {
      throw new Error("Invalid demo cache");
    }
    return parsed;
  } catch {
    const seeded = createDemoDatabase();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveLocal(db: Database) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
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
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function getBackendStatus(): Promise<BackendStatus> {
  if (!isSupabaseConfigured()) {
    return {
      mode: "demo",
      configured: false,
      ok: true,
      message:
        "Supabase is not configured. NovaBoard is using demo data saved in this browser.",
    };
  }

  const supabase = requireClient();
  const { error } = await supabase.from("projects").select("id").limit(1);
  if (error) {
    return {
      mode: "supabase",
      configured: true,
      ok: false,
      message: error.message,
    };
  }

  return {
    mode: "supabase",
    configured: true,
    ok: true,
    message: "Connected to Supabase.",
  };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const supabase = getSupabase();
  if (!supabase) {
    const user = loadLocal().users[0] ?? emptyUser();
    return { signedIn: true, userDetails: { ...user, role: "admin" } };
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw new Error(sessionError.message);
  const session = sessionData.session;
  if (!session) return { signedIn: false, userDetails: null };

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", session.user.id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return {
    signedIn: true,
    userDetails: data ? mapUser(data as UserRow) : null,
  };
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const supabase = requireClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw new Error(error.message);
  return getCurrentUser();
}

export async function signOut(): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getUsers(): Promise<User[]> {
  const supabase = getSupabase();
  if (!supabase) return loadLocal().users;
  const { data, error } = await supabase.from("users").select("*").order("username");
  if (error) throw new Error(error.message);
  return (data as UserRow[]).map(mapUser);
}

export async function createUser(input: UserInput): Promise<User> {
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    const user: User = {
      id: crypto.randomUUID(),
      username: input.username.trim(),
      email: input.email.trim(),
      profilePictureUrl: "",
      teamId: input.teamId,
      role: "viewer",
    };
    db.users.push(user);
    saveLocal(db);
    return user;
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      username: input.username.trim(),
      email: input.email.trim(),
      team_id: input.teamId || null,
      role: "viewer",
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return mapUser(data as UserRow);
}

export async function getTeams(): Promise<Team[]> {
  const supabase = getSupabase();
  if (!supabase) return loadLocal().teams;
  const { data, error } = await supabase.from("teams").select("*").order("team_name");
  if (error) throw new Error(error.message);
  return (data as TeamRow[]).map(mapTeam);
}

export async function createTeam(input: TeamInput): Promise<Team> {
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    const team: Team = {
      id: crypto.randomUUID(),
      teamName: input.teamName.trim(),
      productOwnerUserId: input.productOwnerUserId,
      projectManagerUserId: input.projectManagerUserId,
    };
    db.teams.push(team);
    saveLocal(db);
    return team;
  }

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
  const supabase = getSupabase();
  if (!supabase) return loadLocal().projects;
  const { data, error } = await supabase.from("projects").select("*").order("name");
  if (error) throw new Error(error.message);
  return (data as ProjectRow[]).map(mapProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id) ?? null;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      description: input.description.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
    };
    db.projects.push(project);
    saveLocal(db);
    return project;
  }

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
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    db.projects = db.projects.filter((project) => project.id !== id);
    db.tasks = db.tasks.filter((task) => task.projectId !== id);
    saveLocal(db);
    return;
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const supabase = getSupabase();
  if (!supabase) return filterTasks(loadLocal().tasks, filters);

  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
  if (filters.projectId) query = query.eq("project_id", filters.projectId);
  if (filters.priority) query = query.eq("priority", filters.priority);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return filterTasks((data as TaskRow[]).map(mapTask), { search: filters.search });
}

export async function createTask(input: TaskInput): Promise<Task> {
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    const project = db.projects.find((item) => item.id === input.projectId);
    const task: Task = {
      id: crypto.randomUUID(),
      issueKey: nextIssueKey(project?.name ?? "Task", db.tasks, input.projectId),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      tags: input.tags.trim(),
      startDate: input.startDate,
      dueDate: input.dueDate,
      points: input.points,
      projectId: input.projectId,
      authorUserId: input.authorUserId,
      assignedUserId: input.assignedUserId,
      createdAt: new Date().toISOString(),
    };
    db.tasks.unshift(task);
    saveLocal(db);
    return task;
  }

  const existing = await getTasks({ projectId: input.projectId });
  const project = await getProject(input.projectId);
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      issue_key: nextIssueKey(project?.name ?? "Task", existing, input.projectId),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      tags: input.tags.trim(),
      start_date: input.startDate || null,
      due_date: input.dueDate || null,
      points: input.points,
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
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    const index = db.tasks.findIndex((task) => task.id === id);
    if (index < 0) throw new Error("Issue not found");
    const current = db.tasks[index];
    const next: Task = {
      ...current,
      title: patch.title?.trim() ?? current.title,
      description: patch.description?.trim() ?? current.description,
      status: patch.status ?? current.status,
      priority: patch.priority ?? current.priority,
      tags: patch.tags?.trim() ?? current.tags,
      startDate: patch.startDate ?? current.startDate,
      dueDate: patch.dueDate ?? current.dueDate,
      points: patch.points === undefined ? current.points : patch.points,
      assignedUserId: patch.assignedUserId ?? current.assignedUserId,
    };
    db.tasks[index] = next;
    saveLocal(db);
    return next;
  }

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
  const supabase = getSupabase();
  if (!supabase) {
    const db = loadLocal();
    db.tasks = db.tasks.filter((task) => task.id !== id);
    saveLocal(db);
    return;
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function resetDemoData(): Promise<void> {
  if (isSupabaseConfigured()) {
    throw new Error("Demo reset is only available before Supabase is connected.");
  }
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  saveLocal(createDemoDatabase());
}
