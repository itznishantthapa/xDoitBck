"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  className?: string;
};

export function AdminPageHeader({ title, className }: AdminPageHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const userName = useAuthStore((state) => state.user?.name);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "flex w-full shrink-0 items-center justify-between gap-3 py-0.5",
        className
      )}
    >
      <div className="min-w-0 shrink">
        <h1
          className="truncate text-xl font-medium tracking-tight md:text-2xl"
          style={{ color: TEXT_DARK }}
        >
          {title}
        </h1>
        <div
          className="mt-1 h-0.5 w-full max-w-[3.5rem] rounded-full md:max-w-[4rem]"
          style={{ backgroundColor: TEXT_DARK }}
          aria-hidden
        />
      </div>

      {mounted && userName ? (
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden min-w-0 text-right sm:block">
            <p
              className="truncate text-xs font-medium leading-tight"
              style={{ color: TEXT_DARK }}
            >
              {userName}
            </p>
            <p
              className="truncate text-[10px] leading-tight"
              style={{ color: TEXT_MUTED }}
            >
              Admin
            </p>
          </div>
          <Image
            src="/avatar.png"
            alt={userName}
            width={28}
            height={28}
            priority
            className="size-7 shrink-0 rounded-full object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
