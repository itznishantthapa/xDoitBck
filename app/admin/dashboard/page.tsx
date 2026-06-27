import { AssignmentPieChart } from "@/components/admin/assignment-pie-chart";
import { DashboardToolbar } from "@/components/admin/dashboard-toolbar";
import { PlatformUsersAreaChart } from "@/components/admin/platform-users-area-chart";
import { StatsCard } from "@/components/admin/stats-card";

const stats = [
  {
    id: "users",
    title: "Users",
    value: 16815,
    trend: { value: "1.7%", direction: "up" as const, label: "from last month" },
  },
  {
    id: "assignments",
    title: "Assignment",
    value: 2840,
    trend: { value: "3.2%", direction: "up" as const, label: "from last month" },
  },
  {
    id: "payments",
    title: "Payment",
    value: 94250,
    trend: { value: "0.8%", direction: "down" as const, label: "from last month" },
  },
  {
    id: "deliveries",
    title: "Deliveries",
    value: 1264,
    trend: { value: "2.4%", direction: "up" as const, label: "from last month" },
  },
  {
    id: "mentors",
    title: "Mentors",
    value: 428,
    trend: { value: "2.1%", direction: "up" as const, label: "from last month" },
  },
  {
    id: "students",
    title: "Students",
    value: 9120,
    trend: { value: "4.5%", direction: "up" as const, label: "from last month" },
  },
];

const assignmentsPie = {
  title: "Assignment Breakdown",
  description: "January - June 2026",
  footerTrend: "Trending up by 5.2% this month",
  footerNote: "Showing assignment status for the last 6 months",
  data: [
    { status: "pending" as const, count: 420 },
    { status: "review" as const, count: 186 },
    { status: "completed" as const, count: 1240 },
    { status: "doing" as const, count: 312 },
    { status: "rejected" as const, count: 98 },
  ],
};

const platformUsers = {
  title: "Platform Users",
  description: "Android vs iOS active users",
  referenceDate: "2026-06-30",
  data: buildPlatformUserSeries("2026-06-30"),
};

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5 pt-6">
      <DashboardToolbar />

      <div className="flex min-h-0 flex-1 flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="grid min-h-0 min-w-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <StatsCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
              />
            ))}
          </div>

          <PlatformUsersAreaChart
            data={platformUsers}
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

function buildPlatformUserSeries(referenceDate: string, days = 91) {
  const end = new Date(referenceDate);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end);
    date.setDate(end.getDate() - (days - 1 - index));

    const wave = Math.sin(index / 6) * 90;
    const androidBase = 180 + ((index * 37) % 320);
    const iosBase = 160 + ((index * 53) % 360);

    return {
      date: date.toISOString().slice(0, 10),
      android: Math.round(androidBase + wave),
      ios: Math.round(iosBase - wave * 0.6),
    };
  });
}
