"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TEXT_MUTED, WHITE } from "@/lib/colors";
import { cn } from "@/lib/utils";

const ITEM_H = 44;

type NavOrientation = "vertical" | "horizontal";

const verticalPillClasses =
  "absolute inset-x-1.5 z-0 rounded-full bg-[#1A1A1A] pointer-events-none " +
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

function SlidingPill({
  top,
  visible,
}: {
  top: number;
  visible: boolean;
}) {
  return (
    <div
      aria-hidden
      className={verticalPillClasses}
      style={{
        height: ITEM_H,
        transform: `translateY(${top}px)`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}

function SidebarNavLink({
  href,
  label,
  icon,
  isActive,
  badgeCount,
  registerRef,
  orientation,
}: {
  href: string;
  label: string;
  icon: IconSvgElement;
  isActive: boolean;
  badgeCount?: number;
  registerRef?: (href: string, node: HTMLAnchorElement | null) => void;
  orientation: NavOrientation;
}) {
  const showBadge = badgeCount !== undefined && badgeCount > 0;
  const isHorizontal = orientation === "horizontal";

  const link = (
    <Link
      href={href}
      prefetch={false}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      aria-label={
        showBadge ? `${label}, ${badgeCount} notifications` : label
      }
      aria-current={isActive ? "page" : undefined}
      ref={registerRef ? (node) => registerRef(href, node) : undefined}
      className={cn(
        "group relative z-10 flex cursor-pointer select-none items-center justify-center outline-none transition-colors duration-200",
        isHorizontal
          ? "h-10 min-w-0 flex-1 rounded-full"
          : "h-11 w-full rounded-full",
        isHorizontal && isActive && "bg-[#1A1A1A]",
        isHorizontal && !isActive && "hover:bg-black/4"
      )}
    >
      <span className="relative inline-flex items-center justify-center">
        <HugeiconsIcon
          icon={icon}
          size={18}
          color={isActive ? WHITE : TEXT_MUTED}
          strokeWidth={isActive ? 2 : 1.75}
          className={cn(
            "relative z-0 shrink-0 transition-all duration-200",
            !isActive && "group-hover:opacity-80"
          )}
        />
        {showBadge ? (
          <span
            aria-hidden
            className={cn(
              "absolute -right-2 -top-2 z-20 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#895ef6] px-0.5 text-[9px] font-semibold leading-none text-white",
              isHorizontal && isActive && "ring-2 ring-white"
            )}
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        ) : null}
      </span>
    </Link>
  );

  if (isHorizontal) {
    return link;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {showBadge ? `${label} (${badgeCount})` : label}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarAnimatedNav({
  mainItems,
  activeHref,
  icons,
  badges,
  className,
  orientation = "vertical",
}: {
  mainItems: readonly NavItem[];
  activeHref: string;
  icons: Record<string, IconSvgElement>;
  badges?: Record<string, number>;
  className?: string;
  orientation?: NavOrientation;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, visible: false });
  const isHorizontal = orientation === "horizontal";

  const resolvedActiveHref =
    mainItems.find((item) => item.href === activeHref)?.href ?? activeHref;

  const registerRef = useCallback(
    (href: string, node: HTMLAnchorElement | null) => {
      if (node) itemRefs.current.set(href, node);
      else itemRefs.current.delete(href);
    },
    []
  );

  const updateIndicator = useCallback((href: string | undefined) => {
    const container = containerRef.current;
    const activeEl = href ? itemRefs.current.get(href) : null;

    if (!container || !activeEl) {
      setIndicator((prev) => ({ ...prev, visible: false }));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setIndicator({
      top: activeRect.top - containerRect.top,
      visible: true,
    });
  }, []);

  useLayoutEffect(() => {
    if (isHorizontal) return;

    const sync = () => updateIndicator(resolvedActiveHref);

    const frame = requestAnimationFrame(sync);
    const container = containerRef.current;
    const observer = new ResizeObserver(sync);

    if (container) observer.observe(container);
    window.addEventListener("resize", sync);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [isHorizontal, resolvedActiveHref, updateIndicator]);

  const renderItem = (item: NavItem) => {
    const icon = icons[item.icon];
    if (!icon) return null;

    return (
      <SidebarNavLink
        key={item.id}
        href={item.href}
        label={item.label}
        icon={icon}
        isActive={resolvedActiveHref === item.href}
        badgeCount={badges?.[item.id]}
        registerRef={isHorizontal ? undefined : registerRef}
        orientation={orientation}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full flex-col overflow-visible",
        isHorizontal && "min-h-10",
        className
      )}
    >
      {!isHorizontal ? (
        <SlidingPill top={indicator.top} visible={indicator.visible} />
      ) : null}

      <div
        className={cn(
          "flex w-full",
          isHorizontal ? "flex-row gap-0.5" : "flex-col gap-1"
        )}
      >
        {mainItems.map(renderItem)}
      </div>
    </div>
  );
}
