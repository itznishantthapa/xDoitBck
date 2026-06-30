"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { AssignmentProgressTracker } from "@/components/admin/assignment-progress-tracker";
import { Button } from "@/components/ui/button";
import { useAssignmentProgressQuery } from "@/hooks/query";
import {
  getAssignmentDetailsBackHref,
  getAssignmentDetailsOrigin,
} from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";

export default function AssignmentDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const assignmentId = params.id;
  const from = getAssignmentDetailsOrigin(searchParams.get("from"));
  const userId = searchParams.get("userId");
  const calendarDate = searchParams.get("date");

  const {
    data: progress,
    isLoading,
    isError,
    error,
  } = useAssignmentProgressQuery(assignmentId);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() =>
          router.push(getAssignmentDetailsBackHref(from, userId, calendarDate))
        }
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
        Back
      </Button>

      {isError || !progress ? (
        !isLoading ? (
          <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
            {getApiErrorMessage(error, "Could not load assignment progress.")}
          </div>
        ) : null
      ) : (
        <AssignmentProgressTracker progress={progress} />
      )}
    </div>
  );
}
