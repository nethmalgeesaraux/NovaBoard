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

export type Role = "admin" | "viewer";

export type User = {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string;
  teamId: string;
  role: Role;
};

export type Team = {
  id: string;
  teamName: string;
  productOwnerUserId: string;
  projectManagerUserId: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
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
  teamId: string;
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
  mode: "demo" | "supabase";
  configured: boolean;
  ok: boolean;
  message: string;
};
