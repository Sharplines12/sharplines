type SourceTier = "official" | "reporting" | "betting";

export type SourceNote = {
  title: string;
  url: string;
};

type SourceRule = {
  suffix: string;
  tier: SourceTier;
};

const SOURCE_RULES: SourceRule[] = [
  { suffix: "nba.com", tier: "official" },
  { suffix: "nhl.com", tier: "official" },
  { suffix: "ncaa.com", tier: "official" },
  { suffix: "wnba.com", tier: "official" },
  { suffix: "mlb.com", tier: "official" },
  { suffix: "nfl.com", tier: "official" },
  { suffix: "espn.com", tier: "reporting" },
  { suffix: "cbssports.com", tier: "reporting" },
  { suffix: "sports.yahoo.com", tier: "reporting" },
  { suffix: "rotowire.com", tier: "reporting" },
  { suffix: "reuters.com", tier: "reporting" },
  { suffix: "apnews.com", tier: "reporting" },
  { suffix: "covers.com", tier: "betting" },
  { suffix: "actionnetwork.com", tier: "betting" }
];

export function getApprovedSourceListText() {
  return [
    "Official league and team sources (NBA, NHL, NCAA, NFL, MLB, WNBA)",
    "Major reporting outlets (ESPN, CBS Sports, Yahoo Sports, Rotowire, Reuters, AP)",
    "Market-context sources (Covers, Action Network)"
  ].join("; ");
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matchSourceRule(hostname: string) {
  return SOURCE_RULES.find((rule) => hostname === rule.suffix || hostname.endsWith(`.${rule.suffix}`)) ?? null;
}

export function validateSourceNotes(notes: SourceNote[]) {
  const trusted = notes
    .map((note) => {
      const hostname = getHostname(note.url);
      const rule = hostname ? matchSourceRule(hostname) : null;

      return rule
        ? {
            ...note,
            hostname,
            tier: rule.tier
          }
        : null;
    })
    .filter((note): note is SourceNote & { hostname: string; tier: SourceTier } => Boolean(note));

  const rejectedHosts = Array.from(
    new Set(
      notes
        .map((note) => getHostname(note.url))
        .filter((hostname) => hostname && !matchSourceRule(hostname))
    )
  );

  const uniqueHosts = Array.from(new Set(trusted.map((note) => note.hostname)));
  const hasCoreReporting = trusted.some((note) => note.tier === "official" || note.tier === "reporting");
  const hasMarketContext = trusted.some((note) => note.tier === "betting");

  const ok = uniqueHosts.length >= 2 && hasCoreReporting && hasMarketContext;

  return {
    ok,
    trusted,
    rejectedHosts,
    reason: ok
      ? ""
      : "Daily card skipped because the source mix was not strong enough. Sharplines now requires at least two trusted domains with both reporting/official context and betting-market context."
  };
}
