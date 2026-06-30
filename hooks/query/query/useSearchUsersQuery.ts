import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "@/api/userApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useSearchUsersQuery(
  username: string,
  options?: { enabled?: boolean }
) {
  const trimmedUsername = username.trim();

  return useQuery({
    queryKey: queryKeys.users.search(trimmedUsername),
    queryFn: () => searchUsers(trimmedUsername),
    enabled: (options?.enabled ?? true) && Boolean(trimmedUsername),
  });
}
