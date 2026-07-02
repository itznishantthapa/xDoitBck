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
import { modalTokens, TEXT_DARK } from "@/lib/colors";
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
      className={modalTokens.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Add system notification"
      onClick={onClose}
    >
      <Card
        className={modalTokens.card}
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className={modalTokens.header}>
          <CardTitle className={modalTokens.title}>Send notification</CardTitle>
          <CardDescription className={modalTokens.description}>
            This will push to all users on the all_users topic and save the
            notification.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 px-5 pb-1">
          <div className="grid gap-1 text-left">
            <label
              htmlFor="notification-title"
              className="text-[13px] font-medium text-foreground"
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
              className="h-8 rounded-lg text-[13px]"
              placeholder="Notification title"
            />
          </div>

          <div className="grid gap-1 text-left">
            <label
              htmlFor="notification-message"
              className="text-[13px] font-medium text-foreground"
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
              className="min-h-24 rounded-lg text-[13px]"
              placeholder="Notification message"
            />
          </div>

          {displayError ? (
            <p className="text-left text-xs font-medium text-[#f03063]">
              {displayError}
            </p>
          ) : null}
        </div>

        <CardFooter className={modalTokens.footer}>
          <Button
            type="button"
            variant="outline"
            className={modalTokens.cancelButton}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={cn(modalTokens.confirmButton)}
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
