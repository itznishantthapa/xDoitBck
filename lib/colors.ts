/** Page & surface */
export const GHOSTWHITE = "#F7F7F7";
export const WHITE = "#FFFFFF";

/** Text hierarchy — Airbnb / Shopify inspired */
export const TEXT_DARK = "#222222";
export const TEXT_SECONDARY = "#6A6A6A";
export const TEXT_MUTED = "#717171";
export const TEXT_TERTIARY = "#B0B0B0";

/** Borders & accents */
export const BORDER = "#EBEBEB";
export const BORDER_WIDTH = 1;
export const BOOKED_TEXT = "#B54708";
export const BG_BUTTON = "#CDEBDD";
export const BG_SIDEBAR = "#1A1A1A";

export const adminTokens = {
  sidebarTube: "rounded-full",
  containerBorder: "border border-border shadow-none",
  pageBg: GHOSTWHITE,
} as const;

export const shopifyCardSurface =
  "rounded-[20px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.05)]";

export const shopifyAdminCard =
  "flex flex-col overflow-hidden border-0 pt-0 shadow-none " + shopifyCardSurface;

export const shopifyAdminCardFooter =
  "shrink-0 items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5";

export const statsCardTokens = {
  base:
    "relative flex min-h-[108px] flex-col overflow-hidden p-4 " + shopifyCardSurface,
  imageWrap:
    "pointer-events-none absolute right-2 bottom-2 size-16 sm:size-[4.5rem]",
  image: "size-full object-contain object-bottom-right",
} as const;

export const modalTokens = {
  overlay:
    "fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/30 p-4",
  card: "w-full max-w-sm cursor-default gap-0 rounded-xl border border-border bg-card py-0 shadow-lg",
  header: "items-start space-y-1 px-5 pb-3 pt-5 text-left",
  title: "text-base font-semibold tracking-tight text-foreground",
  description: "text-[13px] leading-relaxed text-muted-foreground",
  footer: "gap-2 border-t border-border bg-card px-5 py-3",
  cancelButton:
    "h-8 min-w-0 flex-1 rounded-lg border-border bg-card text-[13px] font-medium text-foreground shadow-none hover:bg-muted/50",
  confirmButton:
    "h-8 min-w-0 flex-1 rounded-lg text-[13px] font-medium text-white shadow-none hover:opacity-90",
} as const;
