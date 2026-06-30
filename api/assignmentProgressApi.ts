import { API_CLIENT } from "@/service/client";
import { endpoints } from "@/service/endpoint";

export type ProgressStepStatus =
  | "pending"
  | "doing"
  | "completed"
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
  isWorking: boolean;
  steps: AssignmentProgressSteps;
};

type AssignmentProgressResponse = {
  message: string;
  progress: AssignmentProgress;
};

export async function getAssignmentProgress(assignmentId: string) {
  const { data } = await API_CLIENT.get<AssignmentProgressResponse>(
    endpoints.assignmentProgress(assignmentId)
  );

  return data.progress;
}

export async function assignmentReceivedAction(payload: {
  assignmentId: string;
  action: "approve" | "reject";
}) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentProgressReceived,
    {
      assignment_id: payload.assignmentId,
      action: payload.action,
    }
  );

  return data;
}

export async function paymentAction(payload: {
  assignmentId: string;
  action: "send" | "approve" | "reject";
  price?: string;
  paymentDetailsImage?: File | null;
}) {
  const formData = new FormData();
  formData.append("assignment_id", payload.assignmentId);
  formData.append("action", payload.action);

  if (payload.price) {
    formData.append("price", payload.price);
  }

  if (payload.paymentDetailsImage) {
    formData.append("payment_details_image", payload.paymentDetailsImage);
  }

  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentProgressPayment,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
}

export async function doingAction(payload: {
  assignmentId: string;
  action: "approve" | "reject";
}) {
  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentProgressDoing,
    {
      assignment_id: payload.assignmentId,
      action: payload.action,
    }
  );

  return data;
}

export async function completedAction(payload: {
  assignmentId: string;
  completedFile: File;
}) {
  const formData = new FormData();
  formData.append("assignment_id", payload.assignmentId);
  formData.append("completed_file", payload.completedFile);

  const { data } = await API_CLIENT.post<{ message: string }>(
    endpoints.assignmentProgressCompleted,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
}
