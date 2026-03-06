/**
 * Journal Analysis Service
 * Analyzes intelligence notes with Knowledge Base context via Groq
 * Integrates user observations with civilizational framework
 */

import { formatKBContext, getKBForRegion } from './stratum-knowledge-base';

export interface JournalAnalysisResult {
  summary: string;
  lens_insights: Array<{
    lens: string;
    finding: string;
    confidence: number; // 0-1
  }>;
  region_detected: string | null;
  kb_references: string[];
  provider: string;
}

/**
 * Detect region from journal note content
 */
function detectRegionFromNote(note: string): string | null {
  const regions = ['Mexico', 'Israel', 'India', 'Brazil', 'USA'];
  const noteLower = note.toLowerCase();

  for (const region of regions) {
    if (noteLower.includes(region.toLowerCase())) {
      return region;
    }
  }

  return null;
}

/**
 * Analyze journal notes with Groq, optionally with KB context
 */
export async function analyzeJournalWithKB(
  notes: string[],
  region?: string
): Promise<JournalAnalysisResult> {
  if (!notes || notes.length === 0) {
    return getMockAnalysis(null);
  }

  // Auto-detect region if not provided
  const detectedRegion = region || detectRegionFromNote(notes.join(' '));

  // Get knowledge base context if region detected
  let kbContext = '';
  const kbReferences: string[] = [];
  if (detectedRegion) {
    const regionKB = getKBForRegion(detectedRegion);
    kbContext = formatKBContext(detectedRegion);
    kbReferences.push(
      ...Object.keys(regionKB).map(lens => `${detectedRegion} - ${lens}`)
    );
  }

  const notesText = notes.join('\n\n');

  console.log('[JournalAnalysis] Calling Groq with KB context');

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
            content: `You are STRATUM's journal analyst. Analyze intelligence notes through the Six Lenses framework, cross-referenced with knowledge base context.

Return EXACT format:

SUMMARY: [2-3 sentence executive summary]

[Sacred Identity] Finding: [specific insight]
Confidence: [0.0-1.0]

[Demographic] Finding: [specific insight]
Confidence: [0.0-1.0]

[Humiliation] Finding: [specific insight]
Confidence: [0.0-1.0]

[Religious Networks] Finding: [specific insight]
Confidence: [0.0-1.0]

[Civilizational] Finding: [specific insight]
Confidence: [0.0-1.0]

[Cognitive Warfare] Finding: [specific insight]
Confidence: [0.0-1.0]

${kbContext ? `KNOWLEDGE BASE REFERENCES USED:\n${kbContext}\n\n` : ''}`,
          },
          {
            role: 'user',
            content: `Analyze these intelligence observations:\n\n${notesText}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.warn('[JournalAnalysis] Groq error:', response.status);
      return getMockAnalysis(detectedRegion);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.warn('[JournalAnalysis] No content in Groq response');
      return getMockAnalysis(detectedRegion);
    }

    // Parse response
    return parseJournalAnalysis(content, detectedRegion, kbReferences);
  } catch (error) {
    console.warn('[JournalAnalysis] Error calling Groq:', error);
    return getMockAnalysis(detectedRegion);
  }
}

/**
 * Parse Groq response into structured analysis
 */
function parseJournalAnalysis(
  content: string,
  region: string | null,
  kbReferences: string[]
): JournalAnalysisResult {
  // Extract summary
  const summaryMatch = content.match(/SUMMARY:\s*(.+?)(?=\[|$)/i);
  const summary = summaryMatch?.[1]?.trim() || 'Analysis pending';

  // Extract lens findings
  const lensePattern = /\[([^\]]+)\]\s+Finding:\s*(.+?)(?=Confidence:)/gi;
  const confidencePattern = /Confidence:\s*([\d.]+)/gi;

  const lensMatches = Array.from(content.matchAll(lensePattern));
  const confMatches = Array.from(content.matchAll(confidencePattern));

  const lensInsights = lensMatches.map((match, idx) => ({
    lens: match[1]?.trim() || 'Unknown',
    finding: match[2]?.trim() || 'Analysis unavailable',
    confidence: parseFloat(confMatches[idx]?.[1] || '0.5') || 0.5,
  }));

  return {
    summary,
    lens_insights: lensInsights,
    region_detected: region,
    kb_references: kbReferences,
    provider: 'groq',
  };
}

/**
 * Mock analysis when API unavailable
 */
function getMockAnalysis(region: string | null): JournalAnalysisResult {
  return {
    summary: 'Analysis service temporarily unavailable. Observations recorded.',
    lens_insights: [
      {
        lens: 'Sacred Identity',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
      {
        lens: 'Demographic',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
      {
        lens: 'Humiliation',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
      {
        lens: 'Religious Networks',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
      {
        lens: 'Civilizational',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
      {
        lens: 'Cognitive Warfare',
        finding: 'Analysis pending',
        confidence: 0.0,
      },
    ],
    region_detected: region,
    kb_references: [],
    provider: 'mock',
  };
}
