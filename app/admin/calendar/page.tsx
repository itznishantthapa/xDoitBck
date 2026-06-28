import { AdminCalendar } from "@/components/admin/admin-calendar";

const bookedDates = [
  "2026-06-05",
  "2026-06-12",
  "2026-06-13",
  "2026-06-22",
  "2026-06-27",
];

const calendarDateMeta = [
  { date: "2026-06-03", isDelivery: false, isDelivered: true },
  { date: "2026-06-05", isDelivery: false, isDelivered: true },
  { date: "2026-06-10", isDelivery: false, isDelivered: true },
  { date: "2026-06-15", isDelivery: false, isDelivered: true },
  { date: "2026-06-20", isDelivery: false, isDelivered: true },
  { date: "2026-06-30", isDelivery: true, isDelivered: false },
  { date: "2026-07-20", isDelivery: true, isDelivered: false },
  { date: "2026-07-25", isDelivery: true, isDelivered: false },
  { date: "2026-07-15", isDelivery: true, isDelivered: false },
  { date: "2026-07-06", isDelivery: true, isDelivered: false },
];

export default function CalendarPage() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2">
      <AdminCalendar
        initialBookedDates={bookedDates}
        initialDateMeta={calendarDateMeta}
      />
    </div>
  );
}
