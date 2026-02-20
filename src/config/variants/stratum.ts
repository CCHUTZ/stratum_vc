// Stratum variant - stratum.worldmonitor.app
// Deep Pattern Intelligence - Civilizational Analysis

// Re-export base config
export * from './base';

// Stratum-specific exports
export * from '../stratum-geo';
export * from '../stratum-companies';

// Stratum-focused feeds
export {
  SOURCE_TIERS,
  getSourceTier,
  SOURCE_TYPES,
  getSourceType,
  getSourcePropagandaRisk,
  type SourceRiskProfile,
  type SourceType,
} from '../feeds';

// Stratum-specific FEEDS configuration
import type { Feed } from '@/types';

const rss = (url: string) => `/api/rss-proxy?url=${encodeURIComponent(url)}`;

export const FEEDS: Record<string, Feed[]> = {
  // TIER 1: Core Civilizational Analysis Feeds (10 feeds)
  stratum_tier1: [
    { name: 'Religion News Service', url: rss('https://religionnews.com/feed') },
    { name: 'InSight Crime', url: rss('https://insightcrime.org/feed') },
    { name: '972 Magazine', url: rss('https://www.972mag.com/feed') },
    { name: 'The Wire (India)', url: rss('https://thewire.in/feed') },
    { name: 'Haaretz', url: rss('https://www.haaretz.com/srv/haaretz-latest-articles.rss') },
    { name: 'Middle East Eye', url: rss('https://www.middleeasteye.net/rss') },
    { name: 'Jewish Currents', url: rss('https://jewishcurrents.org/feed') },
    { name: 'Arutz Sheva', url: rss('https://www.israelnationalnews.com/rss.aspx') },
    { name: 'OpIndia', url: rss('https://opindia.com/feed') },
    { name: 'Frontline', url: rss('https://frontline.thehindu.com/cover-story/rss') },
  ],

  middle_east: [
    { name: 'Al Jazeera', url: rss('https://www.aljazeera.com/xml/rss/all.xml') },
    { name: 'Times of Israel', url: rss('https://www.timesofisrael.com/feed') },
    { name: 'Al-Monitor', url: rss('https://www.al-monitor.com/feed') },
    { name: 'Jerusalem Post', url: rss('https://www.jpost.com/Rss/RssFeedsHeadlines.aspx') },
    { name: 'Al Arabiya', url: rss('https://english.alarabiya.net/rss.xml') },
  ],

  india: [
    { name: 'The Wire', url: rss('https://thewire.in/feed') },
    { name: 'The Hindu', url: rss('https://www.thehindu.com/feeder/default.rss') },
    { name: 'Scroll.in', url: rss('https://scroll.in/feeds/all.rss') },
    { name: 'The Indian Express', url: rss('https://indianexpress.com/feed') },
    { name: 'The Quint', url: rss('https://www.thequint.com/feed') },
    { name: 'The Print', url: rss('https://theprint.in/feed') },
    { name: 'Caravan Magazine', url: rss('https://caravanmagazine.in/feed') },
  ],

  mexico: [
    { name: 'Proceso', url: rss('https://www.proceso.com.mx/feed') },
    { name: 'Animal Político', url: rss('https://www.animalpolitico.com/feed') },
    { name: 'Aristegui Noticias', url: rss('https://aristeguinoticias.com/feed') },
    { name: 'La Jornada', url: rss('https://www.jornada.com.mx/rss/edicion.xml') },
  ],

  brazil: [
    { name: 'Brasil de Fato', url: rss('https://www.brasildefato.com.br/rss.xml') },
    { name: 'Folha de S.Paulo', url: rss('https://www1.folha.uol.com.br/rss/emcimadahora.xml') },
    { name: 'The Intercept Brasil', url: rss('https://theintercept.com/brasil/feed') },
  ],

  latam_regional: [
    { name: 'InSight Crime', url: rss('https://insightcrime.org/feed') },
    { name: 'El País América', url: rss('https://elpais.com/rss/elpais/america.xml') },
  ],

  europe: [
    { name: 'The Guardian Religion', url: rss('https://www.theguardian.com/world/religion/rss') },
    { name: 'Balkan Insight', url: rss('https://balkaninsight.com/feed') },
  ],

  specialized: [
    { name: 'Brookings Middle East', url: rss('https://www.brookings.edu/topic/middle-east/feed') },
    { name: 'Carnegie Endowment', url: rss('https://carnegieendowment.org/feeds/articles.xml') },
  ],
};
