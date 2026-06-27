"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import type { TileArgs } from "react-calendar";

import { TEXT_MUTED } from "@/lib/colors";
import {
  buildAvailabilityFromBusyDates,
  formatLastUpdated,
  getToday,
  toDateString,
} from "@/lib/availability";
import { cn } from "@/lib/utils";

import "react-calendar/dist/Calendar.css";
import "./availability-calendar.css";

type AvailabilityCalendarProps = {
  busyDates: readonly string[];
  lastUpdatedAt?: string;
  className?: string;
};

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium" style={{ color: TEXT_MUTED }}>
        {label}
      </span>
    </div>
  );
}

export function AvailabilityCalendar({
  busyDates,
  lastUpdatedAt,
  className,
}: AvailabilityCalendarProps) {
  const [value, setValue] = useState<Date>(getToday());

  const { bookedDates, availableDates } = useMemo(
    () => buildAvailabilityFromBusyDates(busyDates),
    [busyDates]
  );

  const getTileClassName = ({ date, view }: TileArgs) => {
    if (view !== "month") return null;

    const key = toDateString(date);
    if (bookedDates.has(key)) return "availability-tile availability-tile--busy";
    if (availableDates.has(key)) return "availability-tile availability-tile--available";

    return null;
  };

  const getTileContent = ({ date, view }: TileArgs) => {
    if (view !== "month") return null;

    const key = toDateString(date);
    if (bookedDates.has(key)) {
      return <span className="availability-tile-label">Busy</span>;
    }
    if (availableDates.has(key)) {
      return <span className="availability-tile-label">Avl</span>;
    }

    return null;
  };

  return (
    <div className={cn("availability-calendar", className)}>
      <Calendar
        className="availability-calendar-widget"
        value={value}
        onChange={(nextValue) => {
          if (nextValue instanceof Date) {
            setValue(nextValue);
          }
        }}
        minDate={getToday()}
        tileClassName={getTileClassName}
        tileContent={getTileContent}
      />

      <div className="availability-calendar-footer">
        <div className="flex items-center justify-center gap-5">
          <LegendItem color="#16A34A" label="Available" />
          <LegendItem color="#DC2626" label="Busy" />
        </div>
        {lastUpdatedAt ? (
          <p className="mt-2 text-center text-xs font-medium" style={{ color: TEXT_MUTED }}>
            Updated {formatLastUpdated(lastUpdatedAt)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
