"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useLoginMutation,
  useTotpSetupMutation,
  useTotpVerifyMutation,
} from "@/hooks/query";
import { BG_SIDEBAR, TEXT_DARK, TEXT_MUTED } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";

const SUCCESS = "#08d203";
const REJECT = "#f03063";

type AuthStep = "credentials" | "totp_setup" | "totp_verify";

const inputClassName = cn(
  "h-11 rounded-xl border-0 bg-background text-sm font-medium shadow-none ring-1 ring-foreground/10",
  "placeholder:text-muted-foreground focus-visible:border-0 focus-visible:ring-1 focus-visible:ring-foreground/20"
);

export default function AuthPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const totpSetupMutation = useTotpSetupMutation();
  const totpVerifyMutation = useTotpVerifyMutation();

  const [step, setStep] = useState<AuthStep>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const isPending =
    loginMutation.isPending ||
    totpSetupMutation.isPending ||
    totpVerifyMutation.isPending ||
    isNavigating;

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
      const response = await loginMutation.mutateAsync({
        username: trimmedUsername,
        password: trimmedPassword,
      });

      if (response.step === "totp_setup") {
        setSetupToken(response.setup_token ?? "");
        setOtpauthUri(response.otpauth_uri ?? null);
        setStep("totp_setup");
        setOtpCode("");
        return;
      }

      setVerifyToken(response.verify_token ?? "");
      setStep("totp_verify");
      setOtpCode("");
    } catch (err) {
      console.error("Login attempt failed:", err);
      setSubmitError(
        getApiErrorMessage(err, "We're unable to authenticate.")
      );
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCode = otpCode.trim();
    const hasOtpError = trimmedCode.length !== 6;

    setOtpError(hasOtpError);
    setSubmitError("");

    if (hasOtpError) {
      return;
    }

    try {
      if (step === "totp_setup") {
        await totpSetupMutation.mutateAsync({
          setup_token: setupToken,
          code: trimmedCode,
        });
      } else {
        await totpVerifyMutation.mutateAsync({
          verify_token: verifyToken,
          code: trimmedCode,
        });
      }

      setOtpauthUri(null);
      setIsNavigating(true);
      router.replace(routes.admin.dashboard);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsNavigating(false);
    } catch (err) {
      console.error("TOTP verification failed:", err);
      setIsNavigating(false);
      setSubmitError(
        getApiErrorMessage(err, "We're unable to authenticate.")
      );
    }
  };

  const isTotpStep = step === "totp_setup" || step === "totp_verify";
  const showQr = step === "totp_setup" && Boolean(otpauthUri);

  return (
    <Card className="gap-0 border-0 py-0 shadow-2xl ring-1 ring-foreground/10">
      <CardHeader className="items-center space-y-0 px-6 pb-2 pt-8 text-center">
        <CardTitle
          className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          <span>Doit.</span>
          <Image
            src="/leaficon.png"
            alt=""
            width={32}
            height={32}
            priority
            aria-hidden
            className="size-7 shrink-0 object-contain"
          />
        </CardTitle>

        <div
          className="mx-auto mt-2 h-1 w-44 rounded-full"
          style={{ backgroundColor: SUCCESS }}
        />

        <CardDescription
          className="mt-4 text-sm font-medium leading-relaxed"
          style={{ color: TEXT_MUTED }}
        >
          {isTotpStep
            ? showQr
              ? "Scan the QR code with your authenticator app, then enter the 6-digit code."
              : "Enter the 6-digit code from your authenticator app."
            : "Sign in to access the admin panel"}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-8 pt-2">
        {!isTotpStep ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                aria-invalid={usernameError}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (event.target.value.trim()) setUsernameError(false);
                }}
                className={cn(
                  inputClassName,
                  usernameError && "ring-[#f03063] focus-visible:ring-[#f03063]"
                )}
              />
              {usernameError ? (
                <p className="text-xs font-medium" style={{ color: REJECT }}>
                  Username is required
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                aria-invalid={passwordError}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (event.target.value.trim()) setPasswordError(false);
                }}
                className={cn(
                  inputClassName,
                  passwordError && "ring-[#f03063] focus-visible:ring-[#f03063]"
                )}
              />
              {passwordError ? (
                <p className="text-xs font-medium" style={{ color: REJECT }}>
                  Password is required
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p className="text-xs font-medium" style={{ color: REJECT }}>
                {submitError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg text-sm font-semibold tracking-tight text-white shadow-none hover:opacity-90 disabled:opacity-70"
              style={{ backgroundColor: BG_SIDEBAR }}
            >
              {isPending ? "Authenticating..." : "Sign in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleTotpSubmit} className="space-y-5" noValidate>
            {showQr ? (
              <div className="flex flex-col items-center rounded-xl bg-background p-4 ring-1 ring-foreground/10">
                <div className="rounded-lg bg-white p-3">
                  <QRCode value={otpauthUri!} size={180} />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm font-semibold tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                Verification code
              </label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={otpCode}
                aria-invalid={otpError}
                onChange={(event) => {
                  const nextValue = event.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtpCode(nextValue);
                  if (nextValue.length === 6) setOtpError(false);
                }}
                className={cn(
                  inputClassName,
                  "text-center text-lg tracking-[0.35em]",
                  otpError && "ring-[#f03063] focus-visible:ring-[#f03063]"
                )}
              />
              {otpError ? (
                <p className="text-xs font-medium" style={{ color: REJECT }}>
                  Enter a valid 6-digit code
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p className="text-xs font-medium" style={{ color: REJECT }}>
                {submitError}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg text-sm font-semibold tracking-tight text-white shadow-none hover:opacity-90 disabled:opacity-70"
              style={{ backgroundColor: BG_SIDEBAR }}
            >
              {isPending ? "Verifying..." : "Verify"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
