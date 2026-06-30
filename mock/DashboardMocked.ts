export type DashboardStat = {
  total: number;
  growthPercentage: number;
};

export type DashboardUsersStat = DashboardStat & {
  iosUsers: number;
  androidUsers: number;
};

export type AssignmentBreakdownStatus = {
  status: "Pending" | "Review" | "Completed" | "Doing" | "Rejected";
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
    working: DashboardStat;
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

export const dashboardResponse: DashboardResponse = {
  message: "Dashboard data retrieved successfully.",

  stats: {
    users: {
      total: 16815,
      growthPercentage: 1.7,
      iosUsers: 1600,
      androidUsers: 815,
    },
    assignments: {
      total: 2840,
      growthPercentage: 3.2,
    },
    revenue: {
      total: 94250,
      growthPercentage: 0.8,
    },
    deliveries: {
      total: 1264,
      growthPercentage: 2.4,
    },
    working: {
      total: 12,
      growthPercentage: 0,
    },
    pendingPayments: {
      total: 2,
      growthPercentage: 0,
    },
  },

  assignmentBreakdown: {
    total: 2256,
    statuses: [
      { status: "Pending", count: 420, percentage: 18.6 },
      { status: "Review", count: 186, percentage: 8.2 },
      { status: "Completed", count: 1240, percentage: 55.0 },
      { status: "Doing", count: 312, percentage: 13.8 },
      { status: "Rejected", count: 98, percentage: 4.3 },
    ],
    growthPercentage: 5.2,
    period: "Lifetime",
  },

  assignmentCompletion: {
    completed: 118,
    rejected: 9,
    series: [
      { date: "2026-05-29", completed: 3, rejected: 0 },
      { date: "2026-05-30", completed: 4, rejected: 0 },
      { date: "2026-05-31", completed: 3, rejected: 1 },
      { date: "2026-06-01", completed: 5, rejected: 0 },
      { date: "2026-06-02", completed: 4, rejected: 1 },
      { date: "2026-06-03", completed: 3, rejected: 1 },
      { date: "2026-06-04", completed: 4, rejected: 1 },
      { date: "2026-06-05", completed: 5, rejected: 0 },
      { date: "2026-06-06", completed: 3, rejected: 0 },
      { date: "2026-06-07", completed: 4, rejected: 1 },
      { date: "2026-06-08", completed: 4, rejected: 0 },
      { date: "2026-06-09", completed: 4, rejected: 0 },
      { date: "2026-06-10", completed: 4, rejected: 0 },
      { date: "2026-06-11", completed: 3, rejected: 1 },
      { date: "2026-06-12", completed: 4, rejected: 0 },
      { date: "2026-06-13", completed: 5, rejected: 0 },
      { date: "2026-06-14", completed: 4, rejected: 0 },
      { date: "2026-06-15", completed: 3, rejected: 0 },
      { date: "2026-06-16", completed: 4, rejected: 0 },
      { date: "2026-06-17", completed: 5, rejected: 1 },
      { date: "2026-06-18", completed: 4, rejected: 0 },
      { date: "2026-06-19", completed: 3, rejected: 0 },
      { date: "2026-06-20", completed: 4, rejected: 0 },
      { date: "2026-06-21", completed: 5, rejected: 0 },
      { date: "2026-06-22", completed: 3, rejected: 1 },
      { date: "2026-06-23", completed: 4, rejected: 0 },
      { date: "2026-06-24", completed: 5, rejected: 0 },
      { date: "2026-06-25", completed: 3, rejected: 0 },
      { date: "2026-06-26", completed: 5, rejected: 0 },
      { date: "2026-06-27", completed: 4, rejected: 1 },
    ],
  },
};
