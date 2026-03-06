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
 * Analyze a geopolitical event or phenomenon through STRATUM's six-lens framework
 * Calls Groq API directly via fetch (client-side)
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

  const geoContext = region ?? 'Global';
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // Fallback to mock if no API key
  if (!apiKey) {
    console.warn('[STRATUM] VITE_GROQ_API_KEY not configured, using mock fallback');
    return getMockFallback(geoContext);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
