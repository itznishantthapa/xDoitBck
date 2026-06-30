"use client";

import { useSearchParams } from "next/navigation";

import { CalendarAssignmentsView } from "@/components/admin/calendar-assignments-view";
import { calendarData } from "@/mock/CalendarMocked";

export default function CalendarDeliveryPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "";

  return (
    <CalendarAssignmentsView
      kind="delivery"
      date={date}
      dateMeta={calendarData.calendarDateMeta}
    />
  );
}
