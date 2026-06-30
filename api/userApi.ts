import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

import type { AssignmentStatus } from "@/api/assignmentApi";

export type UserRole = "Admin" | "User";

export type AdminUser = {
  id: string;
  username: string;
  role: UserRole;
  country: string;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
};

export type UserStats = {
  totalGiven: string;
  totalInReview: string;
  totalDoing: string;
  totalCompleted: string;
  totalRejected: string;
};

export type UserDetailsAssignment = {
  id: string;
  name: string;
  assignmentType: string;
  status: AssignmentStatus;
  isPaid: boolean;
  deliveryDate: string | null;
  providedDate: string | null;
};

export type UserDetails = {
  id: string;
  username: string;
  createdAt: string;
  user_stats: UserStats;
};

type UsersInfiniteResponse = {
  message: string;
  users: AdminUser[];
  total_count: number;
  next_offset: number | null;
  has_more: boolean;
};

type UserDetailsResponse = {
  message: string;
  user: UserDetails;
};

type UserAssignmentsInfiniteResponse = {
  message: string;
  assignments: UserDetailsAssignment[];
  total_count: number;
  next_offset: number | null;
  has_more: boolean;
};

export async function getUsersInfinite(offset: number, limit: number) {
  const { data } = await API_CLIENT.get<UsersInfiniteResponse>(endpoints.users, {
    params: { offset, limit },
  });

  return {
    items: data.users,
    nextOffset: data.next_offset,
    hasMore: data.has_more,
    totalCount: data.total_count,
  };
}

export async function getUserDetails(userId: string) {
  const { data } = await API_CLIENT.get<UserDetailsResponse>(
    endpoints.userDetails(userId)
  );

  return data.user;
}

export async function getUserAssignmentsInfinite(
  userId: string,
  offset: number,
  limit: number
) {
  const { data } = await API_CLIENT.get<UserAssignmentsInfiniteResponse>(
    endpoints.userAssignments(userId),
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

export async function deleteUser(payload: { userId: string }) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.usersDelete,
    { user_id: payload.userId }
  );

  return data;
}
