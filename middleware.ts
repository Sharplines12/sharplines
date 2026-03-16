import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSupabaseMiddlewareClient, isSupabaseConfigured } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

    if ((pathname.startsWith("/premium-picks") || pathname.startsWith("/members")) && !user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  const session = request.cookies.get("premium_picks_session");

  if ((pathname.startsWith("/premium-picks") || pathname.startsWith("/members")) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/premium-picks/:path*", "/members/:path*"]
};
