import { Panel } from '../Panel';
import { scoreRegion } from '@/analysis/stratum-scoring';
import { ALL_STRATUM_LOCATIONS } from '@/config/stratum-geo';

export class CivilizationalScoringPanel extends Panel {
  constructor() {
    super({
      id: 'stratum-scoring',
      title: '📊 CIVILIZATIONAL SCORING',
      showCount: false,
    });
    this.render();
  }

  private render(): void {
    const regions = ['Mexico', 'Israel', 'India', 'Brazil', 'USA'];
    const emojis: Record<string, string> = {
      Mexico: '🇲🇽',
      Israel: '🇮🇱',
      India: '🇮🇳',
      Brazil: '🇧🇷',
      USA: '🇺🇸',
    };

    const countriesHtml = regions
      .map(region => {
        const regionScore = scoreRegion(region, ALL_STRATUM_LOCATIONS);
        const dominant = regionScore.dominantLens.replace(/_/g, ' ').toLowerCase();
        const score = regionScore.overall.toFixed(1);
        const scoreNum = parseFloat(score);

        // Border color dinámico por score: rojo (bajo) → amarillo (medio) → verde (alto)
        const borderColor =
          scoreNum < 4 ? '#ff6b6b' : scoreNum < 6 ? '#ffa940' : '#00ff88';

        return `
          <div class="cs-country" style="border-left-color: ${borderColor};">
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
      const btn = this.element.querySelector('#csRecalcBtn') as HTMLButtonElement;
      if (btn) {
        btn.addEventListener('click', () => {
          btn.textContent = '⏳ RECALCULATING...';
          btn.disabled = true;

          setTimeout(() => {
            this.render();
          }, 500);
        });
      }
    }, 150);
  }
}
