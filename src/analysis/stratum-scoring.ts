import type { StratumLocation } from '@/config/stratum-geo';

/**
 * Normalizes intensity (1-5) to score (0-10)
 */
const normalizeIntensity = (avgIntensity: number): number => {
  return (avgIntensity / 5) * 10;
};

/**
 * Sacred Identity lens: religious/sacred sites prominence
 */
export function scoreSacredIdentity(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'identity_sacred');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * Demographic lens: population dynamics and demographic shifts
 */
export function scoreDemographic(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'demographic');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * Humiliation lens: historical traumas and grievances
 */
export function scoreHumiliation(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'humiliation');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * Religious Networks lens: transnational religious power structures
 */
export function scoreReligiousNetworks(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'religious_networks');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * Civilizational lens: inter-civilizational friction points
 */
export function scoreCivilizational(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'civilizational');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * Cognitive Warfare lens: information warfare and narrative control
 */
export function scoreCognitiveWarfare(locations: StratumLocation[]): number {
  const filtered = locations.filter(loc => loc.primaryLens === 'cognitive_warfare');
  if (filtered.length === 0) return 0;
  const avgIntensity = filtered.reduce((sum, loc) => sum + loc.intensity, 0) / filtered.length;
  return normalizeIntensity(avgIntensity);
}

/**
 * RegionScore: aggregated scores for a geographic region
 */
export interface RegionScore {
  region: string;
  scores: Record<string, number>; // { sacred_identity: 8.5, demographic: 0, ... }
  overall: number;                 // average of all 6 lenses
  dominantLens: string;            // the highest-scoring lens name
}

/**
 * Compute scores for a specific region across all 6 lenses
 */
export function scoreRegion(
  region: string,
  allLocations: StratumLocation[]
): RegionScore {
  // Filter locations to this region only
  const regionLocations = allLocations.filter(loc => loc.region === region);

  // Compute each lens for this region
  const scores: Record<string, number> = {
    sacred_identity: scoreSacredIdentity(regionLocations),
    demographic: scoreDemographic(regionLocations),
    humiliation: scoreHumiliation(regionLocations),
    religious_networks: scoreReligiousNetworks(regionLocations),
    civilizational: scoreCivilizational(regionLocations),
    cognitive_warfare: scoreCognitiveWarfare(regionLocations),
  };

  // Overall = average of all 6
  const overall = Object.values(scores).reduce((a, b) => a + b, 0) / 6;

  // Dominant lens = highest score (with explicit initial value)
  const dominantLens = Object.entries(scores).reduce(
    (max, [lens, score]) => score > (scores[max] ?? 0) ? lens : max,
    Object.keys(scores)[0] ?? 'sacred_identity'
  );

  return { region, scores, overall, dominantLens };
}
