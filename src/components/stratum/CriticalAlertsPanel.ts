import { Panel } from '../Panel';
import { getStratumAlerts, type StratumAlert } from '@/services/stratum-data-pipeline';
import { StratumModal } from './StratumModal';

export class CriticalAlertsPanel extends Panel {
  private modal: StratumModal;

  constructor() {
    super({
      id: 'stratum-critical-alerts',
      title: '🔴 CRITICAL ALERTS',
      showCount: false,
    });
    this.modal = new StratumModal();
    this.renderWithData();
  }

  private async renderWithData(): Promise<void> {
    // Show loading state while fetching
    this.setContent(`
      <div class="ib-alerts">
        <div class="ib-alerts-content" style="text-align: center; padding: 20px; color: var(--text-dim);">
          <div style="font-size: 12px;">Fetching real-time alerts from GDELT + RSS...</div>
        </div>
      </div>
    `);

    try {
      const alerts = await getStratumAlerts();

      if (alerts.length === 0) {
        this.setContent(`
          <div class="ib-alerts">
            <div class="ib-alerts-content" style="padding: 20px; color: var(--text-dim); text-align: center;">
              <div style="font-size: 12px;">No critical alerts detected at this time.</div>
            </div>
          </div>
        `);
        return;
      }

      this.render(alerts.slice(0, 5));
    } catch (error) {
      console.error('[CriticalAlertsPanel] Failed to fetch alerts:', error);
      this.setContent(`
        <div class="ib-alerts">
          <div class="ib-alerts-content" style="padding: 20px; color: #ff6b6b;">
            <div style="font-size: 12px;">Error loading alerts. Retrying...</div>
          </div>
        </div>
      `);

      // Retry after 10 seconds
      setTimeout(() => this.renderWithData(), 10000);
    }
  }

  private render(alerts: StratumAlert[]): void {
    const html = `
      <div class="ib-alerts">
        <div class="ib-alerts-content">
          ${alerts
            .map(
              (alert, idx) => `
                <div class="ib-alert-item" data-alert-index="${idx}" style="cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='var(--surface-hover)'" onmouseout="this.style.background=''">
                  <div class="ib-alert-header">
                    <span class="ib-alert-name">${this.escapeHtml(alert.name)}</span>
                    <span class="ib-alert-intensity" style="background: hsl(${(5 - alert.intensity) * 12}, 70%, 50%);">
                      🔴 ${alert.intensity}/5
                    </span>
                  </div>
                  <div class="ib-alert-meta">
                    <span class="ib-alert-region">${this.escapeHtml(alert.region)}</span>
                    <span class="ib-alert-lens">${this.escapeHtml(alert.primaryLens)}</span>
                  </div>
                  <div class="ib-alert-phase">${this.escapeHtml(alert.predictedPhase || 'Monitoring')}</div>
                  ${
                    alert.sources.length > 0
                      ? `<div class="ib-alert-sources" style="margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border-subtle); font-size: 10px; color: var(--text-secondary);">
                          ${alert.sources.length} sources | click for details
                        </div>`
                      : ''
                  }
                </div>
              `
            )
            .join('')}
        </div>
      </div>
    `;

    this.setContent(html);
    this.attachEventListeners(alerts);
  }

  private attachEventListeners(alerts: StratumAlert[]): void {
    setTimeout(() => {
      const items = this.element?.querySelectorAll('[data-alert-index]');
      if (!items) return;

      items.forEach((item) => {
        const idx = parseInt((item as HTMLElement).dataset.alertIndex || '0');
        const alert = alerts[idx];
        if (!alert) return;

        item.addEventListener('click', () => {
          this.showAlertModal(alert);
        });
      });
    }, 150);
  }

  private showAlertModal(alert: StratumAlert): void {
    const sourcesHtml = alert.sources
      .map(
        source => `
          <div class="modal-source-item">
            <div class="modal-source-title">${this.escapeHtml(source.title)}</div>
            <div class="modal-source-meta">
              <span>${this.escapeHtml(source.source)}</span>
              <span>${this.timeAgo(new Date(source.date))}</span>
              ${source.tone !== undefined ? `<span>Tone: ${source.tone.toFixed(1)}</span>` : ''}
            </div>
            <a href="${source.url}" target="_blank" rel="noopener" class="modal-source-link">
              Read article →
            </a>
          </div>
        `
      )
      .join('');

    const modalHtml = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
          <strong>Region:</strong> ${this.escapeHtml(alert.region)}<br>
          <strong>Primary Lens:</strong> ${this.escapeHtml(alert.primaryLens)}<br>
          <strong>Intensity:</strong> ${alert.intensity}/5<br>
          <strong>Phase:</strong> ${this.escapeHtml(alert.predictedPhase || 'Monitoring')}<br>
          <strong>Updated:</strong> ${this.timeAgo(alert.lastUpdated)}
        </div>
      </div>
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
        <strong style="color: var(--accent);">Description:</strong>
        <div style="margin-top: 8px; color: var(--text-secondary);">
          ${this.escapeHtml(alert.description)}
        </div>
      </div>
      <div>
        <strong style="color: var(--accent);">Sources (${alert.sources.length}):</strong>
        <div class="modal-sources-list" style="margin-top: 12px;">
          ${sourcesHtml}
        </div>
      </div>
    `;

    this.modal.setContent(modalHtml, `ALERT: ${alert.name}`);
    this.modal.open();
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

  private timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
