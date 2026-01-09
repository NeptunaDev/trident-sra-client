import { api } from "../axios";

export type OsType = "Windows" | "Linux" | "Freebsd" | "Macos";
export type TunnelType =
  | "Cloudflare"
  | "Ssh_reverse"
  | "Vpn"
  | "Ngrok"
  | "Direct";
export type AgentStatus = "Online" | "Offline" | "Maintenance" | "Error";

export interface Agent {
  id: string;
  agent_name: string;
  hostname: string;
  os_type: OsType;
  os_version: string | null;
  tunnel_type: TunnelType;
  public_ws_url: string | null;
  local_ws_port: number | null;
  tunnel_config: Record<string, any> | null;
  guacd_host: string | null;
  guacd_port: number | null;
  docker_api_url: string | null;
  version: string | null;
  max_concurrent_sessions: number | null;
  organization_id: string;
  agent_token: string;
  status: AgentStatus;
  last_heartbeat_at: string | null;
  current_active_sessions: number;
  cpu_usage_percent: string | number;
  memory_usage_percent: string | number;
  disk_usage_percent: string | number;
  created_at: string;
  updated_at: string;
}

export interface CreateAgent {
  agent_name: string;
  hostname: string;
  os_type: string;
  os_version: string | null;
  tunnel_type: string;
  public_ws_url: string | null;
  local_ws_port: number | null;
  tunnel_config: Record<string, any> | null;
  guacd_host: string | null;
  guacd_port: number | null;
  docker_api_url: string | null;
  version: string | null;
  max_concurrent_sessions: number | null;
  agent_token: string;
  organization_id: string | null;
}

export interface UpdateAgent extends Partial<CreateAgent> {
  id: string;
  status?: AgentStatus;
  current_active_sessions?: number;
  cpu_usage_percent?: number;
  memory_usage_percent?: number;
  disk_usage_percent?: number;
}

export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await api.get<Agent[]>("/api/v1/agents");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAgent = async (id: string): Promise<Agent> => {
  try {
    const response = await api.get<Agent>(`/api/v1/agents/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createAgent = async (agent: CreateAgent): Promise<Agent> => {
  try {
    const response = await api.post<Agent>("/api/v1/agents", agent);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateAgent = async (agent: UpdateAgent): Promise<Agent> => {
  try {
    const { id, ...rest } = agent;
    const response = await api.put<Agent>(`/api/v1/agents/${id}`, rest);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAgent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/v1/agents/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
