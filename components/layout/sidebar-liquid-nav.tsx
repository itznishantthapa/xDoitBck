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
import { TEXT_DARK, WHITE } from "@/lib/colors";
import { cn } from "@/lib/utils";

const ITEM_H = 56;

/** Single sliding pill — inverted-radius scoops live here, not on each link */
const liquidPillClasses =
  "absolute right-0 z-0 w-full bg-white rounded-l-[24px] pointer-events-none " +
  "transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] " +
  "before:content-[''] before:absolute before:w-5 before:h-5 before:bg-[#1a1a1a] before:right-0 before:-top-5 before:rounded-br-[20px] before:shadow-[4px_4px_0_4px_#ffffff] " +
  "after:content-[''] after:absolute after:w-5 after:h-5 after:bg-[#1a1a1a] after:right-0 after:-bottom-5 after:rounded-tr-[20px] after:shadow-[4px_-4px_0_4px_#ffffff]";

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
      className={liquidPillClasses}
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
}: {
  href: string;
  label: string;
  icon: IconSvgElement;
  isActive: boolean;
  badgeCount?: number;
  registerRef: (href: string, node: HTMLAnchorElement | null) => void;
}) {
  const showBadge = badgeCount !== undefined && badgeCount > 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          prefetch={false}
          aria-label={
            showBadge ? `${label}, ${badgeCount} notifications` : label
          }
          aria-current={isActive ? "page" : undefined}
          ref={(node) => registerRef(href, node)}
          className="group relative z-10 flex h-14 w-full cursor-pointer items-center justify-center outline-none"
        >
          <span className="relative inline-flex items-center justify-center">
            <HugeiconsIcon
              icon={icon}
              size={20}
              color={isActive ? TEXT_DARK : WHITE}
              strokeWidth={isActive ? 2 : 1.75}
              className={cn(
                "relative z-0 shrink-0 transition-all duration-300",
                isActive
                  ? "scale-110"
                  : "text-white group-hover:scale-105"
              )}
            />
            {showBadge ? (
              <span
                aria-hidden
                className="absolute -right-2.5 -top-2.5 z-20 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#895ef6] px-1 text-[10px] font-bold leading-none text-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
              >
                {badgeCount > 99 ? "99+" : badgeCount}
              </span>
            ) : null}
          </span>
        </Link>
      </TooltipTrigger>
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
}: {
  mainItems: readonly NavItem[];
  activeHref: string;
  icons: Record<string, IconSvgElement>;
  badges?: Record<string, number>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, visible: false });

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
  }, [resolvedActiveHref, updateIndicator]);

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
        registerRef={registerRef}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex flex-col overflow-visible", className)}
    >
      <SlidingLiquidPill top={indicator.top} visible={indicator.visible} />

      <div className="flex flex-col gap-2">{mainItems.map(renderItem)}</div>
    </div>
  );
}
