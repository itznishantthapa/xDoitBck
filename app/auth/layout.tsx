import type { Metadata } from "next";

import { WHITE } from "@/lib/colors";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Doit App admin",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-full flex-1 items-center justify-center px-5 py-12"
      style={{ backgroundColor: WHITE }}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
