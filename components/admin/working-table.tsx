"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AssignmentStatus } from "@/api/assignmentApi";
import type { WorkingAssignment } from "@/api/workingApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useInfiniteWorkingQuery,
  useRemoveFromWorkingMutation,
} from "@/hooks/query";
import { routes } from "@/lib/routes";
import { playRemoveSound } from "@/lib/play-sound";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type WorkingTableProps = {
  pageSize?: number;
};

const statusStyles: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
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

function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const config = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-1.5 py-0.5 text-xs font-medium capitalize",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

function PaidBadge({ value }: { value: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-1.5 py-0.5 text-xs font-medium",
        value
          ? "border-emerald-600 text-emerald-600"
          : "border-[#f03063] text-[#f03063]"
      )}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function formatAssignmentDateRange(
  providedDate: string | null,
  deliveryDate: string | null
) {
  if (!providedDate || !deliveryDate) return "—";

  const delivery = new Date(`${deliveryDate}T00:00:00`);
  const deliveryLabel = delivery.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const provided = new Date(`${providedDate}T00:00:00`);
  const startLabel =
    provided.getFullYear() === delivery.getFullYear()
      ? provided.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : provided.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

  return `${startLabel} - ${deliveryLabel}`;
}

export function WorkingTable({ pageSize = 8 }: WorkingTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState("");

  const removeFromWorkingMutation = useRemoveFromWorkingMutation();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteWorkingQuery({ limit: pageSize });

  const allAssignments = useMemo(
    () => data?.pages.flatMap((workingPage) => workingPage.items) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allAssignments.slice(start, start + pageSize);
  }, [allAssignments, page, pageSize]);

  useEffect(() => {
    const neededCount = page * pageSize;

    if (
      allAssignments.length < neededCount &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    allAssignments.length,
    page,
    pageSize,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  const handleRowClick = (id: string) => {
    router.push(routes.admin.assignmentDetails(id, "working"));
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  const handleRemoveFromWorking = async (assignment: WorkingAssignment) => {
    setActionError("");

    try {
      await removeFromWorkingMutation.mutateAsync({
        assignmentId: assignment.id,
      });
      playRemoveSound();
      setPage(1);
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(
          mutationError,
          "Could not remove assignment from working."
        )
      );
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load working assignments.")}
      </div>
    );
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="shrink-0 space-y-0 border-b py-4">
        <CardTitle className="text-base">Working Assignments</CardTitle>
        <CardDescription>Your currently added assignment tasks</CardDescription>
      </CardHeader>

      {actionError ? (
        <p className="shrink-0 border-b px-4 py-2 text-sm font-medium text-[#f03063]">
          {actionError}
        </p>
      ) : null}

      <CardContent className="min-h-0 flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Assignment type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is paid</TableHead>
              <TableHead>Added by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-4 text-right">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssignments.map((assignment) => (
              <TableRow
                key={assignment.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(assignment.id)}
              >
                <TableCell className="pl-4 font-medium text-foreground">
                  {assignment.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {assignment.user}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {assignment.assignmentType}
                </TableCell>
                <TableCell>
                  <AssignmentStatusBadge status={assignment.status} />
                </TableCell>
                <TableCell>
                  <PaidBadge value={assignment.isPaid} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {assignment.addedBy || "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatAssignmentDateRange(
                    assignment.providedDate,
                    assignment.deliveryDate
                  )}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${assignment.name}`}
                      className="text-muted-foreground hover:text-destructive"
                      disabled={
                        removeFromWorkingMutation.isPending &&
                        removeFromWorkingMutation.variables?.assignmentId ===
                          assignment.id
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleRemoveFromWorking(assignment);
                      }}
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        strokeWidth={1.75}
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="shrink-0 items-center justify-between border-t bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {rangeStart}-{rangeEnd} of {totalCount} assignments
          {isFetchingNextPage ? " · Loading more..." : ""}
        </p>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Previous"
                className={cn(page === 1 && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) goToPrevious();
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Next"
                className={cn(
                  (page === totalPages || isFetchingNextPage) &&
                    "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages && !isFetchingNextPage) goToNext();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
