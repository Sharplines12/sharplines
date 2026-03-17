import type { Metadata } from "next";
import { BookOpenText, CheckCircle2, Clock3 } from "lucide-react";
import { getCourseModules } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Members Course`,
  description: `Protected course modules and betting education for active ${siteConfig.name} members.`
};

export default async function MembersCoursePage() {
  const courseModules = await getCourseModules();

  return (
    <div className="space-y-5">
      <div className="panel-strong p-8">
        <p className="muted-label">Protected course</p>
        <h1 className="mt-2 text-5xl uppercase text-white">The full library stays attached to the membership.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          These modules reinforce the {siteConfig.name} process so the daily card is part of a system, not a one-off
          purchase. Course delivery stays inside the membership workflow alongside the daily card and archive.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {courseModules.map((module) => (
          <div key={module.id} className="panel p-6">
            <div className="flex items-center gap-3">
              <BookOpenText className="h-5 w-5 text-aqua" />
              <h2 className="text-3xl uppercase text-white">{module.title}</h2>
            </div>
            <p className="mt-4 text-sm leading-7">{module.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-white/10 px-3 py-1 text-mist/70">
                <Clock3 className="mr-2 inline h-4 w-4" />
                {module.duration}
              </span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-mist/70">
                <CheckCircle2 className="mr-2 inline h-4 w-4" />
                {module.lessonCount} lessons
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
