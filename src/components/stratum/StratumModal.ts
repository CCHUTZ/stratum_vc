/**
 * STRATUM Modal — Reusable popup dialog for alerts and scoring details
 * Handles backdrop, close button, scroll, and animations
 */

export class StratumModal {
  private backdrop: HTMLElement | null = null;
  private container: HTMLElement | null = null;
  private isOpen = false;

  constructor() {
    this.createElements();
    this.attachEventListeners();
  }

  private createElements(): void {
    // Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'stratum-modal-backdrop';

    // Modal container
    this.container = document.createElement('div');
    this.container.className = 'stratum-modal';
  }

  private attachEventListeners(): void {
    if (!this.backdrop || !this.container) return;

    // Close on backdrop click
    this.backdrop.addEventListener('click', () => this.close());

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  public setContent(html: string, title?: string): void {
    if (!this.container) return;

    let headerHtml = '';
    if (title) {
      headerHtml = `
        <div class="stratum-modal-header">
          <h2 class="stratum-modal-title">${this.escapeHtml(title)}</h2>
          <button class="stratum-modal-close" aria-label="Close">✕</button>
        </div>
      `;
    }

    this.container.innerHTML = `
      ${headerHtml}
      <div class="stratum-modal-body">
        ${html}
      </div>
    `;

    // Attach close button listener
    const closeBtn = this.container.querySelector('.stratum-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  public open(): void {
    if (!this.backdrop || !this.container) return;

    if (!this.backdrop.parentElement) {
      document.body.appendChild(this.backdrop);
    }
    if (!this.container.parentElement) {
      document.body.appendChild(this.container);
    }

    // Trigger animation
    requestAnimationFrame(() => {
      if (this.backdrop && this.container) {
        this.backdrop.classList.add('open');
        this.container.classList.add('open');
      }
    });

    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  public close(): void {
    if (!this.backdrop || !this.container) return;

    this.backdrop.classList.remove('open');
    this.container.classList.remove('open');

    setTimeout(() => {
      if (this.backdrop?.parentElement) {
        this.backdrop.parentElement.removeChild(this.backdrop);
      }
      if (this.container?.parentElement) {
        this.container.parentElement.removeChild(this.container);
      }
    }, 200);

    this.isOpen = false;
    document.body.style.overflow = '';
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
