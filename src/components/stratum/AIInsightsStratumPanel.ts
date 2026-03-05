import { Panel } from '../Panel';

export class AIInsightsStratumPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-ai-insights',
      title: '🔮 AI INSIGHTS',
      showCount: false
    });
    this.render();
  }

  private render(): void {
    const html = `
      <div class="ib-ai-insights">
        <div class="ib-predictions">
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

        <div class="ib-burning-man">
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

        <div class="ib-map">
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
