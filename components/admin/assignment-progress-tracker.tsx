"use client";

import {
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CloudDownloadIcon,
  Download04Icon,
  EyeIcon,
  FloppyDiskIcon,
  InformationCircleIcon,
  Layers01Icon,
  Loading03Icon,
  NoteIcon,
  Tick02Icon,
  Upload04Icon,
  UserIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps, type ReactNode, type RefObject } from "react";

import { ConfirmationModal } from "@/components/custom/confirmation-modal";
import { AddAssignmentToWorkingButton } from "@/components/admin/add-assignment-to-working-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  AssignmentProgress,
  AssignmentProgressSteps,
  ProgressStepStatus,
} from "@/api/assignmentProgressApi";
import {
  useAssignmentReceivedActionMutation,
  useCompletedActionMutation,
  useDoingActionMutation,
  usePaymentActionMutation,
} from "@/hooks/query";
import {
  BORDER,
  GHOSTWHITE,
  shopifyAdminCard,
  shopifyCardSurface,
  TEXT_DARK,
  TEXT_MUTED,
  WHITE,
} from "@/lib/colors";
import { downloadFilesAsZip, downloadSingleFile, toCompletedFileName, toZipFileName } from "@/lib/download-files";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";
import { cn } from "@/lib/utils";

type StepKey = keyof AssignmentProgressSteps;

type StepTheme = {
  accent: string;
  surface: string;
  connector: string;
};

const REJECT = "#f03063";
const SUCCESS = "#08d203";

const stepThemes: Record<StepKey, StepTheme> = {
  provided: {
    accent: "#895ef6",
    surface: "#895ef614",
    connector: "#895ef6",
  },
  payment: {
    accent: SUCCESS,
    surface: "#08d2030a",
    connector: SUCCESS,
  },
  doing: {
    accent: "#c9780a",
    surface: "#f1cd3b1f",
    connector: "#c9780a",
  },
  completed: {
    accent: TEXT_DARK,
    surface: "#1a1a1a0d",
    connector: TEXT_DARK,
  },
};

const stepContent: Record<
  StepKey,
  {
    title: string;
    description: string;
    icon: IconSvgElement;
  }
> = {
  provided: {
    title: "Assignment Received",
    description: "Review the submitted assignment and approve or reject.",
    icon: CloudDownloadIcon,
  },
  payment: {
    title: "Payment",
    description: "You have successfully paid for this assignment.",
    icon: Wallet01Icon,
  },
  doing: {
    title: "Doing",
    description: "Your helper is working on your assignment.",
    icon: Loading03Icon,
  },
  completed: {
    title: "Completed",
    description: "Upload the completed assignment file and save.",
    icon: CheckmarkCircle02Icon,
  },
};

const stepOrder: StepKey[] = ["provided", "payment", "doing", "completed"];

function formatDeliveryDate(value: string | null) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStepDate(
  key: StepKey,
  steps: AssignmentProgressSteps
): string | null {
  if (key === "payment") {
    return (
      steps.payment.payment_done_date ?? steps.payment.payment_receipt_date
    );
  }

  return steps[key].date;
}

function isStepReached(key: StepKey, steps: AssignmentProgressSteps) {
  if (key === "payment") {
    return (
      steps.payment.is_active ||
      Boolean(steps.payment.payment_done_date || steps.payment.payment_receipt_date)
    );
  }

  return steps[key].is_active || Boolean(steps[key].date);
}

function getStepStatus(
  key: StepKey,
  steps: AssignmentProgressSteps
): ProgressStepStatus {
  return steps[key].status;
}

function isStepPendingReview(status: ProgressStepStatus) {
  return status === "pending";
}

function isStepActive(key: StepKey, steps: AssignmentProgressSteps) {
  return steps[key].is_active;
}

function getDoingDescription(steps: AssignmentProgressSteps) {
  if (steps.doing.status === "doing") {
    return "Your helper is currently working on your assignment.";
  }

  if (steps.doing.status === "completed") {
    return "Your helper has completed your assignment.";
  }

  if (steps.doing.status === "pending" && steps.doing.is_active) {
    return "Review helper progress and approve or reject.";
  }

  return "Waiting for helper to start working on your assignment.";
}

function isDoingStepReadyForReview(steps: AssignmentProgressSteps) {
  return (
    steps.doing.is_active &&
    (steps.doing.status === "pending" || steps.doing.status === "doing")
  );
}

function getPaymentDescription(steps: AssignmentProgressSteps, isActive: boolean) {
  if (!isActive) {
    return "Payment for this assignment is not available yet.";
  }

  if (steps.payment.payment_screenshot?.trim()) {
    return "Review the submitted payment and approve or reject.";
  }

  return "Set the price and upload payment details for the user.";
}

type AssignmentProgressTrackerProps = {
  progress: AssignmentProgress;
};

export function AssignmentProgressTracker({
  progress,
}: AssignmentProgressTrackerProps) {
  const router = useRouter();
  const { steps } = progress;

  return (
    <Card className={cn("min-h-0 flex-1", shopifyAdminCard)}>
      <CardHeader className="shrink-0 space-y-3 border-b border-border/60 px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="grid gap-2">
            <span className="inline-flex w-fit items-center rounded-md bg-[#895ef612] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#895ef6]">
              {progress.work_type}
            </span>
            <div className="grid gap-1">
              <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                {progress.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      routes.admin.userDetails(String(progress.user.id))
                    )
                  }
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors hover:opacity-80"
                  style={{ color: TEXT_DARK }}
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    size={14}
                    strokeWidth={1.75}
                    color={TEXT_MUTED}
                  />
                  {progress.user.username}
                </button>

                <span
                  className="size-1 shrink-0 rounded-full bg-muted-foreground/25"
                  aria-hidden
                />

                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: TEXT_MUTED }}
                >
                  <HugeiconsIcon
                    icon={NoteIcon}
                    size={14}
                    strokeWidth={1.75}
                    color={TEXT_MUTED}
                  />
                  {progress.assignment_type}
                </span>

                <span
                  className="size-1 shrink-0 rounded-full bg-muted-foreground/25"
                  aria-hidden
                />

                <span
                  className="inline-flex items-center gap-1.5 text-sm font-medium"
                  style={{ color: TEXT_MUTED }}
                >
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={14}
                    strokeWidth={1.75}
                    color={TEXT_MUTED}
                  />
                  {formatDeliveryDate(progress.delivery_date)}
                </span>
              </div>
            </div>
          </div>

          <AddAssignmentToWorkingButton
            assignmentId={progress.id}
            assignmentName={progress.title}
            isWorking={progress.isWorking}
            className="shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-x-auto px-4 py-4">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-4 items-stretch gap-4">
            {stepOrder.map((key, index) => {
              const reached = isStepReached(key, steps);
              const isActive = isStepActive(key, steps);
              const status = getStepStatus(key, steps);
              const theme = stepThemes[key];
              const isLast = index === stepOrder.length - 1;

              return (
                <div key={key} className="relative flex min-w-0 flex-col">
                  <div className="relative mb-3 h-7 shrink-0">
                    {!isLast ? (
                      <div
                        aria-hidden
                        className="absolute top-1/2 z-0 h-px -translate-y-1/2 border-t border-dashed"
                        style={{
                          left: "50%",
                          width: "calc(100% + 1rem)",
                          borderColor:
                            reached && isActive ? `${theme.connector}55` : BORDER,
                        }}
                      />
                    ) : null}

                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                      <StepIndicator
                        reached={reached}
                        status={status}
                        theme={theme}
                        isActive={isActive}
                      />
                    </div>
                  </div>

                  <ProgressStepCard
                    stepKey={key}
                    steps={steps}
                    assignmentId={progress.id}
                    assignmentTitle={progress.title}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepIndicator({
  reached,
  status,
  theme,
  isActive,
}: {
  reached: boolean;
  status: ProgressStepStatus;
  theme: StepTheme;
  isActive: boolean;
}) {
  if (!isActive) {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-border shadow-sm">
        <span
          className="size-1.5 rounded-full bg-muted-foreground/35"
        />
      </div>
    );
  }

  const isCompleted = reached && status === "completed";
  const isRejected = reached && status === "rejected";
  const isPending = reached && !isCompleted && !isRejected;

  return (
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full shadow-sm",
        !reached && "bg-white ring-1 ring-border",
        isPending && "bg-white ring-1",
        isCompleted && "ring-0",
        isRejected && "ring-0"
      )}
      style={{
        backgroundColor: isCompleted
          ? theme.accent
          : isRejected
            ? REJECT
            : WHITE,
        ...(isPending
          ? {
              borderColor: `${theme.accent}44`,
              boxShadow: `0 0 0 3px ${theme.accent}12`,
            }
          : {}),
      }}
    >
      {isCompleted ? (
        <HugeiconsIcon
          icon={Tick02Icon}
          size={13}
          strokeWidth={2.5}
          color="#ffffff"
        />
      ) : isRejected ? (
        <HugeiconsIcon
          icon={Cancel01Icon}
          size={13}
          strokeWidth={2.5}
          color="#ffffff"
        />
      ) : (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: reached ? theme.accent : BORDER }}
        />
      )}
    </div>
  );
}

function parsePriceValue(price: string | null) {
  if (!price) return "";

  const match = price.match(/\d+/);
  return match?.[0] ?? "";
}

function StepReviewActions({
  stepLabel,
  onApprove,
  onReject,
  disabled = false,
}: {
  stepLabel: string;
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
}) {
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(
    null
  );

  const isApprove = pendingAction === "approve";
  const stepTitle =
    stepLabel.charAt(0).toUpperCase() + stepLabel.slice(1);
  const confirmationTitle = isApprove
    ? `Complete ${stepTitle}`
    : `Reject ${stepTitle}`;
  const confirmationSubtitle = isApprove
    ? `Are you sure you want to complete the ${stepLabel} step?`
    : `Are you sure you want to reject the ${stepLabel} step?`;

  const handleConfirm = () => {
    if (pendingAction === "approve") {
      onApprove();
    } else if (pendingAction === "reject") {
      onReject();
    }

    setPendingAction(null);
  };

  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Approve ${stepLabel}`}
          disabled={disabled}
          className="size-9 rounded-full border-0 shadow-none hover:opacity-90"
          style={{ backgroundColor: SUCCESS }}
          onClick={() => setPendingAction("approve")}
        >
          <HugeiconsIcon
            icon={Tick02Icon}
            size={16}
            strokeWidth={2.25}
            color="#ffffff"
          />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Reject ${stepLabel}`}
          disabled={disabled}
          className="size-9 rounded-full border-0 shadow-none hover:opacity-90"
          style={{ backgroundColor: REJECT }}
          onClick={() => setPendingAction("reject")}
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={16}
            strokeWidth={2.25}
            color="#ffffff"
          />
        </Button>
      </div>

      <ConfirmationModal
        open={pendingAction !== null}
        variant={isApprove ? "approve" : "reject"}
        title={confirmationTitle}
        subtitle={confirmationSubtitle}
        cancelLabel="Cancel"
        confirmLabel={isApprove ? "Complete" : "Reject"}
        onConfirm={handleConfirm}
        onClose={() => setPendingAction(null)}
        ariaLabel={`Confirm ${stepLabel} ${pendingAction ?? "action"}`}
      />
    </>
  );
}

const STEP_CARD_FOOTER_HEIGHT = "h-[72px]";

function StepCardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 shrink-0 items-center overflow-hidden border-t border-black/5 bg-white px-4",
        STEP_CARD_FOOTER_HEIGHT,
        className
      )}
    >
      {children}
    </div>
  );
}

function StepPrimaryButton({
  accent,
  className,
  children,
  ...props
}: ComponentProps<typeof Button> & { accent: string }) {
  return (
    <Button
      type="button"
      className={cn(
        "h-8 min-w-0 gap-1 overflow-hidden rounded-lg px-2 text-xs font-medium text-white shadow-none hover:opacity-90 sm:gap-1.5 sm:px-2.5",
        className
      )}
      style={{ backgroundColor: accent }}
      {...props}
    >
      {children}
    </Button>
  );
}

function StepSecondaryButton({
  className,
  children,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-8 min-w-0 gap-1 overflow-hidden rounded-lg border-border/80 bg-white px-2 text-xs font-medium text-foreground shadow-none hover:bg-muted/40 sm:gap-1.5 sm:px-2.5",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

function StepHeaderIconButton({
  ariaLabel,
  onClick,
  className,
  children,
  disabled,
}: {
  ariaLabel: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        "size-7 shrink-0 rounded-full bg-white shadow-none ring-1 ring-black/8 hover:bg-muted/30",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function StepDisabledFooter() {
  return (
    <StepCardFooter className="justify-center">
      <p className="w-full text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60">
        Step unavailable
      </p>
    </StepCardFooter>
  );
}

function ProgressStepCard({
  stepKey,
  steps,
  assignmentId,
  assignmentTitle,
}: {
  stepKey: StepKey;
  steps: AssignmentProgressSteps;
  assignmentId: string;
  assignmentTitle: string;
}) {
  const paymentFileInputRef = useRef<HTMLInputElement>(null);
  const [paymentPrice, setPaymentPrice] = useState(() =>
    stepKey === "payment" ? parsePriceValue(steps.payment.price) : ""
  );
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  useEffect(() => {
    if (stepKey === "payment") {
      setPaymentPrice(parsePriceValue(steps.payment.price));
    }
  }, [stepKey, steps.payment.price]);

  const theme = stepThemes[stepKey];
  const content = stepContent[stepKey];
  const reached = isStepReached(stepKey, steps);
  const isActive = isStepActive(stepKey, steps);
  const isDisabled = !isActive;
  const date = getStepDate(stepKey, steps);
  const accentColor = isDisabled ? TEXT_MUTED : theme.accent;
  const paymentScreenshot = steps.payment.payment_screenshot?.trim() ?? "";
  const paymentDetailsImage = steps.payment.payment_details_image?.trim() ?? "";
  const showPaymentActiveFields =
    stepKey === "payment" && isActive && reached;
  const isWaitingForUserPayment =
    Boolean(paymentDetailsImage) && !paymentScreenshot;

  const description =
    stepKey === "doing"
      ? getDoingDescription(steps)
      : stepKey === "provided"
        ? content.description
        : stepKey === "completed"
          ? content.description
          : stepKey === "payment" && isDisabled
            ? getPaymentDescription(steps, isActive)
            : null;

  const completedFileUrl = steps.completed.completed_file_url?.trim() ?? "";
  const changesRequestDescription =
    steps.completed.changes_request_description?.trim() ?? "";
  const assignmentDescription =
    steps.provided.assignment_description?.trim() ?? "";
  const showCompletedDownloadActions =
    !isDisabled &&
    stepKey === "completed" &&
    reached &&
    Boolean(completedFileUrl);
  const showCompletedChangeRequestAction =
    showCompletedDownloadActions && Boolean(changesRequestDescription);
  const showProvidedHeaderActions =
    !isDisabled && stepKey === "provided" && Boolean(assignmentDescription);

  return (
    <div
      className={cn(
        "flex h-full min-h-[292px] min-w-0 flex-col overflow-hidden transition-all duration-200",
        shopifyCardSurface,
        isDisabled
          ? "pointer-events-none select-none opacity-60"
          : !reached && "opacity-65"
      )}
    >
      <div
        className={cn(
          "flex flex-1 flex-col px-4 pt-4",
          !isDisabled && "rounded-t-[20px]"
        )}
        style={{
          backgroundColor: isDisabled ? GHOSTWHITE : theme.surface,
        }}
      >
        <div className="mb-3.5 flex min-h-9 items-start justify-between gap-2">
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
              isDisabled
                ? "bg-white text-muted-foreground ring-border/80"
                : "bg-white ring-black/4"
            )}
            style={isDisabled ? undefined : { color: accentColor }}
          >
            <HugeiconsIcon icon={content.icon} size={17} strokeWidth={1.75} />
          </div>
          <div className="flex min-h-[18px] min-w-[72px] items-start justify-end">
            {isDisabled ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground ring-1 ring-border/80">
                Locked
              </span>
            ) : date ? (
              <span
                className="text-right text-[10px] font-medium leading-tight tabular-nums"
                style={{ color: accentColor }}
              >
                {date}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid flex-1 gap-2">
          <div className="flex items-center gap-1.5">
            <h3
              className={cn(
                "text-[13px] font-semibold leading-snug",
                isDisabled ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {content.title}
            </h3>
            {showProvidedHeaderActions ? (
              <ProvidedStepHeaderActions description={assignmentDescription} />
            ) : null}
            {showCompletedDownloadActions ? (
              <CompletedStepHeaderActions
                assignmentTitle={assignmentTitle}
                completedFileUrl={completedFileUrl}
                changesRequestDescription={changesRequestDescription}
                showChangeRequestAction={showCompletedChangeRequestAction}
              />
            ) : null}
          </div>
          {description ? (
            <p
              className={cn(
                "text-xs leading-relaxed",
                isDisabled ? "text-muted-foreground/70" : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          ) : null}

          {showPaymentActiveFields ? (
            <PaymentStepFields
              assignmentId={assignmentId}
              accent={theme.accent}
              price={paymentPrice}
              onPriceChange={setPaymentPrice}
              paymentFile={paymentFile}
              onPaymentFileChange={setPaymentFile}
              fileInputRef={paymentFileInputRef}
              hasUserReceipt={Boolean(paymentScreenshot)}
              paymentDetailsImage={paymentDetailsImage || null}
            />
          ) : null}
        </div>
      </div>

      {isDisabled ? (
        <StepDisabledFooter />
      ) : stepKey === "provided" && reached ? (
        <StepCardFooter>
          <ProvidedStepActions
            assignmentId={assignmentId}
            assignmentTitle={assignmentTitle}
            providedFiles={steps.provided.provided_files ?? []}
            stepStatus={steps.provided.status}
            accent={theme.accent}
          />
        </StepCardFooter>
      ) : stepKey === "payment" && reached ? (
        <StepCardFooter>
          <PaymentStepFooterActions
            assignmentId={assignmentId}
            paymentScreenshot={steps.payment.payment_screenshot}
            isWaitingForUser={isWaitingForUserPayment}
            stepStatus={steps.payment.status}
            accent={theme.accent}
            price={paymentPrice}
            paymentFile={paymentFile}
          />
        </StepCardFooter>
      ) : stepKey === "doing" && reached && isDoingStepReadyForReview(steps) ? (
        <StepCardFooter className="justify-end">
          <DoingStepActions assignmentId={assignmentId} />
        </StepCardFooter>
      ) : stepKey === "completed" && reached ? (
        <StepCardFooter>
          <CompletedStepActions
            assignmentId={assignmentId}
            hasExistingFile={Boolean(completedFileUrl)}
          />
        </StepCardFooter>
      ) : null}
    </div>
  );
}

function sanitizePriceInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

function PaymentStepFields({
  assignmentId,
  accent,
  price,
  onPriceChange,
  paymentFile,
  onPaymentFileChange,
  fileInputRef,
  hasUserReceipt,
  paymentDetailsImage = null,
}: {
  assignmentId: string;
  accent: string;
  price: string;
  onPriceChange: (value: string) => void;
  paymentFile: File | null;
  onPaymentFileChange: (file: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  hasUserReceipt: boolean;
  paymentDetailsImage?: string | null;
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const showViewDetails = Boolean(paymentDetailsImage);
  const showUpload = !showViewDetails && !hasUserReceipt;
  const isPriceReadOnly = showViewDetails || hasUserReceipt;

  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <input
          id={`payment-price-${assignmentId}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder="0000"
          value={price}
          readOnly={isPriceReadOnly}
          onChange={(event) => onPriceChange(sanitizePriceInput(event.target.value))}
          className={cn(
            "w-20 border-0 border-b bg-transparent px-0 py-0.5 text-xl font-semibold leading-none tabular-nums tracking-tight outline-none placeholder:font-semibold placeholder:opacity-35",
            isPriceReadOnly && "cursor-default"
          )}
          style={{ borderColor: accent, color: accent }}
          aria-label="Assignment price in AUD"
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          AUD
        </span>
      </div>

      {showViewDetails ? (
        <>
          <button
            type="button"
            title="View payment details"
            onClick={() => setIsDetailsOpen(true)}
            className="mb-3 flex h-9 w-full min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-white/90 px-3 text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-white hover:text-foreground"
          >
            <HugeiconsIcon
              icon={EyeIcon}
              size={15}
              strokeWidth={1.75}
              className="shrink-0"
            />
            <span className="min-w-0 flex-1 truncate text-center text-[11px] font-medium leading-tight">
              View Details
            </span>
          </button>

          <PaymentImageModal
            open={isDetailsOpen}
            imageUrl={paymentDetailsImage!}
            title="Payment Details"
            ariaLabel="Payment details"
            onClose={() => setIsDetailsOpen(false)}
          />
        </>
      ) : null}

      {showUpload ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              onPaymentFileChange(file);
            }}
          />

          <button
            type="button"
            title={paymentFile?.name ?? "Upload payment receipt"}
            onClick={() => fileInputRef.current?.click()}
            className="mb-3 flex h-9 w-full min-w-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border bg-white/90 px-3 text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-white hover:text-foreground"
          >
            <HugeiconsIcon
              icon={Upload04Icon}
              size={15}
              strokeWidth={1.75}
              className="shrink-0"
            />
            <span className="min-w-0 flex-1 truncate text-center text-[11px] font-medium leading-tight">
              {paymentFile ? paymentFile.name : "Upload receipt"}
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
}

function ProvidedStepActions({
  assignmentId,
  assignmentTitle,
  providedFiles,
  stepStatus,
  accent,
}: {
  assignmentId: string;
  assignmentTitle: string;
  providedFiles: string[];
  stepStatus: ProgressStepStatus;
  accent: string;
}) {
  const [isZipping, setIsZipping] = useState(false);
  const [actionError, setActionError] = useState("");
  const receivedActionMutation = useAssignmentReceivedActionMutation();
  const hasFiles = providedFiles.length > 0;
  const showReviewActions = isStepPendingReview(stepStatus);

  const handleZipDownload = async () => {
    setIsZipping(true);

    try {
      await downloadFilesAsZip(providedFiles, toZipFileName(assignmentTitle));
    } catch (error) {
      console.error("Zipping stream failure:", error);
    } finally {
      setIsZipping(false);
    }
  };

  const handleReceivedAction = async (action: "approve" | "reject") => {
    setActionError("");

    try {
      await receivedActionMutation.mutateAsync({ assignmentId, action });
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not update assignment received step.")
      );
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {actionError ? (
        <p className="text-[11px] font-medium text-[#f03063]">{actionError}</p>
      ) : null}
      <div className="flex w-full min-w-0 items-center gap-2">
        <StepPrimaryButton
          accent={accent}
          className={showReviewActions ? "min-w-0 flex-1" : "w-full"}
          disabled={!hasFiles || isZipping}
          title={isZipping ? "Zipping..." : "Download"}
          onClick={handleZipDownload}
        >
          <HugeiconsIcon
            icon={Download04Icon}
            size={15}
            strokeWidth={1.75}
            className="shrink-0"
          />
          <span className="truncate">
            {isZipping ? "Zipping..." : "Download"}
          </span>
        </StepPrimaryButton>

        {showReviewActions ? (
          <StepReviewActions
            stepLabel="assignment received"
            disabled={receivedActionMutation.isPending}
            onApprove={() => void handleReceivedAction("approve")}
            onReject={() => void handleReceivedAction("reject")}
          />
        ) : null}
      </div>
    </div>
  );
}

function ProvidedStepHeaderActions({
  description,
}: {
  description: string;
}) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <>
      <StepHeaderIconButton
        ariaLabel="View assignment description"
        className="border-0 bg-foreground text-background ring-0 hover:bg-foreground/90 hover:text-background"
        onClick={() => setIsDescriptionOpen(true)}
      >
        <HugeiconsIcon
          icon={InformationCircleIcon}
          size={13}
          strokeWidth={1.75}
          color="#ffffff"
        />
      </StepHeaderIconButton>

      <DescriptionTextModal
        open={isDescriptionOpen}
        title="Assignment Description"
        ariaLabel="Assignment description"
        description={description}
        onClose={() => setIsDescriptionOpen(false)}
      />
    </>
  );
}

function CompletedStepHeaderActions({
  assignmentTitle,
  completedFileUrl,
  changesRequestDescription,
  showChangeRequestAction,
}: {
  assignmentTitle: string;
  completedFileUrl: string;
  changesRequestDescription: string;
  showChangeRequestAction: boolean;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      await downloadSingleFile(
        completedFileUrl,
        toCompletedFileName(assignmentTitle, completedFileUrl)
      );
    } catch (error) {
      console.error("Completed file download failure:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <StepHeaderIconButton
          ariaLabel="Download completed assignment"
          disabled={isDownloading}
          className="text-foreground"
          onClick={handleDownload}
        >
          <HugeiconsIcon icon={Download04Icon} size={13} strokeWidth={1.75} />
        </StepHeaderIconButton>
        {showChangeRequestAction ? (
          <StepHeaderIconButton
            ariaLabel="View change request"
            className="text-foreground"
            onClick={() => setIsChangeRequestOpen(true)}
          >
            <HugeiconsIcon icon={Layers01Icon} size={13} strokeWidth={1.75} />
          </StepHeaderIconButton>
        ) : null}
      </div>

      {showChangeRequestAction ? (
        <DescriptionTextModal
          open={isChangeRequestOpen}
          title="Change Request"
          ariaLabel="Change request"
          description={changesRequestDescription}
          onClose={() => setIsChangeRequestOpen(false)}
        />
      ) : null}
    </>
  );
}

function DescriptionTextModal({
  open,
  title,
  ariaLabel,
  description,
  onClose,
}: {
  open: boolean;
  title: string;
  ariaLabel: string;
  description: string;
  onClose: () => void;
}) {
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
      <div
        className={cn(
          "relative max-h-[90vh] w-full max-w-lg cursor-default overflow-hidden",
          shopifyCardSurface
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Close ${title.toLowerCase()}`}
            className="size-8 rounded-lg text-muted-foreground"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-4.5rem)] overflow-auto px-5 py-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DoingStepActions({ assignmentId }: { assignmentId: string }) {
  const [actionError, setActionError] = useState("");
  const doingActionMutation = useDoingActionMutation();

  const handleDoingAction = async (action: "approve" | "reject") => {
    setActionError("");

    try {
      await doingActionMutation.mutateAsync({ assignmentId, action });
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not update doing step.")
      );
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-end gap-2">
      {actionError ? (
        <p className="w-full text-right text-[11px] font-medium text-[#f03063]">
          {actionError}
        </p>
      ) : null}
      <StepReviewActions
        stepLabel="doing"
        disabled={doingActionMutation.isPending}
        onApprove={() => void handleDoingAction("approve")}
        onReject={() => void handleDoingAction("reject")}
      />
    </div>
  );
}

function CompletedStepActions({
  assignmentId,
  hasExistingFile,
}: {
  assignmentId: string;
  hasExistingFile: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [actionError, setActionError] = useState("");
  const completedActionMutation = useCompletedActionMutation();
  const submitLabel = hasExistingFile ? "Update" : "Save";
  const pendingLabel = hasExistingFile ? "Updating..." : "Saving...";

  const handleSave = async () => {
    if (!assignmentFile) return;

    setActionError("");

    try {
      await completedActionMutation.mutateAsync({
        assignmentId,
        completedFile: assignmentFile,
      });
      setAssignmentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(
          mutationError,
          hasExistingFile
            ? "Could not update completed assignment."
            : "Could not save completed assignment."
        )
      );
    }
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      {actionError ? (
        <p className="text-[11px] font-medium text-[#f03063]">{actionError}</p>
      ) : null}
      <div className="flex w-full min-w-0 items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setAssignmentFile(file);
          }}
        />

        <StepSecondaryButton
          className="min-w-0 flex-1 justify-start overflow-hidden px-3 whitespace-normal"
          title={assignmentFile?.name ?? "Upload"}
          disabled={completedActionMutation.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          <HugeiconsIcon
            icon={Upload04Icon}
            size={15}
            strokeWidth={1.75}
            className="shrink-0"
          />
          <span className="min-w-0 flex-1 truncate text-left">
            {assignmentFile ? assignmentFile.name : "Upload"}
          </span>
        </StepSecondaryButton>

        <StepPrimaryButton
          accent={TEXT_DARK}
          className="min-w-0 shrink-0 px-3 sm:px-4"
          disabled={!assignmentFile || completedActionMutation.isPending}
          title={submitLabel}
          onClick={() => void handleSave()}
        >
          <HugeiconsIcon
            icon={FloppyDiskIcon}
            size={15}
            strokeWidth={1.75}
            className="shrink-0"
          />
          <span className="truncate">
            {completedActionMutation.isPending ? pendingLabel : submitLabel}
          </span>
        </StepPrimaryButton>
      </div>
    </div>
  );
}

function PaymentImageModal({
  open,
  imageUrl,
  onClose,
  title,
  ariaLabel,
}: {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
  title: string;
  ariaLabel: string;
}) {
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
      <div
        className={cn(
          "relative max-h-[90vh] w-full max-w-2xl cursor-default overflow-hidden",
          shopifyCardSurface
        )}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Close ${title.toLowerCase()}`}
            className="size-8 rounded-lg text-muted-foreground"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
          </Button>
        </div>

        <div className="max-h-[calc(90vh-4.5rem)] overflow-auto bg-[#fafbfc] p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="mx-auto max-h-[70vh] w-full rounded-lg object-contain ring-1 ring-black/4"
          />
        </div>
      </div>
    </div>
  );
}

function PaymentScreenshotModal({
  open,
  imageUrl,
  onClose,
}: {
  open: boolean;
  imageUrl: string;
  onClose: () => void;
}) {
  return (
    <PaymentImageModal
      open={open}
      imageUrl={imageUrl}
      title="Payment Screenshot"
      ariaLabel="Payment screenshot"
      onClose={onClose}
    />
  );
}

function PaymentStepFooterActions({
  assignmentId,
  paymentScreenshot,
  isWaitingForUser,
  stepStatus,
  accent,
  price,
  paymentFile,
}: {
  assignmentId: string;
  paymentScreenshot: string | null;
  isWaitingForUser: boolean;
  stepStatus: ProgressStepStatus;
  accent: string;
  price: string;
  paymentFile: File | null;
}) {
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const paymentActionMutation = usePaymentActionMutation();
  const hasPaymentScreenshot = Boolean(paymentScreenshot?.trim());
  const showReviewActions = stepStatus === "doing";

  const handleSend = async () => {
    if (!price.trim() || !paymentFile) {
      setActionError("Price and payment details image are required.");
      return;
    }

    setActionError("");

    try {
      await paymentActionMutation.mutateAsync({
        assignmentId,
        action: "send",
        price: price.trim(),
        paymentDetailsImage: paymentFile,
      });
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not send payment details.")
      );
    }
  };

  const handlePaymentReview = async (action: "approve" | "reject") => {
    setActionError("");

    try {
      await paymentActionMutation.mutateAsync({ assignmentId, action });
    } catch (mutationError) {
      setActionError(
        getApiErrorMessage(mutationError, "Could not update payment step.")
      );
    }
  };

  return (
    <>
      {actionError ? (
        <p className="mb-2 w-full text-[11px] font-medium text-[#f03063]">
          {actionError}
        </p>
      ) : null}

      {hasPaymentScreenshot ? (
        <div className="flex w-full min-w-0 items-center gap-2">
          <StepPrimaryButton
            accent={accent}
            className={showReviewActions ? "min-w-0 flex-1" : "w-full"}
            title="View Payment"
            onClick={() => setIsScreenshotOpen(true)}
          >
            <HugeiconsIcon
              icon={EyeIcon}
              size={15}
              strokeWidth={1.75}
              className="shrink-0"
            />
            <span className="truncate">View Payment</span>
          </StepPrimaryButton>

          {showReviewActions ? (
            <StepReviewActions
              stepLabel="payment"
              disabled={paymentActionMutation.isPending}
              onApprove={() => void handlePaymentReview("approve")}
              onReject={() => void handlePaymentReview("reject")}
            />
          ) : null}
        </div>
      ) : (
        <div className="flex w-full min-w-0 items-center gap-2">
          <StepPrimaryButton
            accent={accent}
            className="w-full"
            title={isWaitingForUser ? "Waiting" : "Send"}
            disabled={isWaitingForUser || paymentActionMutation.isPending}
            onClick={() => void handleSend()}
          >
            <span className="truncate">
              {paymentActionMutation.isPending
                ? "Sending..."
                : isWaitingForUser
                  ? "Waiting"
                  : "Send"}
            </span>
          </StepPrimaryButton>
        </div>
      )}

      {hasPaymentScreenshot && paymentScreenshot ? (
        <PaymentScreenshotModal
          open={isScreenshotOpen}
          imageUrl={paymentScreenshot}
          onClose={() => setIsScreenshotOpen(false)}
        />
      ) : null}
    </>
  );
}
