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

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to the admin dashboard. Use the sidebar or the links below to
          navigate.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page 1</CardTitle>
            <CardDescription>First admin sub-page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={routes.admin.page1}>Open Page 1</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Page 2</CardTitle>
            <CardDescription>Second admin sub-page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={routes.admin.page2}>Open Page 2</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
