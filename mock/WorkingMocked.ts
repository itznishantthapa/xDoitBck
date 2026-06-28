export type WorkingAssignmentType =
  | "Essay"
  | "Report"
  | "Presentation"
  | "Project"
  | "Case Study";

export type WorkingAssignmentStatus =
  | "pending"
  | "review"
  | "doing"
  | "completed"
  | "rejected";

export type WorkingAssignment = {
  id: string;
  name: string;
  user: string;
  assignmentType: WorkingAssignmentType;
  status: WorkingAssignmentStatus;
  isPaid: boolean;
  addedBy: string;
  providedDate: string;
  deliveryDate: string;
};

export const workingAssignments: WorkingAssignment[] = [
  {
    id: "1",
    name: "Product Launch Presentation",
    user: "emma.wilson",
    assignmentType: "Presentation",
    status: "doing",
    isPaid: false,
    addedBy: "nishant",
    providedDate: "2026-06-18",
    deliveryDate: "2026-07-02",
  },
  {
    id: "2",
    name: "Leadership Reflection Essay",
    user: "yuki.tanaka",
    assignmentType: "Essay",
    status: "doing",
    isPaid: true,
    addedBy: "aarya",
    providedDate: "2026-06-08",
    deliveryDate: "2026-07-01",
  },
  {
    id: "3",
    name: "Machine Learning Essay",
    user: "noah.smith",
    assignmentType: "Essay",
    status: "doing",
    isPaid: true,
    addedBy: "bhupendra",
    providedDate: "2026-06-30",
    deliveryDate: "2026-07-10",
  },
  {
    id: "4",
    name: "Investor Update Presentation",
    user: "mia.johnson",
    assignmentType: "Presentation",
    status: "doing",
    isPaid: true,
    addedBy: "nishant",
    providedDate: "2026-06-27",
    deliveryDate: "2026-07-05",
  },
  {
    id: "5",
    name: "UX Research Project",
    user: "li.wei",
    assignmentType: "Project",
    status: "pending",
    isPaid: false,
    addedBy: "aarya",
    providedDate: "2026-06-25",
    deliveryDate: "2026-07-08",
  },
  {
    id: "6",
    name: "Financial Analysis Report",
    user: "alex.kumar",
    assignmentType: "Report",
    status: "review",
    isPaid: true,
    addedBy: "bhupendra",
    providedDate: "2026-05-30",
    deliveryDate: "2026-06-02",
  },
  {
    id: "7",
    name: "Quarterly Sales Report",
    user: "olivia.brown",
    assignmentType: "Report",
    status: "review",
    isPaid: true,
    addedBy: "nishant",
    providedDate: "2026-06-12",
    deliveryDate: "2026-06-14",
  },
  {
    id: "8",
    name: "Brand Identity Project",
    user: "lucas.silva",
    assignmentType: "Project",
    status: "review",
    isPaid: true,
    addedBy: "aarya",
    providedDate: "2026-06-09",
    deliveryDate: "2026-06-11",
  },
];
