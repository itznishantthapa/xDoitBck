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
  CardHeader,
} from "@/components/ui/card";
import {
  useCalendarQuery,
  useMarkAvailableDatesMutation,
  useMarkBusyDatesMutation,
} from "@/hooks/query";
import { mergeDateMeta } from "@/lib/calendar-utils";
import { BG_SIDEBAR, BORDER, shopifyAdminCard, TEXT_DARK, WHITE } from "@/lib/colors";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const weekdayLabelsMobile = ["S", "M", "T", "W", "T", "F", "S"] as const;

const statusColors = {
  available: "#7ae3aa",
  booked: "#f03063",
  delivery: "#895ef6",
} as const;

type AdminCalendarProps = {
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
        "flex w-full shrink-0 items-center truncate rounded-none px-1.5 py-1 text-[10px] font-semibold leading-tight sm:px-2 sm:text-[11px]",
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
        "relative z-10 flex w-full shrink-0 cursor-pointer items-center truncate rounded-none px-1.5 py-1 text-left text-[10px] font-semibold leading-tight sm:px-2 sm:text-[11px]",
        eventChipStyles[tone]
      )}
      style={{ color: TEXT_DARK }}
    >
      {label}
    </button>
  );
}

function MonthNavigator({
  currentMonth,
  onPrevious,
  onNext,
}: {
  currentMonth: Date;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Previous month"
        onClick={onPrevious}
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: BG_SIDEBAR }}
      >
        <ChevronLeft className="size-5" strokeWidth={2} />
      </button>
      <span
        className="min-w-32 text-center text-base font-semibold tracking-tight sm:min-w-36 sm:text-lg"
        style={{ color: TEXT_DARK }}
      >
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <button
        type="button"
        aria-label="Next month"
        onClick={onNext}
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: BG_SIDEBAR }}
      >
        <ChevronRight className="size-5" strokeWidth={2} />
      </button>
    </div>
  );
}

export function AdminCalendar({ className }: AdminCalendarProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useCalendarQuery();
  const markBusyMutation = useMarkBusyDatesMutation();
  const markAvailableMutation = useMarkAvailableDatesMutation();

  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const bookedDates = data?.bookedDates ?? [];
  const dateMetaByDate = useMemo(
    () => mergeDateMeta(data?.calendarDateMeta ?? []),
    [data?.calendarDateMeta]
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

  const isSaving =
    markBusyMutation.isPending || markAvailableMutation.isPending;

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

    try {
      await markBusyMutation.mutateAsync({ dates: selectedToBook });
      setSelectedDates((previous) =>
        previous.filter((date) => !selectedToBook.includes(date))
      );
    } catch (mutationError) {
      console.error("Failed to mark busy dates:", mutationError);
    }
  };

  const handleMarkAsAvailable = async () => {
    if (selectedToAvailable.length === 0) return;

    try {
      await markAvailableMutation.mutateAsync({ dates: selectedToAvailable });
      setSelectedDates((previous) =>
        previous.filter((date) => !selectedToAvailable.includes(date))
      );
    } catch (mutationError) {
      console.error("Failed to mark dates available:", mutationError);
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[320px] items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load calendar data.")}
      </div>
    );
  }

  return (
    <Card
      size="sm"
      className={cn(
        "min-h-0 w-full min-w-0 flex-1 gap-0 lg:h-full",
        shopifyAdminCard,
        className
      )}
    >
      <CardHeader className="shrink-0 space-y-3 border-b py-3">
        <div className="flex items-center justify-between gap-3">
          <MonthNavigator
            currentMonth={currentMonth}
            onPrevious={() => setCurrentMonth((month) => subMonths(month, 1))}
            onNext={() => setCurrentMonth((month) => addMonths(month, 1))}
          />

          {selectedToBook.length > 0 || selectedToAvailable.length > 0 ? (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
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
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendDot label="Available" color={statusColors.available} />
          <LegendDot label="Booked" color={statusColors.booked} />
          <LegendDot label="Delivery" color={statusColors.delivery} />
        </div>
      </CardHeader>

      <CardContent className="relative min-h-0 flex-1 basis-0 overflow-hidden p-0">
        <div className="absolute inset-0 flex flex-col">
          <div
            className="grid shrink-0 grid-cols-7 border-b bg-muted/30"
            style={{ borderColor: BORDER }}
          >
            {weekdayLabels.map((day, index) => (
              <div
                key={day}
                className="py-2 text-center text-[11px] font-medium text-muted-foreground sm:py-2.5 sm:text-xs"
              >
                <span className="sm:hidden">{weekdayLabelsMobile[index]}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>

          <div
            className="grid min-h-0 flex-1 grid-cols-7"
            style={{
              borderColor: BORDER,
              gridTemplateRows: "repeat(6, minmax(5.75rem, 1fr))",
            }}
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
                    "relative flex h-full min-h-0 flex-col border-b border-r p-1.5 text-left transition-colors sm:p-2",
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

                  <div className="mt-1 flex min-h-0 flex-1 flex-col gap-1">
                    {isBooked ? <EventChip label="Booked" /> : null}
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
