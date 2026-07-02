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
import { modalTokens, TEXT_DARK } from "@/lib/colors";
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
      className={modalTokens.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Reset user password"
      onClick={onClose}
    >
      <Card
        className={modalTokens.card}
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className={modalTokens.header}>
          <CardTitle className={modalTokens.title}>Reset password</CardTitle>
          <CardDescription className={modalTokens.description}>
            Set a new password for {username}.
          </CardDescription>
        </CardHeader>

        <div className="space-y-3 px-5 pb-1">
          <div className="grid gap-1 text-left">
            <label
              htmlFor="new-password"
              className="text-[13px] font-medium text-foreground"
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
              className="h-8 rounded-lg text-[13px]"
              placeholder="Enter new password"
            />
          </div>

          <div className="grid gap-1 text-left">
            <label
              htmlFor="confirm-password"
              className="text-[13px] font-medium text-foreground"
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
              className="h-8 rounded-lg text-[13px]"
              placeholder="Confirm new password"
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
