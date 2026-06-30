import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type BadgeNumbers = {
  pendingAssignments: number;
  workingAssignments: number;
};

type BadgeNumbersResponse = {
  message: string;
  pendingAssignments: number;
  workingAssignments: number;
};

export async function getBadgeNumbers(): Promise<BadgeNumbers> {
  const { data } = await API_CLIENT.get<BadgeNumbersResponse>(endpoints.badges);

  return {
    pendingAssignments: data.pendingAssignments,
    workingAssignments: data.workingAssignments,
  };
}
