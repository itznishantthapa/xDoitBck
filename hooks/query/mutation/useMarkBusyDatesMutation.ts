import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markBusyDates } from "@/api/calendarApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useMarkBusyDatesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markBusyDates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
    },
  });
}
