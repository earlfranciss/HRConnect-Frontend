import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ If user visits the root path `/`, redirect immediately to /login
  if (pathname === "/") {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If not authenticated and trying to access a protected route
  if (!token && !pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If already authenticated but trying to access /login, redirect to dashboard or home
  if (token && pathname.startsWith("/login")) {
    const homeUrl = new URL("/dashboard", req.url); // change to `/` if you prefer
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static files and API routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
