/**
 * Site Variant Selector
 * Allows switching between worldmonitor, tech, finance, and stratum variants
 * Stores selection in localStorage and reloads page
 */

import { SITE_VARIANT } from '@/config/variant';

export class VariantSelector {
  private element: HTMLElement;
  private isOpen = false;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'variant-selector';
    this.render();
    this.setupEventListeners();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private getVariantLabel(variant: string): string {
    const labels: Record<string, string> = {
      full: '🌍 WORLD',
      tech: '💻 TECH',
      finance: '📈 FINANCE',
      stratum: '🔮 STRATUM',
    };
    return labels[variant] || variant.toUpperCase();
  }

  private getVariantIcon(variant: string): string {
    const icons: Record<string, string> = {
      full: '🌍',
      tech: '💻',
      finance: '📈',
      stratum: '🔮',
    };
    return icons[variant] || '◈';
  }

  private render(): void {
    const variants = ['full', 'tech', 'finance', 'stratum'];
    const currentVariant = SITE_VARIANT;

    this.element.innerHTML = `
      <div style="position: relative;">
        <button class="variant-selector-btn" aria-label="Select site variant">
          <span style="font-size: 14px;">
            ${this.getVariantIcon(currentVariant)} ${this.getVariantLabel(currentVariant)}
          </span>
          <span style="margin-left: 4px; font-size: 10px;">▼</span>
        </button>

        <div class="variant-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; min-width: 120px; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          ${variants
            .map(
              v => `
            <button
              class="variant-option"
              data-variant="${v}"
              style="
                display: block;
                width: 100%;
                padding: 8px 12px;
                background: ${v === currentVariant ? 'var(--border-subtle)' : 'transparent'};
                border: none;
                text-align: left;
                cursor: pointer;
                font-family: var(--font-mono);
                font-size: 12px;
                color: var(--text);
                border-bottom: 1px solid var(--border-subtle);
              "
              ${v === currentVariant ? 'disabled' : ''}
            >
              ${this.getVariantIcon(v)} ${this.getVariantLabel(v)}
            </button>
          `
            )
            .join('')}
        </div>
      </div>

      <style>
        .variant-selector-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 12px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .variant-selector-btn:hover {
          background: var(--surface-active);
          border-color: var(--accent);
        }

        .variant-selector-btn:active {
          opacity: 0.8;
        }

        .variant-option:hover {
          background: var(--border-subtle);
        }

        .variant-option:disabled {
          opacity: 0.6;
          cursor: default;
        }

        .variant-option:last-child {
          border-bottom: none;
        }
      </style>
    `;
  }

  private setupEventListeners(): void {
    const btn = this.element.querySelector('.variant-selector-btn');
    const dropdown = this.element.querySelector('.variant-dropdown') as HTMLElement;
    const options = this.element.querySelectorAll('.variant-option');

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        if (dropdown) {
          dropdown.style.display = this.isOpen ? 'block' : 'none';
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      if (this.isOpen && dropdown) {
        this.isOpen = false;
        dropdown.style.display = 'none';
      }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const variant = (e.currentTarget as HTMLElement).getAttribute('data-variant');
        if (variant) {
          localStorage.setItem('worldmonitor-variant', variant);
          window.location.reload();
        }
      });
    });
  }
}
