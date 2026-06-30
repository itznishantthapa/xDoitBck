"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AssignmentStatus } from "@/api/assignmentApi";
import type { UserDetails } from "@/api/userApi";
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
import { useInfiniteUserAssignmentsQuery } from "@/hooks/query";
import { adminTokens, TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

const SUCCESS = "#08d203";

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

const statCards: {
  key: keyof UserDetails["user_stats"];
  title: string;
  accent: string;
}[] = [
  { key: "totalGiven", title: "Total Given", accent: TEXT_DARK },
  { key: "totalInReview", title: "Pending", accent: "#4da1f7" },
  { key: "totalDoing", title: "Doing", accent: "#c9780a" },
  { key: "totalCompleted", title: "Completed", accent: SUCCESS },
  { key: "totalRejected", title: "Rejected", accent: "#f03063" },
];

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

function UserStatItem({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p
        className="mt-1 text-xl font-bold leading-none tracking-tight"
        style={{ color: TEXT_DARK }}
      >
        {value}
      </p>
      <div
        className="mt-2.5 h-0.5 w-7 rounded-full"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function UserAssignmentsSection({
  userId,
  pageSize = 5,
}: {
  userId: string;
  pageSize?: number;
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUserAssignmentsQuery({ userId, limit: pageSize });

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

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <Card className="flex min-h-[280px] flex-1 flex-col pt-0">
        <CardHeader className="shrink-0 space-y-0 border-b py-4">
          <CardTitle className="text-base">Assignments</CardTitle>
          <CardDescription>
            Assignments submitted by this user
          </CardDescription>
        </CardHeader>
        <div className="flex min-h-[220px] flex-1 items-center justify-center px-4 text-sm font-medium text-[#f03063]">
          {getApiErrorMessage(error, "Could not load user assignments.")}
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="shrink-0 space-y-0 border-b py-4">
        <CardTitle className="text-base">Assignments</CardTitle>
        <CardDescription>Assignments submitted by this user</CardDescription>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>Assignment type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Is paid</TableHead>
              <TableHead>Delivery date</TableHead>
              <TableHead className="pr-4">Provided at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssignments.map((assignment) => (
              <TableRow
                key={assignment.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    routes.admin.assignmentDetails(
                      assignment.id,
                      "users",
                      userId
                    )
                  )
                }
              >
                <TableCell className="pl-4 font-medium text-foreground">
                  {assignment.name}
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
                <TableCell className="pr-4 text-muted-foreground">
                  {formatDate(assignment.providedDate)}
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

export function UserDetailsView({ user }: { user: UserDetails }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Card
        className={cn(
          "shrink-0 gap-0 overflow-hidden pt-0 shadow-none",
          adminTokens.containerBorder
        )}
      >
        <CardHeader className="space-y-0 border-b border-border/60 px-5 py-4">
          <CardTitle
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            {user.username}
          </CardTitle>
          <div
            className="mt-2 h-0.5 w-32 rounded-full"
            style={{ backgroundColor: SUCCESS }}
          />
          <div
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: TEXT_MUTED }}
          >
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={14}
              strokeWidth={1.75}
              color={TEXT_MUTED}
            />
            Created {formatDate(user.createdAt)}
          </div>
        </CardHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => (
            <UserStatItem
              key={stat.key}
              title={stat.title}
              value={user.user_stats[stat.key]}
              accent={stat.accent}
            />
          ))}
        </div>
      </Card>

      <UserAssignmentsSection userId={user.id} />
    </div>
  );
}
