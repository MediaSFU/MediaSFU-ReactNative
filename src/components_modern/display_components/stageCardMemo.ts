/** Focused comparator for high-card-count native stage tiles. */
const loudnessFor = (source: unknown, name?: string): number | undefined => {
  if (!source || !name) return undefined;
  if (Array.isArray(source)) return (source as any[]).find((entry) => entry?.name === name)?.averageLoudness;
  if (typeof source === 'object') {
    const entry = source as any;
    if (entry.name === undefined || entry.name === name) return entry.averageLoudness;
  }
  return undefined;
};
export function stageCardPropsEqual<P extends object>(prev: Readonly<P>, next: Readonly<P>): boolean {
  const a = prev as any; const b = next as any; const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const key of keys) { if (key === 'parameters' || key === 'audioDecibels') continue; if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) return false; }
  return loudnessFor(a.audioDecibels, a.participant?.name ?? a.name) === loudnessFor(b.audioDecibels, b.participant?.name ?? b.name);
}
export default stageCardPropsEqual;
