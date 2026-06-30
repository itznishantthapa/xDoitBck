"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { cn } from "@/lib/utils";

export type AddSystemNotificationModalProps = {
  open: boolean;
  isPending?: boolean;
  error?: string;
  onClose: () => void;
  onSave: (payload: { title: string; message: string }) => void;
};

export function AddSystemNotificationModal({
  open,
  isPending = false,
  error = "",
  onClose,
  onSave,
}: AddSystemNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setMessage("");
      setValidationError("");
    }
  }, [open]);

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

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (!trimmedTitle || !trimmedMessage) {
      setValidationError("Please enter both title and message.");
      return;
    }

    setValidationError("");
    onSave({ title: trimmedTitle, message: trimmedMessage });
  };

  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Add system notification"
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
            Send notification
          </CardTitle>

          <div
            className="mx-auto mt-2 h-1 w-44 rounded-full"
            style={{ backgroundColor: TEXT_DARK }}
          />

          <CardDescription
            className="mt-4 text-sm leading-relaxed font-medium"
            style={{ color: TEXT_MUTED }}
          >
            This will push to all users on the all_users topic and save the
            notification.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 px-6 pb-2">
          <div className="grid gap-1.5 text-left">
            <label
              htmlFor="notification-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="notification-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setValidationError("");
              }}
              className="h-10 rounded-lg"
              placeholder="Notification title"
            />
          </div>

          <div className="grid gap-1.5 text-left">
            <label
              htmlFor="notification-message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <Textarea
              id="notification-message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setValidationError("");
              }}
              className="min-h-28 rounded-lg"
              placeholder="Notification message"
            />
          </div>

          {displayError ? (
            <p className="text-left text-sm font-medium text-[#f03063]">
              {displayError}
            </p>
          ) : null}
        </div>

        <CardFooter className="mt-3 gap-2.5 border-t border-border/60 bg-white px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="h-9 min-w-0 flex-1 rounded-lg border-border/80 bg-white text-sm font-medium text-foreground shadow-none hover:bg-muted/40"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={cn(
              "h-9 min-w-0 flex-1 rounded-lg text-sm font-medium text-white shadow-none hover:opacity-90"
            )}
            style={{ backgroundColor: TEXT_DARK }}
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
