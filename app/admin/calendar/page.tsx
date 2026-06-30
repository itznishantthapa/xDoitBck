import { AdminCalendar } from "@/components/admin/admin-calendar";

export default function CalendarPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col pt-2 lg:h-[calc(100svh-4.75rem)]">
      <AdminCalendar className="min-h-0 flex-1" />
    </div>
  );
}
