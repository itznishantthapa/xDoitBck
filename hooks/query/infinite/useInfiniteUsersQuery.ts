import { getUsersInfinite } from "@/api/userApi";
import { createInfiniteListQuery } from "@/hooks/query/infinite/createInfiniteListQuery";
import { queryKeys } from "@/hooks/query/queryKeys";

export const useInfiniteUsersQuery = createInfiniteListQuery({
  queryKey: queryKeys.users.infinite(),
  fetchPage: getUsersInfinite,
});
