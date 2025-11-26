// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // console.log("🔍 Middleware executed for:", pathname);

  // Public routes - allow access
  if (pathname === "/" || pathname === "/register") {
    // console.log("➡️ Allowing access to public route");
    return NextResponse.next();
  }

  // Login page - allow access
  if (pathname === "/login") {
    // console.log("➡️ Allowing access to /login");
    return NextResponse.next();
  }

  // Protected routes - let client-side handle auth
  // Since we're using localStorage, middleware can't check it
  // SessionMonitor and AuthChecker will handle authentication on client-side
  if (pathname.startsWith("/dashboard")) {
    // console.log("➡️ Protected route, client-side will validate");
    return NextResponse.next();
  }

  // console.log("➡️ Allowing request to pass through");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img).*)',
  ],
};