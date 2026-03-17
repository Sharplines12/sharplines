import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveBrowser } from "@/components/archive-browser";
import { PremiumCtaBlock } from "@/components/premium-cta-block";
import { isPaidAccess, requireAuthenticatedUser } from "@/lib/auth";
import { getArchivePicks, getFutureArchivePicks } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Dashboard Archive`,
  description: `Authenticated archive tools for reviewing past Sharplines picks, future premium positions, and your broader tracking workflow.`
};

export default async function DashboardArchivePage() {
  const session = await requireAuthenticatedUser("/dashboard/archive");
  const paidAccess = isPaidAccess(session.role);
  const [archivePicks, futurePicks] = await Promise.all([getArchivePicks(), getFutureArchivePicks()]);

  return (
    <div className="space-y-5">
      <div className="panel-strong p-8">
        <p className="muted-label">Dashboard archive</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Review the historical trail and the live card split.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mist/75">
          The dashboard archive keeps Sharplines honest on the back end. Past picks stay public, while future positions remain premium until the market locks.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/archive" className="cta-secondary">
            Public archive
          </Link>
          <Link href="/performance" className="cta-secondary">
            Public performance
          </Link>
          <Link href="/dashboard/compare" className="cta-secondary">
            Compare view
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="panel p-6">
          <p className="muted-label">Historical picks</p>
          <p className="mt-4 text-3xl uppercase text-white">{archivePicks.length}</p>
          <p className="mt-3 text-sm leading-7 text-mist/70">
            Settled or already-started positions that remain visible for accountability.
          </p>
        </div>
        <div className="panel p-6">
          <p className="muted-label">Future picks</p>
          <p className="mt-4 text-3xl uppercase text-white">{futurePicks.length}</p>
          <p className="mt-3 text-sm leading-7 text-mist/70">
            Current pending picks still ahead of start time and still protected by the premium gate.
          </p>
        </div>
        <div className="panel p-6">
          <p className="muted-label">Access model</p>
          <p className="mt-4 text-3xl uppercase text-white">{paidAccess ? "Premium" : "Free"}</p>
          <p className="mt-3 text-sm leading-7 text-mist/70">
            {paidAccess
              ? "Your account can move between the archive and the protected live card without losing the public transparency layer."
              : "Free accounts can review the full archive and upgrade only for future picks, deeper writeups, and the protected card before games start."}
          </p>
        </div>
      </div>

      <ArchiveBrowser
        picks={archivePicks}
        title="Archive browser"
        copy="Filter the full Sharplines history by sport, result, league, and search terms. The goal is easy review, not selective storytelling."
      />

      {!paidAccess ? (
        <PremiumCtaBlock
          compact
          title="The live card stays premium."
          copy="You can audit every historical pick here for free. Upgrade only if you want the current-day card, premium analysis, and live positions before lock."
        />
      ) : null}
    </div>
  );
}
