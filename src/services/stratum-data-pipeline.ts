/**
 * STRATUM Hybrid Data Pipeline
 * Merges GDELT Intelligence + RSS Feeds with region/topic correlation
 * Provides dynamic, cross-referenced intelligence for CriticalAlerts & AIInsights panels
 */

import { fetchGdeltArticles, type GdeltArticle } from './gdelt-intel';
import { fetchCategoryFeeds } from './news';
import { FEEDS } from '@/config/feeds';
import { FRICTION_ZONES, type StratumLocation } from '@/config/stratum-geo';
import type { NewsItem } from '@/types';

export interface StratumAlert {
  id: string;
  name: string;
  region: string;
  primaryLens: string;
  intensity: number; // 1-5, derived from article count & GDELT tone
  description: string;
  sources: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
    tone?: number;
  }>;
  predictedPhase?: string;
  lastUpdated: Date;
}

export interface StratumInsight {
  region: string;
  topic: string;
  articles: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
    relevanceScore: number; // 0-1
  }>;
  sentiment: number; // -1 to 1 (tone from GDELT)
  keywordMentions: Record<string, number>;
  lastUpdated: Date;
}

// Regional feed mappings for STRATUM zones
const REGION_FEED_MAP: Record<string, string[]> = {
  'Israel/Palestine': ['middleeast'],
  'Middle East': ['middleeast'],
  'South Asia': ['asia'],
  'Central Asia': ['asia', 'middleeast'],
  'Mexico': ['latam'],
  'Ukraine/Russia': ['politics'],
  'China/Taiwan': ['asia'],
  'Africa': ['africa'],
  'Europe': ['politics'],
};

/**
 * Calculate intensity (1-5) based on article count and GDELT tone
 * More articles + negative tone = higher intensity
 */
function calculateIntensity(
  articleCount: number,
  averageTone: number
): 1 | 2 | 3 | 4 | 5 {
  // Negative tone indicates conflict/crisis
  const toneScore = averageTone < -5 ? 2 : averageTone < 0 ? 1 : 0;

  // Article frequency score
  let frequencyScore = 0;
  if (articleCount >= 20) frequencyScore = 2;
  else if (articleCount >= 10) frequencyScore = 1.5;
  else if (articleCount >= 5) frequencyScore = 1;

  const combinedScore = toneScore + frequencyScore;
  if (combinedScore >= 4) return 5;
  if (combinedScore >= 3) return 4;
  if (combinedScore >= 2) return 3;
  if (combinedScore >= 1) return 2;
  return 1;
}

/**
 * Fetch GDELT articles for a region's keywords
 */
async function fetchRegionGdeltData(
  friction: StratumLocation
): Promise<GdeltArticle[]> {
  try {
    // Use friction zone name as primary query term
    const name = friction.name || 'Global';
    const query: string = (name.split(' / ')[0] || '').trim(); // e.g., "Jerusalem" from "Jerusalem / Al-Quds"
    if (!query) return [];
    return await fetchGdeltArticles(query, 15, '48h');
  } catch (error) {
    const name = friction.name || 'Unknown';
    console.warn(`[StratumPipeline] GDELT fetch failed for ${name}:`, error);
    return [];
  }
}

/**
 * Fetch RSS feeds for a region
 */
async function fetchRegionRssData(region: string): Promise<NewsItem[]> {
  try {
    const feedCategories = REGION_FEED_MAP[region] || ['politics'];
    const regionFeeds = feedCategories.flatMap(cat => FEEDS[cat] || []);

    if (regionFeeds.length === 0) return [];

    const items = await fetchCategoryFeeds(regionFeeds, { batchSize: 5 });
    return items;
  } catch (error) {
    console.warn(`[StratumPipeline] RSS fetch failed for ${region}:`, error);
    return [];
  }
}

/**
 * Combine and deduplicate GDELT + RSS articles
 */
function mergeArticles(
  gdelt: GdeltArticle[],
  rss: NewsItem[]
): Array<{ title: string; source: string; date: string; url: string; tone?: number }> {
  const seen = new Set<string>();
  const combined: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
    tone?: number;
  }> = [];

  // Add GDELT articles (higher priority)
  for (const article of gdelt) {
    const key = article.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push({
        title: article.title,
        source: article.source,
        date: article.date,
        url: article.url,
        tone: article.tone,
      });
    }
  }

  // Add RSS items (if not already in GDELT)
  for (const item of rss) {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push({
        title: item.title,
        source: item.source,
        date: item.pubDate.toISOString(),
        url: item.link,
      });
    }
  }

  return combined.slice(0, 10); // Top 10 articles per region
}

/**
 * Generate real alerts from GDELT + RSS data
 */
export async function generateStratumAlerts(): Promise<StratumAlert[]> {
  const alerts: StratumAlert[] = [];
  const cacheMap = new Map<string, StratumAlert>();

  try {
    // Fetch data for each friction zone in parallel
    const promises = FRICTION_ZONES.map(async friction => {
      const [gdeltData, rssData] = await Promise.all([
        fetchRegionGdeltData(friction),
        fetchRegionRssData(friction.region),
      ]);

      if (gdeltData.length === 0 && rssData.length === 0) {
        return null;
      }

      const articles = mergeArticles(gdeltData, rssData);
      const averageTone =
        gdeltData.length > 0
          ? gdeltData.reduce((sum, a) => sum + (a.tone || 0), 0) / gdeltData.length
          : 0;

      const intensity = calculateIntensity(articles.length, averageTone);

      return {
        id: friction.id,
        name: friction.name,
        region: friction.region,
        primaryLens: friction.primaryLens.replace(/_/g, ' '),
        intensity,
        description: friction.description,
        sources: articles,
        predictedPhase: friction.predictedPhase,
        lastUpdated: new Date(),
      } as StratumAlert;
    });

    const results = await Promise.all(promises);

    // Filter nulls and sort by intensity
    for (const result of results) {
      if (result && !cacheMap.has(result.id)) {
        cacheMap.set(result.id, result);
      }
    }

    // Return top 10 by intensity
    alerts.push(...Array.from(cacheMap.values()));
    alerts.sort((a, b) => b.intensity - a.intensity);

    return alerts.slice(0, 10);
  } catch (error) {
    console.error('[StratumPipeline] generateStratumAlerts error:', error);
    // Return fallback: friction zones with no articles (generic alerts)
    return FRICTION_ZONES.filter(f => f.intensity >= 4)
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 5)
      .map(f => ({
        id: f.id,
        name: f.name,
        region: f.region,
        primaryLens: f.primaryLens.replace(/_/g, ' '),
        intensity: f.intensity,
        description: f.description,
        sources: [],
        predictedPhase: f.predictedPhase,
        lastUpdated: new Date(),
      }));
  }
}

/**
 * Generate insights for a specific region
 */
export async function generateRegionInsights(
  region: string
): Promise<StratumInsight[]> {
  const insights: StratumInsight[] = [];

  try {
    // Fetch GDELT topics for this region
    const topics = [
      { id: 'military', name: 'Military Activity' },
      { id: 'cyber', name: 'Cyber Threats' },
      { id: 'sanctions', name: 'Sanctions' },
      { id: 'intelligence', name: 'Intelligence Operations' },
    ];

    for (const topic of topics) {
      try {
        // Combine region context with topic query
        const query = `(${region.toLowerCase().replace('/', ' OR ')}) AND ${topic.id}`;
        const articles = await fetchGdeltArticles(query, 8, '24h');

        if (articles.length === 0) continue;

        // Extract keywords and count mentions
        const keywords: Record<string, number> = {};
        const words = region
          .toLowerCase()
          .split(/[\s/]+/)
          .filter(w => w.length > 3);

        for (const article of articles) {
          for (const word of words) {
            if (article.title.toLowerCase().includes(word)) {
              keywords[word] = (keywords[word] || 0) + 1;
            }
          }
        }

        const sentiment =
          articles.reduce((sum, a) => sum + (a.tone || 0), 0) / articles.length;

        insights.push({
          region,
          topic: topic.name,
          articles: articles.map(a => ({
            title: a.title,
            source: a.source,
            date: a.date,
            url: a.url,
            relevanceScore: 0.8, // Default high relevance
          })),
          sentiment: Math.max(-1, Math.min(1, sentiment / 10)),
          keywordMentions: keywords,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.warn(
          `[StratumPipeline] Topic insight failed for ${region}/${topic.id}:`,
          error
        );
      }
    }

    return insights;
  } catch (error) {
    console.error('[StratumPipeline] generateRegionInsights error:', error);
    return [];
  }
}

/**
 * Cache layer with 5-minute TTL
 */
const alertsCache = { data: null as StratumAlert[] | null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getStratumAlerts(forceRefresh = false): Promise<StratumAlert[]> {
  const now = Date.now();

  if (!forceRefresh && alertsCache.data && now - alertsCache.timestamp < CACHE_TTL) {
    return alertsCache.data;
  }

  const alerts = await generateStratumAlerts();
  alertsCache.data = alerts;
  alertsCache.timestamp = now;

  return alerts;
}
