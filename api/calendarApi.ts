import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type MetaAssignment = {
  id: number;
  metaAssignmentName: string;
};

export type CalendarDateMeta = {
  date: string;
  isDelivery: boolean;
  isDelivered: boolean;
  deliveryAssignments: MetaAssignment[];
  deliveredAssignments: MetaAssignment[];
};

export type CalendarData = {
  message: string;
  bookedDates: string[];
  calendarDateMeta: CalendarDateMeta[];
};

export type CalendarMutationResponse = CalendarData & {
  removedCount?: number;
};

export async function getCalendarData() {
  const { data } = await API_CLIENT.get<CalendarData>(endpoints.calendar);
  return data;
}

export async function markBusyDates(payload: { dates: string[] }) {
  const { data } = await API_CLIENT.post<CalendarMutationResponse>(
    endpoints.calendarMarkBusy,
    payload
  );
  return data;
}

export async function markAvailableDates(payload: { dates: string[] }) {
  const { data } = await API_CLIENT.post<CalendarMutationResponse>(
    endpoints.calendarMarkAvailable,
    payload
  );
  return data;
}
