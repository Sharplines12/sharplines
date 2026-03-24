import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MAINTENANCE_COOKIE_NAME, MAINTENANCE_COOKIE_VALUE } from "@/lib/site-lock";
import { createSupabaseMiddlewareClient, isSupabaseConfigured } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasMaintenanceAccess = request.cookies.get(MAINTENANCE_COOKIE_NAME)?.value === MAINTENANCE_COOKIE_VALUE;
  const isMaintenancePath = pathname === "/maintenance";
  const isMaintenanceApi = pathname === "/api/maintenance-access";
  const isNextAsset = pathname.startsWith("/_next");
  const isStaticAsset = /\.[a-z0-9]+$/i.test(pathname);

  if (!hasMaintenanceAccess && !isMaintenancePath && !isMaintenanceApi && !isNextAsset && !isStaticAsset) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  if (hasMaintenanceAccess && isMaintenancePath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseMiddlewareClient(request, response);
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (
      (pathname.startsWith("/premium-picks") ||
        pathname.startsWith("/members") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/casino")) &&
      !user
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const session = request.cookies.get("premium_picks_session");

  if (
    (pathname.startsWith("/premium-picks") ||
      pathname.startsWith("/members") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/casino")) &&
    !session
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
