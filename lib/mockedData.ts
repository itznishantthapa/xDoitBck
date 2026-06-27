export const mockedData = {
  sidebar: {
    brand: "Doit.",
    navigation: [
      { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
      { id: "mentors", label: "Mentors", href: "/admin/mentors", icon: "mentors" },
      { id: "students", label: "Students", href: "/admin/students", icon: "students" },
      {
        id: "analytics",
        label: "Analytics",
        href: "/admin/analytics",
        icon: "analytics",
        hasDropdown: true,
      },
      {
        id: "courses",
        label: "Courses",
        href: "/admin/courses",
        icon: "courses",
        hasDropdown: true,
      },
      { id: "forum", label: "Forum", href: "/admin/forum", icon: "forum" },
    ],
    footerNavigation: [
      { id: "settings", label: "Settings", href: "/admin/settings", icon: "settings" },
      { id: "help", label: "Help Center", href: "/admin/help", icon: "help" },
    ],
  },
} as const;

export type MockedData = typeof mockedData;

export function getAdminPageTitle(pathname: string): string {
  const items = [
    ...mockedData.sidebar.navigation,
    ...mockedData.sidebar.footerNavigation,
  ];

  return items.find((item) => item.href === pathname)?.label ?? "Dashboard";
}
