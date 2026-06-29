export type ProgressStepStatus =
  | "pending"
  | "doing"
  | "completed"
  | "review"
  | "rejected";

export type AssignmentProgressUser = {
  id: number;
  username: string;
};

export type PaymentDetails = {
  pay_id: string;
  pay_name: string;
  pay_qr: string | null;
  pay_description: string;
};

export type ProvidedStep = {
  date: string | null;
  is_active: boolean;
  status: ProgressStepStatus;
  provided_files?: string[];
  assignment_description?: string;
};

export type PaymentStep = {
  payment_receipt_date: string | null;
  payment_done_date: string | null;
  is_active: boolean;
  status: ProgressStepStatus;
  price: string | null;
  payment_details_image: string | null;
  payment_screenshot: string | null;
  is_max_submit_reached: boolean;
  payment_details?: PaymentDetails;
};

export type DoingStep = {
  date: string | null;
  is_active: boolean;
  status: ProgressStepStatus;
};

export type CompletedStep = {
  date: string | null;
  is_active: boolean;
  status: ProgressStepStatus;
  completed_file_url?: string;
  changes_request_count?: number;
  changes_request_description?: string | null;
};

export type AssignmentProgressSteps = {
  provided: ProvidedStep;
  payment: PaymentStep;
  doing: DoingStep;
  completed: CompletedStep;
};

export type AssignmentProgress = {
  id: string;
  user: AssignmentProgressUser;
  title: string;
  assignment_type: string;
  work_type: string;
  status: string;
  delivery_date: string | null;
  steps: AssignmentProgressSteps;
};

export type AssignmentProgressResponse = {
  message: string;
  progress: AssignmentProgress;
};

const assignmentProgressMock: AssignmentProgress = {
  id: "3",
  user: {
    id: 1,
    username: "username1",
  },
  title: "Presentation Project 1",
  assignment_type: "Others",
  work_type: "Individual",
  status: "doing",
  delivery_date: "2026-07-30",
  steps: {
    provided: {
      date: "21 Jun 2026 10:50",
      is_active: true,
      status: "pending",
      provided_files: [
        "https://level-esport-matchmaking-bucket.blr1.cdn.digitaloceanspaces.com/doit-prod/assignments/attachments/Presentattion20Project201.pdf",
        "https://level-esport-matchmaking-bucket.blr1.cdn.digitaloceanspaces.com/doit-prod/assignments/attachments/IMG_3819.png",
      ],
      assignment_description:
        "Please help me prepare Presentation Project 1 for next week's review. The deck should cover the project overview, key milestones, budget breakdown, and a short team introduction on the final slide. Use a clean, professional layout with consistent fonts and include any charts or visuals that make the budget section easy to follow.",
    },
    payment: {
      payment_receipt_date: null,
      payment_done_date: null,
      is_active: false,
      status: "pending",
      price: "120 AUD",
      payment_details_image: null,
      payment_screenshot: "https://level-esport-matchmaking-bucket.blr1.cdn.digitaloceanspaces.com/doit-prod/assignments/attachments/IMG_3819.png",
      is_max_submit_reached: false,
    },
    doing: {
      date: "23 Jun 2026 11:10",
      is_active: false,
      status: "doing",
    },
    completed: {
      date: "25 Jun 2026 11:10",
      is_active: false,
      status: "completed",
      completed_file_url:
        "https://level-esport-matchmaking-bucket.blr1.cdn.digitaloceanspaces.com/doit-prod/assignments/attachments/Presentattion20Project201.pdf",
      changes_request_count: 1,
      changes_request_description:
        "Please update slide 3 with the revised budget figures and add the team photo to the closing slide.",
    },
  },
};

export function getAssignmentProgress(
  assignmentId: string
): AssignmentProgressResponse {
  return {
    message: "Assignment progress tracked successfully.",
    progress: {
      ...assignmentProgressMock,
      id: assignmentId,
    },
  };
}
