import { api } from "../axios"

export interface Command {
    id: string,
    session_id: string,
    user_id: string,
    command: string,
    status: string,
    risk_level?: string | null,
    output?: string | null,
    exit_code?: number | null,
    was_blocked: boolean,
    blocked_reason?: string | null,
    executed_at?: string | null,
    created_at: string,

}

export interface CreateCommand {
    session_id: string,
    user_id: string,
    command: string,
    status: string,
    risk_level?: string | null,
    output?: string | null,
    exit_code?: number | null,
    was_blocked: boolean,
    blocked_reason?: string | null,
}

export interface UpdateCommand extends Partial<CreateCommand> {
    id: string
}

export const getCommands= async (): Promise<Command[]> => {
    try {
        const response = await api.get<Command[]>('/api/v1/commands')
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createCommand = async (command: CreateCommand): Promise<Command> => {
try {
    const response = await api.post<Command>('/api/v1/commands', command)
    return response.data
} catch (error) {
    console.error(error)
    throw error
}
}

export const updateCommand = async (command: UpdateCommand): Promise<Command> => {
    try {
        const { id, ...rest } = command
        const response = await api.put<Command>(`/api/v1/commands/${id}`, rest)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const deleteCommand = async (id: string): Promise<void> => {
    try {
        await api.delete(`/api/v1/commands/${id}`)
    } catch (error) {
        console.error(error)
        throw error
    }
}


