"use client";

import Image from "next/image";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { AdminPageTitle } from "@/components/layout/admin-page-title";
import { Input } from "@/components/ui/input";
import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DashboardToolbar() {
  const [mounted, setMounted] = useState(false);
  const userName = useAuthStore((state) => state.user?.name);

  // User is read from localStorage on the client only — defer until after
  // hydration so server HTML matches the first client render.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
      <div className="flex min-w-0 items-start justify-between gap-3 sm:block sm:max-w-[42%] lg:max-w-[36%] xl:max-w-none">
        <AdminPageTitle title="Dashboard" />

        {mounted && userName ? (
          <Image
            src="/avatar.png"
            alt={userName}
            width={44}
            height={44}
            priority
            className="size-10 shrink-0 rounded-full object-cover sm:hidden"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3 sm:justify-end lg:gap-4">
        <label className="relative min-w-0 flex-1 sm:max-w-40 md:max-w-48 lg:max-w-56 xl:max-w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className={cn(
              "h-10 w-full min-w-0 rounded-xl border-0 bg-card pl-10 text-sm font-medium shadow-none ring-1 ring-foreground/10",
              "placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
            )}
          />
        </label>

        {mounted && userName ? (
          <div className="hidden shrink-0 items-center gap-2 sm:flex sm:gap-3">
            <div className="min-w-0 max-w-[7.5rem] text-right md:max-w-32 lg:max-w-36">
              <p
                className="truncate text-base font-semibold leading-tight tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                {userName}
              </p>
              <p
                className="truncate text-sm font-medium leading-tight"
                style={{ color: TEXT_MUTED }}
              >
                Admin
              </p>
            </div>
            <Image
              src="/avatar.png"
              alt={userName}
              width={44}
              height={44}
              priority
              className="size-11 shrink-0 rounded-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
