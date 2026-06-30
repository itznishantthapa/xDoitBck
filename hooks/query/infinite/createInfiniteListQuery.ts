import { useInfiniteQuery } from "@tanstack/react-query";

export type InfiniteListPage<T> = {
  items: T[];
  nextOffset: number | null;
  hasMore: boolean;
  totalCount: number;
};

export type InfiniteListParams = {
  limit?: number;
  enabled?: boolean;
};

/**
 * Factory for paginated admin list hooks.
 * Add concrete hooks here, e.g. useInfiniteAssignments.ts
 */
export function createInfiniteListQuery<T>({
  queryKey,
  fetchPage,
}: {
  queryKey: readonly unknown[];
  fetchPage: (offset: number, limit: number) => Promise<InfiniteListPage<T>>;
}) {
  return function useInfiniteListQuery({
    limit = 10,
    enabled = true,
  }: InfiniteListParams = {}) {
    return useInfiniteQuery({
      queryKey,
      enabled,
      initialPageParam: 0,
      queryFn: ({ pageParam }) => fetchPage(pageParam, limit),
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextOffset : undefined,
    });
  };
}
