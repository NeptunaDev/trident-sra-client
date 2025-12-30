import { api } from "../axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role_id: string;
  is_active: boolean;
  organization_id: string;
  twofa_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role_id: string;
  organization_id: string;
}

export interface UpdateUser extends Partial<CreateUser> {
  id: string;
  is_active?: boolean;
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/api/v1/users/me/profile");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUser = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/api/v1/users");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createUser = async (user: CreateUser): Promise<User> => {
  try {
    const response = await api.post<User>("/api/v1/users", user);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (user: UpdateUser): Promise<User> => {
  try {
    const { id, ...rest } = user;
    const response = await api.put<User>(`/api/v1/users/${id}`, rest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/users/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
