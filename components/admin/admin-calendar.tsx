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
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import type { CalendarDateMeta } from "@/mock/CalendarMocked";
import { mergeDateMeta } from "@/lib/calendar-utils";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { BORDER, TEXT_DARK, WHITE } from "@/lib/colors";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const weekdayLabelsMobile = ["S", "M", "T", "W", "T", "F", "S"] as const;

const statusColors = {
  available: "#7ae3aa",
  booked: "#f03063",
  delivery: "#895ef6",
} as const;

type AdminCalendarProps = {
  initialBookedDates: string[];
  initialDateMeta: CalendarDateMeta[];
  className?: string;
};

function LegendDot({
  label,
  color,
  className,
}: {
  label: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

const eventChipStyles = {
  booked: "bg-[#f0306314]",
  delivery: "bg-[#895ef614]",
  delivered: "bg-[#7ae3aa18]",
} as const;

function EventChip({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full truncate rounded-none px-1.5 py-0.5 text-[10px] font-semibold leading-none sm:px-2 sm:py-1 sm:text-[11px]",
        eventChipStyles.booked
      )}
      style={{ color: TEXT_DARK }}
    >
      {label}
    </span>
  );
}

function EventActionButton({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: "delivery" | "delivered";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={cn(
        "relative z-10 inline-flex w-fit max-w-full cursor-pointer truncate rounded-none px-1.5 py-0.5 text-left text-[10px] font-semibold leading-none sm:px-2 sm:py-1 sm:text-[11px]",
        eventChipStyles[tone]
      )}
      style={{ color: TEXT_DARK }}
    >
      {label}
    </button>
  );
}

export function AdminCalendar({
  initialBookedDates,
  initialDateMeta,
  className,
}: AdminCalendarProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [bookedDates, setBookedDates] = useState<string[]>(initialBookedDates);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);

  const dateMetaByDate = useMemo(
    () => mergeDateMeta(initialDateMeta),
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

  const handleDateClick = (dateString: string, isPast: boolean, inCurrentMonth: boolean) => {
    if (isPast || !inCurrentMonth) return;

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

  const goToToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  return (
    <Card
      size="sm"
      className={cn("flex min-h-0 w-full min-w-0 flex-1 flex-col pt-0", className)}
    >
      <CardHeader className="shrink-0 space-y-4 border-b py-4">
        <CardDescription>
           Manage your calendar and track your assignments.
        </CardDescription>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setCurrentMonth((month) => subMonths(month, 1))}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <ChevronLeft className="size-5" strokeWidth={1.75} />
            </button>

            <p
              className="min-w-0 text-xl font-semibold tracking-tight sm:text-2xl"
              style={{ color: TEXT_DARK }}
            >
              {format(currentMonth, "MMMM yyyy")}
            </p>

            <button
              type="button"
              aria-label="Next month"
              onClick={() => setCurrentMonth((month) => addMonths(month, 1))}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <ChevronRight className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <button
            type="button"
            onClick={goToToday}
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Today
          </button>
        </div>

        {selectedDates.length > 0 ? (
          <div className="flex flex-col gap-3 rounded-xl bg-muted/40 px-3 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-foreground">
              {selectedDates.length} day
              {selectedDates.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedToBook.length > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={isSaving}
                  onClick={handleMarkAsBooked}
                  className="rounded-lg"
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
                  className="rounded-lg"
                >
                  {isSaving ? "Saving..." : "Mark as available"}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendDot label="Available" color={statusColors.available} />
          <LegendDot label="Booked" color={statusColors.booked} />
          <LegendDot label="Delivery" color={statusColors.delivery} />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-0">
        <div className="min-w-[280px]">
          <div
            className="grid grid-cols-7 border-b bg-muted/30"
            style={{ borderColor: BORDER }}
          >
            {weekdayLabels.map((day, index) => (
              <div
                key={day}
                className="py-2.5 text-center text-[11px] font-medium text-muted-foreground sm:text-xs"
              >
                <span className="sm:hidden">{weekdayLabelsMobile[index]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          <div
            className="grid grid-cols-7 grid-rows-6"
            style={{ borderColor: BORDER }}
          >
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
              const canSelectDate = inCurrentMonth && !isPast;
              const hasEventActions = isDelivery || isDelivered;

              return (
                <div
                  key={dateString}
                  role={canSelectDate ? "button" : undefined}
                  tabIndex={canSelectDate ? 0 : undefined}
                  aria-label={format(day, "EEEE, MMMM d, yyyy")}
                  aria-pressed={canSelectDate ? isSelected : undefined}
                  onClick={() =>
                    canSelectDate &&
                    handleDateClick(dateString, isPast, inCurrentMonth)
                  }
                  onKeyDown={(event) => {
                    if (!canSelectDate) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleDateClick(dateString, isPast, inCurrentMonth);
                    }
                  }}
                  className={cn(
                    "relative flex min-h-24 flex-col border-b border-r p-1.5 text-left transition-colors sm:min-h-28 sm:p-2",
                    !inCurrentMonth && "bg-muted/20",
                    inCurrentMonth && isBooked && "bg-[#f030630a]",
                    isPast && inCurrentMonth && "bg-muted/10",
                    isSelected &&
                      "bg-[#1a73e814] ring-2 ring-inset ring-[#1a73e8]/50",
                    canSelectDate && !isSelected && "cursor-pointer hover:bg-muted/30",
                    !canSelectDate && !hasEventActions && "opacity-45",
                    !canSelectDate && "cursor-default"
                  )}
                  style={{ borderColor: BORDER }}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums sm:size-7 sm:text-sm",
                      !inCurrentMonth && "text-muted-foreground",
                      inCurrentMonth && !isTodayDate && !isPast && "text-foreground",
                      inCurrentMonth && !isTodayDate && isPast && "text-muted-foreground",
                      isTodayDate && "font-semibold text-white"
                    )}
                    style={
                      isTodayDate
                        ? { backgroundColor: TEXT_DARK, color: WHITE }
                        : undefined
                    }
                  >
                    {format(day, "d")}
                  </span>

                  <div className="mt-1 flex min-h-0 flex-1 flex-col items-start gap-1 overflow-hidden">
                    {isDelivery ? (
                      <EventActionButton
                        label="Delivery"
                        tone="delivery"
                        onClick={() =>
                          router.push(routes.admin.calendarDelivery(dateString))
                        }
                      />
                    ) : null}
                    {isDelivered ? (
                      <EventActionButton
                        label="Delivered"
                        tone="delivered"
                        onClick={() =>
                          router.push(routes.admin.calendarDelivered(dateString))
                        }
                      />
                    ) : null}
                    {isBooked ? <EventChip label="Booked" /> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
