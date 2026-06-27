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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { adminTokens, colors } from "@/lib/colors";
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

function NavIconLink({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: (typeof navIcons)[keyof typeof navIcons];
  isActive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          prefetch={false}
          aria-label={label}
          className={cn(
            "relative flex h-11 w-full items-center justify-center transition-colors",
            !isActive && "rounded-xl hover:bg-white/10"
          )}
        >
          {isActive ? (
            <span
              aria-hidden
              className="absolute inset-y-0 -right-[calc(0.5rem+1px)] left-0 z-0 rounded-l-2xl rounded-r-none"
              style={{ backgroundColor: colors.canvasTint }}
            />
          ) : null}
          <AppIcon
            icon={icon}
            size={20}
            className="relative z-10"
            color={
              isActive ? colors.sidebarRailActiveFg : colors.sidebarRailFg
            }
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function NavIconButton({
  label,
  icon,
  onClick,
  iconColor = colors.sidebarRailFg,
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

  const handleSignOut = () => {
    logout();
    router.push(routes.auth);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex min-h-svh w-full"
        style={{ backgroundColor: colors.theWhite }}
      >
        <aside className="sticky top-0 flex h-svh w-23 shrink-0 justify-center py-4 pl-4">
          <nav
            aria-label="Admin navigation"
            className={cn(
              "flex h-[calc(100svh-2rem)] w-17 flex-col overflow-visible py-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
              adminTokens.sidebarRailRadius
            )}
            style={{ backgroundColor: colors.sidebarRailBg }}
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

            <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-x-visible overflow-y-auto px-2">
              {mockedData.sidebar.navigation.map((item) => {
                const icon = navIcons[item.icon as keyof typeof navIcons];

                return (
                  <NavIconLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    icon={icon}
                    isActive={pathname === item.href}
                  />
                );
              })}
            </div>

            <div className="mt-4 flex shrink-0 flex-col gap-1 px-2">
              {mockedData.sidebar.footerNavigation.map((item) => {
                const icon = navIcons[item.icon as keyof typeof navIcons];

                return (
                  <NavIconLink
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    icon={icon}
                    isActive={pathname === item.href}
                  />
                );
              })}
              <NavIconButton
                label="Log out"
                icon={Logout01Icon}
                onClick={handleSignOut}
                hoverClassName="hover:bg-red-500/15"
                iconColor="#f87171"
              />
            </div>
          </nav>
        </aside>

        <main
          className="min-h-svh min-w-0 flex-1"
          style={{ backgroundColor: colors.theWhite }}
        >
          <header className="px-6 pb-2 pt-7 md:px-8">
            <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 md:text-[32px]">
              {title}
            </h1>
          </header>
          <div className="flex flex-1 flex-col px-6 pb-8 pt-1 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
