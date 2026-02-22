export interface StratumLocation {
  id: string;
  name: string;
  nameLocal?: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  category: 'friction_zone' | 'religious_center' | 'asabiyyah_node' | 'trauma_site' | 'cognitive_warfare_hub';
  primaryLens: 'identity_sacred' | 'demographic' | 'humiliation' | 'religious_networks' | 'civilizational' | 'cognitive_warfare';
  intensity: 1 | 2 | 3 | 4 | 5;
  description: string;
  historicalEvents?: string[];
  activeSince?: string;
  predictedPhase?: string;
  sources?: string[];
}

export const FRICTION_ZONES: StratumLocation[] = [
  {
    id: 'friction_001',
    name: 'Jerusalem / Al-Quds',
    nameLocal: 'ירושלים / القدس',
    lat: 31.7683,
    lng: 35.2137,
    country: 'Israel/Palestine',
    region: 'Middle East',
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 5,
    description: 'Epicenter of friction between Judaism, Christianity, and Islam',
    historicalEvents: ['Temple Destruction 70 CE', 'Crusades 1099', 'Six-Day War 1967'],
    activeSince: '1000 BCE',
    predictedPhase: 'Religious Energy Cycle: Political Reactivation',
  },
  {
    id: 'friction_002',
    name: 'Kashmir',
    lat: 34.0836,
    lng: 74.7973,
    country: 'India/Pakistan',
    region: 'South Asia',
    category: 'friction_zone',
    primaryLens: 'civilizational',
    intensity: 4,
    description: 'Friction between Hindu and Islamic civilizations since Partition',
    activeSince: '1947',
    predictedPhase: 'Demographic Cycle: Expansion',
  },
  {
    id: 'friction_003',
    name: 'Xinjiang (Urumqi)',
    lat: 43.8256,
    lng: 87.6168,
    country: 'China',
    region: 'Central Asia',
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 5,
    description: 'Secular-authoritarian state vs Uyghur Muslim identity',
    activeSince: '2009',
    predictedPhase: 'Cognitive Warfare: Industrial-scale narrative control',
  },
  {
    id: 'friction_004',
    name: 'Ayodhya',
    lat: 26.7922,
    lng: 82.1998,
    country: 'India',
    region: 'South Asia',
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 4,
    description: 'Site of Babri Mosque destruction, Ram Temple construction',
    activeSince: '1992',
    predictedPhase: 'Religious Energy: Institutionalization (BJP in power)',
  },
  {
    id: 'friction_005',
    name: 'Mexico City',
    nameLocal: 'Ciudad de México',
    lat: 19.4326,
    lng: -99.1332,
    country: 'Mexico',
    region: 'Mexico',
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 4,
    description: 'Messianic political polarization. AMLO legacy vs institutional democracy.',
    activeSince: '2018',
    predictedPhase: 'escalation',
    historicalEvents: ['Mexican Revolution 1910', 'AMLO presidency 2018'],
  },
  {
    id: 'friction_006',
    name: 'Jerusalem',
    nameLocal: 'ירושלים',
    lat: 31.7683,
    lng: 35.2137,
    country: 'Israel',
    region: 'Israel',
    category: 'friction_zone',
    primaryLens: 'religious_networks',
    intensity: 5,
    description: 'Secular-haredi fracture. Nation-state vs tribe-people definition conflict.',
    activeSince: '2023',
    predictedPhase: 'critical',
    historicalEvents: ['Judicial reform crisis 2023', 'Haredi draft exemption controversy'],
  },
  {
    id: 'friction_007',
    name: 'Ayodhya',
    nameLocal: 'अयोध्या',
    lat: 26.7922,
    lng: 82.1998,
    country: 'India',
    region: 'India',
    category: 'friction_zone',
    primaryLens: 'identity_sacred',
    intensity: 5,
    description: 'Hindu nationalist restoration project. Sacred site reclamation as civilizational policy.',
    activeSince: '2019',
    predictedPhase: 'critical',
    historicalEvents: ['Ram Temple construction 2020-2024', 'Consecration January 2024'],
  },
];

export const RELIGIOUS_POWER_CENTERS: StratumLocation[] = [
  {
    id: 'religious_001',
    name: 'Vatican City',
    lat: 41.9029,
    lng: 12.4534,
    country: 'Vatican City',
    region: 'Europe',
    category: 'religious_center',
    primaryLens: 'religious_networks',
    intensity: 3,
    description: 'Seat of Catholic Church, 1.3B global network',
    activeSince: '1929',
    predictedPhase: 'Religious Energy: Sclerosis phase',
  },
  {
    id: 'religious_002',
    name: 'Qom',
    lat: 34.6416,
    lng: 50.8746,
    country: 'Iran',
    region: 'Middle East',
    category: 'religious_center',
    primaryLens: 'religious_networks',
    intensity: 5,
    description: 'Center of Shia clergy, theocratic power base',
    activeSince: '1979',
    predictedPhase: 'Religious Energy: Political Reactivation sustained',
  },
  {
    id: 'religious_003',
    name: 'Mecca',
    lat: 21.4225,
    lng: 39.8262,
    country: 'Saudi Arabia',
    region: 'Middle East',
    category: 'religious_center',
    primaryLens: 'identity_sacred',
    intensity: 5,
    description: 'Epicenter of Islam, 1.8B oriented toward this point',
    activeSince: '622 CE',
    predictedPhase: 'Religious Energy: Institutionalization (state control)',
  },
];

export const ASABIYYAH_NODES: StratumLocation[] = [
  {
    id: 'asabiyyah_001',
    name: 'West Bank Settlements',
    lat: 31.9,
    lng: 35.2,
    country: 'Israel/Palestine',
    region: 'Middle East',
    category: 'asabiyyah_node',
    primaryLens: 'identity_sacred',
    intensity: 5,
    description: 'Religious settler communities with high ideological cohesion',
    activeSince: '1967',
    predictedPhase: 'Asabiyyah Cycle: Active Expansion',
  },
];

export const TRAUMA_SITES: StratumLocation[] = [
  {
    id: 'trauma_001',
    name: 'Auschwitz-Birkenau',
    lat: 50.0355,
    lng: 19.1783,
    country: 'Poland',
    region: 'Central Europe',
    category: 'trauma_site',
    primaryLens: 'humiliation',
    intensity: 5,
    description: 'Holocaust symbol, foundational trauma of Israel',
    activeSince: '1945',
    predictedPhase: 'Long-lived trauma (generational transmission)',
  },
  {
    id: 'trauma_002',
    name: 'Srebrenica',
    lat: 44.1065,
    lng: 19.2978,
    country: 'Bosnia and Herzegovina',
    region: 'Southeastern Europe',
    category: 'trauma_site',
    primaryLens: 'humiliation',
    intensity: 5,
    description: 'Genocide of 8,000 Bosnian Muslims (1995)',
    activeSince: '1995',
    predictedPhase: 'Active trauma (less than 50 years)',
  },
];

export const COGNITIVE_WARFARE_HUBS: StratumLocation[] = [
  {
    id: 'cognitive_001',
    name: 'St. Petersburg (IRA HQ)',
    lat: 59.9311,
    lng: 30.3609,
    country: 'Russia',
    region: 'Eastern Europe',
    category: 'cognitive_warfare_hub',
    primaryLens: 'cognitive_warfare',
    intensity: 5,
    description: 'Internet Research Agency headquarters',
    activeSince: '2013',
    predictedPhase: 'Cognitive Warfare Cycle: Information Weapon (active)',
  },
];

export const ALL_STRATUM_LOCATIONS: StratumLocation[] = [
  ...FRICTION_ZONES,
  ...RELIGIOUS_POWER_CENTERS,
  ...ASABIYYAH_NODES,
  ...TRAUMA_SITES,
  ...COGNITIVE_WARFARE_HUBS,
];

export function getLocationsByLens(lens: StratumLocation['primaryLens']): StratumLocation[] {
  return ALL_STRATUM_LOCATIONS.filter(loc => loc.primaryLens === lens);
}

export function getLocationsByIntensity(minIntensity: number): StratumLocation[] {
  return ALL_STRATUM_LOCATIONS.filter(loc => loc.intensity >= minIntensity);
}

export function getLocationsByCategory(category: StratumLocation['category']): StratumLocation[] {
  return ALL_STRATUM_LOCATIONS.filter(loc => loc.category === category);
}
