# STRATUM - Civilizational Pattern Intelligence Dashboard

**Version**: 0.1.0-alpha

STRATUM es un dashboard de inteligencia en tiempo real especializado en análisis de patrones civilizacionales, análisis geopolítico profundo y predicción de fricción civilizacional.

## 🎯 Objetivo

Proporcionar análisis estructurado de fricciones civilizacionales globales mediante el marco de **Five Lenses**:
- **Identity & Sacred Sites** - Centros de identidad religiosa y espacios sagrados
- **Demographics** - Tendencias poblacionales y cambios demográficos
- **Humiliation** - Traumas históricos y narrativas de humillación
- **Religious Networks** - Redes de poder religioso transnacional
- **Civilizational Friction** - Puntos de fricción entre civilizaciones
- **Cognitive Warfare** - Operaciones de información y narrativa

## 📊 Características

### Core Features (v0.1.0-alpha)
- ✅ **Civilizational Map** - Visualización de puntos de fricción global con Deck.GL
- ✅ **Five Lenses Analysis** - Panel de análisis estructurado
- ✅ **Regional News Feeds** - Feeds de noticias especializadas:
  - Core Analysis Feeds (10 feeds tier-1)
  - Middle East (5 feeds)
  - India (7 feeds)
  - México (4 feeds)
  - Brasil (3 feeds)
  - LATAM Regional (2 feeds)
  - Europa & Balkanes (2 feeds)
  - Think Tanks & Analysis (2 feeds)
- ✅ **Multilingual UI** - 14 idiomas soportados (EN, ES, FR, DE, IT, PT, RU, NL, PL, SV, AR, ZH, JA, TR)
- ✅ **Brand Customization** - Branding personalizado ("DEEP DATA")
- ✅ **Variant Switching** - Switch dinámico entre variantes (World/Tech/Finance/Stratum)

### Planned Features
- 🔄 Real-time civilizational friction scoring
- 🔄 Predictive modeling (30-90 day forecasts)
- 🔄 Interactive historical trauma timeline
- 🔄 Asabiyyah (group cohesion) node tracking
- 🔄 Religious power center analysis

## 🚀 Quick Start

### Desarrollo
```bash
# Instalar dependencias
npm install

# Ejecutar dev server con STRATUM variant
npm run dev:stratum

# Navegar a http://localhost:3000
```

### Build para Producción
```bash
# Build STRATUM variant
npm run build:stratum

# Output: dist/
```

### Variables de Entorno Requeridas

```bash
VITE_VARIANT=stratum    # Selecciona la variante STRATUM
```

## 📁 Estructura de Archivos

```
src/
├── config/
│   ├── variants/
│   │   └── stratum.ts           # Entry point STRATUM
│   ├── stratum-geo.ts           # 13 ubicaciones civilizacionales
│   ├── stratum-companies.ts     # Entidades STRATUM (placeholder)
│   ├── panels.ts                # 12 paneles UI específicos
│   └── index.ts                 # Exports centralizados
├── locales/
│   └── [en|es|fr|...].json      # Traducciones (14 idiomas)
├── App.ts                       # App principal (branding DEEP DATA)
└── ...

src-tauri/
└── tauri.stratum.conf.json      # Configuración desktop app
```

## 🌍 Ubicaciones Civilizacionales Incluidas

**13 Ubicaciones con análisis de Five Lenses:**
- Jerusalem (Conflict Epicenter)
- Kashmir (Religious-National Friction)
- Xinjiang (Identity Suppression)
- Ayodhya (Religious Nationalism)
- Vatican City (Religious Authority)
- Qom, Iran (Shia Authority)
- Mecca, Saudi Arabia (Islamic Center)
- West Bank Settlements (Colonial Friction)
- Auschwitz (Trauma Site)
- Srebrenica (Recent Trauma)
- St. Petersburg (Geopolitical Hub)

## 🎨 Customización

### Cambiar Branding
Edita `src/App.ts` línea ~1844:
```typescript
<span class="logo">DEEP DATA</span>
```

### Agregar Feeds Regionales
Edita `src/config/variants/stratum.ts` - añade nuevas fuentes RSS:
```typescript
export const FEEDS: Record<string, Feed[]> = {
  region_name: [
    { name: 'Feed Name', url: rss('https://example.com/feed') },
  ]
}
```

### Agregar Ubicaciones
Edita `src/config/stratum-geo.ts`:
```typescript
export const ALL_STRATUM_LOCATIONS: StratumLocation[] = [
  {
    id: 'location-id',
    name: 'Location Name',
    nameLocal: 'Local Name',
    lat: 0,
    lng: 0,
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 4,
    // ... más propiedades
  }
]
```

## 🔧 Configuración de Variantes

STRATUM integra con el sistema de variantes existente:
- `VITE_VARIANT=full` → World Monitor (default)
- `VITE_VARIANT=tech` → Tech Monitor
- `VITE_VARIANT=finance` → Finance Monitor
- `VITE_VARIANT=stratum` → STRATUM (Civilizational Analysis)

## 📈 Roadmap

### v0.1.0-beta
- [ ] Cargar feeds en tiempo real
- [ ] Implementar Five Lenses scoring engine
- [ ] Dashboard de fricciones activas

### v0.2.0
- [ ] Predicción de fricción (ML)
- [ ] Timeline interactivo de traumas históricos
- [ ] Análisis de redes religiosas

### v1.0.0
- [ ] API REST pública
- [ ] Mobile app optimizada
- [ ] Real-time alerts

## 📝 Notas de Desarrollo

- **Base**: Fork de worldmonitor v2.5.0 (post-merge upstream)
- **Merge Strategy**: 2 commits de STRATUM antes de mergear upstream (39 commits de mejoras)
- **Conflictos Resueltos**: App.ts HTML refactor (innerHTML → h() hyperscript)
- **Traducciones**: i18n con 14 idiomas, keys dinámicas por panel

## 🤝 Contribuir

STRATUM es un proyecto privado. Para cambios:
1. Crea feature branch
2. Haz commits descriptivos
3. Test en `npm run dev:stratum`
4. Push y abre PR

## 📄 Licencia

AGPL-3.0-only (heredado de worldmonitor)

---

**Mantener por**: Cesar Hutz
**Última actualización**: Febrero 2026
