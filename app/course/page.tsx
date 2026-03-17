import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Course`,
  description: `Premium course access and betting education inside ${siteConfig.name}.`
};

export default function CoursePage() {
  redirect("/pricing");
}
