"use client";

import {
  Delete02Icon,
  Edit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/custom/confirmation-modal";
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
import type { User } from "@/mock/UsersMocked";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type UsersTableProps = {
  users: User[];
  pageSize?: number;
};

function StatusBadge({
  value,
  variant,
}: {
  value: boolean;
  variant: "active" | "suspended";
}) {
  const isActiveYes = variant === "active" && value;
  const isActiveNo = variant === "active" && !value;
  const isSuspendedYes = variant === "suspended" && value;
  const isSuspendedNo = variant === "suspended" && !value;

  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-1.5 py-0.5 text-xs font-medium",
        isActiveYes && "border-emerald-600 text-emerald-600",
        isActiveNo && "border-[#f03063] text-[#f03063]",
        isSuspendedYes && "border-orange-600 text-orange-600",
        isSuspendedNo && "border-emerald-600 text-emerald-600"
      )}
    >
      {value ? "Yes" : "No"}
    </span>
  );
}

function formatCreatedAt(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsersTable({ users, pageSize = 8 }: UsersTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.country.toLowerCase().includes(query)
    );
  }, [search, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const rangeStart =
    filteredUsers.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filteredUsers.length);

  const handleSearchChange = (value: string) => {
    console.log(value);
    setSearch(value);
  };

  const handleRowClick = (userId: string) => {
    router.push(routes.admin.userDetails(userId));
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  return (
    <Card className="flex min-h-0 flex-1 flex-col pt-0">
      <CardHeader className="flex shrink-0 flex-col gap-4 space-y-0 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <CardTitle className="text-base">All Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and access status
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
            placeholder="Search users"
            aria-label="Search users"
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
              <TableHead className="pl-4">Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Is active</TableHead>
              <TableHead>Is suspended</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead className="pr-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(user.id)}
              >
                <TableCell className="pl-4 font-medium text-foreground">
                  {user.username}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.role}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.country}
                </TableCell>
                <TableCell>
                  <StatusBadge value={user.isActive} variant="active" />
                </TableCell>
                <TableCell>
                  <StatusBadge value={user.isSuspended} variant="suspended" />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatCreatedAt(user.createdAt)}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${user.username}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16} strokeWidth={1.75} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${user.username}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(event) => {
                        event.stopPropagation();
                        setUserToDelete(user);
                      }}
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
          Showing {rangeStart}-{rangeEnd} of {filteredUsers.length} users
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

      <ConfirmationModal
        open={userToDelete !== null}
        variant="reject"
        title="Delete user"
        subtitle={
          userToDelete
            ? `Are you sure you want to delete ${userToDelete.username} ?`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={() => {
          if (userToDelete) {
            console.log("delete user", userToDelete.username);
          }
          setUserToDelete(null);
        }}
        onClose={() => setUserToDelete(null)}
        ariaLabel="Confirm user delete"
      />
    </Card>
  );
}
