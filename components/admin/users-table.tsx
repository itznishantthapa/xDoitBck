"use client";

import {
  Delete02Icon,
  PasswordValidationIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/custom/confirmation-modal";
import { ResetUserPasswordModal } from "@/components/custom/reset-user-password-modal";
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
import type { AdminUser } from "@/api/userApi";
import {
  useDeleteUserMutation,
  useInfiniteUsersQuery,
  useResetUserPasswordMutation,
  useSearchUsersQuery,
} from "@/hooks/query";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type UsersTableProps = {
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

export function UsersTable({ pageSize = 8 }: UsersTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<AdminUser | null>(
    null
  );
  const [deleteError, setDeleteError] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");

  const isSearching = Boolean(activeSearch);
  const deleteUserMutation = useDeleteUserMutation();
  const resetUserPasswordMutation = useResetUserPasswordMutation();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsersQuery({ limit: pageSize, enabled: !isSearching });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useSearchUsersQuery(activeSearch, { enabled: isSearching });

  const allUsers = useMemo(
    () => data?.pages.flatMap((usersPage) => usersPage.items) ?? [],
    [data]
  );

  const searchUsers = searchData?.items ?? [];
  const totalCount = isSearching
    ? (searchData?.totalCount ?? 0)
    : (data?.pages[0]?.totalCount ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedUsers = useMemo(() => {
    const sourceUsers = isSearching ? searchUsers : allUsers;
    const start = (page - 1) * pageSize;
    return sourceUsers.slice(start, start + pageSize);
  }, [allUsers, isSearching, page, pageSize, searchUsers]);

  useEffect(() => {
    if (isSearching) return;

    const neededCount = page * pageSize;

    if (
      allUsers.length < neededCount &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    allUsers.length,
    isSearching,
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

  const handleRowClick = (userId: string) => {
    router.push(routes.admin.userDetails(userId));
  };

  const goToPrevious = () => setPage((current) => Math.max(1, current - 1));
  const goToNext = () =>
    setPage((current) => Math.min(totalPages, current + 1));

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const trimmedSearch = searchInput.trim();
    setActiveSearch(trimmedSearch);
    setPage(1);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteError("");

    try {
      await deleteUserMutation.mutateAsync({ userId: userToDelete.id });
      setPage(1);
      setUserToDelete(null);
    } catch (mutationError) {
      setDeleteError(
        getApiErrorMessage(mutationError, "Could not delete user.")
      );
    }
  };

  const handleResetPassword = async ({
    password,
    confirmPassword,
  }: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!userToResetPassword) return;

    setResetPasswordError("");

    try {
      await resetUserPasswordMutation.mutateAsync({
        userId: userToResetPassword.id,
        password,
        confirmPassword,
      });
      setUserToResetPassword(null);
    } catch (mutationError) {
      setResetPasswordError(
        getApiErrorMessage(mutationError, "Could not update password.")
      );
    }
  };

  if (!isSearching && isLoading) {
    return null;
  }

  if (isSearching && isSearchLoading) {
    return null;
  }

  if (!isSearching && isError) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load users.")}
      </div>
    );
  }

  if (isSearching && isSearchError) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(searchError, "Could not search users.")}
      </div>
    );
  }

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
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by username (Enter)"
            aria-label="Search users"
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
                  {user.country || "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge value={user.isActive} variant="active" />
                </TableCell>
                <TableCell>
                  <StatusBadge value={user.isSuspended} variant="suspended" />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.createdAt ? formatCreatedAt(user.createdAt) : "—"}
                </TableCell>
                <TableCell className="pr-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Reset password for ${user.username}`}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        setResetPasswordError("");
                        setUserToResetPassword(user);
                      }}
                    >
                      <HugeiconsIcon
                        icon={PasswordValidationIcon}
                        size={16}
                        strokeWidth={1.75}
                      />
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
          Showing {rangeStart}-{rangeEnd} of {totalCount} users
          {isSearching
            ? activeSearch
              ? ` · Search: "${activeSearch}"`
              : ""
            : isFetchingNextPage
              ? " · Loading more..."
              : ""}
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
                  (page === totalPages || (!isSearching && isFetchingNextPage)) &&
                    "pointer-events-none opacity-50"
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages && (isSearching || !isFetchingNextPage)) {
                    goToNext();
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>

      <ResetUserPasswordModal
        open={userToResetPassword !== null}
        username={userToResetPassword?.username ?? ""}
        isPending={resetUserPasswordMutation.isPending}
        error={resetPasswordError}
        onUpdate={handleResetPassword}
        onClose={() => {
          setResetPasswordError("");
          setUserToResetPassword(null);
        }}
      />

      <ConfirmationModal
        open={userToDelete !== null}
        variant="reject"
        title="Delete user"
        subtitle={
          userToDelete
            ? deleteError ||
              `Are you sure you want to delete ${userToDelete.username} ?`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel={deleteUserMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDeleteUser}
        onClose={() => {
          setDeleteError("");
          setUserToDelete(null);
        }}
        ariaLabel="Confirm user delete"
      />
    </Card>
  );
}
