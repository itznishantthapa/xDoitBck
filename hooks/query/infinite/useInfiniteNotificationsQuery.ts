import { getSystemNotificationsInfinite } from "@/api/notificationApi";
import { createInfiniteListQuery } from "@/hooks/query/infinite/createInfiniteListQuery";
import { queryKeys } from "@/hooks/query/queryKeys";

export const useInfiniteNotificationsQuery = createInfiniteListQuery({
  queryKey: queryKeys.notifications.infinite(),
  fetchPage: getSystemNotificationsInfinite,
});
