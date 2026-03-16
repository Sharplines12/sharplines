import { articles, guides, sportsbooks } from "@/lib/data";
import { createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export async function syncEditorialContent() {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured for editorial sync.");
  }

  const supabase = createSupabaseServiceClient();

  const articleRows = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    published_at: article.publishedAt,
    reading_time: article.readingTime,
    hero_kicker: article.heroKicker,
    content: article.content
  }));

  const guideRows = guides.map((guide) => ({
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    category: guide.category,
    published_at: guide.publishedAt,
    reading_time: guide.readingTime,
    hero_kicker: guide.heroKicker,
    content: guide.content
  }));

  const sportsbookRows = sportsbooks.map((sportsbook) => ({
    slug: sportsbook.slug,
    name: sportsbook.name,
    featured_offer_text: sportsbook.featuredOfferText,
    summary: sportsbook.summary,
    review_bullets: sportsbook.reviewBullets,
    affiliate_url: sportsbook.affiliateUrl,
    disclaimer: sportsbook.disclaimer,
    overview: sportsbook.overview,
    pros: sportsbook.pros,
    cons: sportsbook.cons,
    user_experience: sportsbook.userExperience,
    markets_offered: sportsbook.marketsOffered,
    payment_methods: sportsbook.paymentMethods,
    best_for: sportsbook.bestFor,
    promo_summary: sportsbook.promoSummary
  }));

  const [{ error: articleError }, { error: guideError }, { error: sportsbookError }] = await Promise.all([
    supabase.from("articles").upsert(articleRows, { onConflict: "slug" }),
    supabase.from("guides").upsert(guideRows, { onConflict: "slug" }),
    supabase.from("sportsbooks").upsert(sportsbookRows, { onConflict: "slug" })
  ]);

  if (articleError) {
    throw articleError;
  }

  if (guideError) {
    throw guideError;
  }

  if (sportsbookError) {
    throw sportsbookError;
  }

  return {
    articles: articleRows.length,
    guides: guideRows.length,
    sportsbooks: sportsbookRows.length
  };
}
