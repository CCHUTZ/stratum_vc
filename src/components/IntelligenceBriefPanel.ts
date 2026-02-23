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
          <div class="ib-alerts-content">
            ${
              ALL_STRATUM_LOCATIONS
                .filter(loc => loc.intensity >= 4)
                .sort((a, b) => b.intensity - a.intensity)
                .slice(0, 5)
                .map(alert => `
                  <div class="ib-alert-item">
                    <div class="ib-alert-header">
                      <span class="ib-alert-name">${alert.name}</span>
                      <span class="ib-alert-intensity" style="background: hsl(${(5-alert.intensity)*12}, 70%, 50%);">
                        🔴 ${alert.intensity}/5
                      </span>
                    </div>
                    <div class="ib-alert-meta">
                      <span class="ib-alert-region">${alert.region}</span>
                      <span class="ib-alert-lens">${alert.primaryLens.replace(/_/g, ' ')}</span>
                    </div>
                    <div class="ib-alert-phase">${alert.predictedPhase || 'Monitoring'}</div>
                  </div>
                `).join('')
            }
          </div>
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
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Active cells / Ideological expansion / Resistance index</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>

        <div class="ib-burning-man">
          <h3>🔥 Burning Man Layer</h3>
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Mystical network activity / Key nodes / Political intersections</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>

        <div class="ib-predictions">
          <h3>🔮 Predictions (30-90 days)</h3>
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Probability-based, per region, per lens</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>

        <div class="ib-map">
          <h3>🗺️ Map — Civilizational Friction Heat Map</h3>
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Sacred sites / Friction zones / Active cells</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>

        <div class="ib-cameras">
          <h3>📹 Live Cameras — Critical Points</h3>
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Western Wall / Ayodhya / Zócalo / Tulum</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>

        <div class="ib-feeds">
          <h3>📰 Feeds — Classified by Narrative</h3>
          <div class="ib-section-placeholder">
            <p class="ib-placeholder-subtitle">Pro-state / Opposition / Religious / Mystical</p>
            <div class="ib-placeholder-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Coming in Phase 5</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setContent(html);
  }
}
