import { Panel } from '../Panel';

interface LensAnalysis {
  lens: string;
  score: number;
  analysis: string;
}

export class StratumChatPanel extends Panel {
  private textarea: HTMLTextAreaElement | null = null;
  private analyzeButton: HTMLButtonElement | null = null;
  private responseArea: HTMLElement | null = null;

  constructor() {
    super({
      id: 'stratum-chat',
      title: '◈ STRATUM ANALYSIS',
      showCount: false
    });
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    const html = `
      <div class="stratum-chat-panel">
        <div class="stratum-chat-input">
          <textarea
            class="stratum-textarea"
            placeholder="Describe a geopolitical event, region, or phenomenon for STRATUM analysis..."
            rows="4"
          ></textarea>
          <button class="stratum-analyze-btn">ANALYZE</button>
        </div>
        <div class="stratum-response-area">
          <!-- Mock responses will render here -->
        </div>
      </div>

      <style>
        .stratum-chat-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 12px;
          background: var(--bg);
          color: var(--text);
        }

        .stratum-chat-input {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stratum-textarea {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
          resize: none;
          transition: all 0.2s ease;
        }

        .stratum-textarea:focus {
          outline: none;
          border-color: var(--accent);
          background: var(--surface-active);
          box-shadow: 0 0 0 2px rgba(74, 158, 255, 0.1);
        }

        .stratum-analyze-btn {
          background: var(--accent);
          color: var(--bg);
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
        }

        .stratum-analyze-btn:hover {
          background: #6ab0ff;
          transform: translateY(-1px);
        }

        .stratum-analyze-btn:active {
          transform: translateY(0);
          opacity: 0.9;
        }

        .stratum-response-area {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stratum-analysis-result {
          background: var(--surface);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          padding: 12px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stratum-lens-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .stratum-lens-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stratum-lens-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stratum-lens-name {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
        }

        .stratum-lens-score {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: bold;
          color: var(--accent);
        }

        .stratum-lens-analysis {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .stratum-score-bar {
          width: 100%;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          overflow: hidden;
        }

        .stratum-score-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .stratum-input-prompt {
          color: var(--text-dim);
          font-size: 11px;
          font-style: italic;
          margin-top: 4px;
        }
      </style>
    `;

    this.setContent(html);

    // Cache DOM elements
    this.textarea = this.element.querySelector('.stratum-textarea');
    this.analyzeButton = this.element.querySelector('.stratum-analyze-btn');
    this.responseArea = this.element.querySelector('.stratum-response-area');
  }

  private attachEventListeners(): void {
    if (!this.analyzeButton) return;

    this.analyzeButton.addEventListener('click', () => this.handleAnalyze());

    if (this.textarea) {
      this.textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          this.handleAnalyze();
        }
      });
    }
  }

  private handleAnalyze(): void {
    const input = (this.textarea?.value || '').trim();

    if (!input) {
      if (this.responseArea) {
        this.responseArea.innerHTML = '<div class="stratum-input-prompt">Enter a geopolitical event or phenomenon to analyze.</div>';
      }
      return;
    }

    const lensResults = this.generateMockAnalysis(input);
    this.renderAnalysisResults(input, lensResults);
  }

  private generateMockAnalysis(input: string): LensAnalysis[] {
    const inputLower = input.toLowerCase();

    // Base scores (1-10 for each lens)
    let scores = {
      identity_sacred: 4,
      demographic: 5,
      humiliation: 5,
      religious_networks: 4,
      civilizational: 6,
      cognitive_warfare: 5,
    };

    // Keyword-based adjustments
    if (inputLower.includes('israel') || inputLower.includes('jerusalem') || inputLower.includes('haredi')) {
      scores.religious_networks = 9;
      scores.identity_sacred = 8;
      scores.humiliation = 7;
      scores.cognitive_warfare = 8;
    }

    if (inputLower.includes('india') || inputLower.includes('hindu') || inputLower.includes('modi')) {
      scores.identity_sacred = 9;
      scores.demographic = 8;
      scores.religious_networks = 7;
      scores.civilizational = 8;
    }

    if (inputLower.includes('mexico') || inputLower.includes('amlo') || inputLower.includes('cartel')) {
      scores.humiliation = 8;
      scores.demographic = 7;
      scores.cognitive_warfare = 7;
      scores.civilizational = 6;
    }

    if (inputLower.includes('ukraine') || inputLower.includes('russia')) {
      scores.civilizational = 9;
      scores.humiliation = 8;
      scores.cognitive_warfare = 9;
      scores.demographic = 6;
    }

    if (inputLower.includes('china') || inputLower.includes('taiwan')) {
      scores.identity_sacred = 7;
      scores.civilizational = 9;
      scores.demographic = 8;
      scores.religious_networks = 3;
    }

    return [
      {
        lens: 'Sacred Identity',
        score: this.clamp(scores.identity_sacred),
        analysis: this.getAnalysisText('identity_sacred', inputLower, scores.identity_sacred)
      },
      {
        lens: 'Demographic',
        score: this.clamp(scores.demographic),
        analysis: this.getAnalysisText('demographic', inputLower, scores.demographic)
      },
      {
        lens: 'Humiliation',
        score: this.clamp(scores.humiliation),
        analysis: this.getAnalysisText('humiliation', inputLower, scores.humiliation)
      },
      {
        lens: 'Religious Networks',
        score: this.clamp(scores.religious_networks),
        analysis: this.getAnalysisText('religious_networks', inputLower, scores.religious_networks)
      },
      {
        lens: 'Civilizational',
        score: this.clamp(scores.civilizational),
        analysis: this.getAnalysisText('civilizational', inputLower, scores.civilizational)
      },
      {
        lens: 'Cognitive Warfare',
        score: this.clamp(scores.cognitive_warfare),
        analysis: this.getAnalysisText('cognitive_warfare', inputLower, scores.cognitive_warfare)
      },
    ];
  }

  private getAnalysisText(lens: string, _input: string, score: number): string {
    const analyses: Record<string, string[]> = {
      identity_sacred: [
        'High religious/sacred identity involvement detected.',
        'Sacred sites and identity markers present.',
        'Minimal sacred identity dimension.',
      ],
      demographic: [
        'Significant demographic shifts and migration patterns.',
        'Population dynamics affecting regional stability.',
        'Limited demographic component.',
      ],
      humiliation: [
        'Strong historical grievances and trauma narratives.',
        'Moderate historical trauma influence.',
        'Low humiliation/grievance dimension.',
      ],
      religious_networks: [
        'Transnational religious networks highly active.',
        'Religious network influence moderate.',
        'Minimal transnational religious coordination.',
      ],
      civilizational: [
        'Major civilizational friction and clash dynamics.',
        'Moderate inter-civilizational tension.',
        'Limited civilizational conflict dimension.',
      ],
      cognitive_warfare: [
        'Intensive information warfare and narrative control.',
        'Moderate cognitive warfare activity.',
        'Limited narrative warfare dimension.',
      ],
    };

    const texts = analyses[lens] || ['Analysis data unavailable.'];
    const index = Math.max(0, Math.min(2, score <= 3 ? 2 : score <= 6 ? 1 : 0));
    return texts[index] ?? 'Analysis data unavailable.';
  }

  private clamp(value: number): number {
    return Math.max(1, Math.min(10, value));
  }

  private renderAnalysisResults(input: string, results: LensAnalysis[]): void {
    if (!this.responseArea) return;

    const resultHtml = `
      <div class="stratum-analysis-result">
        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
          <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Input Analysis</div>
          <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 12px; line-height: 1.4;">"${this.escapeHtml(input)}"</div>
        </div>

        <div class="stratum-lens-grid">
          ${results.map(result => `
            <div class="stratum-lens-card">
              <div class="stratum-lens-header">
                <div class="stratum-lens-name">${result.lens}</div>
                <div class="stratum-lens-score">${result.score}/10</div>
              </div>
              <div class="stratum-score-bar">
                <div class="stratum-score-fill" style="width: ${result.score * 10}%;"></div>
              </div>
              <div class="stratum-lens-analysis">${result.analysis}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.responseArea.innerHTML = resultHtml;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return (text || '').replace(/[&<>"']/g, (char: string) => map[char] || char);
  }
}
