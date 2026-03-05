import { Panel } from '../Panel';
import { scoreRegion } from '@/analysis/stratum-scoring';
import { ALL_STRATUM_LOCATIONS } from '@/config/stratum-geo';

export class CivilizationalScoringPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-scoring',
      title: '📊 CIVILIZATIONAL SCORING',
      showCount: false
    });
    this.render();
  }

  private render(): void {
    const html = `
      <div class="ib-scoring">
        <div class="ib-scoring-content">
          ${['Mexico', 'Israel', 'India'].map(region => {
            const regionScore = scoreRegion(region, ALL_STRATUM_LOCATIONS);
            return `
              <div class="ib-region-block">
                <div class="ib-region-header">
                  <span class="ib-region-name">${region}</span>
                  <span class="ib-region-overall">${regionScore.overall.toFixed(1)}/10</span>
                </div>
                <div class="ib-lens-bars">
                  ${Object.entries(regionScore.scores).map(([lens, score]) => `
                    <div class="ib-lens-row">
                      <span class="ib-lens-label">${lens.replace(/_/g, ' ')}</span>
                      <div class="ib-lens-bar-container">
                        <div class="ib-lens-bar" style="width: ${score}%; background: hsl(${score * 3.6}, 70%, 50%);"></div>
                      </div>
                      <span class="ib-lens-score">${score.toFixed(1)}</span>
                    </div>
                  `).join('')}
                </div>
                <div class="ib-dominant-lens">
                  🔝 Dominant: ${regionScore.dominantLens.replace(/_/g, ' ')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    this.setContent(html);
  }
}
