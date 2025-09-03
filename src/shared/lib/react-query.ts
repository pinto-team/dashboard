import {
    QueryKey,
    UseQueryOptions,
    UseQueryResult,
    useQuery as rqUseQuery,
} from '@tanstack/react-query'

const defaultQueryOptions = {
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: 1,
} as const

export function useAppQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>): UseQueryResult<TData, TError> {
    return rqUseQuery({
        ...defaultQueryOptions,
        ...options,
    })
}
