import { ShieldAlert } from "lucide-react";
import { siteConfig } from "@/lib/data";

export function ResponsibleGamingBanner() {
  return (
    <div className="rounded-[28px] border border-amber-300/20 bg-amber-400/10 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-1 h-5 w-5 text-amber-100" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-100">Responsible gaming</p>
            <p className="mt-2 text-sm text-amber-50/90">
              {siteConfig.disclosures[0]} {siteConfig.disclosures[1]} {siteConfig.disclosures[2]}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-amber-50/80">
          {siteConfig.responsibleGamingLinks.map((item) => (
            <a key={item.label} href={item.href} rel="noreferrer" target="_blank" className="hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
