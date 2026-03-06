/**
 * STRATUM Analysis Service
 * Leverages generateSummary with multi-lens framework for civilizational intelligence
 * Falls back to mock analysis if API unavailable
 */

import { generateSummary } from './summarization';

export interface StratumLensResult {
  name: string;
  score: number;
  analysis: string;
}

export interface StratumAnalysisResult {
  lenses: StratumLensResult[];
  summary: string;
  provider: string;
  region?: string;
}

const LENSES = [
  'Sacred Identity',
  'Demographic',
  'Humiliation',
  'Religious Networks',
  'Civilizational',
  'Cognitive Warfare'
];

const LENSES_SYSTEM_PROMPT = `Analyze through Six Lenses of civilizational intelligence:

1. Sacred Identity — religious/sacred sites, identity markers (score 1-10)
2. Demographic — population dynamics, migration, ethnic composition (score 1-10)
3. Humiliation — historical grievances, trauma narratives (score 1-10)
4. Religious Networks — transnational religious coordination (score 1-10)
5. Civilizational — inter-civilizational friction and clash (score 1-10)
6. Cognitive Warfare — narrative control, information warfare (score 1-10)

Return scores and 1-sentence analysis per lens in this format:
[LENS_NAME] Score: [1-10]
Analysis: [1-sentence insight]`;

/**
 * Analyze a geopolitical event or phenomenon through STRATUM's six-lens framework
 * @param input Event description or geopolitical phenomenon
 * @param region Optional region for geographic context (default: 'Global')
 */
export async function analyzeWithStratum(
  input: string,
  region?: string
): Promise<StratumAnalysisResult> {
  if (!input || input.trim().length === 0) {
    return getMockFallback('Global');
  }

  const headlines = [input, LENSES_SYSTEM_PROMPT];
  const geoContext = region ?? 'Global';

  try {
    const result = await generateSummary(headlines, undefined, geoContext, 'en');

    if (!result) {
      console.warn('[STRATUM] generateSummary returned null, using fallback');
      return getMockFallback(geoContext);
    }

    const parsedLenses = parseLensesFromSummary(result.summary);

    // If parsing failed or returned empty, use fallback
    if (parsedLenses.length === 0) {
      console.warn('[STRATUM] Failed to parse lenses from summary, using fallback');
      return getMockFallback(geoContext);
    }

    return {
      lenses: parsedLenses,
      summary: result.summary,
      provider: result.provider,
      region: geoContext,
    };
  } catch (error) {
    console.warn('[STRATUM] analyzeWithStratum error:', error);
    return getMockFallback(geoContext);
  }
}

/**
 * Parse lens scores and analysis from the LLM summary response
 * Expects format:
 * [LENS_NAME] Score: [1-10]
 * Analysis: [1-sentence]
 */
function parseLensesFromSummary(summary: string): StratumLensResult[] {
  const lenses: StratumLensResult[] = [];

  try {
    // Try to match patterns like "[Sacred Identity] Score: 7\nAnalysis: ..."
    const lensPattern = /\[?([^[\]]+)\]?\s*Score:\s*(\d+)/gi;
    const analysisPattern = /Analysis:\s*([^\n]+)/gi;

    const scoreMatches = Array.from(summary.matchAll(lensPattern));
    const analysisMatches = Array.from(summary.matchAll(analysisPattern));

    // Match each lens with its analysis
    for (let i = 0; i < scoreMatches.length && i < analysisMatches.length; i++) {
      const scoreMatch = scoreMatches[i];
      const analysisMatch = analysisMatches[i];
      if (!scoreMatch || !analysisMatch) continue;

      const lensName = scoreMatch[1]?.trim();
      const score = Math.max(1, Math.min(10, parseInt(scoreMatch[2] || '5') || 5));
      const analysis = analysisMatch[1]?.trim() || 'Analysis unavailable';

      if (lensName) {
        lenses.push({
          name: lensName,
          score,
          analysis,
        });
      }
    }

    // If we got some lenses but not all 6, fill with mock
    if (lenses.length > 0 && lenses.length < 6) {
      const existingNames = lenses.map(l => l.name.toLowerCase());
      for (const defaultLens of LENSES) {
        if (!existingNames.includes(defaultLens.toLowerCase())) {
          lenses.push({
            name: defaultLens,
            score: 5,
            analysis: 'Analysis incomplete — partial API response',
          });
        }
      }
    }

    return lenses;
  } catch (error) {
    console.warn('[STRATUM] parseLensesFromSummary error:', error);
    return [];
  }
}

/**
 * Mock fallback when API is unavailable
 */
function getMockFallback(region: string): StratumAnalysisResult {
  return {
    lenses: LENSES.map(name => ({
      name,
      score: 5,
      analysis: 'Analysis pending — API unavailable',
    })),
    summary: 'STRATUM analysis service unavailable. Displaying baseline assessment.',
    provider: 'mock',
    region,
  };
}
