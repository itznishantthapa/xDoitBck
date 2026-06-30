import { getWorkingInfinite } from "@/api/workingApi";
import { createInfiniteListQuery } from "@/hooks/query/infinite/createInfiniteListQuery";
import { queryKeys } from "@/hooks/query/queryKeys";

export const useInfiniteWorkingQuery = createInfiniteListQuery({
  queryKey: queryKeys.working.infinite(),
  fetchPage: getWorkingInfinite,
});
