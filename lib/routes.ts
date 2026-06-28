export const routes = {
  auth: "/auth",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    users: "/admin/users",
    assignments: "/admin/assignments",
    working: "/admin/working",
    calendar: "/admin/calendar",
  },
} as const;
