import { Lock, PlayCircle } from "lucide-react";
import type { CourseModule } from "@/lib/data";

type CourseModuleCardProps = {
  module: CourseModule;
  locked?: boolean;
};

export function CourseModuleCard({ module, locked = true }: CourseModuleCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="muted-label">Module</p>
        {locked ? <Lock className="h-4 w-4 text-ember" /> : <PlayCircle className="h-4 w-4 text-neon" />}
      </div>
      <h3 className="mt-3 text-2xl uppercase text-white">{module.title}</h3>
      <p className="mt-3 text-sm leading-7">{module.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-mist/50">
        <span>{module.lessonCount} lessons</span>
        <span>{module.duration}</span>
      </div>
    </div>
  );
}
