export type AssignmentType =
  | "Essay"
  | "Report"
  | "Presentation"
  | "Project"
  | "Case Study";

export type AssignmentStatus =
  | "pending"
  | "review"
  | "completed"
  | "doing"
  | "rejected";

export type Assignment = {
  id: string;
  name: string;
  user: string;
  assignmentType: AssignmentType;
  status: AssignmentStatus;
  isPaid: boolean;
  isWorking: boolean;
  providedDate: string | null;
  deliveryDate: string;
};

export const assignments: Assignment[] = [
  {
    id: "1",
    name: "Marketing Strategy Essay",
    user: "sophie.martin",
    assignmentType: "Essay",
    status: "completed",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-05-10",
    deliveryDate: "2026-05-12",
  },
  {
    id: "2",
    name: "Financial Analysis Report",
    user: "alex.kumar",
    assignmentType: "Report",
    status: "review",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-05-30",
    deliveryDate: "2026-06-02",
  },
  {
    id: "3",
    name: "Product Launch Presentation",
    user: "emma.wilson",
    assignmentType: "Presentation",
    status: "doing",
    isPaid: false,
    isWorking: false,
    providedDate: "2026-06-18",
    deliveryDate: "2026-07-02",
  },
  {
    id: "4",
    name: "UX Research Project",
    user: "li.wei",
    assignmentType: "Project",
    status: "pending",
    isPaid: false,
    isWorking: false,
    providedDate: "2026-06-25",
    deliveryDate: "2026-07-08",
  },
  {
    id: "5",
    name: "Business Ethics Case Study",
    user: "marco.rossi",
    assignmentType: "Case Study",
    status: "completed",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-04-26",
    deliveryDate: "2026-04-28",
  },
  {
    id: "6",
    name: "Data Science Capstone",
    user: "nina.petersen",
    assignmentType: "Project",
    status: "rejected",
    isPaid: false,
    isWorking: false,
    providedDate: "2026-05-03",
    deliveryDate: "2026-05-05",
  },
  {
    id: "7",
    name: "Leadership Reflection Essay",
    user: "yuki.tanaka",
    assignmentType: "Essay",
    status: "doing",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-06-08",
    deliveryDate: "2026-07-01",
  },
  {
    id: "8",
    name: "Quarterly Sales Report",
    user: "olivia.brown",
    assignmentType: "Report",
    status: "review",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-06-12",
    deliveryDate: "2026-06-14",
  },
  {
    id: "9",
    name: "Startup Pitch Deck",
    user: "ahmed.hassan",
    assignmentType: "Presentation",
    status: "pending",
    isPaid: false,
    isWorking: false,
    providedDate: null,
    deliveryDate: "2026-06-22",
  },
  {
    id: "10",
    name: "Supply Chain Case Study",
    user: "isabella.gomez",
    assignmentType: "Case Study",
    status: "completed",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-05-18",
    deliveryDate: "2026-05-20",
  },
  {
    id: "11",
    name: "Machine Learning Essay",
    user: "noah.smith",
    assignmentType: "Essay",
    status: "doing",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-06-30",
    deliveryDate: "2026-07-10",
  },
  {
    id: "12",
    name: "Operations Audit Report",
    user: "priya.sharma",
    assignmentType: "Report",
    status: "pending",
    isPaid: false,
    isWorking: false,
    providedDate: null,
    deliveryDate: "2026-07-04",
  },
  {
    id: "13",
    name: "Brand Identity Project",
    user: "lucas.silva",
    assignmentType: "Project",
    status: "review",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-06-09",
    deliveryDate: "2026-06-11",
  },
  {
    id: "14",
    name: "Healthcare Policy Essay",
    user: "hannah.becker",
    assignmentType: "Essay",
    status: "completed",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-04-13",
    deliveryDate: "2026-04-15",
  },
  {
    id: "15",
    name: "Mobile App Case Study",
    user: "daniel.kim",
    assignmentType: "Case Study",
    status: "rejected",
    isPaid: false,
    isWorking: false,
    providedDate: "2026-05-06",
    deliveryDate: "2026-05-08",
  },
  {
    id: "16",
    name: "Investor Update Presentation",
    user: "mia.johnson",
    assignmentType: "Presentation",
    status: "doing",
    isPaid: true,
    isWorking: false,
    providedDate: "2026-06-27",
    deliveryDate: "2026-07-05",
  },
];
