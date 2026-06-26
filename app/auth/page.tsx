"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SubmitButton from "@/components/custom/SubmitButton";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { useAuthStore } from "@/lib/store";

const ERROR_COLOR = "#DC2626";

const inputClassName = cn(
  "h-[52px] w-full rounded-2xl border-[1.5px] px-4 text-[15px] font-medium outline-none transition-colors"
);

function getInputStyle(hasError: boolean): React.CSSProperties {
  return {
    color: colors.theSoftBlack,
    backgroundColor: colors.theWhite,
    borderColor: hasError ? ERROR_COLOR : colors.bgColor,
  };
}

export default function AuthPage() {
  const { user, login, isLoading } = useAuthStore();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace(routes.admin.root);
    }
  }, [user, router]);

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
      router.replace(routes.admin.root);
    } catch (err) {
      console.error("Login attempt failed:", err);
      setSubmitError("Could not sign in. Please try again.");
    }
  };

  if (user) {
    return null;
  }

  return (
    <div
      className="rounded-3xl p-6 shadow-sm sm:p-8"
      style={{ backgroundColor: colors.theWhite }}
    >
      <div className="mb-8 text-center">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: colors.theSoftBlack }}
        >
          Doit App
        </h1>
        <p
          className="mt-2 text-[13px] leading-[19px]"
          style={{ color: colors.theSoftGrey }}
        >
          Authenticate yourself to access the admin panel.
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="username"
            className="mb-1.5 block text-base font-bold tracking-tight"
            style={{ color: colors.theSoftBlack }}
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
            className={cn(inputClassName, "placeholder:text-[#8f8e8e]")}
            style={getInputStyle(usernameError)}
          />
          {usernameError ? (
            <p className="mt-2 text-xs" style={{ color: ERROR_COLOR }}>
              Required
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-base font-bold tracking-tight"
            style={{ color: colors.theSoftBlack }}
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
            className={cn(inputClassName, "placeholder:text-[#8f8e8e]")}
            style={getInputStyle(passwordError)}
          />
          {passwordError ? (
            <p className="mt-2 text-xs" style={{ color: ERROR_COLOR }}>
              Required
            </p>
          ) : null}
        </div>

        {submitError ? (
          <p className="text-xs" style={{ color: ERROR_COLOR }}>
            {submitError}
          </p>
        ) : null}

        <SubmitButton
          type="submit"
          className="w-full border-0 hover:opacity-90"
          style={{
            backgroundColor: colors.theGreen,
            color: colors.theSoftBlack,
          }}
          buttonTitle="Login"
          loader={isLoading}
        />
      </form>
    </div>
  );
}
