/**
 * Intelligence Journal Panel
 * Personal notes for STRATUM analysis with localStorage persistence
 * Integrated with Knowledge Base and Groq analysis
 */

import { Panel } from '../Panel';
import { StratumModal } from './StratumModal';
import { analyzeJournalWithKB, type JournalAnalysisResult } from '@/services/journal-analysis';

interface JournalNote {
  id: string;
  timestamp: string;
  text: string;
}

export class IntelligenceJournalPanel extends Panel {
  private notes: JournalNote[] = [];
  private textarea: HTMLTextAreaElement | null = null;
  private modal: StratumModal;
  private isAnalyzing = false;

  constructor() {
    super({
      id: 'stratum-journal',
      title: '📓 INTELLIGENCE JOURNAL',
      showCount: false,
    });
    this.modal = new StratumModal();
    this.loadNotes();
    this.render();
  }

  private loadNotes(): void {
    try {
      const stored = localStorage.getItem('stratum-journal-notes');
      this.notes = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('[IntelligenceJournal] Failed to load notes:', error);
      this.notes = [];
    }
  }

  private saveNotes(): void {
    try {
      localStorage.setItem('stratum-journal-notes', JSON.stringify(this.notes));
    } catch (error) {
      console.warn('[IntelligenceJournal] Failed to save notes:', error);
    }
  }

  private render(): void {
    const notesHtml = this.notes
      .slice(0, 10) // Show max 10 notes
      .map(
        note => `
      <div class="ij-note-item">
        <div class="ij-note-header">
          <span class="ij-note-time">${new Date(note.timestamp).toLocaleString()}</span>
          <button class="ij-note-delete" data-id="${note.id}">×</button>
        </div>
        <div class="ij-note-text">${this.escapeHtml(note.text)}</div>
      </div>
    `
      )
      .join('');

    const html = `
      <div class="ij-panel">
        <div class="ij-input-section">
          <textarea
            class="ij-textarea"
            placeholder="Add intelligence note..."
            rows="2"
          ></textarea>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <button class="ij-save-btn" id="ijSaveBtn">SAVE NOTE</button>
            <button class="ij-analyze-btn" id="ijAnalyzeBtn" ${this.notes.length === 0 ? 'disabled' : ''}>📊 ANALYZE</button>
          </div>
        </div>

        <div class="ij-notes-list">
          ${notesHtml || '<div class="ij-empty">No notes yet. Start documenting intelligence observations.</div>'}
        </div>
      </div>
    `;

    this.setContent(html);
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    setTimeout(() => {
      console.log('[IntelligenceJournalPanel] Attaching event listeners');
      this.textarea = this.element?.querySelector('.ij-textarea') as HTMLTextAreaElement;
      const saveBtn = this.element?.querySelector('#ijSaveBtn') as HTMLButtonElement;
      const analyzeBtn = this.element?.querySelector('#ijAnalyzeBtn') as HTMLButtonElement;
      const deleteButtons = this.element?.querySelectorAll('.ij-note-delete');

      console.log('[IntelligenceJournalPanel] Found buttons - save:', !!saveBtn, 'analyze:', !!analyzeBtn);

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          console.log('[IntelligenceJournalPanel] Save button clicked');
          this.saveNote();
        });
        if (this.textarea) {
          this.textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              this.saveNote();
            }
          });
        }
      }

      if (analyzeBtn && !this.isAnalyzing) {
        analyzeBtn.addEventListener('click', () => {
          console.log('[IntelligenceJournalPanel] Analyze button clicked');
          this.analyzeNotes();
        });
      }

      deleteButtons?.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
          if (id) {
            this.deleteNote(id);
          }
        });
      });
      console.log('[IntelligenceJournalPanel] All event listeners attached');
    }, 200);
  }

  private saveNote(): void {
    const text = (this.textarea?.value || '').trim();
    if (!text) return;

    const note: JournalNote = {
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString(),
      text,
    };

    this.notes.unshift(note); // Add to beginning
    this.notes = this.notes.slice(0, 100); // Keep max 100 in storage

    this.saveNotes();
    this.render();
  }

  private deleteNote(id: string): void {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveNotes();
    this.render();
  }

  private async analyzeNotes(): Promise<void> {
    if (this.notes.length === 0) return;
    if (this.isAnalyzing) return;

    this.isAnalyzing = true;
    const analyzeBtn = this.element?.querySelector('#ijAnalyzeBtn') as HTMLButtonElement;
    if (analyzeBtn) {
      analyzeBtn.textContent = '⏳ ANALYZING...';
      analyzeBtn.disabled = true;
    }

    try {
      const noteTexts = this.notes.map(n => n.text);
      const analysis = await analyzeJournalWithKB(noteTexts);
      this.showAnalysisModal(analysis);
    } catch (error) {
      console.error('[IntelligenceJournal] Analysis failed:', error);
    } finally {
      this.isAnalyzing = false;
      if (analyzeBtn) {
        analyzeBtn.textContent = '📊 ANALYZE';
        analyzeBtn.disabled = false;
      }
    }
  }

  private showAnalysisModal(analysis: JournalAnalysisResult): void {
    const lensesHtml = analysis.lens_insights
      .map(
        lens => `
          <div class="modal-lens-card">
            <div class="modal-lens-name">${this.escapeHtml(lens.lens)}</div>
            <div class="modal-lens-analysis">${this.escapeHtml(lens.finding)}</div>
            <div style="margin-top: 6px; font-size: 9px; color: var(--text-secondary);">
              Confidence: ${(lens.confidence * 100).toFixed(0)}%
            </div>
          </div>
        `
      )
      .join('');

    const kbRefsHtml = analysis.kb_references.length > 0
      ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
           <strong style="color: var(--accent);">Knowledge Base References:</strong>
           <div style="margin-top: 8px; font-size: 10px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 8px;">
             ${analysis.kb_references.map(ref => `<span style="background: var(--surface-hover); padding: 4px 8px; border-radius: 2px;">${this.escapeHtml(ref)}</span>`).join('')}
           </div>
         </div>`
      : '';

    const modalHtml = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
          <strong>Summary:</strong><br>
          ${this.escapeHtml(analysis.summary)}
        </div>
        ${analysis.region_detected ? `<div style="margin-top: 8px; font-size: 11px;"><strong>Detected Region:</strong> ${this.escapeHtml(analysis.region_detected)}</div>` : ''}
      </div>
      <div style="margin-bottom: 16px;">
        <strong style="color: var(--accent);">Six-Lens Analysis:</strong>
        <div class="modal-lenses-grid" style="margin-top: 12px;">
          ${lensesHtml}
        </div>
      </div>
      ${kbRefsHtml}
    `;

    this.modal.setContent(modalHtml, 'JOURNAL ANALYSIS');
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
}
