"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, type PieLabelRenderProps } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  count: {
    label: "Assignments",
  },
  review: {
    label: "In Review",
    color: "#4da1f7",
  },
  payment_pending: {
    label: "Payment Pending",
    color: "#895ef6",
  },
  completed: {
    label: "Completed",
    color: "#7ae3aa",
  },
  doing: {
    label: "Doing",
    color: "#f1cd3b",
  },
  rejected: {
    label: "Rejected",
    color: "#f03063",
  },
} satisfies ChartConfig;

export type PieStatusKey = keyof Omit<typeof chartConfig, "count">;

export function mapBreakdownStatus(status: string): PieStatusKey | null {
  switch (status) {
    case "Review":
      return "review";
    case "Payment Pending":
      return "payment_pending";
    case "Completed":
      return "completed";
    case "Doing":
      return "doing";
    case "Rejected":
      return "rejected";
    default:
      return null;
  }
}

type AssignmentPieChartProps = {
  data: {
    title: string;
    description: string;
    footerTrend: string;
    footerNote: string;
    data: {
      status: PieStatusKey;
      count: number;
    }[];
  };
  className?: string;
};

function renderPieLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  value = 0,
}: PieLabelRenderProps) {
  const RADIAN = Math.PI / 180;
  const radius = Number(outerRadius) * 1.18;
  const x = Number(cx) + radius * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      textAnchor={x > Number(cx) ? "start" : "end"}
      dominantBaseline="central"
      className="fill-foreground text-[10px] font-semibold"
    >
      {Number(value).toLocaleString()}
    </text>
  );
}

export function AssignmentPieChart({ data, className }: AssignmentPieChartProps) {
  const chartData = data.data.map((item) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={cn("flex h-full min-h-0 flex-col pt-0", className)}>
      <CardHeader className="shrink-0 space-y-0 border-b py-3">
        <div className="grid gap-0.5">
          <CardTitle className="text-base">{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 px-3 py-4">
        <div className="flex min-h-[220px] flex-1 items-center justify-center">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-[260px] max-w-[260px] [&_.recharts-pie-label-line]:stroke-muted-foreground [&_.recharts-pie-label-text]:fill-foreground [&_.recharts-responsive-container]:size-full!"
          >
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <ChartTooltip
                content={<ChartTooltipContent hideLabel nameKey="status" />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius="56%"
                strokeWidth={2}
                label={renderPieLabel}
                labelLine={{ stroke: "var(--color-muted-foreground)", strokeWidth: 1 }}
              />
            </PieChart>
          </ChartContainer>
        </div>

        <ul className="shrink-0 space-y-2.5 border-t pt-3">
          {chartData.map((item) => {
            const label =
              chartConfig[item.status as keyof typeof chartConfig]?.label ??
              item.status;
            const share =
              total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";

            return (
              <li key={item.status} className="flex items-center gap-2 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="flex-1 capitalize text-muted-foreground">
                  {label}
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {item.count.toLocaleString()}
                </span>
                <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                  {share}%
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>

      <CardFooter className="shrink-0 flex-col items-start gap-1 border-t bg-muted/30 px-4 py-3 text-left">
        <div className="flex items-center gap-1.5 text-xs font-medium leading-tight text-foreground">
          {data.footerTrend}
          <TrendingUp className="size-3.5 shrink-0" />
        </div>
        <p className="text-xs leading-snug text-muted-foreground">
          {data.footerNote}
        </p>
      </CardFooter>
    </Card>
  );
}
