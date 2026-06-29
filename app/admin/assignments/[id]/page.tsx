"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { AssignmentProgressTracker } from "@/components/admin/assignment-progress-tracker";
import { Button } from "@/components/ui/button";
import { getAssignmentProgress } from "@/mock/AssignmentProgressMocked";
import {
  getAssignmentDetailsOrigin,
  getAssignmentListHref,
} from "@/lib/routes";

export default function AssignmentDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const assignmentId = params.id;
  const from = getAssignmentDetailsOrigin(searchParams.get("from"));
  const response = getAssignmentProgress(assignmentId);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => router.push(getAssignmentListHref(from))}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
        Back
      </Button>

      <AssignmentProgressTracker progress={response.progress} />
    </div>
  );
}
