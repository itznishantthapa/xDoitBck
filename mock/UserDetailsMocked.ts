import type { AssignmentStatus } from "@/mock/AssignmentMocked";

export type UserStats = {
  totalGiven: string;
  totalInReview: string;
  totalDoing: string;
  totalCompleted: string;
  totalRejected: string;
};

export type UserDetailsAssignment = {
  id: string;
  name: string;
  assignmentType: string;
  status: AssignmentStatus;
  isPaid: boolean;
  deliveryDate: string | null;
  providedDate: string | null;
};

export type UserDetails = {
  id: string;
  username: string;
  createdAt: string;
  user_stats: UserStats;
  assignments: UserDetailsAssignment[];
};

export type UserDetailsResponse = {
  message: string;
  user: UserDetails;
};

export const userDetailsMock: UserDetails = {
  id: "1",
  username: "username1",
  createdAt: "2025-10-14",
  user_stats: {
    totalGiven: "12",
    totalInReview: "2",
    totalDoing: "2",
    totalCompleted: "3",
    totalRejected: "2",
  },
  assignments: [
    {
      id: "3",
      name: "Presentation Project 1",
      assignmentType: "Others",
      status: "doing",
      isPaid: true,
      deliveryDate: "2026-07-30",
      providedDate: "2026-06-21",
    },
    {
      id: "11",
      name: "Literature Review Essay",
      assignmentType: "Essay",
      status: "completed",
      isPaid: true,
      deliveryDate: "2026-06-15",
      providedDate: "2026-06-01",
    },
    {
      id: "12",
      name: "Quarterly Sales Report",
      assignmentType: "Report",
      status: "review",
      isPaid: true,
      deliveryDate: "2026-06-28",
      providedDate: "2026-06-10",
    },
    {
      id: "13",
      name: "Startup Pitch Deck",
      assignmentType: "Presentation",
      status: "rejected",
      isPaid: false,
      deliveryDate: "2026-05-20",
      providedDate: "2026-05-05",
    },
    {
      id: "14",
      name: "Mobile App UX Project",
      assignmentType: "Project",
      status: "pending",
      isPaid: false,
      deliveryDate: "2026-08-12",
      providedDate: "2026-07-01",
    },
    {
      id: "15",
      name: "Ethics in AI Case Study",
      assignmentType: "Case Study",
      status: "completed",
      isPaid: true,
      deliveryDate: "2026-04-18",
      providedDate: "2026-04-02",
    },
    {
      id: "16",
      name: "Data Visualization Brief",
      assignmentType: "Others",
      status: "doing",
      isPaid: true,
      deliveryDate: "2026-07-08",
      providedDate: "2026-06-18",
    },
    {
      id: "17",
      name: "Market Entry Strategy",
      assignmentType: "Report",
      status: "review",
      isPaid: true,
      deliveryDate: "2026-07-22",
      providedDate: "2026-07-02",
    },
    {
      id: "18",
      name: "Team Leadership Essay",
      assignmentType: "Essay",
      status: "rejected",
      isPaid: false,
      deliveryDate: "2026-03-30",
      providedDate: "2026-03-12",
    },
    {
      id: "19",
      name: "Product Roadmap Presentation",
      assignmentType: "Presentation",
      status: "completed",
      isPaid: true,
      deliveryDate: "2026-02-14",
      providedDate: "2026-01-28",
    },
    {
      id: "20",
      name: "Supply Chain Analysis",
      assignmentType: "Case Study",
      status: "pending",
      isPaid: false,
      deliveryDate: "2026-09-05",
      providedDate: null,
    },
  ],
};

export function getUserDetails(): UserDetailsResponse {
  return {
    message: "User details fetched successfully.",
    user: userDetailsMock,
  };
}
