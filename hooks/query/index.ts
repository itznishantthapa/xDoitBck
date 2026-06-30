export { queryKeys } from "@/hooks/query/queryKeys";

export { useDashboardQuery } from "@/hooks/query/query/useDashboardQuery";
export { useBadgeNumbersQuery } from "@/hooks/query/query/useBadgeNumbersQuery";
export { useUserDetailsQuery } from "@/hooks/query/query/useUserDetailsQuery";
export { useAssignmentProgressQuery } from "@/hooks/query/query/useAssignmentProgressQuery";
export { useCalendarQuery } from "@/hooks/query/query/useCalendarQuery";

export { useLoginMutation } from "@/hooks/query/mutation/useLoginMutation";
export { useLogoutMutation } from "@/hooks/query/mutation/useLogoutMutation";
export { useMarkBusyDatesMutation } from "@/hooks/query/mutation/useMarkBusyDatesMutation";
export { useMarkAvailableDatesMutation } from "@/hooks/query/mutation/useMarkAvailableDatesMutation";
export { useDeleteUserMutation } from "@/hooks/query/mutation/useDeleteUserMutation";
export { useDeleteAssignmentMutation } from "@/hooks/query/mutation/useDeleteAssignmentMutation";
export { useAddAssignmentOnWorkingMutation } from "@/hooks/query/mutation/useAddAssignmentOnWorkingMutation";
export { useRemoveFromWorkingMutation } from "@/hooks/query/mutation/useRemoveFromWorkingMutation";
export {
  useAssignmentReceivedActionMutation,
  useCompletedActionMutation,
  useDoingActionMutation,
  usePaymentActionMutation,
} from "@/hooks/query/mutation/useAssignmentProgressMutations";

export {
  createInfiniteListQuery,
  type InfiniteListPage,
  type InfiniteListParams,
} from "@/hooks/query/infinite/createInfiniteListQuery";
export { useInfiniteUsersQuery } from "@/hooks/query/infinite/useInfiniteUsersQuery";
export { useInfiniteUserAssignmentsQuery } from "@/hooks/query/infinite/useInfiniteUserAssignmentsQuery";
export { useInfiniteAssignmentsQuery } from "@/hooks/query/infinite/useInfiniteAssignmentsQuery";
export { useInfiniteWorkingQuery } from "@/hooks/query/infinite/useInfiniteWorkingQuery";
