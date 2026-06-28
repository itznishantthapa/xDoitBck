"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
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

  return (
    <div className="flex h-full min-h-0 flex-col gap-6 pt-2">
      <Button
        type="button"
        variant="ghost"
        className="w-fit cursor-pointer gap-1.5 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => router.push(getAssignmentListHref(from))}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
        Back
      </Button>

      <p className="text-base text-foreground">
        this is assignment details page: assignment id {assignmentId}
      </p>
    </div>
  );
}
