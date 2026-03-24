import { NextResponse } from "next/server";
import { MAINTENANCE_COOKIE_NAME, MAINTENANCE_COOKIE_VALUE, MAINTENANCE_PASSWORD } from "@/lib/site-lock";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = payload?.password?.trim();

  if (password !== MAINTENANCE_PASSWORD) {
    return NextResponse.json({ error: "That password is incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: MAINTENANCE_COOKIE_NAME,
    value: MAINTENANCE_COOKIE_VALUE,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
