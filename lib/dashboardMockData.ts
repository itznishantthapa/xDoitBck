import rawDashboardMockData from "./dashboardMockData.json";
import type { StatsCardTrend } from "@/components/admin/stats-card";

type DashboardStat = {
  id: string;
  title: string;
  value: number;
  trend: StatsCardTrend;
};

type AssignmentPieSlice = {
  status: "pending" | "review" | "completed" | "doing" | "rejected";
  count: number;
};

type PlatformUserPoint = {
  date: string;
  android: number;
  ios: number;
};

export type DashboardMockData = {
  stats: DashboardStat[];
  assignmentsPie: {
    title: string;
    description: string;
    footerTrend: string;
    footerNote: string;
    data: AssignmentPieSlice[];
  };
  platformUsers: {
    title: string;
    description: string;
    referenceDate: string;
    data: PlatformUserPoint[];
  };
};

export const dashboardMockData = rawDashboardMockData as DashboardMockData;

export type { DashboardStat, AssignmentPieSlice, PlatformUserPoint };
