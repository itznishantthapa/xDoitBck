import { AdminCalendar } from "@/components/admin/admin-calendar";

export default function CalendarPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:h-full">
      <AdminCalendar className="min-h-0 flex-1" />
    </div>
  );
}
