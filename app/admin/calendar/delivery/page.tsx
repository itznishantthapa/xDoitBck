"use client";

import { useSearchParams } from "next/navigation";

import { CalendarAssignmentsView } from "@/components/admin/calendar-assignments-view";
import { useCalendarQuery } from "@/hooks/query";
import { getApiErrorMessage } from "@/service/client";

export default function CalendarDeliveryPage() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") ?? "";
  const { data, isLoading, isError, error } = useCalendarQuery();

  if (isLoading) {
    return null;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load calendar assignments.")}
      </div>
    );
  }

  return (
    <CalendarAssignmentsView
      kind="delivery"
      date={date}
      dateMeta={data.calendarDateMeta}
    />
  );
}
