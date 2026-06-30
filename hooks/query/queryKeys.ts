export const queryKeys = {
  dashboard: ["dashboard"] as const,
  badges: ["badges"] as const,
  calendar: {
    all: ["calendar"] as const,
    data: () => ["calendar", "data"] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  assignments: {
    all: ["assignments"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["assignments", "list", filters ?? {}] as const,
    infinite: (filters?: Record<string, unknown>) =>
      ["assignments", "infinite", filters ?? {}] as const,
  },
  assignmentProgress: {
    all: ["assignmentProgress"] as const,
    detail: (assignmentId: string) =>
      ["assignmentProgress", assignmentId] as const,
  },
  working: {
    all: ["working"] as const,
    infinite: () => ["working", "infinite"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    infinite: () => ["notifications", "infinite"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["users", "list", filters ?? {}] as const,
    search: (username: string) => ["users", "search", username] as const,
    infinite: (filters?: Record<string, unknown>) =>
      ["users", "infinite", filters ?? {}] as const,
    detail: (userId: string) => ["users", "detail", userId] as const,
    assignmentsInfinite: (userId: string) =>
      ["users", "assignments", "infinite", userId] as const,
  },
} as const;
