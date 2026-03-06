/**
 * Intelligence Journal Panel
 * Personal notes for STRATUM analysis with localStorage persistence
 */

import { Panel } from '../Panel';

interface JournalNote {
  id: string;
  timestamp: string;
  text: string;
}

export class IntelligenceJournalPanel extends Panel {
  private notes: JournalNote[] = [];
  private textarea: HTMLTextAreaElement | null = null;

  constructor() {
    super({
      id: 'stratum-journal',
      title: '📓 INTELLIGENCE JOURNAL',
      showCount: false,
    });
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
          <button class="ij-save-btn" id="ijSaveBtn">SAVE NOTE</button>
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
      this.textarea = this.element.querySelector('.ij-textarea') as HTMLTextAreaElement;
      const saveBtn = this.element.querySelector('#ijSaveBtn') as HTMLButtonElement;
      const deleteButtons = this.element.querySelectorAll('.ij-note-delete');

      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveNote());
        if (this.textarea) {
          this.textarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              this.saveNote();
            }
          });
        }
      }

      deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
          if (id) {
            this.deleteNote(id);
          }
        });
      });
    }, 150);
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
