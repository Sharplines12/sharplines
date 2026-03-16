import { PickRow } from "@/components/pick-row";
import { getTodayCard } from "@/lib/content";

export default async function MembersTodayPage() {
  const todayCard = await getTodayCard();

  return (
    <div className="panel-strong p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="muted-label">Protected daily card</p>
          <h1 className="mt-2 text-5xl uppercase text-white">{todayCard.headline}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7">{todayCard.summary}</p>
        </div>
        <div className="rounded-full border border-neon/25 bg-neon/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon">
          {todayCard.date}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {todayCard.picks.map((pick) => (
          <PickRow key={pick.id} pick={pick} detailed />
        ))}
      </div>
    </div>
  );
}
