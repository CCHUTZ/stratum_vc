/**
 * STRATUM Menu Button — Consolidated header navigation
 * Drops down from header for: Search, Theme, Sources, Language, Variants
 * Replaces scattered worldmonitor buttons (search, theme-toggle, sources)
 */

export class StratumMenuButton {
  private element: HTMLElement | null = null;
  private dropdown: HTMLElement | null = null;
  private isOpen = false;

  constructor() {
    this.render();
  }

  /**
   * Initialize event listeners (call after element is injected into DOM)
   */
  public init(): void {
    this.attachEventListeners();
  }

  /**
   * Render button + dropdown into DOM
   * Call this to inject into header
   */
  public render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'stratum-menu-container';

    const button = document.createElement('button');
    button.id = 'stratumMenuBtn';
    button.className = 'stratum-menu-btn';
    button.innerHTML = '◈ MENU';
    button.title = 'STRATUM Navigation';

    const dropdown = document.createElement('div');
    dropdown.className = 'stratum-menu-dropdown';
    dropdown.innerHTML = `
      <div class="stratum-menu-group">
        <button class="stratum-menu-item" data-action="search">
          🔍 Search
        </button>
        <button class="stratum-menu-item" data-action="theme">
          ☀️ Theme
        </button>
        <button class="stratum-menu-item" data-action="sources">
          📡 Sources
        </button>
        <button class="stratum-menu-item" data-action="language">
          🌐 Language
        </button>
      </div>
      <div class="stratum-menu-separator"></div>
      <div class="stratum-menu-group">
        <button class="stratum-menu-item stratum-menu-variant" data-variant="stratum">
          🔮 STRATUM
        </button>
        <button class="stratum-menu-item stratum-menu-variant" data-variant="world">
          🌍 WORLD
        </button>
      </div>
    `;

    container.appendChild(button);
    container.appendChild(dropdown);

    this.element = button;
    this.dropdown = dropdown;

    return container;
  }

  /**
   * Attach event listeners to button and dropdown items
   */
  private attachEventListeners(): void {
    if (!this.element || !this.dropdown) return;

    // Toggle dropdown on button click
    this.element.addEventListener('click', (_: Event) => {
      this.toggle();
    });

    // Handle dropdown item clicks
    const items = this.dropdown.querySelectorAll('[data-action], [data-variant]');
    items.forEach(item => {
      item.addEventListener('click', (_: Event) => {
        const action = (item as HTMLElement).dataset.action;
        const variant = (item as HTMLElement).dataset.variant;

        if (action) {
          this.handleAction(action);
        } else if (variant) {
          this.handleVariant(variant);
        }

        this.close();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.stratum-menu-container')) {
        this.close();
      }
    });
  }

  /**
   * Handle action: click corresponding worldmonitor button
   */
  private handleAction(action: string): void {
    const targets: Record<string, string> = {
      search: '#searchBtn',
      theme: '.theme-toggle-btn',
      sources: '.sources-btn',
      language: '.language-selector',
    };

    const selector = targets[action];
    if (selector) {
      const btn = document.querySelector(selector) as HTMLButtonElement;
      btn?.click();
    }
  }

  /**
   * Handle variant switch: reload with VITE_VARIANT
   */
  private handleVariant(variant: string): void {
    const currentVariant = new URLSearchParams(window.location.search).get('variant') || 'world';
    if (currentVariant !== variant) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant);
      window.location.href = url.toString();
    }
  }

  /**
   * Toggle dropdown visibility
   */
  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open dropdown
   */
  public open(): void {
    if (!this.dropdown) return;
    this.dropdown.classList.add('open');
    this.isOpen = true;
  }

  /**
   * Close dropdown
   */
  public close(): void {
    if (!this.dropdown) return;
    this.dropdown.classList.remove('open');
    this.isOpen = false;
  }
}
