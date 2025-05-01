import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("AccessToken")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedPath =
    pathname.startsWith("/userdashboard") || pathname.startsWith("/interview");
  const authPaths = ["/signin", "/signup"];
  const isAuthPath = authPaths.includes(pathname);

  // If trying to access protected path without token
  if (isProtectedPath && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If trying to access auth path with token
  if (isAuthPath && accessToken) {
    return NextResponse.redirect(
      new URL("/userdashboard/overview", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
