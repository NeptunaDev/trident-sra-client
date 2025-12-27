import { api } from "./axios";

export type PermissionUser = "create" | "read" | "update" | "delete";
export type PermissionSessions = "create" | "read";

export interface Permissions {
  sessions: PermissionSessions[];
  users: PermissionUser[];
}

export interface Role {
  name: string;
  display_name: string;
  permissions: Permissions;
  color: string;
  id: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRole {
  name: string;
  display_name: string;
  permissions: Permissions;
  color: string;
}

export interface UpdateRole extends Partial<CreateRole> {
  id: string;
  is_system?: boolean;
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get<Role[]>("/api/v1/roles");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createRole = async (role: CreateRole): Promise<Role> => {
  try {
    const response = await api.post<Role>("/api/v1/roles", role);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateRole = async (role: UpdateRole): Promise<Role> => {
  try {
    const { id, ...rest } = role;
    const response = await api.put<Role>(`/api/v1/roles/${id}`, rest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/roles/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
