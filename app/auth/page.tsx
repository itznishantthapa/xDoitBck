"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import SubmitButton from "@/components/custom/SubmitButton";
import {
  BG_BUTTON,
  BOOKED_TEXT,
  BORDER,
  GHOSTWHITE,
  TEXT_DARK,
  TEXT_MUTED,
  WHITE,
} from "@/lib/colors";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/lib/store";

const inputClassName = cn(
  "h-[52px] w-full rounded-2xl border-[1.5px] px-4 text-[15px] font-medium outline-none transition-colors placeholder:text-[var(--text-muted)]"
);

function getInputStyle(hasError: boolean): React.CSSProperties {
  return {
    color: TEXT_DARK,
    backgroundColor: WHITE,
    borderColor: hasError ? BOOKED_TEXT : BORDER,
  };
}

export default function AuthPage() {
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const hasUsernameError = !trimmedUsername;
    const hasPasswordError = !trimmedPassword;

    setUsernameError(hasUsernameError);
    setPasswordError(hasPasswordError);
    setSubmitError("");

    if (hasUsernameError || hasPasswordError) {
      return;
    }

    try {
      await login({ username: trimmedUsername, password: trimmedPassword });
      router.replace(routes.admin.dashboard);
    } catch (err) {
      console.error("Login attempt failed:", err);
      setSubmitError("Could not sign in. Please try again.");
    }
  };

  return (
    <div
      className="rounded-3xl border-0 border-none p-6 shadow-none sm:p-8"
      style={{ backgroundColor: GHOSTWHITE }}
    >
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          Doit App
        </h1>
        <p
          className="mt-2 text-[13px] leading-[19px]"
          style={{ color: TEXT_MUTED }}
        >
          Authenticate yourself to access the admin panel.
        </p>
      </div>

      <form
        onSubmit={handleLoginSubmit}
        className="space-y-5"
        style={{ ["--text-muted" as string]: TEXT_MUTED }}
        noValidate
      >
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-base font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (e.target.value.trim()) setUsernameError(false);
            }}
            className={inputClassName}
            style={getInputStyle(usernameError)}
          />
          {usernameError ? (
            <p className="mt-2 text-xs" style={{ color: BOOKED_TEXT }}>
              Required
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-base font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value.trim()) setPasswordError(false);
            }}
            className={inputClassName}
            style={getInputStyle(passwordError)}
          />
          {passwordError ? (
            <p className="mt-2 text-xs" style={{ color: BOOKED_TEXT }}>
              Required
            </p>
          ) : null}
        </div>

        {submitError ? (
          <p className="text-xs" style={{ color: BOOKED_TEXT }}>
            {submitError}
          </p>
        ) : null}

        <SubmitButton
          type="submit"
          className="w-full border-0 hover:opacity-90"
          style={{
            backgroundColor: BG_BUTTON,
            color: TEXT_DARK,
          }}
          buttonTitle="Login"
          loader={isLoading}
        />
      </form>
    </div>
  );
}
