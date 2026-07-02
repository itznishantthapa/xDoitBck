"use client";

import Image from "next/image";
import {
  Edit02Icon,
  FolderAddIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AndroidIcon, AppleIcon } from "@/components/icons/platform-icons";
import { statsCardTokens } from "@/lib/colors";
import { cn } from "@/lib/utils";

export type StatsCardTrendIcon = "added" | "verification" | "changes";

export type StatsCardTrend = {
  value: string;
  direction: "up" | "down";
  label: string;
  icon?: StatsCardTrendIcon;
};

const trendIconMap = {
  added: FolderAddIcon,
  verification: InformationCircleIcon,
  changes: Edit02Icon,
} as const;

const trendIconClassName = {
  added: "text-[#4da1f7]",
  verification: "text-emerald-600",
  changes: "text-orange-600",
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
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function StatsCard({
  title,
  value,
  trend,
  platformBreakdown,
  imageSrc,
  imageAlt,
  className,
}: StatsCardProps) {
  const isUp = trend.direction === "up";
  const hasImage = Boolean(imageSrc);

  return (
    <div className={cn(statsCardTokens.base, className)}>
      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col",
          hasImage && "pr-14 sm:pr-16"
        )}
      >
        <p className="text-[13px] font-medium leading-tight text-foreground">
          {title}
        </p>

        <p className="mt-1.5 text-[22px] font-semibold leading-none tracking-tight text-foreground sm:text-2xl">
          {value.toLocaleString()}
        </p>

        <p className="mt-2 flex min-w-0 flex-wrap items-center gap-1 text-[11px] leading-snug sm:text-xs">
          {trend.icon ? (
            <HugeiconsIcon
              icon={trendIconMap[trend.icon]}
              size={12}
              strokeWidth={2}
              className={cn("shrink-0", trendIconClassName[trend.icon])}
            />
          ) : null}
          {trend.value ? (
            <span
              className={cn(
                "font-medium",
                isUp ? "text-emerald-600" : "text-orange-600"
              )}
            >
              {trend.value}
            </span>
          ) : null}
          <span className="text-muted-foreground">{trend.label}</span>
        </p>

        {platformBreakdown ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-foreground">
              <AppleIcon className="size-3" />
              {platformBreakdown.iosUsers.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#3ddc84]">
              <AndroidIcon className="size-3" />
              {platformBreakdown.androidUsers.toLocaleString()}
            </span>
          </div>
        ) : null}
      </div>

      {imageSrc ? (
        <div className={statsCardTokens.imageWrap} aria-hidden={!imageAlt}>
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            width={80}
            height={80}
            className={statsCardTokens.image}
            priority={title === "Users"}
          />
        </div>
      ) : null}
    </div>
  );
}
