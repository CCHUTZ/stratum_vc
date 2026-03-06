import { Panel } from '../Panel';
import { scoreRegion } from '@/analysis/stratum-scoring';
import { ALL_STRATUM_LOCATIONS } from '@/config/stratum-geo';
import { StratumModal } from './StratumModal';

export class CivilizationalScoringPanel extends Panel {
  private modal: StratumModal;
  private regions: string[] = [];

  constructor() {
    super({
      id: 'stratum-scoring',
      title: '📊 CIVILIZATIONAL SCORING',
      showCount: false,
    });
    this.modal = new StratumModal();
    this.render();
  }

  private render(): void {
    this.regions = ['Mexico', 'Israel', 'India', 'Brazil', 'USA'];
    const emojis: Record<string, string> = {
      Mexico: '🇲🇽',
      Israel: '🇮🇱',
      India: '🇮🇳',
      Brazil: '🇧🇷',
      USA: '🇺🇸',
    };

    const countriesHtml = this.regions
      .map((region, idx) => {
        const regionScore = scoreRegion(region, ALL_STRATUM_LOCATIONS);
        const dominant = regionScore.dominantLens.replace(/_/g, ' ').toLowerCase();
        const score = regionScore.overall.toFixed(1);
        const scoreNum = parseFloat(score);

        // Border color dinámico por score: rojo (bajo) → amarillo (medio) → verde (alto)
        const borderColor =
          scoreNum < 4 ? '#ff6b6b' : scoreNum < 6 ? '#ffa940' : '#00ff88';

        return `
          <div class="cs-country" data-region-index="${idx}" style="border-left-color: ${borderColor}; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='var(--surface-hover)'" onmouseout="this.style.background=''">
            <span class="cs-name">${emojis[region]} ${region}</span>
            <span class="cs-score">${score}</span>
            <span class="cs-dominant">${dominant}</span>
          </div>
        `;
      })
      .join('');

    const html = `
      <div class="cs-panel">
        <div class="cs-content">
          ${countriesHtml}
        </div>
        <button class="cs-recalc-btn" id="csRecalcBtn">🔄 RECALCULATE</button>
      </div>
    `;

    this.setContent(html);
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    setTimeout(() => {
      console.log('[CivilizationalScoringPanel] Attaching event listeners');

      // Region click handlers
      const regionItems = this.element?.querySelectorAll('[data-region-index]');
      console.log('[CivilizationalScoringPanel] Found region items:', regionItems?.length);

      if (!regionItems || regionItems.length === 0) {
        console.warn('[CivilizationalScoringPanel] No region items found, retrying in 100ms');
        setTimeout(() => this.attachEventListeners(), 100);
        return;
      }

      regionItems.forEach((item) => {
        const idx = parseInt((item as HTMLElement).dataset.regionIndex || '0');
        const region = this.regions[idx];
        if (region) {
          item.addEventListener('click', () => {
            console.log('[CivilizationalScoringPanel] Region clicked:', region);
            this.showRegionModal(region);
          });
        }
      });
      console.log('[CivilizationalScoringPanel] Region listeners attached');

      // Recalculate button
      const btn = this.element?.querySelector('#csRecalcBtn') as HTMLButtonElement;
      if (btn) {
        btn.addEventListener('click', () => {
          console.log('[CivilizationalScoringPanel] Recalculate clicked');
          btn.textContent = '⏳ RECALCULATING...';
          btn.disabled = true;

          setTimeout(() => {
            this.render();
          }, 500);
        });
        console.log('[CivilizationalScoringPanel] Recalculate button listener attached');
      }
    }, 200);
  }

  private showRegionModal(region: string): void {
    const regionScore = scoreRegion(region, ALL_STRATUM_LOCATIONS);

    const lensNames: Record<string, string> = {
      sacred_identity: 'Sacred Identity',
      demographic: 'Demographic',
      humiliation: 'Humiliation',
      religious_networks: 'Religious Networks',
      civilizational: 'Civilizational',
      cognitive_warfare: 'Cognitive Warfare',
    };

    const lensesHtml = Object.entries(regionScore.scores)
      .map(([key, score]) => {
        const name = lensNames[key] || key;
        const color = score > 6 ? '#00ff88' : score > 4 ? '#ffa940' : '#ff6b6b';
        return `
          <div class="modal-lens-card">
            <div class="modal-lens-name">${name}</div>
            <div class="modal-lens-score" style="color: ${color};">${score.toFixed(1)}</div>
            <div class="modal-lens-analysis">
              ${this.getLensDescription(key)}
            </div>
          </div>
        `;
      })
      .join('');

    const modalHtml = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
          <strong>Region:</strong> ${region}<br>
          <strong>Overall Score:</strong> ${regionScore.overall.toFixed(1)}/10<br>
          <strong>Dominant Lens:</strong> ${lensNames[regionScore.dominantLens] || regionScore.dominantLens}
        </div>
      </div>
      <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
        <strong style="color: var(--accent);">Six-Lens Breakdown:</strong>
        <div class="modal-lenses-grid">
          ${lensesHtml}
        </div>
      </div>
      <div>
        <strong style="color: var(--accent);">Regional Friction Points:</strong>
        <div style="margin-top: 12px; font-size: 10px; color: var(--text-secondary); line-height: 1.6;">
          ${this.getRegionalContext(region)}
        </div>
      </div>
    `;

    this.modal.setContent(modalHtml, `${region.toUpperCase()} - CIVILIZATIONAL ANALYSIS`);
    this.modal.open();
  }

  private getLensDescription(lensKey: string): string {
    const descriptions: Record<string, string> = {
      sacred_identity: 'Religious/sacred sites and identity markers prominence in the region',
      demographic: 'Population dynamics, migration patterns, and ethnic composition shifts',
      humiliation: 'Historical grievances, traumas, and collective memory of humiliation',
      religious_networks: 'Transnational religious structures and inter-faith tensions',
      civilizational: 'Friction with other civilizations and civilizational identity',
      cognitive_warfare: 'Narrative control, information warfare, and media dominance',
    };
    return descriptions[lensKey] || 'Analysis data';
  }

  private getRegionalContext(region: string): string {
    const contexts: Record<string, string> = {
      Mexico: 'Narco-state dynamics, border security, migration pressures, cartel competition for US markets',
      Israel: 'Sacred sites (Jerusalem), Palestinian tensions, US-Arab alignment, nuclear capability',
      India: 'Hindu nationalism, Kashmir conflict, Pakistan tensions, demographic weight (1.4B), nuclear power',
      Brazil: 'Regional hegemon, BRICS alignment, Amazon sovereignty, Portuguese identity in Americas',
      USA: 'Superpower status, global narrative dominance, technological/military supremacy, internal polarization',
    };
    return contexts[region] || 'Regional intelligence synthesis pending';
  }
}
