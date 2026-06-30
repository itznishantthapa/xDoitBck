import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type AssignmentStatus =
  | "pending"
  | "rejected"
  | "payment_pending"
  | "payment_rejected"
  | "doing"
  | "completed"
  | "unsubmitted";

export type AssignmentTabStatus =
  | "pending"
  | "doing"
  | "completed"
  | "changes"
  | "rejected"
  | "all";

export type AdminAssignment = {
  id: string;
  name: string;
  user: string;
  assignmentType: string;
  status: AssignmentStatus;
  isPaid: boolean;
  isWorking: boolean;
  providedDate: string | null;
  deliveryDate: string | null;
};

type AssignmentsInfiniteResponse = {
  message: string;
  assignments: AdminAssignment[];
  total_count: number;
  next_offset: number | null;
  has_more: boolean;
};

export async function getAssignmentsInfinite(
  offset: number,
  limit: number,
  status: AssignmentTabStatus
) {
  const { data } = await API_CLIENT.get<AssignmentsInfiniteResponse>(
    endpoints.assignments,
    {
      params: { offset, limit, status },
    }
  );

  return {
    items: data.assignments,
    nextOffset: data.next_offset,
    hasMore: data.has_more,
    totalCount: data.total_count,
  };
}

export async function deleteAssignment(payload: { assignmentId: string }) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentsDelete,
    { assignment_id: payload.assignmentId }
  );

  return data;
}

export async function addAssignmentOnWorking(payload: { assignmentId: string }) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentsAddOnWorking,
    { assignment_id: payload.assignmentId }
  );

  return data;
}
