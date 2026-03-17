import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Dashboard`,
  description: `Account routing and premium dashboard access for ${siteConfig.name}.`
};

export default async function DashboardPage() {
  const session = await getSession();
  redirect(session?.membershipState === "active-paid-member" ? "/members" : "/pricing");
}
