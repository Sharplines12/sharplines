import type { Metadata } from "next";
import { ResultsDayCard } from "@/components/results-day-card";
import { getResultsLedger } from "@/lib/content";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Members Archive`,
  description: `Protected premium archive and prior graded cards inside ${siteConfig.name}.`
};

export default async function MembersArchivePage() {
  const resultsLedger = await getResultsLedger();

  return (
    <div className="space-y-5">
      <div className="panel-strong p-8">
        <p className="muted-label">Protected archive</p>
        <h1 className="mt-2 text-5xl uppercase text-white">Review prior cards and keep the record close.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7">
          The public ledger earns trust. The member archive gives paying users the cleaner internal view of how the
          card has been graded over time.
        </p>
      </div>

      {resultsLedger.map((day) => (
        <ResultsDayCard key={day.id} day={day} />
      ))}
    </div>
  );
}
