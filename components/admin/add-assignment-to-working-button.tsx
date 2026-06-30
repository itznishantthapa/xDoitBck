"use client";

import { FolderAddIcon, FolderCheckIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAddAssignmentOnWorkingMutation } from "@/hooks/query";
import { playAddWorkingSound } from "@/lib/play-sound";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type AddAssignmentToWorkingButtonProps = {
  assignmentId: string;
  assignmentName: string;
  isWorking: boolean;
  className?: string;
};

export function AddAssignmentToWorkingButton({
  assignmentId,
  assignmentName,
  isWorking,
  className,
}: AddAssignmentToWorkingButtonProps) {
  const [actionError, setActionError] = useState("");
  const addAssignmentOnWorkingMutation = useAddAssignmentOnWorkingMutation();

  const handleAddToWorking = async () => {
    if (isWorking) return;

    setActionError("");

    try {
      await addAssignmentOnWorkingMutation.mutateAsync({ assignmentId });
      playAddWorkingSound();
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not add assignment to working.")
      );
    }
  };

  const isPending =
    addAssignmentOnWorkingMutation.isPending &&
    addAssignmentOnWorkingMutation.variables?.assignmentId === assignmentId;

  const label = isWorking
    ? "Already added to working"
    : `Add ${assignmentName} to working`;

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label={label}
            disabled={isWorking || isPending}
            className={cn(
              "size-10 text-muted-foreground hover:text-foreground",
              isWorking && "text-emerald-600 hover:text-emerald-600"
            )}
            onClick={() => void handleAddToWorking()}
          >
            <HugeiconsIcon
              icon={isWorking ? FolderCheckIcon : FolderAddIcon}
              size={44}
              strokeWidth={1.75}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>

      {actionError ? (
        <p className="max-w-48 text-right text-xs font-medium text-[#f03063]">
          {actionError}
        </p>
      ) : null}
    </div>
  );
}
