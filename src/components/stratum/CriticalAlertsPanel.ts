import { Panel } from '../Panel';
import { ALL_STRATUM_LOCATIONS } from '@/config/stratum-geo';

export class CriticalAlertsPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-critical-alerts',
      title: '🔴 CRITICAL ALERTS',
      showCount: false
    });
    this.render();
  }

  private render(): void {
    const html = `
      <div class="ib-alerts">
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
    `;

    this.setContent(html);
  }
}
