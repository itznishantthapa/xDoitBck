"use client";

import {
  Delete02Icon,
  Edit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export type AssignmentStatus =
  | "pending"
  | "review"
  | "completed"
  | "doing"
  | "rejected";

export type AssignmentRow = {
  id: string;
  name: string;
  user: string;
  assignmentType: "Essay" | "Report" | "Presentation" | "Project" | "Case Study";
  status: AssignmentStatus;
  isPaid: boolean;
  deliveryDate: string;
  providedAt: string | null;
};

type AssignmentsTableProps = {
  assignments: AssignmentRow[];
  pageSize?: number;
};

const statusStyles: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-[#895ef6]/10 text-[#895ef6]",
  },
  review: {
    label: "Review",
    className: "bg-[#4da1f7]/10 text-[#4da1f7]",
  },
  completed: {
    label: "Completed",
    className: "bg-[#7ae3aa]/10 text-[#2f6b52]",
  },
  doing: {
    label: "Doing",
    className: "bg-[#f1cd3b]/15 text-[#9a7b0a]",
  },
  rejected: {
    label: "Rejected",
    className: "bg-[#f03063]/10 text-[#f03063]",
  },
};

function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const config = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize",
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
        "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
        value
          ? "bg-emerald-500/10 text-emerald-600"
          : "bg-muted text-muted-foreground"
      )}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AssignmentsTable({
  assignments,
  pageSize = 8,
}: AssignmentsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assignments;

    return assignments.filter(
      (assignment) =>
        assignment.name.toLowerCase().includes(query) ||
        assignment.user.toLowerCase().includes(query) ||
        assignment.assignmentType.toLowerCase().includes(query) ||
        assignment.status.toLowerCase().includes(query)
    );
  }, [assignments, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssignments.length / pageSize)
  );

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAssignments.slice(start, start + pageSize);
  }, [filteredAssignments, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart =
    filteredAssignments.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredAssignments.length);

  const handleSearchChange = (value: string) => {
    console.log(value);
    setSearch(value);
  };

  const handleRowClick = (name: string) => {
    console.log(name);
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="flex shrink-0 flex-col gap-4 space-y-0 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <CardTitle className="text-base">All Assignments</CardTitle>
          <CardDescription>
            Track assignment progress, payments, and delivery dates
          </CardDescription>
        </div>

        <label className="relative block w-full shrink-0 sm:max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            value={search}
            placeholder="Search assignments"
            aria-label="Search assignments"
            onChange={(event) => handleSearchChange(event.target.value)}
            className={cn(
              "h-10 rounded-xl border-0 bg-background pl-10 text-sm font-medium shadow-none ring-1 ring-foreground/10",
              "placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
            )}
          />
        </label>
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
                  {formatDate(assignment.deliveryDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(assignment.providedAt)}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${assignment.name}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16} strokeWidth={1.75} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${assignment.name}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.75} />
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
          Showing {rangeStart}-{rangeEnd} of {filteredAssignments.length}{" "}
          assignments
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
