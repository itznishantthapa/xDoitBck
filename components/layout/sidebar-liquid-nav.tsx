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
import { BG_SIDEBAR, TEXT_DARK, WHITE } from "@/lib/colors";
import { cn } from "@/lib/utils";

const ITEM_H = 56;

type NavOrientation = "vertical" | "horizontal";

/** Single sliding pill — inset from the left so it does not touch the sidebar edge */
const verticalLiquidPillClasses =
  "absolute left-3 right-0 z-0 bg-white rounded-l-[36px] pointer-events-none " +
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] " +
  "before:content-[''] before:absolute before:w-6 before:h-6 before:bg-[var(--liquid-scoop-bg)] before:right-0 before:-top-6 before:rounded-br-[10px] before:shadow-[5px_5px_0_5px_var(--liquid-scoop-cutout)] " +
  "after:content-[''] after:absolute after:w-6 after:h-6 after:bg-[var(--liquid-scoop-bg)] after:right-0 after:-bottom-6 after:rounded-tr-[10px] after:shadow-[5px_-5px_0_5px_var(--liquid-scoop-cutout)]";

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
};

function SlidingLiquidPill({
  top,
  visible,
}: {
  top: number;
  visible: boolean;
}) {
  return (
    <div
      aria-hidden
      className={verticalLiquidPillClasses}
      style={{
        height: ITEM_H,
        transform: `translateY(${top}px)`,
        opacity: visible ? 1 : 0,
        ["--liquid-scoop-bg" as string]: BG_SIDEBAR,
        ["--liquid-scoop-cutout" as string]: WHITE,
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
          ? "h-12 min-w-0 flex-1 rounded-xl"
          : "h-14 w-full",
        isHorizontal && isActive && "bg-white",
        isHorizontal && !isActive && "hover:bg-white/10"
      )}
    >
      <span className="relative inline-flex items-center justify-center">
        <HugeiconsIcon
          icon={icon}
          size={20}
          color={isActive ? TEXT_DARK : WHITE}
          strokeWidth={isActive ? 2 : 1.75}
          className={cn(
            "relative z-0 shrink-0 transition-all duration-300",
            isActive && !isHorizontal && "scale-110",
            !isActive && "group-hover:scale-105"
          )}
        />
        {showBadge ? (
          <span
            aria-hidden
            className={cn(
              "absolute -right-2.5 -top-2.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#895ef6] px-1 text-[10px] font-bold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]",
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
        isHorizontal && "min-h-12",
        className
      )}
    >
      {!isHorizontal ? (
        <SlidingLiquidPill top={indicator.top} visible={indicator.visible} />
      ) : null}

      <div
        className={cn(
          "flex w-full",
          isHorizontal ? "flex-row gap-1" : "flex-col gap-2"
        )}
      >
        {mainItems.map(renderItem)}
      </div>
    </div>
  );
}
