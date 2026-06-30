"use client";

import { useSearchParams } from "next/navigation";

import { CalendarAssignmentsView } from "@/components/admin/calendar-assignments-view";
import { calendarData } from "@/mock/CalendarMocked";

export default function CalendarDeliveredPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "";

  return (
    <CalendarAssignmentsView
      kind="delivered"
      date={date}
      dateMeta={calendarData.calendarDateMeta}
    />
  );
}
