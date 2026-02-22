import { Panel } from './Panel';
import { scoreRegion } from '@/analysis/stratum-scoring';
import { ALL_STRATUM_LOCATIONS } from '@/config/stratum-geo';

export class IntelligenceBriefPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-civilizational',
      title: '◈ STRATUM INTELLIGENCE BRIEF',
      showCount: false
    });
    this.render();
  }

  private render(): void {
    const html = `
      <div class="intelligence-brief-container">
        <div class="ib-alerts">
          <h3>🔴 Critical Alerts (24h)</h3>
          <div class="ib-alerts-content">Priority events with civilizational scoring</div>
        </div>

        <div class="ib-scoring">
          <h3>📊 Civilizational Scoring</h3>
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

        <div class="ib-jihad">
          <h3>🎯 Jihad Observatory</h3>
          <div class="ib-jihad-content">Active cells / Ideological expansion / Resistance index</div>
        </div>

        <div class="ib-burning-man">
          <h3>🔥 Burning Man Layer</h3>
          <div class="ib-burning-man-content">Mystical network activity / Key nodes / Political intersections</div>
        </div>

        <div class="ib-predictions">
          <h3>🔮 Predictions (30-90 days)</h3>
          <div class="ib-predictions-content">Probability-based, per region, per lens</div>
        </div>

        <div class="ib-map">
          <h3>🗺️ Map — Civilizational Friction Heat Map</h3>
          <div class="ib-map-content">Sacred sites / Friction zones / Active cells</div>
        </div>

        <div class="ib-cameras">
          <h3>📹 Live Cameras — Critical Points</h3>
          <div class="ib-cameras-content">Western Wall / Ayodhya / Zócalo / Tulum</div>
        </div>

        <div class="ib-feeds">
          <h3>📰 Feeds — Classified by Narrative</h3>
          <div class="ib-feeds-content">Pro-state / Opposition / Religious / Mystical</div>
        </div>
      </div>
    `;

    this.setContent(html);
  }
}
