"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CalendarDaysIcon,
  Folder01Icon,
  Home01Icon,
  Logout01Icon,
  NoteIcon,
  Notification01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { SidebarAnimatedNav } from "@/components/layout/sidebar-liquid-nav";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { ConfirmationModal } from "@/components/custom/confirmation-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  adminTokens,
  BOOKED_TEXT,
  shopifyCardSurface,
} from "@/lib/colors";
import { routes, getActiveAdminNavHref, isAssignmentDetailsPath, isUserDetailsPath } from "@/lib/routes";
import { useBadgeNumbersQuery, useLogoutMutation } from "@/hooks/query";
import { cn } from "@/lib/utils";

const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: routes.admin.dashboard,
    icon: "dashboard",
  },
  {
    id: "calendar",
    label: "Calendar",
    href: routes.admin.calendar,
    icon: "calendar",
  },
  {
    id: "users",
    label: "Users",
    href: routes.admin.users,
    icon: "users",
  },
  {
    id: "notifications",
    label: "Notification",
    href: routes.admin.notifications,
    icon: "notifications",
  },
  {
    id: "assignments",
    label: "Assignments",
    href: routes.admin.assignments,
    icon: "assignments",
  },
  {
    id: "working",
    label: "Working",
    href: routes.admin.working,
    icon: "working",
  },
] as const;

const pageTitles: Record<string, string> = {
  [routes.admin.dashboard]: "Dashboard",
  [routes.admin.users]: "Users",
  [routes.admin.assignments]: "Assignments",
  [routes.admin.working]: "Working",
  [routes.admin.notifications]: "Notification",
  [routes.admin.calendar]: "Calendar",
};

const navIcons = {
  dashboard: Home01Icon,
  users: UserMultipleIcon,
  notifications: Notification01Icon,
  assignments: NoteIcon,
  working: Folder01Icon,
  calendar: CalendarDaysIcon,
} as const;

function getPageTitle(pathname: string) {
  if (isAssignmentDetailsPath(pathname)) {
    return "Assignment Details";
  }

  if (isUserDetailsPath(pathname)) {
    return "User Details";
  }

  if (pathname.startsWith(`${routes.admin.calendar}/delivery`)) {
    return "Delivery Assignments";
  }

  if (pathname.startsWith(`${routes.admin.calendar}/delivered`)) {
    return "Delivered Assignments";
  }

  return pageTitles[pathname] ?? "Dashboard";
}

function NavIconButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/4"
        >
          <HugeiconsIcon
            icon={icon}
            size={18}
            color={BOOKED_TEXT}
            strokeWidth={1.75}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();
  const { data: badgeNumbers } = useBadgeNumbersQuery();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const title = getPageTitle(pathname);
  const activeNavHref = getActiveAdminNavHref(
    pathname,
    searchParams.get("from")
  );
  const navBadges = {
    assignments: badgeNumbers?.inReviewAssignments ?? 0,
    working: badgeNumbers?.workingAssignments ?? 0,
  };

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync();
    router.push(routes.auth);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex min-h-svh max-h-svh w-full flex-col gap-3 p-3"
        style={{ backgroundColor: adminTokens.pageBg }}
      >
        <AdminPageHeader title={title} />

        <div className="flex min-h-0 flex-1 items-stretch gap-3">
          <aside className="z-20 hidden w-[60px] shrink-0 lg:flex">
            <nav
              aria-label="Admin navigation"
              className={cn(
                "flex h-full w-full flex-col items-center py-2",
                shopifyCardSurface,
                adminTokens.sidebarTube
              )}
            >
              <Link
                href={routes.admin.dashboard}
                prefetch={false}
                draggable={false}
                onDragStart={(event) => event.preventDefault()}
                aria-label="Doit. home"
                className="mb-2 flex h-8 w-full shrink-0 items-center justify-center select-none"
              >
                <Image
                  src="/logo.png"
                  alt="Doit."
                  width={28}
                  height={28}
                  priority
                  className="size-7 rounded-md object-cover"
                />
              </Link>

              <div className="flex min-h-0 w-full flex-1 flex-col justify-center overflow-visible px-1.5">
                <SidebarAnimatedNav
                  mainItems={navigation}
                  activeHref={activeNavHref}
                  icons={navIcons}
                  badges={navBadges}
                />
              </div>

              <div className="w-full shrink-0 px-1.5 pb-0.5">
                <NavIconButton
                  label="Log out"
                  icon={Logout01Icon}
                  onClick={() => setIsLogoutModalOpen(true)}
                />
              </div>
            </nav>
          </aside>

          <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:overflow-hidden lg:pb-0">
              {children}
            </div>
          </main>
        </div>

        <ConfirmationModal
          open={isLogoutModalOpen}
          variant="neutral"
          title="Log out"
          subtitle="Are you sure you want to log out of your account?"
          cancelLabel="Cancel"
          confirmLabel="Log out"
          onConfirm={async () => {
            setIsLogoutModalOpen(false);
            await handleSignOut();
          }}
          onClose={() => setIsLogoutModalOpen(false)}
          ariaLabel="Confirm log out"
        />

        <nav
          aria-label="Admin navigation"
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white lg:hidden",
            shopifyCardSurface,
            "rounded-none border-x-0 border-b-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          )}
        >
          <div className="flex items-stretch px-1 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
            <div className="relative min-w-0 flex-1 px-1">
              <SidebarAnimatedNav
                mainItems={navigation}
                activeHref={activeNavHref}
                icons={navIcons}
                badges={navBadges}
                orientation="horizontal"
              />
            </div>
            <button
              type="button"
              aria-label="Log out"
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/4"
            >
              <HugeiconsIcon
                icon={Logout01Icon}
                size={18}
                color={BOOKED_TEXT}
                strokeWidth={1.75}
              />
            </button>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
