import type { AssignmentStatus } from "@/api/assignmentApi";

type StatusStyle = {
  label: string;
  className: string;
};

export const assignmentStatusStyles: Record<AssignmentStatus, StatusStyle> = {
  in_review: {
    label: "In Review",
    className: "border-[#895ef6] text-[#895ef6]",
  },
  doing: {
    label: "Doing",
    className: "border-[#c9a208] text-[#9a7b0a]",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-600 text-emerald-600",
  },
  rejected: {
    label: "Rejected",
    className: "border-[#f03063] text-[#f03063]",
  },
  payment_pending: {
    label: "Payment Pending",
    className: "border-[#895ef6] text-[#895ef6]",
  },
  payment_rejected: {
    label: "Payment Rejected",
    className: "border-[#f03063] text-[#f03063]",
  },
  unsubmitted: {
    label: "Unsubmitted",
    className: "border-orange-600 text-orange-600",
  },
};

const defaultStatusStyle: StatusStyle = {
  label: "Unknown",
  className: "border-foreground text-foreground",
};

export function getAssignmentStatusStyle(status: string): StatusStyle {
  if (status === "pending") {
    return assignmentStatusStyles.in_review;
  }

  return assignmentStatusStyles[status as AssignmentStatus] ?? {
    ...defaultStatusStyle,
    label: status.replace(/_/g, " "),
  };
}
