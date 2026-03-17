import { affiliateLinks, affiliateNotes } from "@/lib/affiliate-config";

export type PickResult = "win" | "loss" | "push" | "pending";
export type MembershipState = "public" | "authenticated" | "active-paid-member";

export type PickEntry = {
  id: string;
  date: string;
  event: string;
  sport: string;
  league: string;
  pickTitle: string;
  betType: string;
  market: string;
  line: string;
  odds: string;
  sportsbook: string;
  startTime: string;
  confidence: "High" | "Medium" | "Lean";
  units: number;
  shortSummary: string;
  premiumTeaser: string;
  premiumAnalysis: string;
  result: PickResult;
  isBestBet?: boolean;
};

export type DailyCard = {
  id: string;
  date: string;
  headline: string;
  summary: string;
  premiumIntro: string;
  recordLabel: string;
  picks: PickEntry[];
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  lessonCount: number;
  duration: string;
};

export type Sportsbook = {
  slug: string;
  name: string;
  featuredOfferText: string;
  summary: string;
  reviewBullets: string[];
  affiliateUrl: string;
  disclaimer: string;
  overview: string;
  pros: string[];
  cons: string[];
  userExperience: string;
  marketsOffered: string;
  paymentMethods: string;
  bestFor: string;
  promoSummary: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  heroKicker: string;
  content: string[];
};

export type Guide = Article;

type EditorialEntryInput = Omit<Article, "readingTime">;

function buildReadingTime(excerpt: string, content: string[]) {
  const words = [excerpt, ...content]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 210));

  return `${minutes} min read`;
}

export const siteConfig = {
  name: "Sharplines",
  shortName: "Sharplines",
  tagline: "Premium betting analysis, daily top picks, and a members-only card built like a real media brand.",
  monthlyPrice: 29,
  yearlyPrice: 249,
  annualValue: 348,
  contactEmail: "partners@sharplines.com",
  socialHandle: "@sharplines",
  isDemoContent: false,
  freePreviewCount: 2,
  disclosures: [
    "21+ only. Please gamble responsibly.",
    "Picks are informational and opinion-based only. No outcome is guaranteed.",
    "Odds, offers, and legality vary by state and operator.",
    "Affiliate links may earn a commission at no extra cost to you."
  ],
  responsibleGamingLinks: [
    { label: "1-800-GAMBLER", href: "https://www.1800gambler.net/" },
    { label: "NCPG", href: "https://www.ncpgambling.org/" }
  ]
};

export const courseModules: CourseModule[] = [
  {
    id: "bankroll",
    title: "Bankroll Discipline",
    summary: "How units are assigned, why volume is controlled, and how to stay process-driven instead of chasing short-term swings.",
    lessonCount: 5,
    duration: "54 min"
  },
  {
    id: "market-read",
    title: "Market Reading",
    summary: "How line movement, public sentiment, and matchup context shape which plays make the card and which stay off it.",
    lessonCount: 4,
    duration: "39 min"
  },
  {
    id: "card-build",
    title: "Building The Card",
    summary: "The exact structure behind top picks, best bets, leans, and when confidence deserves more or less exposure.",
    lessonCount: 6,
    duration: "71 min"
  },
  {
    id: "review-process",
    title: "Review And Tracking",
    summary: "Transparent grading, post-result review, and how the record tracker stays part of the product story.",
    lessonCount: 3,
    duration: "31 min"
  }
];

export const dailyCards: DailyCard[] = [
  {
    id: "2026-03-16",
    date: "March 16, 2026",
    headline: "Daily Top Picks",
    summary: "Four measured positions across college hoops and NBA totals, with one featured best bet and two locked premium edges.",
    premiumIntro: "Premium members get the full card, unit sizing context, and extra matchup notes.",
    recordLabel: "Featured daily card",
    picks: [
      {
        id: "p1",
        date: "2026-03-16",
        event: "Duke vs. North Carolina",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Duke controls the half-court battle",
        betType: "Spread",
        market: "Spread",
        line: "Duke -4.5",
        odds: "-110",
        sportsbook: "FanDuel",
        startTime: "7:00 PM ET",
        confidence: "High",
        units: 1.5,
        shortSummary: "Transition defense and late-game free throw profile support the favorite.",
        premiumTeaser: "Unlock the full matchup breakdown, injury context, and number threshold.",
        premiumAnalysis:
          "Duke grades out better in the half-court and should create cleaner late-possession shots. The free throw edge matters late if this number stays under two possessions. Premium notes also cover how far the line can move before the edge disappears.",
        result: "pending",
        isBestBet: true
      },
      {
        id: "p2",
        date: "2026-03-16",
        event: "Knicks vs. Heat",
        sport: "Basketball",
        league: "NBA",
        pickTitle: "Under in a slower-possession profile",
        betType: "Total",
        market: "Total",
        line: "Under 218.5",
        odds: "-108",
        sportsbook: "BetMGM",
        startTime: "7:30 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "Both second units project a longer half-court game than the market implies.",
        premiumTeaser: "Members get the tempo notes, foul-rate context, and the live-bet pivot.",
        premiumAnalysis:
          "This number still looks a touch rich if the Heat bench rotation stays intact. Premium members get the pace assumptions, why the foul environment matters here, and what would invalidate the under before tip.",
        result: "pending"
      },
      {
        id: "p3",
        date: "2026-03-16",
        event: "Creighton vs. Marquette",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Rebounding prop in a volume matchup",
        betType: "Player Prop",
        market: "Player Prop",
        line: "Kalkbrenner over 7.5 rebounds",
        odds: "+102",
        sportsbook: "Fanatics",
        startTime: "9:10 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "Projected shot profile creates extra defensive board chances.",
        premiumTeaser: "Premium unlocks the player-rotation angle and stat split notes.",
        premiumAnalysis:
          "The matchup projects enough jump shooting to create rebound volume on both ends, but the best edge comes from how Marquette's spacing shifts missed-shot geography. Members get the minute projection, matchup split, and the fallback number.",
        result: "pending"
      },
      {
        id: "p4",
        date: "2026-03-16",
        event: "Maple Leafs vs. Rangers",
        sport: "Hockey",
        league: "NHL",
        pickTitle: "Premium-only lean on early pace",
        betType: "Total",
        market: "Total",
        line: "Over 6.5",
        odds: "+100",
        sportsbook: "Caesars",
        startTime: "7:00 PM ET",
        confidence: "Lean",
        units: 0.5,
        shortSummary: "The free card shows the headline, but the reason this stayed smaller is in the member notes.",
        premiumTeaser: "Unlock the goalie volatility angle and why this is a smaller unit lean.",
        premiumAnalysis:
          "This is the classic example of a play that belongs in the premium card but not in the public hero. Members see exactly why the goaltending uncertainty keeps this at half a unit and how to react if the number moves.",
        result: "pending"
      }
    ]
  },
  {
    id: "2026-03-14",
    date: "March 14, 2026",
    headline: "Saturday Card",
    summary: "A controlled three-play card with two wins and one miss.",
    premiumIntro: "Archived premium notes explain why the market read held up even on the loss.",
    recordLabel: "2-1, +1.7u",
    picks: [
      {
        id: "r1",
        date: "2026-03-14",
        event: "Purdue vs. Illinois",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Interior edge for Purdue",
        betType: "Spread",
        market: "Spread",
        line: "Purdue -3.5",
        odds: "-112",
        sportsbook: "DraftKings",
        startTime: "3:40 PM ET",
        confidence: "High",
        units: 1.5,
        shortSummary: "Interior matchup and turnover margin projected well.",
        premiumTeaser: "See how the number compared to the model close.",
        premiumAnalysis:
          "This was a good example of the card landing inside the projection window. Premium archive notes detail the close-line value and where the free throw edge really showed up.",
        result: "win",
        isBestBet: true
      },
      {
        id: "r2",
        date: "2026-03-14",
        event: "Lakers vs. Suns",
        sport: "Basketball",
        league: "NBA",
        pickTitle: "Pace-up total angle",
        betType: "Total",
        market: "Total",
        line: "Over 231.5",
        odds: "-110",
        sportsbook: "FanDuel",
        startTime: "8:10 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "Spot favored pace increase, but the finishing variance never arrived.",
        premiumTeaser: "Premium notes show why this loss still fit the process.",
        premiumAnalysis:
          "The handicap was sound even though the game underperformed late. The archive explains which assumptions were right, which were wrong, and why the result still matters less than the number quality.",
        result: "loss"
      },
      {
        id: "r3",
        date: "2026-03-14",
        event: "Houston vs. Iowa State",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Fast-start first half angle",
        betType: "First Half",
        market: "First half spread",
        line: "Houston -2.5",
        odds: "+100",
        sportsbook: "BetRivers",
        startTime: "1:00 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "Expected stronger opening stretch and rebound edge.",
        premiumTeaser: "Members can review the closing value and first-half script.",
        premiumAnalysis:
          "The archive explains why Houston graded as the better early-game team and how the market lagged the expected opening pace.",
        result: "win"
      }
    ]
  },
  {
    id: "2026-03-13",
    date: "March 13, 2026",
    headline: "Friday Card",
    summary: "Two basketball positions and one hold-your-nose NHL angle.",
    premiumIntro: "This archive illustrates what a mixed-result day looks like without hiding the details.",
    recordLabel: "1-1-1, +0.1u",
    picks: [
      {
        id: "r4",
        date: "2026-03-13",
        event: "Arizona vs. Oregon",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Offense-led total read",
        betType: "Total",
        market: "Total",
        line: "Over 147.5",
        odds: "-110",
        sportsbook: "BetMGM",
        startTime: "9:00 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "The number landed on the key and graded as a push.",
        premiumTeaser: "Premium archive notes explain the closing movement.",
        premiumAnalysis:
          "This was close to the final threshold and the archive shows why the market movement mattered more than the raw result.",
        result: "push"
      },
      {
        id: "r5",
        date: "2026-03-13",
        event: "Mavericks vs. Clippers",
        sport: "Basketball",
        league: "NBA",
        pickTitle: "Underdog moneyline shot",
        betType: "Moneyline",
        market: "Moneyline",
        line: "Clippers ML",
        odds: "+118",
        sportsbook: "Fanatics",
        startTime: "10:30 PM ET",
        confidence: "Lean",
        units: 1,
        shortSummary: "Half-court creation edge carried through in the fourth quarter.",
        premiumTeaser: "See why the price mattered more than the side.",
        premiumAnalysis:
          "Members can review the underdog threshold and the matchup-specific creation advantages that made this playable only at plus money.",
        result: "win"
      },
      {
        id: "r6",
        date: "2026-03-13",
        event: "Bruins vs. Panthers",
        sport: "Hockey",
        league: "NHL",
        pickTitle: "Smaller-unit road dog angle",
        betType: "Moneyline",
        market: "Moneyline",
        line: "Bruins ML",
        odds: "+124",
        sportsbook: "Caesars",
        startTime: "7:00 PM ET",
        confidence: "Lean",
        units: 1,
        shortSummary: "Shot volume was there, finish was not.",
        premiumTeaser: "The archive explains why this stayed a lean, not a feature play.",
        premiumAnalysis:
          "The premium notes break down the price sensitivity and why the matchup stayed in the smaller-unit bucket despite a decent projection.",
        result: "loss"
      }
    ]
  },
  {
    id: "2026-03-12",
    date: "March 12, 2026",
    headline: "Thursday Card",
    summary: "One of the cleaner boards of the week, graded 3-0.",
    premiumIntro: "This card works well as archive proof because all three plays had clear role separation.",
    recordLabel: "3-0, +3.3u",
    picks: [
      {
        id: "r7",
        date: "2026-03-12",
        event: "Tennessee vs. Florida",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Dog in a defense-led matchup",
        betType: "Spread",
        market: "Spread",
        line: "Tennessee +2.5",
        odds: "-105",
        sportsbook: "FanDuel",
        startTime: "2:30 PM ET",
        confidence: "High",
        units: 1,
        shortSummary: "Defensive shot quality and matchup profile pointed to the dog.",
        premiumTeaser: "Archive notes show how the market moved late.",
        premiumAnalysis:
          "The premium notes detail how Tennessee's defensive shape controlled the game and why the number stayed playable through the close.",
        result: "win"
      },
      {
        id: "r8",
        date: "2026-03-12",
        event: "Pelicans vs. Kings",
        sport: "Basketball",
        league: "NBA",
        pickTitle: "Travel spot under",
        betType: "Total",
        market: "Total",
        line: "Under 229.5",
        odds: "-110",
        sportsbook: "BetMGM",
        startTime: "10:00 PM ET",
        confidence: "High",
        units: 1.3,
        shortSummary: "Half-court dependency and travel fatigue shaped the under.",
        premiumTeaser: "Premium members can see why the foul environment mattered here.",
        premiumAnalysis:
          "The archive spells out the travel profile, the half-court assumptions, and how this fit the best-bet bucket.",
        result: "win",
        isBestBet: true
      },
      {
        id: "r9",
        date: "2026-03-12",
        event: "Michigan State vs. Wisconsin",
        sport: "Basketball",
        league: "NCAA",
        pickTitle: "Player prop under in a slow-possession spot",
        betType: "Player Prop",
        market: "Player Prop",
        line: "Walker under 16.5 points",
        odds: "+105",
        sportsbook: "BetRivers",
        startTime: "8:00 PM ET",
        confidence: "Medium",
        units: 1,
        shortSummary: "Possession environment and defensive matchup both pointed under.",
        premiumTeaser: "Review the shot volume assumptions in the archive.",
        premiumAnalysis:
          "Premium archive notes explain the pace environment, matchup-specific defender notes, and why the plus-money price made the under stronger.",
        result: "win"
      }
    ]
  }
];

export const todayCard = dailyCards[0];
export const resultsLedger = dailyCards.slice(1);

export const sportsbookOrder = ["fanduel", "draftkings", "betmgm", "caesars", "fanatics"] as const;

export const sportsbooks: Sportsbook[] = [
  {
    slug: "fanduel",
    name: "FanDuel",
    featuredOfferText: "Mainstream operator with broad brand recognition and a familiar market layout.",
    summary: "FanDuel works as a credibility anchor on the site because nearly every bettor recognizes the brand and understands what it represents in the market.",
    reviewBullets: [
      "Broad market coverage for major sports",
      "Strong brand familiarity for new bettors",
      "Useful benchmark when comparing other books"
    ],
    affiliateUrl: affiliateLinks.fanduel,
    disclaimer: affiliateNotes.disclaimer,
    overview:
      "FanDuel is a recognizable national sportsbook that makes sense as a first-stop option for users who value a familiar interface and broad mainstream market depth.",
    pros: ["Recognizable brand", "Clean navigation", "Broad US market coverage"],
    cons: ["Pricing can be less aggressive in some markets", "Regional availability varies"],
    userExperience:
      "The interface is approachable and easy to navigate, which makes FanDuel useful for both casual visitors and content-driven comparison guides.",
    marketsOffered: "Spreads, totals, moneylines, player props, same-game parlays, and live markets.",
    paymentMethods: "Card, ACH, PayPal, and operator-supported digital wallet options where available.",
    bestFor: "Users who want a familiar brand and a straightforward all-around sportsbook experience.",
    promoSummary:
      "Use neutral promo language only. Do not imply guaranteed outcomes or overstate the value of any offer."
  },
  {
    slug: "draftkings",
    name: "DraftKings",
    featuredOfferText: "A large-name sportsbook with deep menu coverage and strong user familiarity.",
    summary: "DraftKings belongs in the review stack because it is one of the core names users expect to see on a legitimate US betting media property.",
    reviewBullets: [
      "Major national recognition",
      "Strong menu depth across leagues",
      "Fits comparison and beginner review content"
    ],
    affiliateUrl: affiliateLinks.draftkings,
    disclaimer: affiliateNotes.disclaimer,
    overview:
      "DraftKings is a natural inclusion for any US-facing sportsbook review section because it combines broad recognition with a deep market menu that appeals to many sports bettors.",
    pros: ["Strong event menu", "Recognized national brand", "Useful for broad audience content"],
    cons: ["Odds value can vary by market", "Not available in every state"],
    userExperience:
      "DraftKings gives users a familiar betting interface with a large range of markets, making it a natural review target for content-first media sites.",
    marketsOffered: "Core pregame markets, live betting, props, parlays, and specialty content depending on state.",
    paymentMethods: "Standard deposit and withdrawal methods vary by state and operator support.",
    bestFor: "Visitors looking for a recognizable brand with broad menu depth and mainstream appeal.",
    promoSummary:
      "Promo summaries should stay neutral, factual, and compliant. Avoid hype or language suggesting easy profits."
  },
  {
    slug: "betmgm",
    name: "BetMGM",
    featuredOfferText: "Established all-around sportsbook with strong market range and recognizable branding.",
    summary: "BetMGM rounds out the review stack with another top-tier operator that helps the site feel broad, current, and business-ready.",
    reviewBullets: [
      "High brand familiarity",
      "Useful market depth for comparison content",
      "Strong secondary trust signal on affiliate pages"
    ],
    affiliateUrl: affiliateLinks.betmgm,
    disclaimer: affiliateNotes.disclaimer,
    overview:
      "BetMGM is a recognizable sportsbook brand with wide market coverage and a stable position in US-facing betting content ecosystems.",
    pros: ["Recognizable brand", "Solid all-around market range", "Useful for comparison guides"],
    cons: ["Offer language changes by market", "Availability and features vary by state"],
    userExperience:
      "BetMGM feels familiar to many sports bettors and works well inside broad review pages that compare mainstream operators.",
    marketsOffered: "Major market types, live betting, props, and parlay content where supported.",
    paymentMethods: "Operator-supported banking methods vary by state and account eligibility.",
    bestFor: "Users who want another mainstream national option with a broad feature set.",
    promoSummary:
      "Keep promotional copy neutral and current. Include terms, limits, and state-specific caveats."
  },
  {
    slug: "caesars",
    name: "Caesars",
    featuredOfferText: "A recognizable national operator with broad awareness and rewards-driven brand identity.",
    summary: "Caesars helps complete the major-book coverage story and gives the affiliate section a more credible full-market feel.",
    reviewBullets: [
      "Strong national brand recognition",
      "Supports a more complete review library",
      "Good fit for rewards-focused comparison content"
    ],
    affiliateUrl: affiliateLinks.caesars,
    disclaimer: affiliateNotes.disclaimer,
    overview:
      "Caesars is a useful review inclusion for bettors who care about big-brand familiarity and a recognized rewards ecosystem.",
    pros: ["Big-brand recognition", "Useful in comparison content", "Strong awareness among US bettors"],
    cons: ["Feature depth varies by market", "Availability depends on state"],
    userExperience:
      "Caesars is easy to understand as part of a broader review library and helps reinforce that the site covers legitimate mainstream operators.",
    marketsOffered: "Standard pregame and live markets with content varying by jurisdiction.",
    paymentMethods: "Banking options differ based on state, operator rules, and account eligibility.",
    bestFor: "Users who prefer a widely recognized national brand with reward-oriented positioning.",
    promoSummary:
      "Summarize promos factually. Avoid framing any offer as low-risk, no-risk, or guaranteed value."
  },
  {
    slug: "fanatics",
    name: "Fanatics",
    featuredOfferText: "Fast-growing brand presence that fits both operator coverage and partnership positioning.",
    summary: "Fanatics is strategically important for this platform because it supports the broader business story without overshadowing the premium picks product.",
    reviewBullets: [
      "Useful strategic operator to feature prominently",
      "Supports media-brand credibility",
      "Fits premium review and comparison modules"
    ],
    affiliateUrl: affiliateLinks.fanatics,
    disclaimer: affiliateNotes.disclaimer,
    overview:
      "Fanatics is a strong addition to the operator stack because it gives the site a current, growth-oriented sportsbook brand that still fits a premium media aesthetic.",
    pros: ["Current brand momentum", "Strategic partnership relevance", "Strong review-page fit"],
    cons: ["State footprint varies", "Offer details change frequently"],
    userExperience:
      "Fanatics fits well in a content-led affiliate section because it feels current, recognized, and strategically aligned with a modern sports-media brand.",
    marketsOffered: "Core sportsbook markets and bet types vary by state and product rollout.",
    paymentMethods: "Payment options depend on state support and operator account settings.",
    bestFor: "Users who want to compare another recognizable sportsbook brand in the national mix.",
    promoSummary:
      "Promo summaries should stay factual, current, and compliant with affiliate terms."
  }
];

const articleDrafts: EditorialEntryInput[] = [
  {
    slug: "how-to-read-a-daily-betting-card",
    title: "How To Read A Daily Betting Card Without Chasing Every Game",
    excerpt: "How to tell the difference between a real betting card, a random list of opinions, and a content product that is just trying to look busy.",
    category: "Strategy",
    publishedAt: "March 10, 2026",
    heroKicker: "Card Strategy",
    content: [
      "A lot of betting content still confuses activity with quality. The card is long, the opinions are loud, and everything gets treated like a must-play spot. That can feel exciting for a few minutes, but it becomes useless quickly if there is no structure behind it.",
      "A real daily card should do two things well. First, it should tell you what the strongest opinions actually are. Second, it should make it obvious where conviction begins to taper off. If every pick is presented with the same energy and the same unit size, the card is not helping you think. It is just asking you to borrow someone else's confidence.",
      "That is why better products separate the board into layers. There is usually a best bet or featured position, then a handful of standard plays, and then maybe a smaller lean that is worth tracking but not worth treating like the centerpiece. Those distinctions matter. They tell you how the handicapper sees the risk, not just how they want to market the card.",
      "The same logic applies to analysis. Good writeups explain why a number is playable, what market factors matter, and what would make the bet less attractive if the line moves. Weak writeups mostly exist to sound certain. They tell you a side is strong, but they do not tell you where the edge actually lives.",
      "Over time, the cleanest cards are also the easiest to grade honestly. When the strongest opinion loses, you can go back and ask whether the number was still right. When a smaller lean wins, you can avoid rewriting history and pretending it was always the best play on the board. That kind of separation keeps the product accountable, which is a big part of what makes a picks brand feel real.",
      "A strong card also respects the fact that most bettors are making choices under time pressure. They may be reading from a phone ten minutes before tip, or checking a premium board between line moves. The product should help them identify the core positions quickly without turning every decision into a scavenger hunt through five different paragraphs that all say the same thing.",
      "That is where formatting matters. The best cards tell you the event, market, number, sportsbook, confidence, and a short thesis immediately. The longer writeup exists to support the play, not to bury it. Readers should be able to understand what is being bet in seconds and then decide whether they want the deeper context.",
      "Another signal of quality is whether the card acknowledges price sensitivity. It is not enough to say Duke is the side or the under is the look. Good betting content explains whether a play is worth betting only at -4.5, still acceptable at -5, or gone once the market reaches -6. That is the difference between analysis and fandom.",
      "The same principle applies to volume. If a card covers seven games just because seven games are on television, the product starts to look like content for content's sake. A sharper card is comfortable passing on matchups that do not offer a real number advantage. Selectivity often does more for credibility than a bloated slate ever can.",
      "The best readers pick up on that quickly. They do not just want winning picks; they want a workflow they can trust. A disciplined daily card teaches them what matters, what does not, and how to think about the board when the premium writeup is no longer in front of them.",
      "That is ultimately why daily-card structure matters so much for a brand like Sharplines. The card is not only the product. It is also a statement about process. When it is clear, measured, and easy to audit later, the entire site feels more serious."
    ]
  },
  {
    slug: "what-makes-a-sportsbook-review-useful",
    title: "What Makes A Sportsbook Review Useful For Real Bettors",
    excerpt: "The difference between a review that actually helps a bettor and one that only exists to hold an affiliate link.",
    category: "Reviews",
    publishedAt: "March 9, 2026",
    heroKicker: "Sportsbook Reviews",
    content: [
      "Most sportsbook reviews are technically about the operator, but you can usually tell within a few sentences whether the page was written for an actual reader or for a link report. The weak ones all sound the same. They repeat whatever promo language is easiest to recycle, say the app is \"great for bettors,\" and move on without offering much of a reason to trust the opinion.",
      "A useful review starts with the experience itself. What does the app feel like to navigate? Are the markets broad or mostly surface-level? Does the book make mainstream betting easy while feeling thinner around props and niche spots, or does it hold up better once you move past the front-page menu? Those are the kinds of things a bettor can actually use.",
      "The next layer is context. A mainstream operator like FanDuel or DraftKings does not need a fake hard sell. Readers already know the names. What they need is a calmer explanation of how those books differ in practice: pricing, app feel, market depth, live betting, and whether the product seems stronger for beginners or for someone who already shops numbers across multiple books.",
      "The other thing a real review should do is describe tradeoffs honestly. Maybe the app is clean but the pricing is rarely aggressive. Maybe the rewards ecosystem is interesting but the market menu can feel uneven by state. Those details make the page more credible because they signal that the goal is to evaluate the product, not just to push a signup.",
      "For a betting media brand, sportsbook reviews are a trust test. If the reviews feel thoughtful, the affiliate layer feels earned. If the reviews feel thin, everything else starts to look thinner too.",
      "Good reviews also help bettors understand what comparison actually means. It is not only about the bonus headline. It is about how quickly the book posts props, whether the live screen is usable, how often the app hangs during high-volume windows, and whether the market menu feels deep enough for the type of bettor reading the page.",
      "That is why operator fit is such an important section. Some users simply want a recognizable book with a clean interface and a broad menu on Saturday afternoons. Others care more about prop availability, alt markets, and whether the app is good enough for line shopping across three or four tabs. A useful review says that out loud instead of pretending one operator wins every category.",
      "There is also a responsibility piece here. If an operator's pricing is often less aggressive in certain mainstream markets, the review should say so. If state availability creates important limitations, the page should state that clearly. If the book has a good beginner feel but less appeal for experienced shoppers, that is still valuable information.",
      "Readers can tell when a page has been written from observation rather than from a template. Small details about navigation, market discovery, and promotional clarity make the review feel grounded. They also make affiliate links feel less intrusive because the editorial layer is doing real work before the call to action shows up.",
      "For Sharplines, this matters beyond SEO. Review pages help prove that the site is not only a paywall with a few locked picks. They show that there is operator knowledge, product context, and a broader understanding of how bettors actually choose where to place a wager.",
      "That is why the best sportsbook reviews stay calm. They do not need to shout. They simply need to answer the questions a real bettor would have before signing up or before adding another book to the rotation."
    ]
  },
  {
    slug: "tracking-results-without-hiding-the-losses",
    title: "Tracking Results Without Hiding The Losses",
    excerpt: "Why public results matter, what a clean record should show, and why hiding losing days destroys trust faster than a cold streak ever could.",
    category: "Transparency",
    publishedAt: "March 8, 2026",
    heroKicker: "Accountability",
    content: [
      "The easiest way to make a picks brand look fake is not by losing. It is by pretending the losses somehow do not count. Most people who have spent time around betting content already know the signs: selective screenshots, record resets, suspiciously vague unit counts, and timelines that celebrate every win while quietly erasing the rough nights.",
      "A real record does not need to look perfect. It needs to look complete. That means wins, losses, pushes, unit size, and enough date-by-date structure that somebody can actually understand how the card has performed over time. Without that, the record is just another piece of marketing language.",
      "That is also why unit tracking matters more than raw win rate. A 3-2 day can still be weak if the losses came on larger positions. A 2-2 day can still be fine if the card was built around one stronger position and one smaller lean. Once you start showing units and not just wins, the reader gets a clearer picture of how the product is actually being managed.",
      "Transparency also changes the tone of the whole site. If your record is public, you do not need to write like you are trying to overpower skepticism. The data is already doing some of that work for you. The copy can stay calmer, the claims can stay tighter, and the premium pitch can feel more like an invitation than a dare.",
      "In the long run, honest tracking is one of the few things that helps both sides of the business at once. Members feel less like they are buying into a black box, and operator partners see a brand that at least understands how to present itself like a serious product.",
      "A clean results page should also preserve context. It helps to know whether a losing day came from a missed best bet, three small leans, or a bad close after a late injury update. None of that erases the loss, but it does help readers understand how the card was built and whether the process still made sense.",
      "That is the difference between transparency and performance theater. Performance theater wants the audience to remember only the green screenshots. Transparency is willing to keep the full sequence visible, even when the short-term record is rough. That kind of honesty creates a much sturdier relationship over time.",
      "There is also a practical side to this. Honest archives make better future analysis possible. If you can review old plays with the original number, writeup, unit size, and result, you can actually learn something from them. If the history has been cleaned up for appearance, the archive becomes nearly useless as a tool for improvement.",
      "That is one reason serious bettors care about closing line value, thresholds, and whether the edge was still there even when the result failed. A good archive gives you enough information to ask those questions. It does not stop at the final score and call the lesson complete.",
      "For a premium picks brand, public recordkeeping is also part of the sales experience. It signals that the product expects scrutiny. That confidence reads much better than a site that tries to protect itself from evaluation by keeping everything vague.",
      "The simplest version of the rule is still the best one: keep the wins, keep the losses, keep the unit sizing, and keep the dates. If the product is worth trusting, the full record should help prove it rather than threaten it."
    ]
  }
];

export const articles: Article[] = articleDrafts.map((article) => ({
  ...article,
  readingTime: buildReadingTime(article.excerpt, article.content)
}));

const guideDrafts: EditorialEntryInput[] = [
  {
    slug: "best-sportsbook-apps-for-beginners",
    title: "Best Sportsbook Apps For Beginners",
    excerpt: "A beginner-friendly guide to the major U.S. sportsbook apps and what matters most when choosing one.",
    category: "Beginner Guide",
    publishedAt: "March 7, 2026",
    heroKicker: "Betting Guides",
    content: [
      "The best app for a beginner is usually the one with the clearest interface, solid market depth, and enough brand trust to make the experience feel stable instead of overwhelming.",
      "New bettors should care less about hype and more about usability, market availability, and how clearly an app presents odds, bet slips, and grading.",
      "A strong beginner guide should compare apps calmly, explain tradeoffs, and remind readers that offers, terms, and availability vary by state.",
      "Most new users do not need every possible market on day one. They need an app that makes the basics obvious: how to find spreads, totals, and moneylines; how the bet slip works; how live prices update; and where account information is stored. If those basics feel confusing, everything else gets harder quickly.",
      "Brand familiarity matters too. A national operator with a clean, familiar interface may be a better beginner choice than a book with a deeper niche menu but a less intuitive product. Early comfort matters because confusion often leads to rushed decisions and poor number discipline.",
      "Beginners should also pay attention to simple practical details. Can you find player props without endless tapping? Does the app make odds changes obvious before submitting a ticket? Is the grading history easy to review afterward? Those are small things until they are not.",
      "Another useful filter is whether the app supports comparison shopping. Even a beginner should start learning that the same side can be -110 at one book and -118 at another. An app that encourages cleaner browsing and faster market checks helps build that habit earlier.",
      "A beginner guide is strongest when it avoids making the choice sound permanent. Most bettors eventually use more than one book. The real goal is to help new readers pick a good starting point while understanding how and why they may add other operators later."
    ]
  },
  {
    slug: "fanduel-vs-draftkings",
    title: "FanDuel Vs DraftKings",
    excerpt: "A side-by-side look at two of the most familiar U.S. sportsbook brands for mainstream bettors.",
    category: "Comparison",
    publishedAt: "March 6, 2026",
    heroKicker: "Betting Guides",
    content: [
      "FanDuel and DraftKings are often the first two names bettors compare because both have national recognition and broad event coverage.",
      "The most useful comparison is not which brand is universally better, but which one fits the bettor's preferred interface, market menu, and review priorities.",
      "A good comparison page stays neutral, explains app feel and market depth, and avoids overpromising promo value.",
      "For many users, FanDuel feels cleaner on first impression. The navigation tends to be straightforward, the mainstream markets are easy to reach, and the product generally works well for a bettor who wants a stable, familiar experience. That is part of why it is often the easiest recommendation for newer users.",
      "DraftKings often appeals to readers who want a deeper-feeling event menu and a broader sense of market variety. It is still mainstream, but it can feel slightly more expansive once you move beyond the front page and start browsing props, alt lines, and more specialized markets.",
      "Pricing is another area where blanket statements usually fail. Neither book wins every category all the time. A bettor who checks only one app may never notice that, but a bettor who shops numbers quickly sees how often the better price changes by sport, market type, and time of day.",
      "That is why interface alone is not enough. Good comparison content should help readers think in layers: app usability, market breadth, odds quality, live-betting feel, and whether the operator matches their style. Someone looking for simple mainstream betting may not prioritize the same things as someone who checks props constantly.",
      "The best comparison pages also explain what they are not doing. They are not declaring a universal winner for every bettor in every state. They are giving readers a clearer framework for deciding which operator feels stronger for their own habits."
    ]
  },
  {
    slug: "how-welcome-offers-work",
    title: "How Welcome Offers Work",
    excerpt: "A straightforward guide to the structure of sportsbook welcome offers without hype or unrealistic framing.",
    category: "Offers Explained",
    publishedAt: "March 5, 2026",
    heroKicker: "Betting Guides",
    content: [
      "Welcome offers vary by operator, state, and time. The useful question is not whether an offer sounds large, but what the terms, limits, and eligibility rules actually say.",
      "Readers should understand that welcome offers do not change the underlying risk of betting, and they should never be described as guaranteed value or automatic profit.",
      "A credible guide explains how to read offer terms calmly and where operator-specific restrictions usually matter.",
      "The headline amount is rarely the whole story. A larger-looking offer can still be less useful if the qualifying rules are narrow, the time window is short, or the eligible markets are more limited than the reader expects. That is why the terms deserve more attention than the graphic.",
      "Another thing worth explaining is that welcome offers are still attached to a real-money betting environment. They do not remove variance, they do not guarantee a positive result, and they should never be treated like free income. Readers who understand that are much less likely to misread what the promotion is actually doing.",
      "Good offer coverage also explains where state differences matter. A promotion that is available in one state may not exist in another, and the exact structure can change as operators rotate creative, adjust acquisition goals, or respond to regulation.",
      "For a media site, the best tone is descriptive rather than persuasive. Spell out who may qualify, what the important conditions are, and where readers should verify the current language on the operator site before taking action.",
      "That kind of guide helps the affiliate layer feel more responsible. It tells readers how to think about offers without implying they are a shortcut to easy results."
    ]
  },
  {
    slug: "what-american-odds-mean",
    title: "What American Odds Mean",
    excerpt: "An easy explanation of plus and minus odds, implied payout, and why price matters more than just picking winners.",
    category: "Odds Basics",
    publishedAt: "March 4, 2026",
    heroKicker: "Betting Guides",
    content: [
      "American odds tell you both payout structure and implied price. Positive numbers show underdog return, while negative numbers show favorite cost.",
      "The real lesson is that betting is a price-driven activity. Two bettors can like the same side but only one can have a worthwhile number.",
      "A clean odds explainer helps newer readers understand why line shopping and number discipline matter.",
      "Positive odds tell you how much profit a 100-dollar stake would return. Negative odds tell you how much you would need to risk to win 100 dollars. That is the mechanical part, and it matters, but it is only the beginning.",
      "The more important lesson is that odds are prices, not predictions. If a bettor only asks who is more likely to win, they miss the real question: is the number fair relative to the true probability? That is what turns a pick into a betting decision.",
      "This is also why line shopping matters. If one book offers +105 and another offers -110 on the same outcome, the difference may look small in the moment, but it compounds over time. Price sensitivity is one of the few edges that almost every bettor can improve immediately.",
      "A good odds guide should also show how different prices change breakeven points. Once readers understand how much often they need to win at -110 versus +105, they start thinking about the market differently. That is a healthier habit than focusing only on today's single result.",
      "For Sharplines, odds education is part of the broader brand story. It shows that the site is trying to build better betting habits, not just publish selections."
    ]
  },
  {
    slug: "parlay-guide",
    title: "Parlay Guide",
    excerpt: "What parlays are, why they appeal to bettors, and how to think about them responsibly.",
    category: "Bet Type Guide",
    publishedAt: "March 3, 2026",
    heroKicker: "Betting Guides",
    content: [
      "Parlays combine multiple outcomes into one ticket, which increases payout potential and difficulty at the same time.",
      "A credible guide should explain why parlays are popular without presenting them as a shortcut to easy results.",
      "The best educational framing is to help readers understand risk concentration, correlation, and price sensitivity.",
      "Parlays appeal to bettors because they compress multiple opinions into a single payout line. That can be fun, and for some users it is part of the entertainment value. The problem begins when the bigger return distracts from how much the difficulty rises with each leg.",
      "A useful guide should explain that every added leg compounds risk. A bettor may feel good about each individual piece, but the ticket still requires everything to align. That is why parlays can feel close all night and still lose in ways single bets do not.",
      "Correlation matters too. Some books restrict obvious correlations, but even legal combinations can carry hidden overlap in game environment, pace, or scoring profile. Readers should learn to ask whether the legs are independent or whether the ticket is more fragile than it looks.",
      "Price is another piece most beginner parlay guides ignore. A two-leg parlay is not automatically strong just because both sides sound reasonable. The underlying numbers still matter. If each leg is a poor price on its own, bundling them does not solve the problem.",
      "Responsible framing means acknowledging why bettors enjoy parlays while also being honest about the risk concentration. That is more useful than either shaming the bet type or pretending it is a secret shortcut."
    ]
  },
  {
    slug: "bankroll-management-basics",
    title: "Bankroll Management Basics",
    excerpt: "A foundational guide to units, exposure control, and why disciplined sizing matters more than streak chasing.",
    category: "Strategy",
    publishedAt: "March 2, 2026",
    heroKicker: "Betting Guides",
    content: [
      "Bankroll management is what turns betting content into a repeatable framework instead of emotional guessing.",
      "Unit sizing helps create consistency across plays and makes record tracking more useful over time.",
      "A good beginner strategy guide should emphasize preservation, pacing, and self-control instead of hype.",
      "The easiest mistake newer bettors make is tying stake size to emotion. A play feels obvious, so the risk jumps. A bad night stings, so the next card gets oversized in an attempt to get even quickly. That pattern usually does more damage than the picks themselves.",
      "Units exist to stop that drift. They create a consistent language for exposure, which makes both tracking and decision-making cleaner. Once a bettor starts thinking in units rather than in impulsive dollar swings, the card gets easier to manage.",
      "Bankroll management also helps a reader interpret results correctly. A product that goes 2-2 on one day and 4-3 on another may look almost the same on the surface, but the unit distribution can tell a very different story. That is why serious results pages show more than just win-loss record.",
      "Another healthy habit is defining total daily exposure. Even bettors who use small units can get sloppy if they stack too many plays or chase late action after a rough start. A bankroll plan should set limits not only on single bets but also on how much of the card can be in play at once.",
      "At its core, bankroll management is not flashy. That is exactly why it matters. It is one of the few habits that can make the entire betting experience more sustainable regardless of short-term variance."
    ]
  },
  {
    slug: "how-to-read-betting-lines",
    title: "How To Read Betting Lines",
    excerpt: "A practical guide to spreads, totals, moneylines, and what each market is actually asking you to bet.",
    category: "Line Reading",
    publishedAt: "March 1, 2026",
    heroKicker: "Betting Guides",
    content: [
      "Reading betting lines starts with understanding what the market measures: margin, total points, or straight-up outcome.",
      "Most new bettors improve quickly once they stop seeing lines as predictions and start seeing them as prices attached to specific market assumptions.",
      "A strong line-reading guide should stay practical and avoid jargon overload.",
      "A point spread is asking whether a team can win by more than a listed margin or stay within it. A total is asking about combined scoring. A moneyline strips away margin and focuses on the straight winner. Those are the building blocks, and they need to be clear before anything more advanced matters.",
      "What trips many new readers up is that the line is not simply a prediction from the sportsbook. It is a price attached to a market. That means it can move for reasons that include injury news, betting volume, sharper action, and adjustments in the book's own risk position.",
      "That is why line reading and line movement belong together. If a spread opens at -3.5 and moves to -5, the question is not only whether the favorite is better. It is whether the earlier number offered a better price than the current one, and whether the edge still exists.",
      "The same logic applies to totals and props. Markets tell a story about assumptions: pace, efficiency, game script, role, volume, and injury impact. A bettor who learns to read that story becomes much better at understanding why a play exists in the first place.",
      "The cleaner the explanation, the better. Readers do not need jargon piled on top of a simple concept. They need a practical way to understand what the market is asking and how price changes the answer."
    ]
  },
  {
    slug: "best-betting-apps-by-user-type",
    title: "Best Betting Apps By User Type",
    excerpt: "A framework for matching different sportsbook apps to different types of bettors and browsing styles.",
    category: "App Guides",
    publishedAt: "February 28, 2026",
    heroKicker: "Betting Guides",
    content: [
      "Not every sportsbook fits every bettor. Some users care most about a clean app, others about niche markets, and others about mainstream familiarity.",
      "A useful guide categorizes operator strengths without sounding like a hard sell for any single book.",
      "This kind of page supports affiliate strategy best when it stays editorial, comparative, and honest about tradeoffs.",
      "A beginner may value clarity above all else. They want a clean bet slip, obvious market navigation, and a product that does not feel cluttered. For that reader, a book with strong mainstream usability may be a better recommendation than one with a wider but more confusing menu.",
      "A comparison shopper has different needs. They care about price differences, prop depth, and how quickly they can bounce between markets without losing context. That bettor may tolerate a busier interface if the operator helps them shop more efficiently.",
      "Then there is the entertainment-first user, who may care most about broad event coverage, a familiar brand, and an app that feels stable during major televised slates. That person may not be hunting for niche edges, but they still need honest guidance about tradeoffs and state availability.",
      "Framing sportsbook apps by user type is useful because it avoids the false promise of a universal number-one recommendation. It lets the content stay practical. Different readers want different things, and credible editorial coverage should be comfortable saying that.",
      "For Sharplines, pages like this also help the affiliate layer feel more mature. They show operator knowledge, encourage comparison behavior, and give readers a reason to stay on the site even when they are not looking at the premium card."
    ]
  }
];

export const guides: Guide[] = guideDrafts.map((guide) => ({
  ...guide,
  readingTime: buildReadingTime(guide.excerpt, guide.content)
}));

export const faqs = [
  {
    question: "What does premium membership include?",
    answer: "Premium unlocks the full daily card, complete written analysis, archived picks, record tracking, and the premium dashboard."
  },
  {
    question: "Can free users still use the site?",
    answer: "Yes. Free users can browse articles, sportsbook reviews, and a limited preview of the daily top picks."
  },
  {
    question: "Are the picks guaranteed?",
    answer: "No. Picks are opinion-based sports betting content and there are no guaranteed outcomes."
  },
  {
    question: "Does sportsbook availability vary?",
    answer: "Yes. Operators, odds, offers, and legality vary by state and should always be verified before use."
  }
];

export const savedArticleSlugs = [articles[0].slug, articles[2].slug];
export const savedPickIds = [todayCard.picks[0].id, resultsLedger[0].picks[0].id, resultsLedger[1].picks[1].id];

export function getSportsbookSlugByName(name: string) {
  const sportsbook = sportsbooks.find((item) => item.name.toLowerCase() === name.toLowerCase());
  return sportsbook?.slug;
}

export function getLedgerTotals() {
  const gradedPicks = dailyCards.flatMap((day) => day.picks).filter((pick) => pick.result !== "pending");
  const totalRisked = gradedPicks.reduce((sum, pick) => sum + pick.units, 0);
  const wins = gradedPicks.filter((pick) => pick.result === "win").length;
  const losses = gradedPicks.filter((pick) => pick.result === "loss").length;
  const pushes = gradedPicks.filter((pick) => pick.result === "push").length;
  const units = gradedPicks.reduce((sum, pick) => {
    if (pick.result === "win") {
      return sum + pick.units * 0.91;
    }

    if (pick.result === "loss") {
      return sum - pick.units;
    }

    return sum;
  }, 0);
  const roi = totalRisked ? (units / totalRisked) * 100 : 0;

  return {
    wins,
    losses,
    pushes,
    units,
    roi,
    totalRisked
  };
}

export function getCurrentStreak() {
  const graded = dailyCards
    .flatMap((day) => day.picks)
    .filter((pick) => pick.result !== "pending")
    .slice()
    .reverse();

  const first = graded[0];

  if (!first) {
    return "No graded picks yet";
  }

  let count = 0;

  for (const pick of graded) {
    if (pick.result === first.result) {
      count += 1;
    } else {
      break;
    }
  }

  return `${count} ${first.result}${count > 1 ? "s" : ""}`;
}

export function getSportBreakdown() {
  const grouped = new Map<string, { wins: number; losses: number; pushes: number; units: number }>();

  for (const pick of dailyCards.flatMap((day) => day.picks)) {
    if (pick.result === "pending") {
      continue;
    }

    const current = grouped.get(pick.sport) || { wins: 0, losses: 0, pushes: 0, units: 0 };

    if (pick.result === "win") {
      current.wins += 1;
      current.units += pick.units * 0.91;
    } else if (pick.result === "loss") {
      current.losses += 1;
      current.units -= pick.units;
    } else {
      current.pushes += 1;
    }

    grouped.set(pick.sport, current);
  }

  return Array.from(grouped.entries()).map(([sport, stats]) => ({
    sport,
    ...stats
  }));
}
