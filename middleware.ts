import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/auth", "/auth/:path*"],
};
