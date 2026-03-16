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

export const siteConfig = {
  name: "Sharplines",
  shortName: "Sharplines",
  tagline: "Premium betting analysis, daily top picks, and a members-only card built like a real media brand.",
  monthlyPrice: 29,
  yearlyPrice: 249,
  annualValue: 348,
  contactEmail: "partners@sharplines.com",
  socialHandle: "@sharplines",
  isDemoContent: true,
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
    recordLabel: "Sample launch card",
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

export const articles: Article[] = [
  {
    slug: "how-to-read-a-daily-betting-card",
    title: "How To Read A Daily Betting Card Without Chasing Every Game",
    excerpt: "How to tell the difference between a real betting card, a random list of opinions, and a content product that is just trying to look busy.",
    category: "Strategy",
    publishedAt: "March 10, 2026",
    readingTime: "8 min read",
    heroKicker: "Card Strategy",
    content: [
      "A lot of betting content still confuses activity with quality. The card is long, the opinions are loud, and everything gets treated like a must-play spot. That can feel exciting for a few minutes, but it becomes useless quickly if there is no structure behind it.",
      "A real daily card should do two things well. First, it should tell you what the strongest opinions actually are. Second, it should make it obvious where conviction begins to taper off. If every pick is presented with the same energy and the same unit size, the card is not helping you think. It is just asking you to borrow someone else's confidence.",
      "That is why better products separate the board into layers. There is usually a best bet or featured position, then a handful of standard plays, and then maybe a smaller lean that is worth tracking but not worth treating like the centerpiece. Those distinctions matter. They tell you how the handicapper sees the risk, not just how they want to market the card.",
      "The same logic applies to analysis. Good writeups explain why a number is playable, what market factors matter, and what would make the bet less attractive if the line moves. Weak writeups mostly exist to sound certain. They tell you a side is strong, but they do not tell you where the edge actually lives.",
      "Over time, the cleanest cards are also the easiest to grade honestly. When the strongest opinion loses, you can go back and ask whether the number was still right. When a smaller lean wins, you can avoid rewriting history and pretending it was always the best play on the board. That kind of separation keeps the product accountable, which is a big part of what makes a picks brand feel real."
    ]
  },
  {
    slug: "what-makes-a-sportsbook-review-useful",
    title: "What Makes A Sportsbook Review Useful For Real Bettors",
    excerpt: "The difference between a review that actually helps a bettor and one that only exists to hold an affiliate link.",
    category: "Reviews",
    publishedAt: "March 9, 2026",
    readingTime: "7 min read",
    heroKicker: "Sportsbook Reviews",
    content: [
      "Most sportsbook reviews are technically about the operator, but you can usually tell within a few sentences whether the page was written for an actual reader or for a link report. The weak ones all sound the same. They repeat whatever promo language is easiest to recycle, say the app is \"great for bettors,\" and move on without offering much of a reason to trust the opinion.",
      "A useful review starts with the experience itself. What does the app feel like to navigate? Are the markets broad or mostly surface-level? Does the book make mainstream betting easy while feeling thinner around props and niche spots, or does it hold up better once you move past the front-page menu? Those are the kinds of things a bettor can actually use.",
      "The next layer is context. A mainstream operator like FanDuel or DraftKings does not need a fake hard sell. Readers already know the names. What they need is a calmer explanation of how those books differ in practice: pricing, app feel, market depth, live betting, and whether the product seems stronger for beginners or for someone who already shops numbers across multiple books.",
      "The other thing a real review should do is describe tradeoffs honestly. Maybe the app is clean but the pricing is rarely aggressive. Maybe the rewards ecosystem is interesting but the market menu can feel uneven by state. Those details make the page more credible because they signal that the goal is to evaluate the product, not just to push a signup.",
      "For a betting media brand, sportsbook reviews are a trust test. If the reviews feel thoughtful, the affiliate layer feels earned. If the reviews feel thin, everything else starts to look thinner too."
    ]
  },
  {
    slug: "tracking-results-without-hiding-the-losses",
    title: "Tracking Results Without Hiding The Losses",
    excerpt: "Why public results matter, what a clean record should show, and why hiding losing days destroys trust faster than a cold streak ever could.",
    category: "Transparency",
    publishedAt: "March 8, 2026",
    readingTime: "7 min read",
    heroKicker: "Accountability",
    content: [
      "The easiest way to make a picks brand look fake is not by losing. It is by pretending the losses somehow do not count. Most people who have spent time around betting content already know the signs: selective screenshots, record resets, suspiciously vague unit counts, and timelines that celebrate every win while quietly erasing the rough nights.",
      "A real record does not need to look perfect. It needs to look complete. That means wins, losses, pushes, unit size, and enough date-by-date structure that somebody can actually understand how the card has performed over time. Without that, the record is just another piece of marketing language.",
      "That is also why unit tracking matters more than raw win rate. A 3-2 day can still be weak if the losses came on larger positions. A 2-2 day can still be fine if the card was built around one stronger position and one smaller lean. Once you start showing units and not just wins, the reader gets a clearer picture of how the product is actually being managed.",
      "Transparency also changes the tone of the whole site. If your record is public, you do not need to write like you are trying to overpower skepticism. The data is already doing some of that work for you. The copy can stay calmer, the claims can stay tighter, and the premium pitch can feel more like an invitation than a dare.",
      "In the long run, honest tracking is one of the few things that helps both sides of the business at once. Members feel less like they are buying into a black box, and operator partners see a brand that at least understands how to present itself like a serious product."
    ]
  }
];

export const guides: Guide[] = [
  {
    slug: "best-sportsbook-apps-for-beginners",
    title: "Best Sportsbook Apps For Beginners",
    excerpt: "A beginner-friendly guide to the major U.S. sportsbook apps and what matters most when choosing one.",
    category: "Beginner Guide",
    publishedAt: "March 7, 2026",
    readingTime: "7 min read",
    heroKicker: "Betting Guides",
    content: [
      "The best app for a beginner is usually the one with the clearest interface, solid market depth, and enough brand trust to make the experience feel stable instead of overwhelming.",
      "New bettors should care less about hype and more about usability, market availability, and how clearly an app presents odds, bet slips, and grading.",
      "A strong beginner guide should compare apps calmly, explain tradeoffs, and remind readers that offers, terms, and availability vary by state."
    ]
  },
  {
    slug: "fanduel-vs-draftkings",
    title: "FanDuel Vs DraftKings",
    excerpt: "A side-by-side look at two of the most familiar U.S. sportsbook brands for mainstream bettors.",
    category: "Comparison",
    publishedAt: "March 6, 2026",
    readingTime: "6 min read",
    heroKicker: "Betting Guides",
    content: [
      "FanDuel and DraftKings are often the first two names bettors compare because both have national recognition and broad event coverage.",
      "The most useful comparison is not which brand is universally better, but which one fits the bettor's preferred interface, market menu, and review priorities.",
      "A good comparison page stays neutral, explains app feel and market depth, and avoids overpromising promo value."
    ]
  },
  {
    slug: "how-welcome-offers-work",
    title: "How Welcome Offers Work",
    excerpt: "A straightforward guide to the structure of sportsbook welcome offers without hype or unrealistic framing.",
    category: "Offers Explained",
    publishedAt: "March 5, 2026",
    readingTime: "5 min read",
    heroKicker: "Betting Guides",
    content: [
      "Welcome offers vary by operator, state, and time. The useful question is not whether an offer sounds large, but what the terms, limits, and eligibility rules actually say.",
      "Readers should understand that welcome offers do not change the underlying risk of betting, and they should never be described as guaranteed value or automatic profit.",
      "A credible guide explains how to read offer terms calmly and where operator-specific restrictions usually matter."
    ]
  },
  {
    slug: "what-american-odds-mean",
    title: "What American Odds Mean",
    excerpt: "An easy explanation of plus and minus odds, implied payout, and why price matters more than just picking winners.",
    category: "Odds Basics",
    publishedAt: "March 4, 2026",
    readingTime: "4 min read",
    heroKicker: "Betting Guides",
    content: [
      "American odds tell you both payout structure and implied price. Positive numbers show underdog return, while negative numbers show favorite cost.",
      "The real lesson is that betting is a price-driven activity. Two bettors can like the same side but only one can have a worthwhile number.",
      "A clean odds explainer helps newer readers understand why line shopping and number discipline matter."
    ]
  },
  {
    slug: "parlay-guide",
    title: "Parlay Guide",
    excerpt: "What parlays are, why they appeal to bettors, and how to think about them responsibly.",
    category: "Bet Type Guide",
    publishedAt: "March 3, 2026",
    readingTime: "6 min read",
    heroKicker: "Betting Guides",
    content: [
      "Parlays combine multiple outcomes into one ticket, which increases payout potential and difficulty at the same time.",
      "A credible guide should explain why parlays are popular without presenting them as a shortcut to easy results.",
      "The best educational framing is to help readers understand risk concentration, correlation, and price sensitivity."
    ]
  },
  {
    slug: "bankroll-management-basics",
    title: "Bankroll Management Basics",
    excerpt: "A foundational guide to units, exposure control, and why disciplined sizing matters more than streak chasing.",
    category: "Strategy",
    publishedAt: "March 2, 2026",
    readingTime: "6 min read",
    heroKicker: "Betting Guides",
    content: [
      "Bankroll management is what turns betting content into a repeatable framework instead of emotional guessing.",
      "Unit sizing helps create consistency across plays and makes record tracking more useful over time.",
      "A good beginner strategy guide should emphasize preservation, pacing, and self-control instead of hype."
    ]
  },
  {
    slug: "how-to-read-betting-lines",
    title: "How To Read Betting Lines",
    excerpt: "A practical guide to spreads, totals, moneylines, and what each market is actually asking you to bet.",
    category: "Line Reading",
    publishedAt: "March 1, 2026",
    readingTime: "5 min read",
    heroKicker: "Betting Guides",
    content: [
      "Reading betting lines starts with understanding what the market measures: margin, total points, or straight-up outcome.",
      "Most new bettors improve quickly once they stop seeing lines as predictions and start seeing them as prices attached to specific market assumptions.",
      "A strong line-reading guide should stay practical and avoid jargon overload."
    ]
  },
  {
    slug: "best-betting-apps-by-user-type",
    title: "Best Betting Apps By User Type",
    excerpt: "A framework for matching different sportsbook apps to different types of bettors and browsing styles.",
    category: "App Guides",
    publishedAt: "February 28, 2026",
    readingTime: "7 min read",
    heroKicker: "Betting Guides",
    content: [
      "Not every sportsbook fits every bettor. Some users care most about a clean app, others about niche markets, and others about mainstream familiarity.",
      "A useful guide categorizes operator strengths without sounding like a hard sell for any single book.",
      "This kind of page supports affiliate strategy best when it stays editorial, comparative, and honest about tradeoffs."
    ]
  }
];

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
