"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CalendarDaysIcon,
  Folder01Icon,
  Home01Icon,
  Logout01Icon,
  NoteIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { SidebarAnimatedNav } from "@/components/layout/sidebar-liquid-nav";
import { AdminPageTitle } from "@/components/layout/admin-page-title";
import { ConfirmationModal } from "@/components/custom/confirmation-modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  adminTokens,
  BG_SIDEBAR,
  BOOKED_TEXT,
  TEXT_DARK,
  WHITE,
} from "@/lib/colors";
import { routes, getActiveAdminNavHref, isAssignmentDetailsPath, isUserDetailsPath } from "@/lib/routes";
import { useBadgeNumbersQuery, useLogoutMutation } from "@/hooks/query";
import { cn } from "@/lib/utils";

const brand = "Doit.";

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
  [routes.admin.calendar]: "Calendar",
};

const navIcons = {
  dashboard: Home01Icon,
  users: UserMultipleIcon,
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

function AppIcon({
  icon,
  className,
  color = "currentColor",
  size = 20,
  strokeWidth = 1.75,
}: {
  icon: IconSvgElement;
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
    />
  );
}

function NavIconButton({
  label,
  icon,
  onClick,
  iconColor = WHITE,
  hoverClassName = "hover:bg-white/10",
}: {
  label: string;
  icon: IconSvgElement;
  onClick: () => void;
  iconColor?: string;
  hoverClassName?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-center rounded-xl transition-colors",
            hoverClassName
          )}
        >
          <AppIcon icon={icon} size={20} color={iconColor} />
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
  const isDashboard = pathname === routes.admin.dashboard;
  const navBadges = {
    assignments: badgeNumbers?.pendingAssignments ?? 0,
    working: badgeNumbers?.workingAssignments ?? 0,
  };

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync();
    router.push(routes.auth);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex min-h-svh w-full flex-col lg:flex-row"
        style={{ backgroundColor: WHITE }}
      >
        <aside className="sticky top-0 z-20 hidden h-svh w-23 shrink-0 justify-center overflow-visible py-4 pl-4 lg:flex">
          <nav
            aria-label="Admin navigation"
            className={cn(
              "flex h-[calc(100svh-2rem)] w-23 flex-col overflow-visible py-4 rounded-l-3xl",
            )}
            style={{ backgroundColor: BG_SIDEBAR }}
          >
            <Link
              href={routes.admin.dashboard}
              prefetch={false}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              aria-label={brand}
              className={cn(
                "mx-auto mb-6 block shrink-0 select-none overflow-hidden",
                adminTokens.sidebarLogoRadius
              )}
            >
              <Image
                src="/logo.png"
                alt={brand}
                width={50}
                height={50}
                draggable={false}
                className={cn("size-11 object-cover", adminTokens.sidebarLogoRadius)}
                priority
              />
            </Link>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-visible pl-2">
              <SidebarAnimatedNav
                mainItems={navigation}
                activeHref={activeNavHref}
                icons={navIcons}
                badges={navBadges}
              />
            </div>

            <div className="mt-4 shrink-0 pl-2">
              <NavIconButton
                label="Log out"
                icon={Logout01Icon}
                onClick={() => setIsLogoutModalOpen(true)}
                hoverClassName=""
                iconColor={BOOKED_TEXT}
              />
            </div>
          </nav>
        </aside>

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

        <main className="flex min-h-0 min-w-0 flex-1 flex-col lg:h-svh lg:overflow-hidden">
          {!isDashboard ? (
            <header className="shrink-0 px-4 pb-2 pt-5 md:px-8 md:pt-7">
              <AdminPageTitle title={title} />
            </header>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] pt-1 md:px-8 lg:overflow-hidden lg:pb-4">
            {children}
          </div>
        </main>

        <nav
          aria-label="Admin navigation"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 lg:hidden"
          style={{ backgroundColor: BG_SIDEBAR }}
        >
          <div className="flex items-stretch px-1 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
              className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors"
            >
              <AppIcon icon={Logout01Icon} size={20} color={BOOKED_TEXT} />
            </button>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
