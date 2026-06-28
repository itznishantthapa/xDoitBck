export type AssignmentDetailsFrom = "assignments" | "working";

export const routes = {
  auth: "/auth",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    assignments: "/admin/assignments",
    assignmentDetails: (
      id: string,
      from: AssignmentDetailsFrom = "assignments"
    ) => `/admin/assignments/${id}?from=${from}`,
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

export function getAssignmentDetailsOrigin(
  from: string | null | undefined
): AssignmentDetailsFrom {
  return from === "working" ? "working" : "assignments";
}

export function getAssignmentListHref(from: AssignmentDetailsFrom) {
  return from === "working"
    ? routes.admin.working
    : routes.admin.assignments;
}

export function getActiveAdminNavHref(
  pathname: string,
  from: string | null | undefined
) {
  if (isAssignmentDetailsPath(pathname)) {
    return getAssignmentListHref(getAssignmentDetailsOrigin(from));
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
