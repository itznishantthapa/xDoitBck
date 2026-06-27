import Image from "next/image";

import { TEXT_DARK } from "@/lib/colors";
import { cn } from "@/lib/utils";

type AdminPageTitleProps = {
  title: string;
  className?: string;
};

export function AdminPageTitle({ title, className }: AdminPageTitleProps) {
  return (
    <h1
      className={cn(
        "flex items-center gap-2 text-[28px] font-bold tracking-tight md:gap-2.5 md:text-[32px]",
        className
      )}
      style={{ color: TEXT_DARK }}
    >
      <span>{title}</span>
      <Image
        src="/leaficon.png"
        alt=""
        width={40}
        height={40}
        priority
        aria-hidden
        className="size-7 shrink-0 object-contain md:size-8"
      />
    </h1>
  );
}
