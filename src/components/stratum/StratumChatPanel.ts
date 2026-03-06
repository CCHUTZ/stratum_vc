import { Panel } from '../Panel';
import { analyzeWithStratum, type StratumLensResult } from '@/services/stratum-analysis';

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

    // Wait for Panel's contentDebounceMs (150ms) to complete, then cache DOM elements and attach listeners
    // This ensures this.content.innerHTML has been set before querySelector() is called
    setTimeout(() => {
      this.textarea = this.element.querySelector('.stratum-textarea');
      this.analyzeButton = this.element.querySelector('.stratum-analyze-btn');
      this.responseArea = this.element.querySelector('.stratum-response-area');

      // Attach listeners after DOM elements are cached and available
      this.attachEventListeners();
    }, 150);
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

  private async handleAnalyze(): Promise<void> {
    const input = (this.textarea?.value || '').trim();

    if (!input) {
      if (this.responseArea) {
        this.responseArea.innerHTML = '<div class="stratum-input-prompt">Enter a geopolitical event or phenomenon to analyze.</div>';
      }
      return;
    }

    // Disable button and show analyzing state
    if (this.analyzeButton) {
      this.analyzeButton.disabled = true;
      this.analyzeButton.textContent = 'ANALYZING...';
    }

    if (this.responseArea) {
      this.responseArea.innerHTML = '<div class="stratum-analysis-result" style="opacity: 0.6;"><div style="text-align: center; padding: 20px; color: var(--text-dim);">Connecting to STRATUM analysis service...</div></div>';
    }

    try {
      // Detect region from keywords
      const detectedRegion = this.detectRegion(input);

      // Call real GROQ analysis
      const result = await analyzeWithStratum(input, detectedRegion);

      if (this.analyzeButton) {
        this.analyzeButton.disabled = false;
        this.analyzeButton.textContent = 'ANALYZE';
      }

      // Render results with provider badge
      this.renderAnalysisResults(input, result.lenses, result.provider);
    } catch (error) {
      console.error('[StratumChatPanel] Analysis error:', error);

      if (this.analyzeButton) {
        this.analyzeButton.disabled = false;
        this.analyzeButton.textContent = 'ANALYZE';
      }

      if (this.responseArea) {
        this.responseArea.innerHTML = `
          <div class="stratum-analysis-result" style="border-color: #ff4444;">
            <div style="color: #ff4444; font-family: var(--font-mono); font-size: 12px; margin-bottom: 8px;">
              ⚠ Analysis Error
            </div>
            <div style="color: var(--text-secondary); font-size: 12px; line-height: 1.5;">
              ${this.escapeHtml(error instanceof Error ? error.message : 'Unknown error occurred')}
            </div>
          </div>
        `;
      }
    }
  }

  private detectRegion(input: string): string | undefined {
    const inputLower = input.toLowerCase();

    if (inputLower.includes('israel') || inputLower.includes('jerusalem') || inputLower.includes('palestine')) {
      return 'Israel/Palestine';
    }
    if (inputLower.includes('india') || inputLower.includes('hindu') || inputLower.includes('modi')) {
      return 'India';
    }
    if (inputLower.includes('mexico') || inputLower.includes('amlo') || inputLower.includes('cartel')) {
      return 'Mexico';
    }
    if (inputLower.includes('ukraine') || inputLower.includes('russia') || inputLower.includes('putin')) {
      return 'Ukraine/Russia';
    }
    if (inputLower.includes('china') || inputLower.includes('taiwan') || inputLower.includes('xi')) {
      return 'China/Taiwan';
    }
    if (inputLower.includes('iran') || inputLower.includes('saudi') || inputLower.includes('yemen')) {
      return 'Middle East';
    }

    return undefined;
  }

  private renderAnalysisResults(input: string, lenses: StratumLensResult[], provider: string): void {
    if (!this.responseArea) return;

    const resultHtml = `
      <div class="stratum-analysis-result">
        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);">
          <div style="color: var(--text-dim); font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Input Analysis</div>
          <div style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 12px; line-height: 1.4; margin-bottom: 8px;">"${this.escapeHtml(input)}"</div>
          <div style="display: flex; gap: 6px; align-items: center; font-size: 10px; color: var(--text-dim);">
            <span style="text-transform: uppercase; letter-spacing: 0.05em;">Provider:</span>
            <span style="font-family: var(--font-mono); color: var(--accent);">${this.escapeHtml(provider)}</span>
          </div>
        </div>

        <div class="stratum-lens-grid">
          ${lenses.map(lens => `
            <div class="stratum-lens-card">
              <div class="stratum-lens-header">
                <div class="stratum-lens-name">${this.escapeHtml(lens.name)}</div>
                <div class="stratum-lens-score">${lens.score}/10</div>
              </div>
              <div class="stratum-score-bar">
                <div class="stratum-score-fill" style="width: ${lens.score * 10}%;"></div>
              </div>
              <div class="stratum-lens-analysis">${this.escapeHtml(lens.analysis)}</div>
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
