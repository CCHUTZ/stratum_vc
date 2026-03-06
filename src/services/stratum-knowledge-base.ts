/**
 * STRATUM Knowledge Base
 * Contextual intelligence repository indexed by region and civilizational lens
 * Integrated with Journal analysis and regional scoring
 */

export interface KBEntry {
  lens: string;
  region: string;
  context: string;
  keywords: string[];
}

// Knowledge Base indexed by region
const KNOWLEDGE_BASE: Record<string, Record<string, KBEntry[]>> = {
  'Mexico': {
    sacred_identity: [
      {
        lens: 'Sacred Identity',
        region: 'Mexico',
        context: 'Catholic identity deeply embedded in Mexican culture; syncretic blend of indigenous and Spanish religious traditions. Marian devotion (Guadalupe) as national identity marker.',
        keywords: ['guadalupe', 'catholic', 'indigenous', 'syncretism', 'spiritual'],
      },
    ],
    demographic: [
      {
        lens: 'Demographic',
        region: 'Mexico',
        context: 'Population ~130M, young demographic (median age ~28), high internal migration (rural to urban), significant emigration to USA (~10M Mexican-born live in USA).',
        keywords: ['population', 'migration', 'youth', 'emigration', 'border'],
      },
    ],
    humiliation: [
      {
        lens: 'Humiliation',
        region: 'Mexico',
        context: 'Historical humiliation: Mexican-American War (1846-48) loss of 55% territory to USA, colonialism legacy, NAFTA economic dependency, US interventions in drug war.',
        keywords: ['territorial loss', 'colonialism', 'nafta', 'dependence', 'sovereignty'],
      },
    ],
    religious_networks: [
      {
        lens: 'Religious Networks',
        region: 'Mexico',
        context: 'Catholic Church (85% population), liberation theology influence, indigenous spiritual networks, increasingly pentecostal growth competing with Catholic dominance.',
        keywords: ['catholic', 'church', 'liberation theology', 'pentecostal', 'indigenous spirituality'],
      },
    ],
    civilizational: [
      {
        lens: 'Civilizational',
        region: 'Mexico',
        context: 'Latin American civilization overlapping with North American sphere; Spanish-Catholic heritage vs indigenous Mesoamerican civilizational memory; caught between two civilizations.',
        keywords: ['latin america', 'hispanic', 'indigenous', 'mesoamerica', 'western'],
      },
    ],
    cognitive_warfare: [
      {
        lens: 'Cognitive Warfare',
        region: 'Mexico',
        context: 'Narrative battle: US media dominance vs Mexican media, cartel information control, immigration framing (illegal vs forced migration), sovereignty vs dependency messaging.',
        keywords: ['media', 'narrative', 'framing', 'information war', 'sovereignty'],
      },
    ],
  },
  'Israel': {
    sacred_identity: [
      {
        lens: 'Sacred Identity',
        region: 'Israel',
        context: 'Jerusalem as sacred center (Jewish Temple/Western Wall, Christian Holy Sites, Islamic Al-Aqsa); foundational to Jewish identity, Zionist project; competing sacred claims.',
        keywords: ['jerusalem', 'temple', 'wailing wall', 'al-aqsa', 'zionism', 'sacred'],
      },
    ],
    demographic: [
      {
        lens: 'Demographic',
        region: 'Israel',
        context: 'Population ~9.5M (75% Jewish, 21% Arab), high immigration (Law of Return), Palestinian population in settlements/occupied territories ~6M, demographic competition.',
        keywords: ['jewish', 'arab', 'immigration', 'settlement', 'demographics', 'population'],
      },
    ],
    humiliation: [
      {
        lens: 'Humiliation',
        region: 'Israel',
        context: 'Historical humiliation: diaspora experience, Holocaust, wars of survival (1948, 1967, 1973), Palestinian Nakba (1948), mutual trauma narratives.',
        keywords: ['holocaust', 'nakba', 'displacement', 'refugee', 'trauma', 'survival'],
      },
    ],
    religious_networks: [
      {
        lens: 'Religious Networks',
        region: 'Israel',
        context: 'Judaism (orthodox/secular divide), connections to diaspora Jewish communities, Christian Zionist networks, Islamic umma solidary with Palestinians, transnational religious mobilization.',
        keywords: ['judaism', 'orthodox', 'zionism', 'umma', 'diaspora', 'transnational'],
      },
    ],
    civilizational: [
      {
        lens: 'Civilizational',
        region: 'Israel',
        context: 'Western civilization outpost in Middle East (per Huntington), Jewish-Islamic civilizational clash, Hebrew language revival, European/American ties vs Arab/Islamic world.',
        keywords: ['western', 'middle east', 'islamic', 'civilization clash', 'hebrew'],
      },
    ],
    cognitive_warfare: [
      {
        lens: 'Cognitive Warfare',
        region: 'Israel',
        context: 'Narrative dominance: Holocaust memory mobilization, security framing, Palestinian narrative suppression, US media bias, Arab counter-narrative, information warfare on settlements/occupation.',
        keywords: ['narrative', 'holocaust', 'security', 'occupation', 'media', 'propaganda'],
      },
    ],
  },
  'India': {
    sacred_identity: [
      {
        lens: 'Sacred Identity',
        region: 'India',
        context: 'Hindu sacred geography (Ganges, temples, pilgrimage sites), 4 major religions (Hindu, Islam, Christianity, Sikhism), Hinduism revival as national identity (Hindu nationalism/Hindutva).',
        keywords: ['hindu', 'ganges', 'temple', 'pilgrimage', 'hindutva', 'nationalism'],
      },
    ],
    demographic: [
      {
        lens: 'Demographic',
        region: 'India',
        context: 'Population ~1.4B (17% of global), predominantly Hindu (80%), Muslim minority (14%), young demographic, high fertility, urbanization wave, migration to Gulf/West.',
        keywords: ['population', 'hindu', 'muslim', 'youth', 'urbanization', 'migration'],
      },
    ],
    humiliation: [
      {
        lens: 'Humiliation',
        region: 'India',
        context: 'Colonial past (British Raj), partition trauma (1947, 1M deaths), Pakistan conflicts, caste humiliation (dalit discrimination), development lag vs China, regional power anxiety.',
        keywords: ['colonial', 'partition', 'pakistan', 'dalit', 'caste', 'regional power'],
      },
    ],
    religious_networks: [
      {
        lens: 'Religious Networks',
        region: 'India',
        context: 'Hindu networks (RSS, VHP), Islamic organizations, diaspora Hindu communities (USA, UK, Middle East), transnational Islamist networks, Sikh international presence.',
        keywords: ['hindu networks', 'rss', 'islamic', 'diaspora', 'transnational', 'sikh'],
      },
    ],
    civilizational: [
      {
        lens: 'Civilizational',
        region: 'India',
        context: 'Hindu civilization (per Huntington), Islamic civilization friction (Pakistan, Kashmir), friction with Chinese civilization, leader of Global South/BRICS, civilizational weight.',
        keywords: ['hindu civilization', 'islamic', 'pakistan', 'china', 'global south', 'brics'],
      },
    ],
    cognitive_warfare: [
      {
        lens: 'Cognitive Warfare',
        region: 'India',
        context: 'Hindu nationalist narrative (Hindutva), Kashmir framing (occupation vs terrorism), Modi brand dominance, WhatsApp disinformation, Pakistan counter-narrative, Indian media dominance regionally.',
        keywords: ['hindutva', 'kashmir', 'modi', 'disinformation', 'pakistan', 'narrative'],
      },
    ],
  },
  'Brazil': {
    sacred_identity: [
      {
        lens: 'Sacred Identity',
        region: 'Brazil',
        context: 'Afro-Brazilian religions (Candomblé, Umbanda), Catholicism syncretic with indigenous/African elements, growing Pentecostalism, Amazon as spiritual/ecological sacred site.',
        keywords: ['candomble', 'afro-brazilian', 'catholic', 'pentecostal', 'amazon', 'spiritual'],
      },
    ],
    demographic: [
      {
        lens: 'Demographic',
        region: 'Brazil',
        context: 'Population ~215M (largest Latin America), mixed-race majority, African diaspora legacy, high urbanization (88%), significant favela populations, internal migration.',
        keywords: ['population', 'mixed-race', 'african', 'favela', 'urbanization', 'diaspora'],
      },
    ],
    humiliation: [
      {
        lens: 'Humiliation',
        region: 'Brazil',
        context: 'Slavery legacy (last country to abolish, 1888), slavery humiliation in collective memory, economic dependency, US-backed military dictatorship (1964-1985), Amazon exploitation.',
        keywords: ['slavery', 'dictatorship', 'dependency', 'amazon', 'colonial', 'exploitation'],
      },
    ],
    religious_networks: [
      {
        lens: 'Religious Networks',
        region: 'Brazil',
        context: 'Catholic networks (liberation theology heritage), Pentecostal megachurches explosion, African diaspora spiritual networks, indigenous shamanic traditions, transnational evangelical networks.',
        keywords: ['catholic', 'pentecostal', 'liberation theology', 'evangelical', 'african diaspora', 'indigenous'],
      },
    ],
    civilizational: [
      {
        lens: 'Civilizational',
        region: 'Brazil',
        context: 'Latin American civilization hegemon, Portuguese identity, African/indigenous syncretism, tension with Eurocentric West, BRICS leader, Amazon stewardship role.',
        keywords: ['latin america', 'portuguese', 'syncretism', 'brics', 'amazon', 'hegemon'],
      },
    ],
    cognitive_warfare: [
      {
        lens: 'Cognitive Warfare',
        region: 'Brazil',
        context: 'Lula vs Bolsonaro narrative wars, Amazon deforestation framing, development vs conservation, anti-PT campaigns, fake news in WhatsApp, regional media dominance.',
        keywords: ['lula', 'bolsonaro', 'amazon', 'fake news', 'narrative', 'whatsapp'],
      },
    ],
  },
  'USA': {
    sacred_identity: [
      {
        lens: 'Sacred Identity',
        region: 'USA',
        context: 'Manifest Destiny sacred narrative, American Exceptionalism (divine providence), God-nation fusion (Puritan roots), Civil Religion, nationalism as quasi-religion.',
        keywords: ['manifest destiny', 'exceptionalism', 'providence', 'civil religion', 'nationalism'],
      },
    ],
    demographic: [
      {
        lens: 'Demographic',
        region: 'USA',
        context: 'Population ~335M, white Christian majority declining (now <50%), Hispanic/Latino growth (19%), Asian (6%), African-American (13%), polarized by race/religion/region.',
        keywords: ['population', 'white', 'hispanic', 'diversity', 'declining majority', 'racial'],
      },
    ],
    humiliation: [
      {
        lens: 'Humiliation',
        region: 'USA',
        context: 'Indigenous genocide & reservation system (ongoing humiliation), slavery & Jim Crow legacy, Vietnam War defeat narrative, 9/11 trauma, relative decline anxiety vs China/Russia.',
        keywords: ['indigenous genocide', 'slavery', 'jim crow', 'vietnam', '9/11', 'decline'],
      },
    ],
    religious_networks: [
      {
        lens: 'Religious Networks',
        region: 'USA',
        context: 'Christian networks (evangelical dominance in Republican coalition), Jewish diaspora networks, Muslim organizations, transnational Christian missionary networks, religious polarization.',
        keywords: ['evangelical', 'christian', 'jewish', 'muslim', 'missionary', 'transnational'],
      },
    ],
    civilizational: [
      {
        lens: 'Civilizational',
        region: 'USA',
        context: 'Western civilization defender (per narrative), clash with Islamic civilization (post-9/11), declining unipolarity, competition with Chinese civilization, civilizational anxiety.',
        keywords: ['western', 'defender', 'islamic clash', 'unipolarity', 'china', 'civilization'],
      },
    ],
    cognitive_warfare: [
      {
        lens: 'Cognitive Warfare',
        region: 'USA',
        context: 'Information dominance (tech/media), but internal narrative fragmentation (polarization), culture war narratives, disinformation from foreign actors (Russia, China), ideological polarization.',
        keywords: ['information dominance', 'polarization', 'disinformation', 'culture war', 'ideological'],
      },
    ],
  },
};

/**
 * Get knowledge base entries for a region
 */
export function getKBForRegion(region: string): Record<string, KBEntry[]> {
  return KNOWLEDGE_BASE[region] || {};
}

/**
 * Get knowledge base entry for a specific region + lens combination
 */
export function getKBForLens(region: string, lens: string): KBEntry | undefined {
  const regionKB = KNOWLEDGE_BASE[region];
  if (!regionKB) return undefined;
  const entries = regionKB[lens];
  return entries?.[0]; // Return first entry for this lens
}

/**
 * Get all KB entries indexed by lens
 */
export function getAllKBByLens(): Record<string, KBEntry[]> {
  const result: Record<string, KBEntry[]> = {};
  for (const region of Object.keys(KNOWLEDGE_BASE)) {
    const regionKB = KNOWLEDGE_BASE[region];
    if (!regionKB) continue;
    for (const [lens, entries] of Object.entries(regionKB)) {
      if (!result[lens]) result[lens] = [];
      result[lens].push(...entries);
    }
  }
  return result;
}

/**
 * Format KB context for LLM consumption
 */
export function formatKBContext(region: string, lenses?: string[]): string {
  const regionKB = KNOWLEDGE_BASE[region];
  if (!regionKB) return '';

  const targetLenses = lenses || Object.keys(regionKB);
  const parts: string[] = [];

  for (const lens of targetLenses) {
    const entries = regionKB[lens];
    if (!entries || entries.length === 0) continue;

    const entry = entries[0];
    if (entry) {
      parts.push(`[${entry.lens}] ${entry.context}`);
    }
  }

  return parts.join('\n\n');
}
