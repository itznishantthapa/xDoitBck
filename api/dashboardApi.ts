import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type DashboardStat = {
  total: number;
  growthPercentage: number;
};

export type DashboardUsersStat = DashboardStat & {
  iosUsers: number;
  androidUsers: number;
};

export type AssignmentBreakdownStatus = {
  status: "Review" | "Payment Pending" | "Completed" | "Doing" | "Rejected";
  count: number;
  percentage: number;
};

export type AssignmentCompletionSeriesPoint = {
  date: string;
  completed: number;
  rejected: number;
};

export type DashboardResponse = {
  message: string;
  stats: {
    users: DashboardUsersStat;
    assignments: DashboardStat;
    revenue: DashboardStat;
    deliveries: DashboardStat;
    changes: DashboardStat;
    pendingPayments: DashboardStat;
  };
  assignmentBreakdown: {
    total: number;
    statuses: AssignmentBreakdownStatus[];
    growthPercentage: number;
    period: string;
  };
  assignmentCompletion: {
    completed: number;
    rejected: number;
    series: AssignmentCompletionSeriesPoint[];
  };
};

export async function getDashboardData() {
  const { data } = await API_CLIENT.get<DashboardResponse>(endpoints.dashboard);
  return data;
}
