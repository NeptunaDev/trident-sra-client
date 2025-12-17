'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { AxiosError } from 'axios'

// Hook para GET requests
export function useApiQuery<T>(
  key: string[],
  url: string,
  options?: { enabled?: boolean }
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await api.get(url)
      return response.data
    },
    ...options,
  })
}

// Hook para POST/PUT/DELETE requests
export function useApiMutation<TData, TVariables>(
  method: 'post' | 'put' | 'delete',
  url: string,
  options?: {
    onSuccess?: (data: TData) => void
    onError?: (error: AxiosError) => void
    invalidateKeys?: string[][]
  }
) {
  const queryClient = useQueryClient()

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data) => {
      let response
      if (method === 'post') {
        response = await api.post<TData>(url, data)
      } else if (method === 'put') {
        response = await api.put<TData>(url, data)
      } else {
        // delete method - data is optional
        response = await api.delete<TData>(url, { data })
      }
      return response.data
    },
    onSuccess: (data) => {
      // Invalidar queries si se especifican
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key })
        })
      }
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
