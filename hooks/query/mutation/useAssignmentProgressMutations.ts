import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  assignmentReceivedAction,
  completedAction,
  doingAction,
  paymentAction,
} from "@/api/assignmentProgressApi";
import { invalidateAssignmentProgressQueries } from "@/hooks/query/invalidateAssignmentProgressQueries";

export function useAssignmentReceivedActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignmentReceivedAction,
    onSuccess: (_data, variables) => {
      invalidateAssignmentProgressQueries(
        queryClient,
        variables.assignmentId
      );
    },
  });
}

export function usePaymentActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentAction,
    onSuccess: (_data, variables) => {
      invalidateAssignmentProgressQueries(
        queryClient,
        variables.assignmentId
      );
    },
  });
}

export function useDoingActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: doingAction,
    onSuccess: (_data, variables) => {
      invalidateAssignmentProgressQueries(
        queryClient,
        variables.assignmentId
      );
    },
  });
}

export function useCompletedActionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completedAction,
    onSuccess: (_data, variables) => {
      invalidateAssignmentProgressQueries(
        queryClient,
        variables.assignmentId
      );
    },
  });
}
