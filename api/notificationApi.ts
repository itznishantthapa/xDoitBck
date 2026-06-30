import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type SystemNotification = {
  id: string;
  title: string;
  message: string;
  topic: string;
  createdAt: string;
};

type SystemNotificationsInfiniteResponse = {
  message: string;
  notifications: SystemNotification[];
  total_count: number;
  next_offset: number | null;
  has_more: boolean;
};

type CreateSystemNotificationResponse = {
  message: string;
  notification: SystemNotification;
};

export async function getSystemNotificationsInfinite(
  offset: number,
  limit: number
) {
  const { data } = await API_CLIENT.get<SystemNotificationsInfiniteResponse>(
    endpoints.notifications,
    {
      params: { offset, limit },
    }
  );

  return {
    items: data.notifications,
    nextOffset: data.next_offset,
    hasMore: data.has_more,
    totalCount: data.total_count,
  };
}

export async function createSystemNotification(payload: {
  title: string;
  message: string;
  topic?: string;
}) {
  const { data } = await API_CLIENT.post<CreateSystemNotificationResponse>(
    endpoints.notificationsCreate,
    {
      title: payload.title,
      message: payload.message,
      topic: payload.topic ?? "all_users",
    }
  );

  return data.notification;
}

export async function resendSystemNotification(notificationId: string) {
  const { data } = await API_CLIENT.post<CreateSystemNotificationResponse>(
    endpoints.notificationsResend,
    { notification_id: notificationId }
  );

  return data.notification;
}
