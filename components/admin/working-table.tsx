"use client";

import { useEffect, useMemo, useState } from "react";

import type { AssignmentRow } from "@/components/admin/assignments-table";
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
import { cn } from "@/lib/utils";

export type WorkingAssignmentRow = AssignmentRow & {
  addedBy: string;
};

type WorkingTableProps = {
  assignments: WorkingAssignmentRow[];
  pageSize?: number;
};

const statusStyles = {
  pending: {
    label: "Pending",
    className: "border-[#895ef6] text-[#895ef6]",
  },
  review: {
    label: "Review",
    className: "border-[#4da1f7] text-[#4da1f7]",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-600 text-emerald-600",
  },
  doing: {
    label: "Doing",
    className: "border-[#c9a208] text-[#9a7b0a]",
  },
  rejected: {
    label: "Rejected",
    className: "border-[#f03063] text-[#f03063]",
  },
} as const;

function AssignmentStatusBadge({
  status,
}: {
  status: AssignmentRow["status"];
}) {
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
  providedAt: string | null,
  deliveryDate: string
) {
  const delivery = new Date(deliveryDate);
  const deliveryLabel = delivery.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!providedAt) {
    return deliveryLabel;
  }

  const provided = new Date(providedAt);
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

export function WorkingTable({ assignments, pageSize = 8 }: WorkingTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(assignments.length / pageSize));

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return assignments.slice(start, start + pageSize);
  }, [assignments, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart = assignments.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, assignments.length);

  const handleRowClick = (name: string) => {
    console.log(name);
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="shrink-0 space-y-0 border-b py-4">
        <CardTitle className="text-base">Working Assignments</CardTitle>
        <CardDescription>
          Your currently added assignment tasks
        </CardDescription>
      </CardHeader>

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
              <TableHead className="pr-4">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssignments.map((assignment) => (
              <TableRow
                key={assignment.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(assignment.name)}
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
                  {assignment.addedBy}
                </TableCell>
                <TableCell className="pr-4 text-muted-foreground">
                  {formatAssignmentDateRange(
                    assignment.providedAt,
                    assignment.deliveryDate
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="shrink-0 items-center justify-between border-t bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {rangeStart}-{rangeEnd} of {assignments.length} assignments
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
                  page === totalPages && "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages) goToNext();
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
