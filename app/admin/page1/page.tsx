import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { routes } from "@/lib/routes";

export default function AdminPage1() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Page 1</h1>
        <p className="mt-1 text-muted-foreground">
          You are on the first admin page.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Navigate to Page 2</CardTitle>
          <CardDescription>
            Use the button below to switch between admin pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={routes.admin.page2}>Go to Page 2</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
