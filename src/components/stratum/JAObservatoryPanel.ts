import { Panel } from '../Panel';

export class JAObservatoryPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-ja-observatory',
      title: '🎯 J&A OBSERVATORY',
      showCount: false
    });
    this.render();
  }

  private render(): void {
    const html = `
      <div class="ib-jihad">
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
    `;

    this.setContent(html);
  }
}
