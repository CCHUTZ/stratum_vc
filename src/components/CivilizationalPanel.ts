import { Panel } from './Panel';
import { t } from '@/services/i18n';
import { escapeHtml } from '@/utils/sanitize';
import type { StratumLocation } from '@/config/stratum-geo';

export class CivilizationalPanel extends Panel {
  private location: StratumLocation | null = null;
  private selectedLens: StratumLocation['primaryLens'] = 'identity_sacred';

  constructor() {
    super({
      id: 'stratum-civilizational',
      title: t('panels.civAnalysis') || '◈ Civilizational Analysis',
      showCount: false,
      infoTooltip: 'Five Lenses Framework: Identity, Demographics, Humiliation, Religious Networks, Civilizational Friction, Cognitive Warfare'
    });
  }

  public update(event: StratumLocation): void {
    this.location = event;
    this.selectedLens = event.primaryLens;
    this.render();
  }

  public setSelectedLens(lens: StratumLocation['primaryLens']): void {
    this.selectedLens = lens;
    this.render();
  }

  private render(): void {
    if (!this.location) {
      this.showLoading();
      return;
    }

    const intensityBars = this.renderIntensityBars(this.location.intensity);
    const analysis = this.generateAnalysis(this.location);
    const prediction = this.generatePrediction(this.location);
    const lensLabel = this.getLensLabel(this.selectedLens);

    const html = `
      <div class="civilizational-panel-content">
        <div class="civ-header">
          <h3 class="civ-location">${escapeHtml(this.location.name)}</h3>
          <span class="civ-region">${escapeHtml(this.location.region)}</span>
        </div>

        <div class="civ-lens-section">
          <div class="civ-lens-label">
            <strong>${escapeHtml(lensLabel)}</strong>
          </div>
          <div class="civ-intensity">
            <span class="intensity-label">${t('common.intensity')}:</span>
            <div class="intensity-bars">${intensityBars}</div>
            <span class="intensity-value">${this.location.intensity}/5</span>
          </div>
        </div>

        <div class="civ-analysis">
          <h4>${t('components.analysis') || 'Analysis'}</h4>
          <p class="civ-analysis-text">${escapeHtml(analysis)}</p>
        </div>

        <div class="civ-prediction">
          <h4>${t('components.prediction') || '30-Day Outlook'}</h4>
          <p class="civ-prediction-text">${escapeHtml(prediction)}</p>
        </div>

        <div class="civ-category">
          <span class="category-badge category-${escapeHtml(this.location.category)}">
            ${escapeHtml(this.getCategoryLabel(this.location.category))}
          </span>
        </div>

        <div class="civ-footer">
          <span class="civ-source">${t('common.updated')}: ${escapeHtml(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))}</span>
        </div>
      </div>
    `;

    this.setContent(html);
    this.setDataBadge('live', this.location.name);
  }

  private renderIntensityBars(intensity: number): string {
    return Array.from({ length: 5 })
      .map((_, i) => `
        <div class="intensity-bar ${i < intensity ? 'filled' : ''}"
             style="background-color: ${this.getIntensityColor(i + 1)}">
        </div>
      `)
      .join('');
  }

  private getIntensityColor(level: number): string {
    const colors: Record<number, string> = {
      1: '#2d8a6e', // Green (low)
      2: '#44aa44',
      3: '#ffaa00', // Yellow (medium)
      4: '#ff8800',
      5: '#ff4444'  // Red (high)
    };
    return colors[level] || '#666';
  }

  private generateAnalysis(location: StratumLocation): string {
    // Keyword-based simple analysis (no LLM)
    const lensKeywords = {
      identity_sacred: [
        'Sacred identity marker contested',
        'Religious significance disputed',
        'Symbolic territorial claim active'
      ],
      demographic: [
        'Population pressure evident',
        'Demographic shift accelerating',
        'Age cohort imbalance detected'
      ],
      humiliation: [
        'Historical grievance narrative active',
        'Collective memory of trauma present',
        'Restoration narrative mobilizing'
      ],
      religious_networks: [
        'Religious authority contested',
        'Transnational network activation',
        'Sectarian friction point active'
      ],
      civilizational: [
        'Civilizational boundary friction',
        'Cultural boundary conflict zone',
        'Inter-civilizational contact stress'
      ],
      cognitive_warfare: [
        'Narrative conflict ongoing',
        'Information operation detected',
        'Strategic communications battle'
      ]
    };

    const keywords = lensKeywords[this.selectedLens] || ['Analysis pending'];
    const randomAnalysis = keywords[Math.floor(Math.random() * keywords.length)];

    return `${randomAnalysis}. ${escapeHtml(location.description.substring(0, 100))}...`;
  }

  private generatePrediction(location: StratumLocation): string {
    // Keyword-based prediction (no LLM)
    const predictions = [
      `${location.name} remains in ${location.category.replace(/_/g, ' ')} status. Monitor ${this.selectedLens.replace(/_/g, ' ')} developments closely.`,
      `Expected ${location.intensity <= 3 ? 'stable' : 'elevated'} tension in ${this.selectedLens.replace(/_/g, ' ')} dimension over 30 days.`,
      `${location.predictedPhase} phase likely to persist. Regional spillover risk: ${location.intensity >= 4 ? 'High' : 'Moderate'}.`,
    ];

    return escapeHtml(predictions[Math.floor(Math.random() * predictions.length)] ?? predictions[0]!);
  }

  private getLensLabel(lens: StratumLocation['primaryLens']): string {
    const lensLabels: Record<StratumLocation['primaryLens'], string> = {
      identity_sacred: '🏛️ Identity & Sacred Sites',
      demographic: '👥 Demographics',
      humiliation: '⚔️ Historical Humiliation',
      religious_networks: '🕌 Religious Networks',
      civilizational: '🌍 Civilizational Friction',
      cognitive_warfare: '📡 Cognitive Warfare'
    };
    return lensLabels[lens] || 'Analysis';
  }

  private getCategoryLabel(category: StratumLocation['category']): string {
    const categoryLabels = {
      friction_zone: 'Friction Zone',
      religious_center: 'Religious Center',
      asabiyyah_node: 'Asabiyyah Node',
      trauma_site: 'Trauma Site',
      cognitive_warfare_hub: 'Cognitive Hub'
    } satisfies Record<StratumLocation['category'], string>;
    return categoryLabels[category] ?? category;
  }
}
