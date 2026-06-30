"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useParams, useRouter } from "next/navigation";

import { UserDetailsView } from "@/components/admin/user-details-view";
import { Button } from "@/components/ui/button";
import { useUserDetailsQuery } from "@/hooks/query";
import { routes } from "@/lib/routes";
import { getApiErrorMessage } from "@/service/client";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const { data: user, isLoading, isError, error } = useUserDetailsQuery(userId);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 pt-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-fit shrink-0 gap-1.5 px-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        onClick={() => router.push(routes.admin.users)}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.75} />
        Back
      </Button>

      {isError || !user ? (
        !isLoading ? (
          <div className="flex min-h-[320px] flex-1 items-center justify-center px-4 pt-10 text-sm font-medium text-[#f03063]">
            {getApiErrorMessage(error, "Could not load user details.")}
          </div>
        ) : null
      ) : (
        <UserDetailsView user={user} />
      )}
    </div>
  );
}
