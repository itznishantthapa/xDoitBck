import { AdminCalendar } from "@/components/admin/admin-calendar";
import { calendarData } from "@/mock/CalendarMocked";

export default function CalendarPage() {
  return (
    <div className="flex w-full min-w-0 flex-col pt-2 lg:h-full lg:min-h-0">
      <AdminCalendar
        initialBookedDates={calendarData.bookedDates}
        initialDateMeta={calendarData.calendarDateMeta}
      />
    </div>
  );
}
