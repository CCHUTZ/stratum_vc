# STRATUM Changelog

Todos los cambios notables a STRATUM están documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [0.1.0-alpha] - 2026-02-20

### ✨ Agregado

#### Core Infrastructure
- **Variant Architecture**: Sistema modular de variantes integrado
  - Nueva variante `stratum` al lado de `full`, `tech`, `finance`
  - Soporte para `VITE_VARIANT=stratum` en build system
  - Dynamic variant switching con localStorage persistence

#### Configuration
- **STRATUM Variant Entry Point** (`src/config/variants/stratum.ts`)
  - 8 categorías de feeds RSS
  - 36 fuentes de noticias especializadas (tier-1 core + regional)

- **Civilizational Geolocation Data** (`src/config/stratum-geo.ts`)
  - 13 ubicaciones con análisis Five Lenses
  - 5 categorías de fricción civilizacional
  - 6 lentes analíticas (identity_sacred, demographic, humiliation, religious_networks, civilizational, cognitive_warfare)
  - Helper functions: `getLocationsByLens()`, `getLocationsByIntensity()`, `getLocationsByCategory()`

- **Entity Tracking** (`src/config/stratum-companies.ts`)
  - StratumEntity interface (placeholder para future expansion)
  - Estructura para NGOs, think tanks, movimientos religiosos

#### UI/UX
- **12 Panels STRATUM Específicos** (`src/config/panels.ts`)
  - Civilizational Map (3D visualization)
  - Civilizational News
  - Five Lenses Analysis
  - Core Analysis Feeds + 7 Regional Panels
  - My Monitors

- **37 Map Layers** con configuración regional
  - 6 enabled por defecto: weather, cyberThreats, protests, natural, ucdpEvents, displacement
  - Mobile-optimized version con layers reducidos

- **Variant Switcher Button**
  - Botón 🔷 "Stratum" en header
  - Integración con event listener de variant switching
  - Soporta switch local sin URLs externas

#### Branding
- Reemplazo de logo: "MONITOR" → "DEEP DATA"
- Eliminación de: versión app, link a GitHub, link a Twitter
- Botones de variante (World/Tech/Finance) como switching local

#### Internacionalization
- **14 idiomas soportados**:
  - Inglés (en), Español (es), Francés (fr), Alemán (de)
  - Italiano (it), Portugués (pt), Ruso (ru), Holandés (nl)
  - Polaco (pl), Sueco (sv), Árabe (ar), Chino (zh)
  - Japonés (ja), Turco (tr)

- Traducciones de paneles STRATUM en todos los idiomas
- Keys i18n: `panels.stratum_tier1`, `panels.middle_east`, `panels.india`, etc.

#### Build & Deployment
- **npm scripts**
  - `npm run dev:stratum` - Dev server con variante STRATUM
  - `npm run build:stratum` - Production build STRATUM

- **Desktop App** (`src-tauri/tauri.stratum.conf.json`)
  - Configuración específica para app de escritorio
  - Branding "Stratum Monitor"
  - Window size: 1400x900

- **SEO Metadata** (vite.config.ts)
  - HTML metadata inyectado automáticamente
  - OG tags para social sharing
  - Structured data (JSON-LD)
  - 10 features listadas en manifest PWA

### 🔧 Cambios

#### Build System Improvements
- **Vite Configuration** (`vite.config.ts`)
  - Support para `VITE_VARIANT` environment variable
  - VARIANT_META dictionary para 4 variantes
  - htmlVariantPlugin() para metadata injection dinámico

- **Package.json**
  - Versión: 2.5.0 → 0.1.0-alpha
  - Nombre: world-monitor → stratum
  - Scripts de dev/build específicos para STRATUM

#### Code Organization
- **Variant Detection** (`src/config/variant.ts`)
  - localStorage-first para variant detection
  - Fallback a `import.meta.env.VITE_VARIANT`
  - Support para 'stratum' junto a tech/finance/full

- **Exports Centralizados** (`src/config/index.ts`)
  - Reexporta STRATUM-specific types y data
  - StratumLocation interface
  - Helper functions para queries geopolíticas

### 🐛 Bug Fixes

- Fixed variant button click listener - ahora funciona para todas las variantes incluida STRATUM
- Fixed i18n missing key warnings - agregadas todas las traducciones de paneles STRATUM
- Removed unused imports - limpieza de TypeScript warnings

### 📚 Documentation

- **README-STRATUM.md** - Guía completa de features, uso y roadmap
- **CHANGELOG-STRATUM.md** - Este archivo
- Inline comments en archivos críticos

### ⚠️ Cambios Incompatibles

Ninguno - STRATUM es una variante adicional que no afecta otras variantes.

### 🚀 Notas Técnicas

#### Merge Strategy
- Creados 2 commits STRATUM antes de mergear 39 commits de upstream (worldmonitor v2.5.0)
- Resuelto conflicto en App.ts (refactor innerHTML → h() hyperscript)
- Todos los cambios de upstream (i18n, perf, features) integrados sin impacto en STRATUM

#### Known Limitations (v0.1.0-alpha)
- Paneles renderean estructura pero sin datos (feeds aún no cargan datos en tiempo real)
- Five Lenses Analysis panel es UI-only (scoring engine no implementado)
- Predicción de fricción civilizacional no implementada
- Historical trauma timeline es placeholder

#### Testing
- ✅ TypeScript compilation clean (`npm run typecheck`)
- ✅ Production build exitoso (`npm run build:stratum` - 7.47s)
- ✅ Dev server hot-reload funcional
- ✅ Variant switching local (localStorage-based)
- ⚠️ News feed loading needs API review
- ⚠️ Panel data rendering needs integration testing

### 📦 Dependencies

Usa todas las dependencias de worldmonitor v2.5.0:
- Deck.GL + MapLibre GL (visualization)
- i18next (localization)
- Transformers.js (ML in browser)
- Workbox (PWA)
- Vite (build)
- TypeScript 5.x

---

**Release Date**: Febrero 20, 2026
**Status**: Alpha - Feature Complete, Needs Integration Testing
**Next Version**: 0.1.0-beta (with real-time data loading)
