import { useQuery } from "@tanstack/react-query";

import { getCalendarData } from "@/api/calendarApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useCalendarQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.calendar.data(),
    queryFn: getCalendarData,
    enabled: options?.enabled ?? true,
  });
}
