"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { AssignmentCompletionSeriesPoint } from "@/api/dashboardApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  assignments: {
    label: "Assignments",
  },
  completed: {
    label: "Completed",
    color: "#7ae3aa",
  },
  rejected: {
    label: "Rejected",
    color: "#f03063",
  },
} satisfies ChartConfig;

type AssignmentCompletionAreaChartProps = {
  data: {
    title: string;
    description: string;
    series: AssignmentCompletionSeriesPoint[];
  };
  className?: string;
};

export function AssignmentCompletionAreaChart({
  data,
  className,
}: AssignmentCompletionAreaChartProps) {
  return (
    <Card className={cn("flex min-h-0 flex-col pt-0", className)}>
      <CardHeader className="shrink-0 space-y-0 border-b py-4">
        <div className="grid gap-1">
          <CardTitle className="text-base">{data.title}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-2 pt-4 pb-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-[160px] w-full flex-1"
        >
          <AreaChart
            data={data.series}
            margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-completed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(`${value}T00:00:00`);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="url(#fillCompleted)"
              stroke="var(--color-completed)"
              stackId="a"
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
