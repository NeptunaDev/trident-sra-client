import { api } from '../axios'

export interface Policy {
    id: string,
    organization_id: string,
    name: string,
    description: string,
    is_active: boolean,
    blocked_patterns: string[],
    applies_to_roles: string[],
    created_by_user_id: string,
    created_at: string
}

export interface CreatePolicy {
    organization_id?: string,
    name: string,
    description?: string,
    is_active?: boolean,
    blocked_patterns?: string[],
    applies_to_roles?: string[],
    create_by_user_id: string,
} 

export interface UpdatePolicy extends Partial<CreatePolicy> {
    id: string
}

export const getPolicies= async (): Promise<Policy[]> => {
    try {
        const response = await api.get<Policy[]>('/api/v1/policies')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createPolicy = async (policy: CreatePolicy): Promise<Policy> => {
    try {
        const response = await api.post<Policy>('/api/v1/policies', policy)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updatePolicy = async (policy: UpdatePolicy): Promise<Policy> => {
    try {
        const { id, ...rest } = policy
        const response = await api.put<Policy>(`/api/v1/policies/${id}`, rest)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deletePolicy = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/policies/${id}`)
    } catch (error) {
        console.error(error)
        throw error
    }
}
