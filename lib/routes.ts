export type AssignmentDetailsFrom =
  | "assignments"
  | "working"
  | "users"
  | "calendar-delivery"
  | "calendar-delivered";

type AssignmentDetailsOptions = {
  userId?: string;
  date?: string;
};

export const routes = {
  auth: "/auth",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    userDetails: (id: string) => `/admin/users/${id}`,
    assignments: "/admin/assignments",
    assignmentDetails: (
      id: string,
      from: AssignmentDetailsFrom = "assignments",
      userIdOrOptions?: string | AssignmentDetailsOptions
    ) => {
      const options: AssignmentDetailsOptions =
        typeof userIdOrOptions === "string"
          ? { userId: userIdOrOptions }
          : (userIdOrOptions ?? {});

      if (from === "users") {
        const params = new URLSearchParams({ from: "users" });
        if (options.userId) {
          params.set("userId", options.userId);
        }
        return `/admin/assignments/${id}?${params.toString()}`;
      }

      const params = new URLSearchParams({ from });
      if (options.date) {
        params.set("date", options.date);
      }

      return `/admin/assignments/${id}?${params.toString()}`;
    },
    working: "/admin/working",
    calendar: "/admin/calendar",
    calendarDelivery: (date: string) =>
      `/admin/calendar/delivery?date=${encodeURIComponent(date)}`,
    calendarDelivered: (date: string) =>
      `/admin/calendar/delivered?date=${encodeURIComponent(date)}`,
  },
} as const;

export function isAssignmentDetailsPath(pathname: string) {
  return (
    pathname !== routes.admin.assignments &&
    pathname.startsWith(`${routes.admin.assignments}/`)
  );
}

export function isUserDetailsPath(pathname: string) {
  return (
    pathname !== routes.admin.users &&
    pathname.startsWith(`${routes.admin.users}/`)
  );
}

export function isCalendarSubPath(pathname: string) {
  return (
    pathname !== routes.admin.calendar &&
    pathname.startsWith(`${routes.admin.calendar}/`)
  );
}

export function getAssignmentDetailsOrigin(
  from: string | null | undefined
): AssignmentDetailsFrom {
  if (from === "working") return "working";
  if (from === "users") return "users";
  if (from === "calendar-delivery") return "calendar-delivery";
  if (from === "calendar-delivered") return "calendar-delivered";
  return "assignments";
}

export function getAssignmentListHref(
  from: Exclude<
    AssignmentDetailsFrom,
    "users" | "calendar-delivery" | "calendar-delivered"
  >
) {
  return from === "working" ? routes.admin.working : routes.admin.assignments;
}

export function getAssignmentDetailsBackHref(
  from: AssignmentDetailsFrom,
  userId: string | null | undefined,
  calendarDate?: string | null
) {
  if (from === "users") {
    return routes.admin.userDetails(userId ?? "1");
  }

  if (from === "calendar-delivery") {
    return routes.admin.calendarDelivery(calendarDate ?? "");
  }

  if (from === "calendar-delivered") {
    return routes.admin.calendarDelivered(calendarDate ?? "");
  }

  return getAssignmentListHref(from);
}

export function getActiveAdminNavHref(
  pathname: string,
  from: string | null | undefined
) {
  if (isAssignmentDetailsPath(pathname)) {
    const origin = getAssignmentDetailsOrigin(from);
    if (origin === "users") {
      return routes.admin.users;
    }
    if (origin === "calendar-delivery" || origin === "calendar-delivered") {
      return routes.admin.calendar;
    }
    return getAssignmentListHref(origin);
  }

  if (isUserDetailsPath(pathname)) {
    return routes.admin.users;
  }

  if (isCalendarSubPath(pathname)) {
    return routes.admin.calendar;
  }

  const navRoutes = [
    routes.admin.dashboard,
    routes.admin.calendar,
    routes.admin.users,
    routes.admin.assignments,
    routes.admin.working,
  ] as const;

  return navRoutes.find((href) => href === pathname) ?? routes.admin.dashboard;
}
