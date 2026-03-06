import { Panel } from '../Panel';
import { generateRegionInsights, type StratumInsight } from '@/services/stratum-data-pipeline';

export class AIInsightsStratumPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-ai-insights',
      title: '🔮 AI INSIGHTS',
      showCount: false,
    });
    this.renderWithData();
  }

  private async renderWithData(): Promise<void> {
    // Show loading state
    this.setContent(`
      <div class="ib-ai-insights">
        <div style="padding: 20px; text-align: center; color: var(--text-dim);">
          <div style="font-size: 12px;">Analyzing intelligence across friction zones...</div>
        </div>
      </div>
    `);

    try {
      // Analyze key regions
      const regions = [
        'Israel/Palestine',
        'Middle East',
        'South Asia',
        'China/Taiwan',
        'Ukraine/Russia',
      ];

      const allInsights: Map<string, StratumInsight[]> = new Map();

      for (const region of regions) {
        try {
          const insights = await generateRegionInsights(region);
          if (insights.length > 0) {
            allInsights.set(region, insights);
          }
        } catch (error) {
          console.warn(`[AIInsightsPanel] Failed to fetch insights for ${region}:`, error);
        }
      }

      if (allInsights.size === 0) {
        this.setContent(`
          <div class="ib-ai-insights">
            <div style="padding: 20px; color: var(--text-dim); text-align: center;">
              <div style="font-size: 12px;">No insights available. Check API configuration.</div>
            </div>
          </div>
        `);
        return;
      }

      this.render(allInsights);
    } catch (error) {
      console.error('[AIInsightsPanel] Failed to load insights:', error);
      this.setContent(`
        <div class="ib-ai-insights">
          <div style="padding: 20px; color: #ff6b6b;">
            <div style="font-size: 12px;">Error loading insights.</div>
          </div>
        </div>
      `);
    }
  }

  private render(insights: Map<string, StratumInsight[]>): void {
    const html = `
      <div class="ib-ai-insights" style="display: flex; flex-direction: column; gap: 16px; padding: 12px;">
        ${Array.from(insights.entries())
          .map(
            ([region, regionInsights]) => `
          <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="font-weight: bold; color: var(--accent); font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">
              📍 ${this.escapeHtml(region)}
            </div>
            ${regionInsights
              .slice(0, 3)
              .map(
                insight => `
              <div style="margin-bottom: 10px; padding: 8px; background: var(--surface); border-radius: 3px; border-left: 3px solid ${this.sentimentColor(insight.sentiment)};">
                <div style="font-size: 11px; font-weight: bold; color: var(--text); margin-bottom: 4px;">
                  ${this.escapeHtml(insight.topic)}
                  <span style="color: var(--text-secondary); font-weight: normal; margin-left: 6px;">
                    ${this.sentimentBadge(insight.sentiment)}
                  </span>
                </div>
                <div style="font-size: 10px; color: var(--text-secondary); line-height: 1.4;">
                  ${insight.articles.length} articles | Keywords: ${Object.keys(insight.keywordMentions).slice(0, 2).join(', ')}
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `
          )
          .join('')}
      </div>
    `;

    this.setContent(html);
  }

  private sentimentColor(sentiment: number): string {
    if (sentiment < -0.5) return '#ff6b6b'; // Negative - red
    if (sentiment < -0.2) return '#ffa940'; // Slightly negative - orange
    if (sentiment < 0.2) return '#ffd666'; // Neutral - yellow
    return '#4a9eff'; // Positive - blue
  }

  private sentimentBadge(sentiment: number): string {
    if (sentiment < -0.5) return '🔴 Tense';
    if (sentiment < -0.2) return '🟠 Concerned';
    if (sentiment < 0.2) return '🟡 Neutral';
    return '🟢 Stable';
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, char => map[char] || char);
  }
}
