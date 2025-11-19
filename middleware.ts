import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const pathname = req.nextUrl.pathname;

  console.log("🔍 Middleware executed for:", pathname, "| Token exists:", !!token);

  // ROOT (/) → public landing page, allow access for everyone
  if (pathname === "/") {
    console.log("➡️ Allowing access to public landing page");
    return NextResponse.next();
  }

  // LOGIN page → redirect if token valid
  if (pathname === "/login") {
    if (token) {
      const isValid = await verifyToken(token);
      if (isValid) {
        console.log("✅ Already authenticated, redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    console.log("➡️ Allowing access to /login");
    return NextResponse.next();
  }

  // DASHBOARD → protect
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      console.log("❌ No token for dashboard, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    const isValid = await verifyToken(token);
    if (!isValid) {
      console.log("❌ Invalid token, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    console.log("✅ Token valid, allowing dashboard access");
    return NextResponse.next();
  }

  console.log("➡️ Allowing request to pass through");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|img).*)',
  ],
};