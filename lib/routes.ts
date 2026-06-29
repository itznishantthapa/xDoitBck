export type AssignmentDetailsFrom = "assignments" | "working" | "users";

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
      userId?: string
    ) => {
      if (from === "users") {
        const params = new URLSearchParams({ from: "users" });
        if (userId) {
          params.set("userId", userId);
        }
        return `/admin/assignments/${id}?${params.toString()}`;
      }

      return `/admin/assignments/${id}?from=${from}`;
    },
    working: "/admin/working",
    calendar: "/admin/calendar",
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

export function getAssignmentDetailsOrigin(
  from: string | null | undefined
): AssignmentDetailsFrom {
  if (from === "working") return "working";
  if (from === "users") return "users";
  return "assignments";
}

export function getAssignmentListHref(from: Exclude<AssignmentDetailsFrom, "users">) {
  return from === "working"
    ? routes.admin.working
    : routes.admin.assignments;
}

export function getAssignmentDetailsBackHref(
  from: AssignmentDetailsFrom,
  userId: string | null | undefined
) {
  if (from === "users") {
    return routes.admin.userDetails(userId ?? "1");
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
    return getAssignmentListHref(origin);
  }

  if (isUserDetailsPath(pathname)) {
    return routes.admin.users;
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
