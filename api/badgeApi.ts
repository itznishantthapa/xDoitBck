import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type BadgeNumbers = {
  inReviewAssignments: number;
  workingAssignments: number;
};

type BadgeNumbersResponse = {
  message: string;
  inReviewAssignments?: number;
  pendingAssignments?: number;
  workingAssignments: number;
};

export async function getBadgeNumbers(): Promise<BadgeNumbers> {
  const { data } = await API_CLIENT.get<BadgeNumbersResponse>(endpoints.badges);

  return {
    inReviewAssignments:
      data.inReviewAssignments ?? data.pendingAssignments ?? 0,
    workingAssignments: data.workingAssignments,
  };
}
