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
    this.setupGlobalListeners();
  }

  private createElements(): void {
    // Backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'stratum-modal-backdrop';

    // Modal container
    this.container = document.createElement('div');
    this.container.className = 'stratum-modal';
  }

  private setupGlobalListeners(): void {
    // Close on escape key - setup once globally
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
    if (!this.backdrop || !this.container) {
      console.error('[StratumModal] Elements not initialized');
      return;
    }

    if (!this.backdrop.parentElement) {
      document.body.appendChild(this.backdrop);
      // Attach click listener when backdrop enters DOM
      this.backdrop.addEventListener('click', () => this.close());
    }
    if (!this.container.parentElement) {
      document.body.appendChild(this.container);
    }

    // Trigger animation
    requestAnimationFrame(() => {
      if (this.backdrop && this.container) {
        this.backdrop.classList.add('open');
        this.container.classList.add('open');
        console.log('[StratumModal] Opened with classes added');
      }
    });

    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    console.log('[StratumModal] Modal opened, overflow hidden');
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
