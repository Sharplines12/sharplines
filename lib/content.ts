import {
  articles as fallbackArticles,
  courseModules as fallbackCourseModules,
  dailyCards as fallbackDailyCards,
  faqs as fallbackFaqs,
  getCurrentStreak,
  getLedgerTotals,
  getSportBreakdown,
  guides as fallbackGuides,
  resultsLedger as fallbackResultsLedger,
  savedArticleSlugs as fallbackSavedArticleSlugs,
  savedPickIds as fallbackSavedPickIds,
  sportsbooks as fallbackSportsbooks,
  todayCard as fallbackTodayCard,
  type Article,
  type CourseModule,
  type DailyCard,
  type Guide,
  type PickEntry,
  type Sportsbook
} from "@/lib/data";
import { flattenDailyCards, getHistoricalPicks, getFuturePicks, type PickArchiveEntry } from "@/lib/picks";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

type DbDailyCard = {
  id: string;
  card_date: string;
  headline: string;
  summary: string;
  premium_intro: string;
  record_label: string;
  picks: DbPickEntry[] | null;
};

type DbPickEntry = {
  id: string;
  date: string;
  event: string;
  sport: string;
  league: string;
  pick_title: string;
  bet_type: string;
  market: string;
  line: string;
  odds: string;
  sportsbook: string;
  start_time: string;
  confidence: "High" | "Medium" | "Lean";
  units: number;
  short_summary: string;
  premium_teaser: string;
  premium_analysis: string;
  result: PickEntry["result"];
  is_featured: boolean | null;
  posted_at: string | null;
  updated_at: string | null;
  settled_at: string | null;
  profit_loss: number | null;
  is_premium: boolean | null;
  closing_status: PickEntry["closingStatus"] | null;
};

type DbArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  reading_time: string;
  hero_kicker: string;
  content: string[];
};

type DbSportsbook = {
  slug: string;
  name: string;
  featured_offer_text: string;
  summary: string;
  review_bullets: string[];
  affiliate_url: string;
  disclaimer: string;
  overview: string;
  pros: string[];
  cons: string[];
  user_experience: string;
  markets_offered: string;
  payment_methods: string;
  best_for: string;
  promo_summary: string;
};

function mapPick(pick: DbPickEntry): PickEntry {
  return {
    id: pick.id,
    date: pick.date,
    event: pick.event,
    sport: pick.sport,
    league: pick.league,
    pickTitle: pick.pick_title,
    betType: pick.bet_type,
    market: pick.market,
    line: pick.line,
    odds: pick.odds,
    sportsbook: pick.sportsbook,
    startTime: pick.start_time,
    confidence: pick.confidence,
    units: pick.units,
    shortSummary: pick.short_summary,
    premiumTeaser: pick.premium_teaser,
    premiumAnalysis: pick.premium_analysis,
    result: pick.result,
    isBestBet: pick.is_featured ?? false,
    postedAt: pick.posted_at ?? undefined,
    updatedAt: pick.updated_at ?? undefined,
    settledAt: pick.settled_at,
    profitLoss: pick.profit_loss ?? undefined,
    isPremium: pick.is_premium ?? undefined,
    closingStatus: pick.closing_status ?? undefined
  };
}

function mapDailyCard(card: DbDailyCard): DailyCard {
  return {
    id: card.id,
    date: new Date(card.card_date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    headline: card.headline,
    summary: card.summary,
    premiumIntro: card.premium_intro,
    recordLabel: card.record_label,
    picks: (card.picks || []).map(mapPick)
  };
}

function mapArticle(article: DbArticle): Article {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    publishedAt: article.published_at,
    readingTime: article.reading_time,
    heroKicker: article.hero_kicker,
    content: article.content
  };
}

function mapSportsbook(sportsbook: DbSportsbook): Sportsbook {
  return {
    slug: sportsbook.slug,
    name: sportsbook.name,
    featuredOfferText: sportsbook.featured_offer_text,
    summary: sportsbook.summary,
    reviewBullets: sportsbook.review_bullets,
    affiliateUrl: sportsbook.affiliate_url,
    disclaimer: sportsbook.disclaimer,
    overview: sportsbook.overview,
    pros: sportsbook.pros,
    cons: sportsbook.cons,
    userExperience: sportsbook.user_experience,
    marketsOffered: sportsbook.markets_offered,
    paymentMethods: sportsbook.payment_methods,
    bestFor: sportsbook.best_for,
    promoSummary: sportsbook.promo_summary
  };
}

async function safeQuery<T>(query: () => Promise<T>, fallback: T) {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

export async function getDailyCards() {
  if (!isSupabaseConfigured()) {
    return fallbackDailyCards;
  }

  return safeQuery(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("daily_cards")
      .select("id, card_date, headline, summary, premium_intro, record_label, picks(*)")
      .eq("is_published", true)
      .order("card_date", { ascending: false });

    if (error || !data?.length) {
      return fallbackDailyCards;
    }

    return (data as DbDailyCard[]).map(mapDailyCard);
  }, fallbackDailyCards);
}

export async function getTodayCard() {
  const cards = await getDailyCards();
  return cards[0] ?? fallbackTodayCard;
}

export async function getResultsLedger() {
  const cards = await getDailyCards();
  return cards.slice(1).length ? cards.slice(1) : fallbackResultsLedger;
}

export async function getArchivePicks() {
  const cards = await getDailyCards();
  return getHistoricalPicks(cards).sort((left, right) => new Date(right.postedAt).getTime() - new Date(left.postedAt).getTime());
}

export async function getFutureArchivePicks() {
  const cards = await getDailyCards();
  return getFuturePicks(cards).sort((left, right) => new Date(left.postedAt).getTime() - new Date(right.postedAt).getTime());
}

export async function getPickBySlug(slug: string) {
  const cards = await getDailyCards();
  return flattenDailyCards(cards).find((pick) => pick.slug === slug || pick.id === slug) ?? null;
}

export async function getArticles() {
  if (!isSupabaseConfigured()) {
    return fallbackArticles;
  }

  return safeQuery(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("articles").select("*").order("published_at", { ascending: false });

    if (error || !data?.length) {
      return fallbackArticles;
    }

    return (data as DbArticle[]).map(mapArticle);
  }, fallbackArticles);
}

export async function getArticleBySlug(slug: string) {
  const items = await getArticles();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getGuides() {
  if (!isSupabaseConfigured()) {
    return fallbackGuides;
  }

  return safeQuery(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("guides").select("*").order("published_at", { ascending: false });

    if (error || !data?.length) {
      return fallbackGuides;
    }

    return (data as DbArticle[]).map(mapArticle) as Guide[];
  }, fallbackGuides);
}

export async function getGuideBySlug(slug: string) {
  const items = await getGuides();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getSportsbooks() {
  if (!isSupabaseConfigured()) {
    return fallbackSportsbooks;
  }

  return safeQuery(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("sportsbooks").select("*").order("name", { ascending: true });

    if (error || !data?.length) {
      return fallbackSportsbooks;
    }

    return (data as DbSportsbook[]).map(mapSportsbook);
  }, fallbackSportsbooks);
}

export async function getSportsbookBySlug(slug: string) {
  const items = await getSportsbooks();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getCourseModules() {
  return fallbackCourseModules as CourseModule[];
}

export async function getFaqs() {
  return fallbackFaqs;
}

export async function getDashboardSavedArticleSlugs() {
  return fallbackSavedArticleSlugs;
}

export async function getDashboardSavedPickIds() {
  return fallbackSavedPickIds;
}

export const contentMetrics = {
  getLedgerTotals,
  getCurrentStreak,
  getSportBreakdown
};
