import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

import type { AssignmentStatus } from "@/api/assignmentApi";

export type WorkingAssignment = {
  id: string;
  name: string;
  user: string;
  assignmentType: string;
  status: AssignmentStatus;
  isPaid: boolean;
  addedBy: string;
  providedDate: string | null;
  deliveryDate: string | null;
};

type WorkingInfiniteResponse = {
  message: string;
  assignments: WorkingAssignment[];
  total_count: number;
  next_offset: number | null;
  has_more: boolean;
};

export async function getWorkingInfinite(offset: number, limit: number) {
  const { data } = await API_CLIENT.get<WorkingInfiniteResponse>(
    endpoints.working,
    {
      params: { offset, limit },
    }
  );

  return {
    items: data.assignments,
    nextOffset: data.next_offset,
    hasMore: data.has_more,
    totalCount: data.total_count,
  };
}

export async function removeFromWorking(payload: { assignmentId: string }) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.workingRemove,
    { assignment_id: payload.assignmentId }
  );

  return data;
}
