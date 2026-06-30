"use client";

import {
  FolderAddIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AndroidIcon, AppleIcon } from "@/components/icons/platform-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type StatsCardTrendIcon = "added" | "verification";

export type StatsCardTrend = {
  value: string;
  direction: "up" | "down";
  label: string;
  icon?: StatsCardTrendIcon;
};

const trendIconMap = {
  added: FolderAddIcon,
  verification: InformationCircleIcon,
} as const;

const trendIconClassName = {
  added: "text-[#4da1f7]",
  verification: "text-emerald-600",
} as const;

export type StatsCardPlatformBreakdown = {
  iosUsers: number;
  androidUsers: number;
};

export type StatsCardProps = {
  title: string;
  value: number;
  trend: StatsCardTrend;
  platformBreakdown?: StatsCardPlatformBreakdown;
  className?: string;
};

export function StatsCard({
  title,
  value,
  trend,
  platformBreakdown,
  className,
}: StatsCardProps) {
  const isUp = trend.direction === "up";

  return (
    <Card size="sm" className={cn("pt-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 border-b py-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        {platformBreakdown ? (
          <div className="flex shrink-0 items-center gap-x-2.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground sm:text-sm">
              <AppleIcon className="size-3.5 sm:size-4" />
              {platformBreakdown.iosUsers.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#3ddc84] sm:text-sm">
              <AndroidIcon className="size-3.5 sm:size-4" />
              {platformBreakdown.androidUsers.toLocaleString()}
            </span>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-2xl font-bold leading-none tracking-tight">
          {value.toLocaleString()}
        </p>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm leading-snug">
          {trend.icon ? (
            <HugeiconsIcon
              icon={trendIconMap[trend.icon]}
              size={14}
              strokeWidth={2}
              className={cn("shrink-0", trendIconClassName[trend.icon])}
            />
          ) : null}
          {trend.value ? (
            <>
              <span
                className={cn(
                  "font-medium",
                  isUp ? "text-emerald-600" : "text-orange-600"
                )}
              >
                {trend.value}
              </span>{" "}
            </>
          ) : null}
          <span className="text-muted-foreground">{trend.label}</span>
        </p>
      </CardContent>
    </Card>
  );
}
