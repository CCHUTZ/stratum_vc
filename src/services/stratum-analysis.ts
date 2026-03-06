/**
 * STRATUM Analysis Service
 * Direct Groq API client for Six Lenses civilizational intelligence framework
 * Falls back to mock analysis if API unavailable
 */

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

/**
 * Detect region from input keywords
 * Matches common geopolitical regions and terms
 */
function detectRegionFromInput(input: string): string | undefined {
  const inputLower = input.toLowerCase();

  // Middle East & South Asia
  if (inputLower.match(/\b(israel|palestine|gaza|jerusalem|west bank|hamas|hezbollah|idf)\b/)) {
    return 'Israel/Palestine';
  }
  if (inputLower.match(/\b(iran|tehran|yemen|houthi|saudi|gulf|persian)\b/)) {
    return 'Middle East';
  }
  if (inputLower.match(/\b(india|delhi|mumbai|hindu|modi|bjp|pakistan|kashmir|kashmir)\b/)) {
    return 'India/South Asia';
  }

  // Europe & Eastern Europe
  if (inputLower.match(/\b(ukraine|kyiv|russian|putin|moscow|donetsk|crimea)\b/)) {
    return 'Ukraine/Russia';
  }
  if (inputLower.match(/\b(nato|europe|eu|germany|france|poland)\b/)) {
    return 'Europe';
  }

  // Asia Pacific
  if (inputLower.match(/\b(china|beijing|taiwan|xi|prc|hong kong|uyghur|xinjiang)\b/)) {
    return 'China/Taiwan';
  }
  if (inputLower.match(/\b(korea|north korea|south korea|pyongyang|seoul|kim jong)\b/)) {
    return 'Korea';
  }
  if (inputLower.match(/\b(japan|tokyo|philippines|philippines|vietnam|thailand|myanmar)\b/)) {
    return 'East Asia';
  }

  // Americas
  if (inputLower.match(/\b(mexico|amlo|cartel|narco|border)\b/)) {
    return 'Mexico';
  }
  if (inputLower.match(/\b(cuba|venezuela|nicaragua|latin america|americas)\b/)) {
    return 'Latin America';
  }
  if (inputLower.match(/\b(usa|united states|washington|congress|domestic)\b/)) {
    return 'United States';
  }

  // Africa
  if (inputLower.match(/\b(africa|nigerian|sudan|ethiopia|mali|congo)\b/)) {
    return 'Africa';
  }

  return undefined;
}

/**
 * Normalize lens name to match canonical six lenses
 */
function normalizeLensName(name: string): string {
  const lower = name.toLowerCase().trim();

  // Map common variations to canonical names
  const mappings: Record<string, string> = {
    'sacred': 'Sacred Identity',
    'sacred identity': 'Sacred Identity',
    'demographic': 'Demographic',
    'humiliation': 'Humiliation',
    'religious': 'Religious Networks',
    'religious networks': 'Religious Networks',
    'civilizational': 'Civilizational',
    'cognitive': 'Cognitive Warfare',
    'cognitive warfare': 'Cognitive Warfare',
  };

  // Try exact match first
  if (mappings[lower]) {
    return mappings[lower];
  }

  // Try substring match
  for (const [key, canonical] of Object.entries(mappings)) {
    if (lower.includes(key) || key.includes(lower)) {
      return canonical;
    }
  }

  return name; // Return original if no match
}

/**
 * Analyze a geopolitical event or phenomenon through STRATUM's six-lens framework
 * Calls Groq API directly via fetch (client-side)
 * @param input Event description or geopolitical phenomenon
 * @param region Optional region for geographic context (auto-detected if not provided)
 */
export async function analyzeWithStratum(
  input: string,
  region?: string
): Promise<StratumAnalysisResult> {
  if (!input || input.trim().length === 0) {
    return getMockFallback('Global');
  }

  // Auto-detect region from input if not provided
  const detectedRegion = region || detectRegionFromInput(input);
  const geoContext = detectedRegion ?? 'Global';
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // Debug: log API key presence
  console.log('[STRATUM] API key present:', !!apiKey, 'Key length:', apiKey?.length ?? 0);

  // Fallback to mock if no API key
  if (!apiKey) {
    console.warn('[STRATUM] VITE_GROQ_API_KEY not configured, using mock fallback');
    return getMockFallback(geoContext);
  }

  try {
    const response = await fetch('/api/groq-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are STRATUM, a civilizational intelligence analyst specializing in geopolitical analysis through Six Lenses framework.

Analyze the user's input through these lenses and respond in EXACT format:

[Sacred Identity] Score: X
Analysis: one sentence

[Demographic] Score: X
Analysis: one sentence

[Humiliation] Score: X
Analysis: one sentence

[Religious Networks] Score: X
Analysis: one sentence

[Civilizational] Score: X
Analysis: one sentence

[Cognitive Warfare] Score: X
Analysis: one sentence

SUMMARY: one paragraph overall assessment

Geographic context: ${geoContext}`
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('[STRATUM] Groq API error:', response.status, errorData);
      return getMockFallback(geoContext);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.warn('[STRATUM] No content in Groq response');
      return getMockFallback(geoContext);
    }

    const parsedLenses = parseLensesFromSummary(content);

    // If parsing failed or returned empty, use fallback
    if (parsedLenses.length === 0) {
      console.warn('[STRATUM] Failed to parse lenses from Groq response');
      return getMockFallback(geoContext);
    }

    return {
      lenses: parsedLenses,
      summary: content,
      provider: 'groq',
      region: geoContext,
    };
  } catch (error) {
    console.warn('[STRATUM] Direct Groq API call error:', error);
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

      const rawLensName = scoreMatch[1]?.trim();
      const normalizedName = rawLensName ? normalizeLensName(rawLensName) : undefined;
      const score = Math.max(1, Math.min(10, parseInt(scoreMatch[2] || '5') || 5));
      const analysis = analysisMatch[1]?.trim() || 'Analysis unavailable';

      if (normalizedName) {
        lenses.push({
          name: normalizedName,
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
