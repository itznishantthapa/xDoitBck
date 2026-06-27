import { AssignmentPieChart } from "@/components/admin/assignment-pie-chart";
import { DashboardToolbar } from "@/components/admin/dashboard-toolbar";
import { PlatformUsersAreaChart } from "@/components/admin/platform-users-area-chart";
import { StatsCard } from "@/components/admin/stats-card";
import { dashboardMockData } from "@/lib/dashboardMockData";

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 pt-6">
      <DashboardToolbar />

      <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dashboardMockData.stats.map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
              />
            ))}
          </div>

          <PlatformUsersAreaChart
            data={dashboardMockData.platformUsers}
            className="min-h-0 w-full"
          />
        </div>

        <aside className="flex min-h-0 w-full shrink-0 lg:w-80 xl:w-[22rem]">
          <AssignmentPieChart
            data={dashboardMockData.assignmentsPie}
            className="w-full"
          />
        </aside>
      </div>
    </div>
  );
}
