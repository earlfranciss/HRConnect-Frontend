import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  console.log("Access Token", token);

  const protectedPaths = ["/", "/chat"]; // all protected pages

  // Protect pages
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect logged-in users away from /login
  if (pathname.startsWith("/login") && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/", req.url)); // already logged in → go to /
    } catch {
      return NextResponse.next();
    }
  }

  // Public pages
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
