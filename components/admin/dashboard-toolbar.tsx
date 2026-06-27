"use client";

import Image from "next/image";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

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
    <div className="flex shrink-0 items-center justify-between gap-8">
      <label className="relative block w-full max-w-sm">
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
            "h-10 rounded-xl border-0 bg-card pl-10 text-sm font-medium shadow-none ring-1 ring-foreground/10",
            "placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
          )}
        />
      </label>

      {mounted && userName ? (
        <div className="flex shrink-0 items-center gap-3">
          <div className="min-w-0 text-right">
            <p
              className="truncate text-base font-semibold leading-tight tracking-tight"
              style={{ color: TEXT_DARK }}
            >
              {userName}
            </p>
            <p
              className="text-sm font-medium leading-tight"
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
  );
}
