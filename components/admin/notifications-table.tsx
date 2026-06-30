"use client";

import { Add01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";

import { AddSystemNotificationModal } from "@/components/custom/add-system-notification-modal";
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
import type { SystemNotification } from "@/api/notificationApi";
import {
  useCreateSystemNotificationMutation,
  useInfiniteNotificationsQuery,
  useResendSystemNotificationMutation,
} from "@/hooks/query";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type NotificationsTableProps = {
  pageSize?: number;
};

export function NotificationsTable({ pageSize = 5 }: NotificationsTableProps) {
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notificationToResend, setNotificationToResend] =
    useState<SystemNotification | null>(null);
  const [saveError, setSaveError] = useState("");
  const [resendError, setResendError] = useState("");

  const createNotificationMutation = useCreateSystemNotificationMutation();
  const resendNotificationMutation = useResendSystemNotificationMutation();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNotificationsQuery({ limit: pageSize });

  const allNotifications = useMemo(
    () => data?.pages.flatMap((notificationsPage) => notificationsPage.items) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedNotifications = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allNotifications.slice(start, start + pageSize);
  }, [allNotifications, page, pageSize]);

  useEffect(() => {
    const neededCount = page * pageSize;

    if (
      allNotifications.length < neededCount &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    allNotifications.length,
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

  const handleSaveNotification = async ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    setSaveError("");

    try {
      await createNotificationMutation.mutateAsync({ title, message });
      setPage(1);
      setIsAddModalOpen(false);
    } catch (mutationError) {
      setSaveError(
        getApiErrorMessage(mutationError, "Could not send notification.")
      );
    }
  };

  const handleResendNotification = async () => {
    if (!notificationToResend) return;

    setResendError("");

    try {
      await resendNotificationMutation.mutateAsync(notificationToResend.id);
      setNotificationToResend(null);
    } catch (mutationError) {
      setResendError(
        getApiErrorMessage(mutationError, "Could not resend notification.")
      );
    }
  };

  if (isLoading) {
    return null;
  }

  if (isError) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
        {getApiErrorMessage(error, "Could not load notifications.")}
      </div>
    );
  }

  return (
    <>
      <Card className="flex min-h-0 flex-1 flex-col pt-0">
        <CardHeader className="flex shrink-0 flex-col gap-4 space-y-0 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>
              Broadcast messages sent to all users
            </CardDescription>
          </div>

          <Button
            type="button"
            size="sm"
            className="h-9 shrink-0 gap-1.5 rounded-lg px-3"
            onClick={() => {
              setSaveError("");
              setIsAddModalOpen(true);
            }}
          >
            <HugeiconsIcon icon={Add01Icon} size={16} strokeWidth={1.75} />
            Add
          </Button>
        </CardHeader>

        <CardContent className="min-h-0 flex-1 overflow-auto p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4">Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Sent at</TableHead>
                <TableHead className="pr-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="pl-4 font-medium text-foreground">
                    {notification.title}
                  </TableCell>
                  <TableCell className="max-w-md text-muted-foreground">
                    <p className="line-clamp-2">{notification.message}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {notification.topic}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {notification.createdAt}
                  </TableCell>
                  <TableCell className="pr-4">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Resend ${notification.title}`}
                        className="text-muted-foreground hover:text-foreground"
                        disabled={
                          resendNotificationMutation.isPending &&
                          resendNotificationMutation.variables ===
                            notification.id
                        }
                        onClick={() => {
                          setResendError("");
                          setNotificationToResend(notification);
                        }}
                      >
                        <HugeiconsIcon
                          icon={SentIcon}
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
            Showing {rangeStart}-{rangeEnd} of {totalCount} notifications
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

      <AddSystemNotificationModal
        open={isAddModalOpen}
        isPending={createNotificationMutation.isPending}
        error={saveError}
        onSave={handleSaveNotification}
        onClose={() => {
          setSaveError("");
          setIsAddModalOpen(false);
        }}
      />

      <ConfirmationModal
        open={notificationToResend !== null}
        variant="neutral"
        title="Resend notification"
        subtitle={
          notificationToResend
            ? resendError ||
              `Send "${notificationToResend.title}" again to the ${notificationToResend.topic} topic?`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel={
          resendNotificationMutation.isPending ? "Sending..." : "Send"
        }
        onConfirm={handleResendNotification}
        onClose={() => {
          setResendError("");
          setNotificationToResend(null);
        }}
        ariaLabel="Confirm resend notification"
      />
    </>
  );
}
