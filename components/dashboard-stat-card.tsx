import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export function DashboardStatCard({ label, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <div className="panel p-5">
      <Icon className="h-5 w-5 text-aqua" />
      <p className="mt-3 muted-label">{label}</p>
      <p className="mt-2 text-3xl font-display uppercase text-white">{value}</p>
    </div>
  );
}
