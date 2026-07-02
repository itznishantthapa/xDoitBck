"use client";

import {
  Delete02Icon,
  Edit02Icon,
  FolderAddIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  AdminAssignment,
  AssignmentTabStatus,
} from "@/api/assignmentApi";
import { ConfirmationModal } from "@/components/custom/confirmation-modal";
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
  useAddAssignmentOnWorkingMutation,
  useDeleteAssignmentMutation,
  useInfiniteAssignmentsQuery,
} from "@/hooks/query";
import { getAssignmentStatusStyle } from "@/lib/assignment-status";
import { routes } from "@/lib/routes";
import { playAddWorkingSound } from "@/lib/play-sound";
import { shopifyAdminCard, shopifyAdminCardFooter } from "@/lib/colors";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type AssignmentsTableProps = {
  pageSize?: number;
};

const statusTabs: {
  value: AssignmentTabStatus;
  label: string;
  className: string;
}[] = [
  { value: "in_review", label: "In Review", className: "border-[#895ef6] text-[#895ef6]" },
  { value: "doing", label: "Doing", className: "border-[#c9a208] text-[#9a7b0a]" },
  {
    value: "completed",
    label: "Completed",
    className: "border-emerald-600 text-emerald-600",
  },
  {
    value: "changes",
    label: "Changes",
    className: "border-orange-600 text-orange-600",
  },
  { value: "rejected", label: "Rejected", className: "border-[#f03063] text-[#f03063]" },
  { value: "all", label: "All", className: "border-foreground text-foreground" },
];

function AssignmentStatusBadge({ status }: { status: string }) {
  const config = getAssignmentStatusStyle(status);

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

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AssignmentsTable({ pageSize = 8 }: AssignmentsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState<AssignmentTabStatus>("in_review");
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<AdminAssignment | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [actionError, setActionError] = useState("");

  const deleteAssignmentMutation = useDeleteAssignmentMutation();
  const addAssignmentOnWorkingMutation = useAddAssignmentOnWorkingMutation();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAssignmentsQuery({ status: statusFilter, limit: pageSize });

  const allAssignments = useMemo(
    () => data?.pages.flatMap((assignmentsPage) => assignmentsPage.items) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allAssignments.slice(start, start + pageSize);
  }, [allAssignments, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

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
    router.push(routes.admin.assignmentDetails(id, "assignments"));
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  const handleAddToWorking = async (assignment: AdminAssignment) => {
    setActionError("");

    try {
      await addAssignmentOnWorkingMutation.mutateAsync({
        assignmentId: assignment.id,
      });
      playAddWorkingSound();
      setPage(1);
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not add assignment to working.")
      );
    }
  };

  const handleDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    setDeleteError("");

    try {
      await deleteAssignmentMutation.mutateAsync({
        assignmentId: assignmentToDelete.id,
      });
      setPage(1);
      setAssignmentToDelete(null);
    } catch (mutationError) {
      setDeleteError(
        getApiErrorMessage(mutationError, "Could not delete assignment.")
      );
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load assignments.")}
      </div>
    );
  }

  return (
    <Card className={cn("min-h-0 flex-1", shopifyAdminCard)}>
      <CardHeader className="flex shrink-0 flex-col gap-3 space-y-0 border-b py-3">
        <div className="grid gap-0.5">
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            Track assignment progress, payments, and delivery dates
          </CardDescription>
        </div>
      </CardHeader>

      {actionError ? (
        <p className="shrink-0 border-b px-4 py-2 text-sm font-medium text-[#f03063]">
          {actionError}
        </p>
      ) : null}

      <div className="flex shrink-0 flex-wrap gap-1.5 border-b px-3 py-2.5">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.value;

          return (
            <Button
              key={tab.value}
              type="button"
              variant="outline"
              size="sm"
              aria-pressed={isActive}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "rounded-lg border bg-transparent shadow-none",
                isActive
                  ? tab.className
                  : "border-transparent text-muted-foreground ring-1 ring-foreground/10"
              )}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      <CardContent className="min-h-0 flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Assignment type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is paid</TableHead>
              <TableHead>Delivery date</TableHead>
              <TableHead>Provided at</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
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
                  {formatDate(assignment.deliveryDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(assignment.providedDate)}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Add ${assignment.name} to working`}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={
                        addAssignmentOnWorkingMutation.isPending &&
                        addAssignmentOnWorkingMutation.variables
                          ?.assignmentId === assignment.id
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        void handleAddToWorking(assignment);
                      }}
                    >
                      <HugeiconsIcon
                        icon={FolderAddIcon}
                        size={16}
                        strokeWidth={1.75}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${assignment.name}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <HugeiconsIcon
                        icon={Edit02Icon}
                        size={16}
                        strokeWidth={1.75}
                      />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${assignment.name}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        setAssignmentToDelete(assignment);
                      }}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
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

      <CardFooter className={shopifyAdminCardFooter}>
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

      <ConfirmationModal
        open={assignmentToDelete !== null}
        variant="reject"
        title="Delete assignment"
        subtitle={
          assignmentToDelete
            ? deleteError ||
              `Are you sure you want to delete ${assignmentToDelete.name}?`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel={
          deleteAssignmentMutation.isPending ? "Deleting..." : "Delete"
        }
        onConfirm={handleDeleteAssignment}
        onClose={() => {
          setDeleteError("");
          setAssignmentToDelete(null);
        }}
        ariaLabel="Confirm assignment delete"
      />
    </Card>
  );
}
