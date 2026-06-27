export const routes = {
  auth: "/auth",
  admin: {
    root: "/admin",
    dashboard: "/admin/dashboard",
    mentors: "/admin/mentors",
    students: "/admin/students",
    analytics: "/admin/analytics",
    courses: "/admin/courses",
    forum: "/admin/forum",
    settings: "/admin/settings",
    help: "/admin/help",
  },
} as const;
