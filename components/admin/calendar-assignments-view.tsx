"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Folder01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CalendarDateMeta, MetaAssignment } from "@/mock/CalendarMocked";
import {
  getCalendarAssignmentsForDate,
  type CalendarAssignmentKind,
} from "@/lib/calendar-utils";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

const kindConfig = {
  delivery: {
    title: "Delivery Assignments",
    description: "Assignments scheduled for delivery on this date.",
    detailsFrom: "calendar-delivery" as const,
    theme: {
      pageBg: "bg-[#895ef60a]",
      tab: "bg-[#895ef6]",
      folder: "bg-[#895ef622]",
 
      iconWrap: "bg-white/75 text-[#895ef6]",
      label: "text-[#4c2f91]",
      meta: "text-[#895ef6]",
    },
  },
  delivered: {
    title: "Delivered Assignments",
    description: "Assignments delivered on this date.",
    detailsFrom: "calendar-delivered" as const,
    theme: {
      pageBg: "bg-[#7ae3aa0a]",
      tab: "bg-[#7ae3aa]",
      folder: "bg-[#7ae3aa22]",
   
      iconWrap: "bg-white/75 text-emerald-600",
      label: "text-emerald-900",
      meta: "text-emerald-700",
    },
  },
} as const;

type CalendarAssignmentsViewProps = {
  kind: CalendarAssignmentKind;
  date: string;
  dateMeta: CalendarDateMeta[];
};

function formatDisplayDate(date: string) {
  try {
    return format(parseISO(date), "EEEE, MMMM d, yyyy");
  } catch {
    return date;
  }
}

function AssignmentFolderItem({
  assignment,
  href,
  theme,
}: {
  assignment: MetaAssignment;
  href: string;
  theme: (typeof kindConfig)[CalendarAssignmentKind]["theme"];
}) {
  return (
    <Link href={href} className="block min-w-0">
      <div className="relative pt-2.5">
        <div
          className={cn(
            "absolute left-4 top-0 z-20 h-3 w-13 rounded-t-[10px] shadow-sm",
            theme.tab
          )}
        />

        <div
          className={cn(
            "relative overflow-hidden rounded-[1.25rem] rounded-tl-md",
            theme.folder,
  
          )}
        >
          <div className="absolute inset-x-0 top-0 h-8 bg-white/10" />

          <div className="relative flex min-h-25 flex-col justify-between gap-4 p-4 pt-5">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
                  theme.iconWrap
                )}
              >
                <HugeiconsIcon
                  icon={Folder01Icon}
                  size={20}
                  strokeWidth={1.75}
                />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    "line-clamp-2 text-sm font-semibold leading-snug tracking-tight",
                    theme.label
                  )}
                >
                  {assignment.metaAssignmentName}
                </p>
                <p className={cn("mt-1 text-[11px] font-medium", theme.meta)}>
                  Assignment #{assignment.id}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <span className={cn("text-xs font-medium", theme.meta)}>
                Open Assignment
              </span>
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full bg-white/70",
                  theme.iconWrap
                )}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  strokeWidth={2}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CalendarAssignmentsView({
  kind,
  date,
  dateMeta,
}: CalendarAssignmentsViewProps) {
  const router = useRouter();
  const config = kindConfig[kind];

  const assignments = useMemo(
    () => getCalendarAssignmentsForDate(kind, date, dateMeta),
    [kind, date, dateMeta]
  );

  const formattedDate = date ? formatDisplayDate(date) : "Unknown date";

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => router.push(routes.admin.calendar)}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
        Back to calendar
      </Button>

      <Card size="sm" className="overflow-hidden pt-0">
        <CardHeader className="space-y-1 border-b py-4">
          <CardTitle className="text-base font-medium">{config.title}</CardTitle>
          <CardDescription>{config.description}</CardDescription>
          <p className="pt-1 text-sm font-medium text-foreground">{formattedDate}</p>
        </CardHeader>

        <CardContent className={cn("py-5", config.theme.pageBg)}>
          {assignments.length === 0 ? (
            <div
              className={cn(
                "rounded-[1.25rem] px-4 py-10 text-center",
                config.theme.folder,
              )}
            >
              <div
                className={cn(
                  "mx-auto mb-3 flex size-12 items-center justify-center rounded-xl",
                  config.theme.iconWrap
                )}
              >
                <HugeiconsIcon
                  icon={Folder01Icon}
                  size={22}
                  strokeWidth={1.75}
                />
              </div>
              <p className={cn("text-sm font-semibold", config.theme.label)}>
                No assignments found
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                There are no {kind} assignments for this date.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {assignments.map((assignment) => (
                <AssignmentFolderItem
                  key={assignment.id}
                  assignment={assignment}
                  href={routes.admin.assignmentDetails(
                    String(assignment.id),
                    config.detailsFrom,
                    { date }
                  )}
                  theme={config.theme}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
