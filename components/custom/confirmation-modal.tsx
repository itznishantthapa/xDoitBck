"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { cn } from "@/lib/utils";

const SUCCESS = "#08d203";
const REJECT = "#f03063";

export type ConfirmationModalVariant = "approve" | "reject" | "neutral";

export type ConfirmationModalProps = {
  open: boolean;
  title: string;
  subtitle: string;
  variant?: ConfirmationModalVariant;
  cancelLabel?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  ariaLabel?: string;
};

export function ConfirmationModal({
  open,
  title,
  subtitle,
  variant = "approve",
  cancelLabel = "Cancel",
  confirmLabel,
  onConfirm,
  onClose,
  ariaLabel = "Confirmation",
}: ConfirmationModalProps) {
  const accentColor =
    variant === "approve"
      ? SUCCESS
      : variant === "reject"
        ? REJECT
        : TEXT_DARK;

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md cursor-default gap-0 border-0 py-0 shadow-2xl ring-1 ring-foreground/10"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="items-center space-y-0 px-6 pb-2 pt-7 text-center">
          <CardTitle
            className="text-lg font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            {title}
          </CardTitle>

          <div
            className="mx-auto mt-2 h-1 w-44 rounded-full"
            style={{ backgroundColor: accentColor }}
          />

          <CardDescription
            className="mt-4 text-sm leading-relaxed font-medium"
            style={{ color: TEXT_MUTED }}
          >
            {subtitle}
          </CardDescription>
        </CardHeader>

        <CardFooter className="mt-3 gap-2.5 border-t border-border/60 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-9 min-w-0 flex-1 rounded-lg border-border/80 bg-white text-sm font-medium text-foreground shadow-none hover:bg-muted/40"
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className={cn(
              "h-9 min-w-0 flex-1 rounded-lg text-sm font-medium text-white shadow-none hover:opacity-90"
            )}
            style={{ backgroundColor: accentColor }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
