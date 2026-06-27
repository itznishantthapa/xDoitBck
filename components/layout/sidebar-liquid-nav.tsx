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
  registerRef,
}: {
  href: string;
  label: string;
  icon: IconSvgElement;
  isActive: boolean;
  registerRef: (href: string, node: HTMLAnchorElement | null) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          prefetch={false}
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
          ref={(node) => registerRef(href, node)}
          className="group relative z-10 flex h-14 w-full items-center justify-center outline-none"
        >
          <HugeiconsIcon
            icon={icon}
            size={20}
            color={isActive ? TEXT_DARK : WHITE}
            strokeWidth={isActive ? 2 : 1.75}
            className={cn(
              "relative z-10 shrink-0 transition-all duration-300",
              isActive
                ? "scale-110"
                : "text-zinc-400 group-hover:scale-105 group-hover:text-zinc-200"
            )}
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={12}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarAnimatedNav({
  mainItems,
  footerItems,
  pathname,
  icons,
  className,
}: {
  mainItems: readonly NavItem[];
  footerItems: readonly NavItem[];
  pathname: string;
  icons: Record<string, IconSvgElement>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, visible: false });

  const activeHref =
    mainItems.find((item) => item.href === pathname)?.href ??
    footerItems.find((item) => item.href === pathname)?.href;

  const registerRef = useCallback(
    (href: string, node: HTMLAnchorElement | null) => {
      if (node) itemRefs.current.set(href, node);
      else itemRefs.current.delete(href);
    },
    []
  );

  const updateIndicator = useCallback((activeHref: string | undefined) => {
    const container = containerRef.current;
    const activeEl = activeHref ? itemRefs.current.get(activeHref) : null;

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
    const sync = () => updateIndicator(activeHref);

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
  }, [activeHref, updateIndicator]);

  const renderItem = (item: NavItem) => {
    const icon = icons[item.icon];
    if (!icon) return null;

    return (
      <SidebarNavLink
        key={item.id}
        href={item.href}
        label={item.label}
        icon={icon}
        isActive={activeHref === item.href}
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

      <div className="mt-4 flex flex-col gap-2">
        {footerItems.map(renderItem)}
      </div>
    </div>
  );
}
