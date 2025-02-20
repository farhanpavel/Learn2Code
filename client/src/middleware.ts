import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("AccessToken")?.value;
  const pathname = request.nextUrl.pathname;

  const isProtectedPath = pathname.startsWith("/userdashboard");
  const isProtectedPath2 = pathname.startsWith("/interview");

  const authPaths = ["/signin", "/signup"];
  const isAuthPath = authPaths.includes(pathname);

  if (isProtectedPath && isProtectedPath2 && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

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
