"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

import { UserDetailsView } from "@/components/admin/user-details-view";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "@/mock/UserDetailsMocked";
import { routes } from "@/lib/routes";

export default function UserDetailsPage() {
  const router = useRouter();
  const { user } = getUserDetails();

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

      <UserDetailsView user={user} />
    </div>
  );
}
