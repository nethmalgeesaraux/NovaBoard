export const STATUSES = [
  "To Do",
  "Work In Progress",
  "Under Review",
  "Completed",
] as const;

export const PRIORITIES = [
  "Urgent",
  "High",
  "Medium",
  "Low",
  "Backlog",
] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export type Role = "admin" | "developer" | "viewer";

export type User = {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  teamId: string;
  role: Role;
  createdAt?: string;
};

export type Team = {
  id: string;
  teamName: string;
  productOwnerUserId: string;
  projectManagerUserId: string;
  createdAt?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
};

export type Task = {
  id: string;
  issueKey: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string;
  startDate: string;
  dueDate: string;
  points: number | null;
  projectId: string;
  authorUserId: string;
  assignedUserId: string;
  createdAt: string;
};

export type AuthUser = {
  signedIn: boolean;
  userDetails: User | null;
};

export type Database = {
  users: User[];
  teams: Team[];
  projects: Project[];
  tasks: Task[];
};

export type ProjectInput = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};

export type UserInput = {
  username: string;
  email: string;
  password?: string;
  role?: Role;
  teamId?: string;
};

export type TeamInput = {
  teamName: string;
  productOwnerUserId: string;
  projectManagerUserId: string;
};

export type TaskInput = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string;
  startDate: string;
  dueDate: string;
  points: number | null;
  projectId: string;
  authorUserId: string;
  assignedUserId: string;
};

export type TaskFilters = {
  projectId?: string;
  priority?: Priority;
  search?: string;
};

export type BackendStatus = {
  mode: "supabase" | "unconfigured";
  configured: boolean;
  ok: boolean;
  message: string;
};
