"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatsCardTrend = {
  value: string;
  direction: "up" | "down";
  label: string;
};

export type StatsCardProps = {
  title: string;
  value: number;
  trend: StatsCardTrend;
  className?: string;
};

export function StatsCard({ title, value, trend, className }: StatsCardProps) {
  const isUp = trend.direction === "up";

  return (
    <Card size="sm" className={cn("pt-0", className)}>
      <CardHeader className="space-y-0 border-b py-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-2xl font-bold leading-none tracking-tight">
          {value.toLocaleString()}
        </p>

        <p className="mt-1.5 text-sm leading-snug">
          <span
            className={cn(
              "font-medium",
              isUp ? "text-emerald-600" : "text-orange-600"
            )}
          >
            {trend.value}
          </span>{" "}
          <span className="text-muted-foreground">{trend.label}</span>
        </p>
      </CardContent>
    </Card>
  );
}
