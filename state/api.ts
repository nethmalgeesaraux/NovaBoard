import { createApi } from "@reduxjs/toolkit/query/react";
import {
  createProject,
  createTask,
  createTeam,
  createUser,
  deleteProject,
  deleteTask,
  deleteUser,
  getBackendStatus,
  getCurrentUser,
  getProject,
  getProjects,
  getTasks,
  getTeams,
  getUsers,
  signIn,
  signOut,
  updateTask,
} from "@/lib/repository";
import type {
  AuthUser,
  BackendStatus,
  Priority,
  Project,
  ProjectInput,
  Task,
  TaskFilters,
  TaskInput,
  Team,
  TeamInput,
  User,
  UserInput,
} from "@/lib/types";

type QueryError = { status: "CUSTOM_ERROR"; error: string };

function failure(error: unknown): { error: QueryError } {
  const message = error instanceof Error ? error.message : "Request failed";
  return { error: { status: "CUSTOM_ERROR", error: message } };
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: async () => ({ data: null }),
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "User", "Status"],
  endpoints: (build) => ({
    getAuthUser: build.query<AuthUser, object>({
      queryFn: async () => {
        try {
          return { data: await getCurrentUser() };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["User"],
    }),
    getBackendStatus: build.query<BackendStatus, void>({
      queryFn: async () => {
        try {
          return { data: await getBackendStatus() };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Status"],
    }),
    getProjects: build.query<Project[], void>({
      queryFn: async () => {
        try {
          return { data: await getProjects() };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Projects"],
    }),
    getProject: build.query<Project | null, string>({
      queryFn: async (id) => {
        try {
          return { data: await getProject(id) };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Projects"],
    }),
    createProject: build.mutation<Project, ProjectInput>({
      queryFn: async (input) => {
        try {
          return { data: await createProject(input) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Projects"],
    }),
    deleteProject: build.mutation<null, string>({
      queryFn: async (id) => {
        try {
          await deleteProject(id);
          return { data: null };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Projects", "Tasks"],
    }),
    getTasks: build.query<Task[], TaskFilters | void>({
      queryFn: async (filters) => {
        try {
          return { data: await getTasks(filters ?? {}) };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Tasks"],
    }),
    createTask: build.mutation<Task, TaskInput>({
      queryFn: async (input) => {
        try {
          return { data: await createTask(input) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Tasks"],
    }),
    updateTask: build.mutation<Task, { id: string; patch: Partial<TaskInput> }>({
      queryFn: async ({ id, patch }) => {
        try {
          return { data: await updateTask(id, patch) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: build.mutation<null, string>({
      queryFn: async (id) => {
        try {
          await deleteTask(id);
          return { data: null };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Tasks"],
    }),
    getUsers: build.query<User[], void>({
      queryFn: async () => {
        try {
          return { data: await getUsers() };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Users"],
    }),
    createUser: build.mutation<User, UserInput>({
      queryFn: async (input) => {
        try {
          return { data: await createUser(input) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Users", "User"],
    }),
    deleteUser: build.mutation<null, string>({
      queryFn: async (id) => {
        try {
          await deleteUser(id);
          return { data: null };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Users", "User"],
    }),
    getTeams: build.query<Team[], void>({
      queryFn: async () => {
        try {
          return { data: await getTeams() };
        } catch (error) {
          return failure(error);
        }
      },
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<Team, TeamInput>({
      queryFn: async (input) => {
        try {
          return { data: await createTeam(input) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["Teams"],
    }),
    signIn: build.mutation<AuthUser, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          return { data: await signIn(email, password) };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["User", "Projects", "Tasks", "Users", "Teams", "Status"],
    }),
    signOut: build.mutation<null, void>({
      queryFn: async () => {
        try {
          await signOut();
          return { data: null };
        } catch (error) {
          return failure(error);
        }
      },
      invalidatesTags: ["User", "Projects", "Tasks", "Users", "Teams", "Status"],
    }),
    resetDemoData: build.mutation<null, void>({
      queryFn: async () => {
        return { data: null };
      },
      invalidatesTags: ["Projects", "Tasks", "Users", "Teams", "User", "Status"],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useGetBackendStatusQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useResetDemoDataMutation,
  useSignInMutation,
  useSignOutMutation,
} = api;

export type { Priority };
