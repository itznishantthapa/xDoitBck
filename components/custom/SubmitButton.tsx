"use client";

import { BeatLoader } from "react-spinners";

import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  buttonTitle: string;
  loader?: boolean;
  loaderColor?: string;
  onPress?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function SubmitButton({
  onPress,
  onClick,
  disabled = false,
  buttonTitle,
  loader = false,
  loaderColor = colors.theSoftBlack,
  className,
  variant = "default",
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      onClick={onClick ?? onPress}
      disabled={disabled || loader}
      variant={variant}
      className={cn(
        "h-[50px] rounded-2xl px-6 font-sans font-semibold tracking-wide text-xl transition-all disabled:opacity-100",
        className
      )}
      {...props}
    >
      {loader ? (
        <div className="flex h-full items-center justify-center">
          <BeatLoader size={12} margin={3} color={loaderColor} />
        </div>
      ) : (
        buttonTitle
      )}
    </Button>
  );
}
