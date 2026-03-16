import { NextResponse } from "next/server";
import { affiliateLinks } from "@/lib/affiliate-config";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const link = affiliateLinks[slug as keyof typeof affiliateLinks] as string | undefined;
  const requestUrl = new URL(request.url);

  if (link && link !== "#") {
    return NextResponse.redirect(link.startsWith("http") ? new URL(link) : new URL(link, requestUrl.origin));
  }

  return NextResponse.redirect(new URL(`/sportsbooks/${slug}`, requestUrl.origin));
}
