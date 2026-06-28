import { AdminCalendar } from "@/components/admin/admin-calendar";
import { calendarData } from "@/mock/CalendarMocked";

export default function CalendarPage() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2">
      <AdminCalendar
        initialBookedDates={calendarData.bookedDates}
        initialDateMeta={calendarData.calendarDateMeta}
      />
    </div>
  );
}
