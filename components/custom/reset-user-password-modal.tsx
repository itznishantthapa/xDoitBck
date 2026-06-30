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
import { TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { cn } from "@/lib/utils";

export type ResetUserPasswordModalProps = {
  open: boolean;
  username: string;
  isPending?: boolean;
  error?: string;
  onClose: () => void;
  onUpdate: (payload: { password: string; confirmPassword: string }) => void;
};

export function ResetUserPasswordModal({
  open,
  username,
  isPending = false,
  error = "",
  onClose,
  onUpdate,
}: ResetUserPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
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

  const handleUpdate = () => {
    if (!password.trim() || !confirmPassword.trim()) {
      setValidationError("Please enter and confirm the new password.");
      return;
    }

    if (password.length < 6 || confirmPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError("");
    onUpdate({ password, confirmPassword });
  };

  const displayError = validationError || error;

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Reset user password"
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
            Reset password
          </CardTitle>

          <div
            className="mx-auto mt-2 h-1 w-44 rounded-full"
            style={{ backgroundColor: TEXT_DARK }}
          />

          <CardDescription
            className="mt-4 text-sm leading-relaxed font-medium"
            style={{ color: TEXT_MUTED }}
          >
            Set a new password for {username}.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 px-6 pb-2">
          <div className="grid gap-1.5 text-left">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-foreground"
            >
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setValidationError("");
              }}
              className="h-10 rounded-lg"
              placeholder="Enter new password"
            />
          </div>

          <div className="grid gap-1.5 text-left">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-foreground"
            >
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setValidationError("");
              }}
              className="h-10 rounded-lg"
              placeholder="Confirm new password"
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
            onClick={handleUpdate}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
