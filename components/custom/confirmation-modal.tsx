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
import { modalTokens, TEXT_DARK } from "@/lib/colors";
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
      className={modalTokens.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <Card
        className={modalTokens.card}
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className={modalTokens.header}>
          <CardTitle className={modalTokens.title}>{title}</CardTitle>
          <CardDescription className={modalTokens.description}>
            {subtitle}
          </CardDescription>
        </CardHeader>

        <CardFooter className={modalTokens.footer}>
          <Button
            type="button"
            variant="outline"
            className={modalTokens.cancelButton}
            onClick={onClose}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className={cn(modalTokens.confirmButton)}
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
