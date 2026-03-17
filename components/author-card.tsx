import { siteConfig } from "@/lib/data";

type AuthorLink = {
  label: string;
  href: string;
};

type AuthorCardProps = {
  title?: string;
  compact?: boolean;
  links?: AuthorLink[];
};

export function AuthorCard({ title = "Written by Dale Campbell", compact = false, links = [] }: AuthorCardProps) {
  const author = siteConfig.founder;

  return (
    <div className={`panel ${compact ? "p-5" : "p-6"}`}>
      <p className="muted-label">{title}</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className={`${compact ? "text-2xl" : "text-3xl"} uppercase text-white`}>{author.name}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aqua">{author.role}</p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-mist/75">{author.bio}</p>
        </div>
        {links.length ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {links.map((link) => (
              <a
                key={`${link.label}-${link.href}`}
                href={link.href}
                className="rounded-full border border-white/10 px-3 py-2 text-mist/70 hover:border-aqua/30 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
