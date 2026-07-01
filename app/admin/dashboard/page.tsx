"use client";

import { AssignmentCompletionAreaChart } from "@/components/admin/assignment-completion-area-chart";
import {
  AssignmentPieChart,
  mapBreakdownStatus,
} from "@/components/admin/assignment-pie-chart";
import { DashboardToolbar } from "@/components/admin/dashboard-toolbar";
import {
  StatsCard,
  type StatsCardPlatformBreakdown,
  type StatsCardTrend,
} from "@/components/admin/stats-card";
import { useDashboardQuery, useBadgeNumbersQuery } from "@/hooks/query";
import { getApiErrorMessage } from "@/service/client";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardQuery();
  useBadgeNumbersQuery();

  if (isLoading) {
    return null;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load dashboard data.")}
      </div>
    );
  }

  const { stats, assignmentBreakdown, assignmentCompletion } = data;

  const statCards: {
    id: string;
    title: string;
    value: number;
    trend: StatsCardTrend;
    platformBreakdown?: StatsCardPlatformBreakdown;
  }[] = [
    {
      id: "users",
      title: "Users",
      value: stats.users.total,
      trend: formatTrend(stats.users.growthPercentage),
      platformBreakdown: {
        iosUsers: stats.users.iosUsers,
        androidUsers: stats.users.androidUsers,
      },
    },
    {
      id: "assignments",
      title: "Assignment",
      value: stats.assignments.total,
      trend: formatTrend(stats.assignments.growthPercentage),
    },
    {
      id: "revenue",
      title: "Revenue",
      value: stats.revenue.total,
      trend: formatTrend(stats.revenue.growthPercentage),
    },
    {
      id: "deliveries",
      title: "Deliveries",
      value: stats.deliveries.total,
      trend: formatTrend(stats.deliveries.growthPercentage),
    },
    {
      id: "changes",
      title: "Changes",
      value: stats.changes.total,
      trend: {
        value: "",
        direction: "up",
        label: "request made",
        icon: "changes",
      },
    },
    {
      id: "payment",
      title: "Payment",
      value: stats.pendingPayments.total,
      trend: {
        value: "",
        direction: "up",
        label: "verification needed",
        icon: "verification",
      },
    },
  ];

  const assignmentsPie = {
    title: "Assignment Breakdown",
    description: assignmentBreakdown.period,
    footerTrend: `Trending up by ${assignmentBreakdown.growthPercentage}% this month`,
    footerNote: "Showing assignment status for the last 6 months",
    data: assignmentBreakdown.statuses.flatMap((item) => {
      const status = mapBreakdownStatus(item.status);
      if (!status || item.count === 0) {
        return [];
      }

      return [{ status, count: item.count }];
    }),
  };

  const assignmentCompletionChart = {
    title: "Assignment Completion",
    description: "Completed vs rejected assignments of last 30 days",
    series: assignmentCompletion.series,
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 pt-4 lg:h-full lg:min-h-0 lg:pt-6">
      <DashboardToolbar />

      <div className="flex flex-col gap-5 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-stretch">
        <div className="grid min-w-0 flex-1 gap-5 lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {statCards.map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                platformBreakdown={stat.platformBreakdown}
              />
            ))}
          </div>

          <AssignmentCompletionAreaChart
            data={assignmentCompletionChart}
            className="min-h-[280px] w-full lg:min-h-0"
          />
        </div>

        <aside className="flex w-full shrink-0 lg:min-h-0 lg:w-80 xl:w-88">
          <AssignmentPieChart
            data={assignmentsPie}
            className="min-h-[320px] w-full lg:h-full lg:min-h-0"
          />
        </aside>
      </div>
    </div>
  );
}

function formatTrend(growthPercentage: number): StatsCardTrend {
  return {
    value: `${growthPercentage}%`,
    direction: growthPercentage >= 0 ? "up" : "down",
    label: "from last month",
  };
}
