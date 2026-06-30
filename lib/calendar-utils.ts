import type { CalendarDateMeta, MetaAssignment } from "@/api/calendarApi";

export type CalendarAssignmentKind = "delivery" | "delivered";

export function mergeDateMeta(
  entries: CalendarDateMeta[]
): Map<string, CalendarDateMeta> {
  const map = new Map<string, CalendarDateMeta>();

  for (const entry of entries) {
    const existing = map.get(entry.date);

    if (!existing) {
      map.set(entry.date, {
        ...entry,
        deliveryAssignments: [...entry.deliveryAssignments],
        deliveredAssignments: [...entry.deliveredAssignments],
      });
      continue;
    }

    map.set(entry.date, {
      date: entry.date,
      isDelivery: existing.isDelivery || entry.isDelivery,
      isDelivered: existing.isDelivered || entry.isDelivered,
      deliveryAssignments: [
        ...existing.deliveryAssignments,
        ...entry.deliveryAssignments,
      ],
      deliveredAssignments: [
        ...existing.deliveredAssignments,
        ...entry.deliveredAssignments,
      ],
    });
  }

  return map;
}

export function getCalendarAssignmentsForDate(
  kind: CalendarAssignmentKind,
  date: string,
  entries: CalendarDateMeta[]
): MetaAssignment[] {
  const meta = mergeDateMeta(entries).get(date);

  if (!meta) return [];

  if (kind === "delivery") {
    return meta.deliveryAssignments;
  }

  return meta.deliveredAssignments;
}
