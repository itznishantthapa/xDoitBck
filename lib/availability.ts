import { format } from "date-fns";

export const AVAILABILITY_MONTHS = 3;

export function toDateString(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function buildAvailabilityFromBusyDates(busyDatesList: readonly string[] = []) {
  const bookedDates = new Set(busyDatesList);
  const availableDates = new Set<string>();
  const today = getToday();
  const totalDays = AVAILABILITY_MONTHS * 30;

  for (let offset = 0; offset <= totalDays; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    const dateString = toDateString(date);

    if (!bookedDates.has(dateString)) {
      availableDates.add(dateString);
    }
  }

  return { bookedDates, availableDates };
}

export function formatLastUpdated(isoString: string): string {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
