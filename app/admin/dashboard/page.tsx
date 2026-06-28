import { AssignmentCompletionAreaChart } from "@/components/admin/assignment-completion-area-chart";
import { AssignmentPieChart } from "@/components/admin/assignment-pie-chart";
import { DashboardToolbar } from "@/components/admin/dashboard-toolbar";
import { StatsCard, type StatsCardPlatformBreakdown, type StatsCardTrend } from "@/components/admin/stats-card";
import { dashboardResponse } from "@/mock/DashboardMocked";

const { stats, assignmentBreakdown, assignmentCompletion } = dashboardResponse;

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
    id: "payments",
    title: "Payment",
    value: stats.payments.total,
    trend: formatTrend(stats.payments.growthPercentage),
  },
  {
    id: "deliveries",
    title: "Deliveries",
    value: stats.deliveries.total,
    trend: formatTrend(stats.deliveries.growthPercentage),
  },
  {
    id: "mentors",
    title: "Mentors",
    value: stats.mentors.total,
    trend: formatTrend(stats.mentors.growthPercentage),
  },
  {
    id: "students",
    title: "Students",
    value: stats.students.total,
    trend: formatTrend(stats.students.growthPercentage),
  },
];

const assignmentsPie = {
  title: "Assignment Breakdown",
  description: assignmentBreakdown.period,
  footerTrend: `Trending up by ${assignmentBreakdown.growthPercentage}% this month`,
  footerNote: "Showing assignment status for the last 6 months",
  data: assignmentBreakdown.statuses.map((item) => ({
    status: item.status.toLowerCase() as
      | "pending"
      | "review"
      | "completed"
      | "doing"
      | "rejected",
    count: item.count,
  })),
};

const assignmentCompletionChart = {
  title: "Assignment Completion",
  description: "Completed vs rejected assignments of last 30 days",
  series: assignmentCompletion.series,
};

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 pt-6">
      <DashboardToolbar />

      <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5">
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
            className="min-h-0 w-full"
          />
        </div>

        <aside className="flex min-h-0 w-full shrink-0 lg:w-80 xl:w-[22rem]">
          <AssignmentPieChart data={assignmentsPie} className="w-full" />
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
