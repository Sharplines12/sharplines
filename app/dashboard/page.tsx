import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  redirect(session?.membershipState === "active-paid-member" ? "/members" : "/pricing");
}
