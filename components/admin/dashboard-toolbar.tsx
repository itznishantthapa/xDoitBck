"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AdminPageTitle } from "@/components/layout/admin-page-title";
import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { useAuthStore } from "@/lib/store";

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

      <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 sm:flex lg:gap-4">
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
