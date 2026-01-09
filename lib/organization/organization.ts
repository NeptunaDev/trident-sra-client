import { api } from "../axios";

export type PlanType = "Free" | "Pro" | "Enterprise";
export type TunnelType =
  | "Cloudflare"
  | "Ssh_reverse"
  | "Vpn"
  | "Ngrok"
  | "Direct";

export interface Organization {
  id: string;
  name: string;
  is_active: boolean;
  plan: PlanType;
  slug: string;
  max_users: number;
  max_agents: number;
  max_connections: number;
  tunnel_type: TunnelType;
  tunnel_config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrganization {
  name: string;
  slug: string;
  plan: string;
  max_users: number | null;
  max_connections: number | null;
  max_agents: number | null;
  tunnel_type: string;
  tunnel_config: Record<string, any> | null;
}

export interface updateOrganization extends Partial<CreateOrganization> {
  id: string;
  is_active: boolean;
}

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get<Organization[]>("/api/v1/organizations");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateOrganization = async (
  organization: CreateOrganization
): Promise<Organization> => {
  try {
    const response = await api.post<Organization>(
      "/api/v1/organizations",
      organization
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateOrganization = async (
  organization: updateOrganization
): Promise<Organization> => {
  try {
    const { id, ...rest } = organization;
    const response = await api.put<Organization>(
      `/api/v1/organizations/${id}`,
      rest
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteOrganization = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/organizations/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
