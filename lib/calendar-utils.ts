import type { CalendarDateMeta, MetaAssignment } from "@/mock/CalendarMocked";

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
        metaAssignments: [...entry.metaAssignments],
      });
      continue;
    }

    map.set(entry.date, {
      date: entry.date,
      isDelivery: existing.isDelivery || entry.isDelivery,
      isDelivered: existing.isDelivered || entry.isDelivered,
      metaAssignments: [
        ...existing.metaAssignments,
        ...entry.metaAssignments,
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
  if (kind === "delivery" && !meta.isDelivery) return [];
  if (kind === "delivered" && !meta.isDelivered) return [];

  return meta.metaAssignments;
}
