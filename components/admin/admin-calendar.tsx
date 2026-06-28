"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BORDER, TEXT_DARK, WHITE } from "@/lib/colors";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const statusColors = {
  available: "#7ae3aa",
  booked: "#f03063",
} as const;

const bookedBackground = "#f0306314";

type CalendarDateMeta = {
  date: string;
  isDelivery: boolean;
  isDelivered: boolean;
};

type AdminCalendarProps = {
  initialBookedDates: string[];
  initialDateMeta: CalendarDateMeta[];
};

function LegendSwatch({
  label,
  backgroundColor,
  borderColor = BORDER,
}: {
  label: string;
  backgroundColor: string;
  borderColor?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span
        className="size-4 shrink-0 rounded-md border"
        style={{ backgroundColor, borderColor }}
      />
      {label}
    </span>
  );
}

export function AdminCalendar({
  initialBookedDates,
  initialDateMeta,
}: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [bookedDates, setBookedDates] = useState<string[]>(initialBookedDates);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);

  const dateMetaByDate = useMemo(
    () => new Map(initialDateMeta.map((entry) => [entry.date, entry])),
    [initialDateMeta]
  );

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);

    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [currentMonth]);

  const selectedToBook = useMemo(
    () => selectedDates.filter((date) => !bookedDates.includes(date)),
    [selectedDates, bookedDates]
  );

  const selectedToAvailable = useMemo(
    () => selectedDates.filter((date) => bookedDates.includes(date)),
    [selectedDates, bookedDates]
  );

  const handleDateClick = (dateString: string, isPast: boolean) => {
    if (isPast) return;

    setSelectedDates((previous) =>
      previous.includes(dateString)
        ? previous.filter((date) => date !== dateString)
        : [...previous, dateString]
    );
  };

  const handleMarkAsBooked = async () => {
    if (selectedToBook.length === 0) return;

    setIsSaving(true);

    try {
      console.log({ action: "book", dates: selectedToBook });
      setBookedDates((previous) => [...previous, ...selectedToBook]);
      setSelectedDates((previous) =>
        previous.filter((date) => !selectedToBook.includes(date))
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsAvailable = async () => {
    if (selectedToAvailable.length === 0) return;

    setIsSaving(true);

    try {
      console.log({ action: "available", dates: selectedToAvailable });
      setBookedDates((previous) =>
        previous.filter((date) => !selectedToAvailable.includes(date))
      );
      setSelectedDates((previous) =>
        previous.filter((date) => !selectedToAvailable.includes(date))
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card size="sm" className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="shrink-0 space-y-4 border-b py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-1">
            <CardTitle className="text-base">Availability Calendar</CardTitle>
            <CardDescription>
              Select dates to mark as booked or available.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedDates.length > 0 ? (
              <>
                <span className="rounded-xl bg-muted px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-foreground/10">
                  {selectedDates.length} day
                  {selectedDates.length === 1 ? "" : "s"} selected
                </span>
                {selectedToBook.length > 0 ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isSaving}
                    onClick={handleMarkAsBooked}
                    className="rounded-xl"
                  >
                    {isSaving ? "Saving..." : "Mark as booked"}
                  </Button>
                ) : null}
                {selectedToAvailable.length > 0 ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isSaving}
                    onClick={handleMarkAsAvailable}
                    className="rounded-xl"
                  >
                    {isSaving ? "Saving..." : "Mark as available"}
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Previous month"
              onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
              className="rounded-xl border-black bg-black text-white hover:bg-black/90 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="size-4 text-white" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label="Next month"
              onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
              className="rounded-xl border-black bg-black text-white hover:bg-black/90 hover:text-white cursor-pointer"
            >
              <ChevronRight className="size-4 text-white" />
            </Button>
            <p className="text-lg font-semibold tracking-tight">
              {format(currentMonth, "MMMM yyyy")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <LegendSwatch label="Available" backgroundColor="transparent" />
            <LegendSwatch label="Booked" backgroundColor={bookedBackground} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-4 sm:p-5">
        <div className="grid shrink-0 grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {weekdayLabels.map((day) => (
            <div key={day} className="py-0.5">
              {day}
            </div>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6 gap-2">
          {monthDays.map((day) => {
            const dateString = format(day, "yyyy-MM-dd");
            const inCurrentMonth = isSameMonth(day, currentMonth);
            const isBooked = bookedDates.includes(dateString);
            const isSelected = selectedDates.includes(dateString);
            const isTodayDate = isToday(day);
            const isPast = isBefore(startOfDay(day), today);
            const dateMeta = dateMetaByDate.get(dateString);
            const isDelivery = dateMeta?.isDelivery ?? false;
            const isDelivered = dateMeta?.isDelivered ?? false;

            if (!inCurrentMonth) {
              return <div key={dateString} aria-hidden className="min-h-0" />;
            }

            const selectedBorderColor =
              isSelected && isBooked
                ? statusColors.available
                : isSelected
                  ? statusColors.booked
                  : undefined;

            const cellBackgroundColor = isBooked ? bookedBackground : "transparent";

            return (
              <div
                key={dateString}
                role="button"
                tabIndex={isPast ? -1 : 0}
                aria-label={format(day, "EEEE, MMMM d, yyyy")}
                aria-pressed={isSelected}
                aria-disabled={isPast}
                onClick={() => handleDateClick(dateString, isPast)}
                onKeyDown={(event) => {
                  if (isPast) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleDateClick(dateString, isPast);
                  }
                }}
                className={cn(
                  "relative box-border flex h-full min-h-0 w-full flex-col rounded-lg border p-2 text-left transition-[border-color,background-color,color] sm:p-2.5",
                  isPast ? "cursor-not-allowed" : "cursor-pointer"
                )}
                style={{
                  borderColor: selectedBorderColor ?? BORDER,
                  backgroundColor: cellBackgroundColor,
                }}
              >
                <span
                  className={cn(
                    "font-semibold tabular-nums",
                    isTodayDate
                      ? "inline-flex size-6 items-center justify-center rounded-full text-xs text-white sm:size-7 sm:text-sm"
                      : "text-sm text-foreground sm:text-base"
                  )}
                  style={
                    isTodayDate
                      ? { backgroundColor: TEXT_DARK, color: WHITE }
                      : undefined
                  }
                >
                  {format(day, "d")}
                </span>

                <div className="mt-auto flex flex-col items-start gap-1 pt-1">
                  {isDelivery ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log("delivery clicked");
                      }}
                      className="cursor-pointer rounded-md border border-[#895ef6] px-1.5 py-0.5 text-[10px] font-medium text-[#895ef6] sm:text-xs"
                    >
                      Delivery
                    </button>
                  ) : null}
                  {isDelivered ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log("delivered clicked");
                      }}
                      className="cursor-pointer rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:text-xs"
                      style={{
                        borderColor: statusColors.available,
                        color: statusColors.available,
                      }}
                    >
                      Delivered
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
