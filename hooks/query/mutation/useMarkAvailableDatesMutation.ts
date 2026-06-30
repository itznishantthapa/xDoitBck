import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markAvailableDates } from "@/api/calendarApi";
import { queryKeys } from "@/hooks/query/queryKeys";

export function useMarkAvailableDatesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAvailableDates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
    },
  });
}
