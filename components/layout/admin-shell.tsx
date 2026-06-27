"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Analytics01Icon,
  CustomerService01Icon,
  GraduationCapIcon,
  Home01Icon,
  Logout01Icon,
  Message01Icon,
  Settings01Icon,
  UserMultipleIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { SidebarAnimatedNav } from "@/components/layout/sidebar-liquid-nav";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  adminTokens,
  BOOKED_TEXT,
  TEXT_DARK,
  WHITE,
} from "@/lib/colors";
import { getAdminPageTitle, mockedData } from "@/lib/mockedData";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navIcons = {
  dashboard: Home01Icon,
  mentors: UserMultipleIcon,
  students: GraduationCapIcon,
  analytics: Analytics01Icon,
  courses: Video01Icon,
  forum: Message01Icon,
  settings: Settings01Icon,
  help: CustomerService01Icon,
} as const;

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
            "flex h-11 w-full items-center justify-center rounded-xl transition-colors",
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
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const title = getAdminPageTitle(pathname);
  const isDashboard = pathname === routes.admin.dashboard;

  const handleSignOut = () => {
    logout();
    router.push(routes.auth);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex min-h-svh w-full"
        style={{ backgroundColor: WHITE }}
      >
        <aside className="sticky top-0 z-20 flex h-svh w-23 shrink-0 justify-center overflow-visible py-4 pl-4">
          <nav
            aria-label="Admin navigation"
            className={cn(
              "flex h-[calc(100svh-2rem)] w-17 flex-col overflow-visible py-4",
              adminTokens.sidebarRailRadius
            )}
            style={{ backgroundColor: TEXT_DARK }}
          >
            <Link
              href={routes.admin.dashboard}
              prefetch={false}
              aria-label={mockedData.sidebar.brand}
              className={cn("mx-auto mb-6 block shrink-0 overflow-hidden", adminTokens.sidebarLogoRadius)}
            >
              <Image
                src="/logo.png"
                alt={mockedData.sidebar.brand}
                width={44}
                height={44}
                className={cn("size-11 object-cover", adminTokens.sidebarLogoRadius)}
                priority
              />
            </Link>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-visible pl-2">
              <SidebarAnimatedNav
                mainItems={mockedData.sidebar.navigation}
                footerItems={mockedData.sidebar.footerNavigation}
                pathname={pathname}
                icons={navIcons}
              />
            </div>

            <div className="mt-4 shrink-0 pl-2">
              <NavIconButton
                label="Log out"
                icon={Logout01Icon}
                onClick={handleSignOut}
                hoverClassName="hover:bg-red-500/15"
                iconColor={BOOKED_TEXT}
              />
            </div>
          </nav>
        </aside>

        <main className="flex h-svh min-w-0 flex-1 flex-col overflow-hidden">
          {!isDashboard ? (
            <header className="shrink-0 px-6 pb-2 pt-7 md:px-8">
              <h1
                className="text-[28px] font-bold tracking-tight md:text-[32px]"
                style={{ color: TEXT_DARK }}
              >
                {title}
              </h1>
            </header>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-4 pt-1 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
